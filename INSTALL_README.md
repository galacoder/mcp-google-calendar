## Google Calendar MCP Server — Node.js Compatibility Fix

### Problem

Running `npm start` fails immediately with:

```
TypeError: Cannot read properties of undefined (reading 'prototype')
    at .../node_modules/buffer-equal-constant-time/index.js:37
```

### Root Cause

Node.js v25 removed `SlowBuffer` from the `buffer` module. The dependency chain `google-auth-library` → `jws` → `jwa` → `buffer-equal-constant-time@1.0.1` relies on `SlowBuffer.prototype.equal`, which no longer exists. No updated version of `buffer-equal-constant-time` has been published.

### Fix

Pin the project to **Node.js 22 LTS** using [mise](https://mise.jdx.dev/):

```bash
# Install Node 22 if you don't have it
mise install node@22

# In the project directory, set Node 22 as the active version
mise use node@22
```

This creates a `mise.toml` file in the project root. For mise to **automatically** switch Node versions when you enter the directory, you need `mise activate` in your shell profile:

```bash
# Add to ~/.zshrc (or ~/.bashrc)
eval "$(mise activate zsh)"   # or: eval "$(mise activate bash)"
```

Then restart your terminal (or `source ~/.zshrc`) and verify:

```bash
cd /path/to/mcp-google-calendar
node --version   # should print v22.x.x
npm install
npm start
```

**If you don't want to modify your shell profile**, use `mise exec` to run commands under Node 22 directly:

```bash
mise exec -- npm install
mise exec -- npm start
```

### Why not just upgrade the dependency?

The latest versions of `google-auth-library` (v10.6.1) and `jwa` (v2.0.1) still depend on `buffer-equal-constant-time@1.0.1`. There is no upstream fix available, so using Node 22 LTS is the correct solution. Node 22 is the current LTS release (supported through April 2027).
