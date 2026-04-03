/**
 * Content validation script for diabolus-in-musica.
 *
 * Checks every markdown file under content/lessons and reports:
 *   1. Missing required frontmatter fields
 *   2. Mixed Cyrillic + Latin characters within a single word
 *   3. Empty body content in topic files
 *   4. Duplicate slugs within a lesson
 *   5. Duplicate order numbers across lessons (in index.md files)
 *
 * Exit code 0 = clean, 1 = issues found.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Issue {
  file: string;
  line?: number;
  message: string;
}

interface CheckResult {
  name: string;
  issues: Issue[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CONTENT_DIR = path.join(process.cwd(), "content", "lessons");

/** Return every markdown file under CONTENT_DIR, recursively. */
function collectMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

/** Return a path relative to cwd for display purposes. */
function rel(file: string): string {
  return path.relative(process.cwd(), file);
}

/** Return 1-based line number for the first occurrence of `text` in `raw`. */
function lineOf(raw: string, text: string): number | undefined {
  const idx = raw.indexOf(text);
  if (idx === -1) return undefined;
  return raw.slice(0, idx).split("\n").length;
}

/**
 * Return the 1-based line number where body content starts (after frontmatter).
 * gray-matter tells us how many lines the frontmatter block occupies via
 * `matter.stringify` — but it is simpler to count the closing `---`.
 */
function bodyStartLine(raw: string): number {
  const lines = raw.split("\n");
  // frontmatter starts with ---
  if (!lines[0].trimEnd().startsWith("---")) return 1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trimEnd() === "---" || lines[i].trimEnd() === "...") {
      return i + 2; // line after closing delimiter (1-based)
    }
  }
  return 1;
}

// ---------------------------------------------------------------------------
// Check 1 — Missing required frontmatter fields
// ---------------------------------------------------------------------------

const INDEX_REQUIRED = ["title", "slug", "instrument", "order", "level"] as const;
const TOPIC_REQUIRED = ["title", "slug"] as const;

function checkFrontmatter(files: string[]): CheckResult {
  const issues: Issue[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const { data } = matter(raw);
    const isIndex = path.basename(file) === "index.md";
    const required = isIndex ? INDEX_REQUIRED : TOPIC_REQUIRED;

    for (const field of required) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        issues.push({
          file: rel(file),
          message: `Missing required frontmatter field: "${field}"`,
        });
      }
    }
  }

  return { name: "Frontmatter issues", issues };
}

// ---------------------------------------------------------------------------
// Check 2 — Mixed Cyrillic + Latin within a single word
// ---------------------------------------------------------------------------

/** Unicode ranges */
const CYRILLIC = /[\u0400-\u04FF]/;
const LATIN = /[A-Za-z]/;

/**
 * A "word" here is a contiguous run of letters (Cyrillic or Latin).
 * Returns true if the word contains at least one Cyrillic and one Latin character.
 */
function isMixedWord(word: string): boolean {
  return CYRILLIC.test(word) && LATIN.test(word);
}

function checkMixedScripts(files: string[]): CheckResult {
  const issues: Issue[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const { content } = matter(raw);
    const lines = content.split("\n");
    const startLine = bodyStartLine(raw);

    lines.forEach((line, idx) => {
      // Extract runs of mixed-script-capable characters (letters + optional hyphens)
      const words = line.match(/[\u0400-\u04FFA-Za-z][\u0400-\u04FFA-Za-z-]*/g) ?? [];
      for (const word of words) {
        if (isMixedWord(word)) {
          issues.push({
            file: rel(file),
            line: startLine + idx,
            message: `Mixed Cyrillic+Latin word: "${word}"`,
          });
        }
      }
    });
  }

  return { name: "Mixed scripts", issues };
}

// ---------------------------------------------------------------------------
// Check 3 — Empty body content in topic files
// ---------------------------------------------------------------------------

function checkEmptyBody(files: string[]): CheckResult {
  const issues: Issue[] = [];

  for (const file of files) {
    if (path.basename(file) === "index.md") continue; // index files have no required body

    const raw = fs.readFileSync(file, "utf-8");
    const { content } = matter(raw);

    if (content.trim() === "") {
      issues.push({
        file: rel(file),
        message: "Topic file has no body content after frontmatter",
      });
    }
  }

  return { name: "Empty content", issues };
}

// ---------------------------------------------------------------------------
// Check 4 — Duplicate slugs within a lesson
// ---------------------------------------------------------------------------

