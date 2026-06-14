# Changelog

All notable changes to the Nyxos node client are documented here.

## [0.1.0]

Initial public release.

- Connect to the Nyxos coordinator over a secure WebSocket (outbound only).
- Register a provider node and serve inference jobs via local [Ollama](https://ollama.com).
- One-line installer (`curl -fsSL https://nyxos.dev/join | sh -s <NODE_KEY>`).
- Prebuilt single-binary releases for macOS and Linux (arm64 / x64).
