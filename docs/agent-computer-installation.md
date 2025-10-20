# 20251010

current os: ubuntu22.04

## install nvm

```bash

# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.20.0".

# Verify npm version:
npm -v # Should print "10.9.3".
```

## install python related

```bash
# Update package list
sudo apt update

# Install Python 3 and pip
sudo apt install python3 python3-pip python3-venv -y

# Install the Claude Code CLI globally
npm install -g @anthropic-ai/claude-code

# Decided to use uv to install the sdk
# Create/sync environment and install package
uv init
uv add claude-agent-sdk
```

## install others

```bash
# task master
npm install -g task-master-ai

# github cli
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
	&& sudo mkdir -p -m 755 /etc/apt/keyrings \
	&& out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
	&& cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
	&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
	&& sudo mkdir -p -m 755 /etc/apt/sources.list.d \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
	&& sudo apt update \
	&& sudo apt install gh -y
sudo apt install gh
```

## clone git repo

- clone the current repo with existing.. 
	- nuxtjs accelerator (working out the box)
	- taskmaster configurations

# 20251017

```bash
npm install -g @playwright/mcp
```

# 20251019

```bash
npm init playwright@latest
# Getting started with writing end-to-end tests with Playwright:
# Initializing project in '.'
# ✔ Where to put your end-to-end tests? · tests
# ✔ Add a GitHub Actions workflow? (Y/n) · true
# ✔ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
# ✔ Install Playwright operating system dependencies (requires sudo / root - can be done manually via 'sudo npx playwright install-deps')? (y/N) · true

# Installing Playwright Test (npm install --save-dev @playwright/test)…

# added 3 packages, and audited 902 packages in 1s

# 232 packages are looking for funding
#   run `npm fund` for details

# found 0 vulnerabilities
# Installing Types (npm install --save-dev @types/node)…

# added 2 packages, and audited 904 packages in 1s

# 232 packages are looking for funding
#   run `npm fund` for details

# found 0 vulnerabilities
# Writing playwright.config.ts.
# Writing .github/workflows/playwright.yml.
# Writing tests/example.spec.ts.
# Writing package.json.
# Downloading browsers (npx playwright install --with-deps)…
# Installing dependencies...
# Switching to root user to install dependencies...
# [sudo] password for user1: 
# Hit:1 https://cli.github.com/packages stable InRelease
# Get:2 http://security.ubuntu.com/ubuntu jammy-security InRelease [129 kB]    SKIP...

npx playwright install
```