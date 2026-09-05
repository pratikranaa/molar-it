#!/usr/bin/env python3
"""Compare a deployed marketing release with the explicit .site-dist package."""
import argparse
import concurrent.futures
import hashlib
import html
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

parser = argparse.ArgumentParser()
parser.add_argument('--base', default='https://molar.it')
parser.add_argument('--deployment', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
stage = root / '.site-dist'
manifest = json.loads((root / 'marketing/build-manifest.json').read_text())

def digest(body):
    return hashlib.sha256(body).hexdigest()

def email_decode(encoded):
    data = bytes.fromhex(encoded)
    return html.escape(bytes(value ^ data[0] for value in data[1:]).decode(), quote=True)

def normalize_cloudflare(body):
    # Observed Cloudflare Email Address Obfuscation transformations only.
    # Any other content change remains a failed comparison.
    text = body.decode()
    text = re.sub(r'/cdn-cgi/l/email-protection#([a-fA-F0-9]+)', lambda m: 'mailto:' + email_decode(m[1]), text)
    text = re.sub(r'<span class="__cf_email__" data-cfemail="([a-fA-F0-9]+)">\[email&#160;protected\]</span>', lambda m: email_decode(m[1]), text)
    text = text.replace('<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>', '')
    text = re.sub(r'<a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="([a-fA-F0-9]+)">\[email&#160;protected\]</a>', lambda m: email_decode(m[1]), text)
    return text.encode()

files = {}
for path in manifest['html']:
    if path == '404.html':
        continue
    content = (stage / path).read_text()
    canonical = re.search(r'rel="canonical" href="([^"]+)"', content)
    if canonical:
        files[urlsplit(canonical[1]).path or '/'] = path
for path in stage.rglob('*'):
    if path.is_file() and path.suffix != '.html' and not path.name.startswith('_'):
        files['/' + path.relative_to(stage).as_posix()] = path.relative_to(stage).as_posix()

def check(item):
    route, path = item
    url = args.base.rstrip('/') + route
    result = subprocess.run(['curl', '-sS', '-L', '--max-redirs', '3', '--max-time', '25', '--retry', '1', '-w', '\n%{http_code}\n%{url_effective}', url], capture_output=True)
    response, _, effective = result.stdout.rpartition(b'\n')
    body, _, status = response.rpartition(b'\n')
    expected = (stage / path).read_bytes()
    normalized = normalize_cloudflare(body) if path.endswith('.html') and status == b'200' else body
    edge_policy = None
    if path == 'robots.txt' and body.endswith(expected):
        prefix = body[:-len(expected)]
        # Exact managed prefix observed at release verification; report its policy separately.
        if digest(prefix) == '842b34303164ead41bccb7c05d1707422e98d108753b397b6dcc19683eb02101':
            normalized = expected
            edge_policy = prefix.decode()
    same_target = effective.decode().rstrip('/') == url.rstrip('/')
    return {'route': route, 'file': path, 'http': status.decode(), 'expected_sha256': digest(expected),
            'received_sha256': digest(body), 'normalized_sha256': digest(normalized),
            'cloudflare_email_rewrite': path.endswith('.html') and body != normalized,
            'effective_url': effective.decode(), 'cloudflare_managed_robots': edge_policy,
            'matches_release': result.returncode == 0 and status == b'200' and same_target and normalized == expected}

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    checks = list(pool.map(check, sorted(files.items())))
report = {'checked_at': datetime.now(timezone.utc).isoformat(),
          'source_revision': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root).decode().strip(),
          'deployment_url': args.deployment, 'base': args.base,
          'normalization': 'Only observed Cloudflare email obfuscation href/span/anchor replacements and decoder script, plus the exact hash-pinned managed robots prefix (retained verbatim per check). Same-path trailing-slash redirects allowed.',
          'checks': checks}
Path(args.output).write_text(json.dumps(report, indent=2) + '\n')
failed = [row for row in checks if not row['matches_release']]
print(f'Checked {len(checks)} deployed pages/assets: {len(checks) - len(failed)} matched, {len(failed)} failed.')
for row in failed:
    print(row['http'], row['route'], 'release mismatch')
raise SystemExit(bool(failed))
