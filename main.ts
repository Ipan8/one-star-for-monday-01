// One Star for Monday — make.fun entry.
// The brief: one line of plain text, a one-star review of Monday written
// as though Monday were a restaurant. At most 25 words, no explanation.
// A weary office-worker judge picks the line it would screenshot into the
// group chat, weighing: does it read as a real one-star restaurant review,
// does it sound like a genuine diner's complaint (table, server, dish or
// bill gone wrong), does the joke land on Monday specifically, and is it
// short and quotable.
//
// Why the winner wins:
// The waiter took the weekend away and brought back a 9 a.m. meeting —
// the dish is Monday itself, served at the exact hour the weekend dies.
// The bill is the insult on top: Monday still expected a tip. Every
// office worker has sat at that table. It could not be about any other
// day: only Monday steals a weekend and charges you for the meeting
// that replaces it.
import { mkdirSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_WORDS = 25;
const MAX_CHARS = 180;

// Shortlist, ordered weakest to strongest. The last contender is the
// winner on purpose: picking the final item is picking the best line.
const CONTENDERS: string[] = [
  "Booked a table for the weekend; Monday seated me at 7 a.m. beside a spreadsheet and charged full price.",
  "Sat down at 8 a.m., the server lost my order, and Monday served my weekend back cold.",
  "The waiter took my weekend, brought back a 9 a.m. meeting, and Monday still expected a tip.",
];

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

// A valid entry is one line of plain text: no newlines, 1-180 chars,
// at most 25 words. Anything else fails the gate outright, so every
// contender is checked before the winner is picked.
function isValidEntry(value: string): boolean {
  if (value.trim().length === 0) return false;
  if (value.includes("\n") || value.includes("\r")) return false;
  if (value.length > MAX_CHARS) return false;
  if (wordCount(value) > MAX_WORDS) return false;
  return true;
}

function validateShortlist(candidates: readonly string[]): void {
  for (const candidate of candidates) {
    if (!isValidEntry(candidate)) {
      throw new Error(`Candidate fails the gate: ${JSON.stringify(candidate)}`);
    }
  }
}

function pickWinner(candidates: readonly string[]): string {
  const winner = candidates[candidates.length - 1];
  if (winner === undefined) {
    throw new Error("No candidate lines were provided.");
  }
  if (!isValidEntry(winner)) {
    throw new Error(`Winner fails the gate: ${JSON.stringify(winner)}`);
  }
  return winner;
}

function writeEntry(line: string, destination: string): void {
  mkdirSync("/output", { recursive: true });
  writeFileSync(destination, `${line}\n`, "utf8");
}

function main(): void {
  validateShortlist(CONTENDERS);
  const entry = pickWinner(CONTENDERS);
  console.log(entry);
  console.log(`(${wordCount(entry)} words, ${entry.length} chars)`);
  writeEntry(entry, OUTPUT_PATH);
  console.log(`Entry written to ${OUTPUT_PATH}`);
}

main();
