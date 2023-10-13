import * as fs from "node:fs/promises";
import * as ps from "node:path";
import * as babylon from "babylon";
import _traverse from "@babel/traverse";
import { transformFromAstSync } from "@babel/core";
import { fileURLToPath } from "node:url";
import { log } from "node:console";

const traverse = _traverse.default;

let id = 0;
const __filename = fileURLToPath(import.meta.url);
const __dirname = ps.dirname(__filename);

const filename = ps.join(__dirname, "./example/entry.js");

async function createAsset(filename) {
  const content = await fs.readFile(filename, { encoding: "utf-8" });

  const ast = babylon.parse(content, {
    sourceType: "module",
  });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  log(dependencies);
}

createAsset(filename);
