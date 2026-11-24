import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");

const ENTRY =
  "You will lean so far toward the morning light that your keeper will turn your pot, and you will lean again.";

// Self-check: the gate is 1-120 characters, one line, no trailing newline.
if (ENTRY.length < 1 || ENTRY.length > 120) {
  throw new Error(`entry length ${ENTRY.length} outside 1-120`);
}
if (ENTRY.includes("\n")) throw new Error("entry must be a single line");

mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, ENTRY, "utf8");

// Read back and verify byte-identical, plus fortune-shape checks:
// no double spaces, ends with a period, keeps the lean loop and the
// "lean again" close, and reads as one sentence of prediction.
const back = readFileSync(`${outDir}/entry.txt`, "utf8");
if (back !== ENTRY) throw new Error("read-back mismatch");
if (back.includes("  ")) throw new Error("entry has a double space");
if (!back.endsWith(".")) throw new Error("entry must end with a period");
if (!back.includes("lean again.")) {
  throw new Error("entry lost its closing sting");
}
const words = back.split(" ").filter(Boolean);
if (words.length < 10 || words.length > 30) {
  throw new Error(`entry word count ${words.length} outside 10-30`);
}
console.log(`wrote ${outDir}/entry.txt (${ENTRY.length} chars)`);
