#!/usr/bin/env sh
# Nyxos node-client installer.
#   curl -fsSL https://nyxos.dev/join | sh -s <NODE_KEY>
# Installs Ollama (if needed), pulls the model, downloads the node binary, and runs it.
set -e

NODE_KEY="$1"
MODEL="${MODEL:-llama3.2:1b}"
REPO="${NYXOS_REPO:-Nyxos-org/nyxos-node}"

if [ -z "$NODE_KEY" ]; then
  echo "usage: curl -fsSL https://nyxos.dev/join | sh -s <NODE_KEY>"
  echo "get a NODE_KEY by registering at https://nyxos.dev/app#providers"
  exit 1
fi

say() { printf "\033[35m▸\033[0m %s\n" "$1"; }

# 1. Ensure Ollama is installed.
if ! command -v ollama >/dev/null 2>&1; then
  say "Installing Ollama…"
  case "$(uname -s)" in
    Linux) curl -fsSL https://ollama.com/install.sh | sh ;;
    Darwin)
      if command -v brew >/dev/null 2>&1; then brew install ollama
      else echo "Install Ollama from https://ollama.com/download, then re-run."; exit 1; fi ;;
    *) echo "Unsupported OS. Install Ollama manually from https://ollama.com/download"; exit 1 ;;
  esac
fi

# 2. Ensure the Ollama server is running.
if ! curl -fsS localhost:11434/api/version >/dev/null 2>&1; then
  say "Starting Ollama…"
  (ollama serve >/dev/null 2>&1 &)
  sleep 2
fi

# 3. Pull the model (one-time ~1.3 GB for the default).
say "Pulling model $MODEL (one-time download)…"
ollama pull "$MODEL"

# 4. Download the prebuilt node binary for this platform.
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
[ "$ARCH" = "x86_64" ] && ARCH="x64"
[ "$ARCH" = "aarch64" ] && ARCH="arm64"
BIN="nyxos-node-${OS}-${ARCH}"
URL="https://github.com/${REPO}/releases/latest/download/${BIN}"
DEST="${HOME}/.nyxos/nyxos-node"
mkdir -p "${HOME}/.nyxos"
say "Downloading node client ($BIN)…"
curl -fsSL "$URL" -o "$DEST"
chmod +x "$DEST"

# 5. Run — node connects to the coordinator and starts earning.
say "Starting your node — leave this running to earn \$NYXOS."
NODE_KEY="$NODE_KEY" MODEL="$MODEL" exec "$DEST"
