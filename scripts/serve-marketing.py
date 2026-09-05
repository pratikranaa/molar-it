#!/usr/bin/env python3
"""Serve the static marketing package locally with Cloudflare-style clean URLs."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse

ROOT = Path(__file__).resolve().parent.parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _clean_route(self):
        route = unquote(urlsplit(self.path).path)
        candidate = ROOT / (route.lstrip('/') + '.html')
        if not Path(route).suffix and candidate.is_file() and candidate.resolve().is_relative_to(ROOT):
            self.path = route + '.html'

    def do_GET(self):
        self._clean_route()
        super().do_GET()

    def do_HEAD(self):
        self._clean_route()
        super().do_HEAD()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        if code == 404 and (ROOT / '404.html').is_file():
            content = (ROOT / '404.html').read_bytes()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(content)
        else:
            super().send_error(code, message, explain)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()
    ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
