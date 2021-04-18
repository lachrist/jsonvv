
import * as ChildProcess from "child_process";

const target = process.argv[2];

if (!target.startsWith("lib/")) {
  throw new Error(`Invalid target file: ${target}`);
}

ChildProcess.spawnSync(
  "npx",
  [
    "c8",
    "--reporter=html",
    `--include=${target}`,
    `node`,
    `test/${target.substring("4")}`
  ],
  {
    stdio: "inherit"
  }
);

ChildProcess.spawnSync(
  "open",
  ["coverage/index.html"],
  {
    stdio: "inherit"
  }
);
