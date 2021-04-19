#!/usr/bin/env node

import * as FileSystem from "fs";
import { parse as acorn } from "acorn";
import { generate as escodegen } from "escodegen";
// import checkSyntax from "../lib/check-syntax.mjs";
import compile from "../lib/compile.mjs";

const node = acorn(
  FileSystem.readFileSync(process.argv[2], "utf8"),
  {
    ecmaVersion: 2020,
    locations: true
  }
);

// checkSyntax(node);

FileSystem.writeFileSync(
  process.argv[3],
  escodegen(compile(node)),
  "utf8"
);
