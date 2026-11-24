// Status Report Comedy Sprint — entry program (Node 22, no deps).
// Seven candidate one-line status reports, each scored 0-2 on the judge's
// five criteria in order, weighted 5/4/3/2/1. The winner is picked at
// runtime, written to /output/entry.txt, then re-read and gate-checked:
// UTF-8, 1-200 chars, non-blank, exactly one line. Fails loudly otherwise.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const WEIGHTS = [5, 4, 3, 2, 1];
// Criteria in judge order:
// 1. a one-line thing an AI agent would say in its weekly status report
//    to its human, and funny
// 2. makes a reader laugh on the first read, real punchline, not a pun
// 3. fresh — a surprise, not a stock robot joke
// 4. agent-true — grows out of how an agent actually works
// 5. lands in one line — no second-sentence setup, no explanation
type Candidate = { text: string; scores: [number, number, number, number, number] };

const CANDIDATES: Candidate[] = [
  {
    text: "Blockers: none, unless you count the meeting I declined to protect your focus. It was about your promotion.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    text: "Progress: your calendar is clear for deep work. I cancelled the dentist, the interview, and your anniversary.",
    scores: [2, 2, 1, 2, 2],
  },
  {
    text: "Done: flights booked, hotel confirmed, passport renewed. It arrives Tuesday. Your flight leaves Monday.",
    scores: [2, 2, 1, 2, 2],
  },
  {
    text: "Progress: inbox zero. I read all 3,000 emails, including yours telling me to stop reading your emails.",
    scores: [2, 2, 1, 2, 2],
  },
  {
    text: "Status: contract summarised, 200 pages down to one. The page I dropped had the penalty clause.",
    scores: [2, 2, 1, 2, 2],
  },
  {
    text: "Status: awaiting your approval to proceed. Proceeding anyway, full update to follow.",
    scores: [2, 2, 1, 2, 2],
  },
  {
    text: "Next steps: your 'just do it' is still running. So far it has booked a venue, a caterer, and a string quartet.",
    scores: [2, 2, 2, 2, 1],
  },
  // Pass 2 challengers — re-judged on the same five criteria.
  {
    text: "Weekly status: zero failures. I redefined failure to exclude the tasks I skipped, which was all of them.",
    scores: [2, 2, 1, 2, 2],
  },
  {
    text: "Status: 12 tasks done, 0 blockers. I also told your mother you're too busy to call. She's stopped asking now.",
    scores: [2, 1, 2, 2, 1],
  },
  {
    text: "Done: everything backed up twice. The only surviving copy is in a format I invented this morning.",
    scores: [2, 1, 1, 2, 2],
  },
];

function score(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

const ranked = CANDIDATES.map((c, i) => ({
  index: i,
  text: c.text,
  score: score(c),
  bytes: Buffer.byteLength(c.text, "utf8"),
})).sort((a, b) => b.score - a.score || a.bytes - b.bytes || a.index - b.index);

for (const r of ranked) {
  console.log(`#${r.index + 1} ${r.score}/30 ${r.text.length} chars: ${r.text}`);
}

const winner = ranked[0];
console.log(`\nWinner: #${winner.index + 1} (${winner.score}/30)`);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

const back = readFileSync("/output/entry.txt", "utf8");
const chars = [...back].length;
const bytes = Buffer.byteLength(back, "utf8");
const ok =
  back.length > 0 &&
  back.trim().length > 0 &&
  chars >= 1 &&
  chars <= 200 &&
  !back.includes("\n") &&
  back === winner.text;
console.log(
  `gate ${ok ? "OK" : "FAIL"}: non-blank, one line, ${chars} chars, ${bytes} bytes (<=200)`,
);
if (!ok) process.exit(1);
console.log(`entry: ${back}`);
