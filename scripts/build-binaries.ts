// Cross-compiles the node client to single binaries for every supported platform.
import { $ } from "bun";

const entry = "src/main.ts";
const targets = [
  { target: "bun-darwin-arm64", out: "dist/nyxos-node-darwin-arm64" },
  { target: "bun-darwin-x64", out: "dist/nyxos-node-darwin-x64" },
  { target: "bun-linux-x64", out: "dist/nyxos-node-linux-x64" },
  { target: "bun-linux-arm64", out: "dist/nyxos-node-linux-arm64" },
];

for (const { target, out } of targets) {
  console.log(`building ${out} (${target})…`);
  await $`bun build ${entry} --compile --target=${target} --outfile ${out}`;
}
console.log("done");
