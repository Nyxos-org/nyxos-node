# Contributing

Thanks for your interest in the Nyxos node client.

## Development

Requires [Bun](https://bun.sh) and [Ollama](https://ollama.com).

```bash
bun install
ollama serve &
ollama pull llama3.2:1b

NODE_KEY=node_… COORD_URL=wss://api.nyxos.dev/node bun run src/main.ts
```

## Building binaries

```bash
bun run build       # current platform -> dist/nyxos-node
bun run build:all   # all platforms    -> dist/nyxos-node-<os>-<arch>
```

## Guidelines

- Keep the client small and dependency-free - it's a single binary people run on their own machines.
- The wire protocol lives in `src/protocol.ts` and must stay in sync with the coordinator.
- Open an issue before large changes.

## Releasing

Maintainers tag `vX.Y.Z`; CI builds and attaches binaries to the GitHub Release.
