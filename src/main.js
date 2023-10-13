import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as babylon from "babylon";
import _traverse from "@babel/traverse";
import { transformFromAstAsync } from "@babel/core";
import { fileURLToPath } from "node:url";
import { log } from "node:console";

const traverse = _traverse.default;

let ID = 0;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filename = path.join(__dirname, "./example/entry.js");

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

  const { code } = await transformFromAstAsync(ast, null);

  const id = ID++;

  return {
    id,
    filename,
    dependencies,
    code,
  };
}

async function createGraph(entry) {
  const mainAsset = await createAsset(entry);
  const queue = [mainAsset];

  for (const asset of queue) {
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);
    for (const relativePath of asset.dependencies) {
      const absolutePath = path.join(dirname, relativePath);
      const child = await createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    }
  }

  return queue;
}

const r = await createGraph(filename);
log(r);
