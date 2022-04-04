import path from "node:path";
import process from "node:process";
import test from "ava";
import { execa } from "execa";
import fs from "fs-extra";
import { readPackage } from "read-pkg";
import { writePackage } from "write-pkg";

test.serial("hasScriptsField", async (t) => {
  // Setup
  const directory = path.resolve("test/hasScriptsField");

  await fs.mkdir(directory);
  process.chdir(directory);

  await writePackage({
    name: "has-scripts-field",
    scripts: {},
  });

  // Test
  await execa("setup-ava");
  const packageJson = await readPackage({ normalize: false });

  t.deepEqual(packageJson, {
    name: "has-scripts-field",
    scripts: {
      test: "ava",
    },
    ava: {
      extensions: ["ts"],
      register: ["esbuild-runner/register"],
    },
    dependencies: {
      ava: "4.1.0",
      "esbuild-runner": "2.2.1",
    },
  });

  // Cleanup
  process.chdir("../..");
  fs.rmSync(directory, { recursive: true });
});

test.serial("noScriptsField", async (t) => {
  // Setup
  const directory = path.resolve("test/noScriptsField");

  await fs.mkdir(directory);
  process.chdir(directory);

  await writePackage({
    name: "no-scripts-field",
  });

  // Test
  await execa("setup-ava");
  const packageJson = await readPackage({ normalize: false });

  t.deepEqual(packageJson, {
    name: "no-scripts-field",
    scripts: {
      test: "ava",
    },
    ava: {
      extensions: ["ts"],
      register: ["esbuild-runner/register"],
    },
    dependencies: {
      ava: "4.1.0",
      "esbuild-runner": "2.2.1",
    },
  });

  // Cleanup
  process.chdir("../..");
  fs.rmSync(directory, { recursive: true });
});
