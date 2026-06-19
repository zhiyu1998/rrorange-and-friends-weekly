// 生成周刊推送文案脚本
// 用法: pnpm gen:push 039   或   node scripts/gen-push.mjs 039
// 从指定期数的 md 文件解析标题与全部条目，按推送模板输出到控制台。

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const HOSTNAME = "https://rrorangeandfriends.de";

const issue = process.argv[2];
if (!issue) {
  console.error("用法: pnpm gen:push <期号>，例如 pnpm gen:push 039");
  process.exit(1);
}

// 期号归一化为 3 位（038 / 39 都接受）
const issuePadded = String(issue).padStart(3, "0");

// 扫描 posts/ 下所有年份目录，定位匹配该期号的 md 文件
const postsDir = resolve(ROOT, "docs", "posts");
let mdPath = "";
for (const year of readdirSync(postsDir)) {
  const candidate = resolve(postsDir, year, `${issuePadded}.md`);
  try {
    readFileSync(candidate, "utf-8");
    mdPath = candidate;
    break;
  } catch {
    // 该年份下无此文件，继续找
  }
}

if (!mdPath) {
  console.error(`未找到期号 ${issuePadded} 对应的 md 文件（已搜索 docs/posts/*/）`);
  process.exit(1);
}

const raw = readFileSync(mdPath, "utf-8");
// 归一化行尾，兼容 CRLF（Windows）与 LF
const content = raw.replace(/\r\n/g, "\n");

// 解析 frontmatter 取 title
const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
const title = fmMatch?.[1].match(/^title:\s*(.+)$/m)?.[1].trim();
if (!title) {
  console.error(`未能在 ${mdPath} 的 frontmatter 中解析到 title`);
  process.exit(1);
}

// 从 md 路径反推 URL（docs/posts/2026/038.md -> /posts/2026/038）
const rel = mdPath.replace(/\\/g, "/").replace(/.*\/docs/, "");
const urlPath = rel.replace(/\.md$/, "");
const url = `${HOSTNAME}${urlPath}`;

// 提取所有 `### [标题](URL)` 的标题文本
const entries = [...content.matchAll(/^### \[([^\]]+)\]\([^)]*\)/gm)].map((m) => m[1]);
if (entries.length === 0) {
  console.error(`未在 ${mdPath} 中找到任何 ### [标题](URL) 条目`);
  process.exit(1);
}

// 组装推送文案
const lines = [];
lines.push("#周刊");
lines.push("");
lines.push(`本期《${title}》 (${url})`);
lines.push("");
lines.push(`👉直达：${url}`);
lines.push("");
lines.push("🤩 本期看点：");
lines.push("");
for (const entry of entries) {
  lines.push(`${entry}\n`);
}
lines.push("");
lines.push(
  `📬投稿 & 群聊 (https://t.me/RrOrangeAndFriendsWithChat)    🔈频道 (https://t.me/RrOrangeAndFriends)    🔎索引 (https://t.me/RrOrangeAndFriends/280)    👉文末直达 (${url})`
);

console.log(lines.join("\n"));
