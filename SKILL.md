---
name: molar
description: Set up Molar for browser checks on an authorized public site.
---

# Set up Molar

The Molar plugin gives coding agents a skill and the hosted MCP endpoint. See the
[public marketplace](https://github.com/pratikranaa/molar-cli) for installation and
its complete [skill and task references](https://github.com/pratikranaa/molar-cli/tree/main/plugins/molar/skills/molar).

For Claude Code, run these inside a session:

```text
/plugin marketplace add pratikranaa/molar-cli
/plugin install molar@molar
```

For Codex:

```sh
codex plugin marketplace add pratikranaa/molar-cli
codex plugin add molar@molar
```

The hosted MCP connection may prompt for sign-in and consent; client compatibility
is still being validated. To use the CLI skill, install `@molar/cli`, sign in,
and use a publicly reachable URL you are authorized to test. The published CLI
does not include its local browser daemon, so localhost checks are not an
out-of-the-box workflow. Do not send private URLs to the hosted service.