function checkDuplicateSlugs(files: string[]): CheckResult {
  const issues: Issue[] = [];

  // Group topic files by their parent directory (= lesson)
  const byLesson = new Map<string, string[]>();
  for (const file of files) {
    if (path.basename(file) === "index.md") continue;
    const lessonDir = path.dirname(file);
    if (!byLesson.has(lessonDir)) byLesson.set(lessonDir, []);
    byLesson.get(lessonDir)!.push(file);
  }

  for (const [lessonDir, topicFiles] of byLesson) {
    const slugCounts = new Map<string, string[]>(); // slug → files

    for (const file of topicFiles) {
      const raw = fs.readFileSync(file, "utf-8");
      const { data } = matter(raw);
      const slug = String(data.slug ?? "");
      if (!slug) continue; // missing slug is reported by check 1
      if (!slugCounts.has(slug)) slugCounts.set(slug, []);
      slugCounts.get(slug)!.push(file);
    }

    for (const [slug, dupeFiles] of slugCounts) {
      if (dupeFiles.length > 1) {
        issues.push({
          file: rel(lessonDir),
          message: `Duplicate slug "${slug}" in files: ${dupeFiles.map(rel).join(", ")}`,
        });
      }
    }
  }

  return { name: "Duplicate slugs", issues };
}

// ---------------------------------------------------------------------------
// Check 5 — Duplicate order numbers across index.md files
// ---------------------------------------------------------------------------

function checkOrderDuplicates(files: string[]): CheckResult {
  const issues: Issue[] = [];

  const indexFiles = files.filter((f) => path.basename(f) === "index.md");

  // Group by instrument directory (one level up from lesson dir, one level down from CONTENT_DIR)
  const byInstrument = new Map<string, string[]>();
  for (const file of indexFiles) {
    const instrumentDir = path.dirname(path.dirname(file));
    if (!byInstrument.has(instrumentDir)) byInstrument.set(instrumentDir, []);
    byInstrument.get(instrumentDir)!.push(file);
  }

  for (const [instrumentDir, indexPaths] of byInstrument) {
    const orderMap = new Map<number, string[]>(); // order → files

    for (const file of indexPaths) {
      const raw = fs.readFileSync(file, "utf-8");
      const { data } = matter(raw);
      const order = Number(data.order);
      if (isNaN(order)) continue;
      if (!orderMap.has(order)) orderMap.set(order, []);
      orderMap.get(order)!.push(file);
    }

    for (const [order, dupeFiles] of orderMap) {
      if (dupeFiles.length > 1) {
        issues.push({
          file: rel(instrumentDir),
          message: `Duplicate order number ${order} in: ${dupeFiles.map(rel).join(", ")}`,
        });
      }
    }

    // Also report gaps
    const orders = [...orderMap.keys()].sort((a, b) => a - b);
    for (let i = 1; i < orders.length; i++) {
      const prev = orders[i - 1];
      const curr = orders[i];
      if (curr - prev > 1) {
        issues.push({
          file: rel(instrumentDir),
          message: `Order gap between ${prev} and ${curr} (missing: ${Array.from(
            { length: curr - prev - 1 },
            (_, k) => prev + k + 1
          ).join(", ")})`,
        });
      }
    }
  }

  return { name: "Order gaps or duplicates", issues };
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

function printResult(result: CheckResult): void {
  const { name, issues } = result;
  const status = issues.length === 0 ? "✓" : "✗";
  console.log(`\n${status} ${name} — ${issues.length} issue(s)`);
  for (const issue of issues) {
    const loc = issue.line !== undefined ? `:${issue.line}` : "";
    console.log(`  ${issue.file}${loc}: ${issue.message}`);
  }
}

function main(): void {
  console.log("Scanning content/lessons …\n");

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`ERROR: Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = collectMarkdownFiles(CONTENT_DIR);
  console.log(`Found ${files.length} markdown file(s).`);

  const results: CheckResult[] = [
    checkFrontmatter(files),
    checkMixedScripts(files),
    checkEmptyBody(files),
    checkDuplicateSlugs(files),
    checkOrderDuplicates(files),
  ];

  let totalIssues = 0;
  for (const result of results) {
    printResult(result);
    totalIssues += result.issues.length;
  }

  console.log("\n──────────────────────────────────────────");
  if (totalIssues === 0) {
    console.log("All checks passed. Content is clean.");
    process.exit(0);
  } else {
    console.log(`${totalIssues} total issue(s) found across ${results.filter((r) => r.issues.length > 0).length} check(s).`);
    process.exit(1);
  }
}

main();
