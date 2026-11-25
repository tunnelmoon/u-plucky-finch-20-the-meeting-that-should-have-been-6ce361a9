import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I took three pages of notes in a meeting that could have been an email, and the only action item was 'circulate the notes'.";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`line must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("line must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("line must not contain control characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  fail("round-trip read-back does not match the line");
}
