/**
 * upload-pd-data.js
 * 把從 pokerdinosaur.com 下載的 JSON 資料批量上傳到測試 Supabase (btiqmckyjyswzrarmfxa)
 *
 * 執行方式：
 *   node scripts/upload-pd-data.js
 *
 * 預期 Downloads 資料夾內有：
 *   projects_all.json
 *   scenarios_all.json
 *   project_<uuid>_tables.json  (10 個)
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const SUPABASE_URL = 'https://btiqmckyjyswzrarmfxa.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aXFtY2t5anlzd3pyYXJtZnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzA4MjAsImV4cCI6MjA5MTcwNjgyMH0.NexV3NCPU3ksCVudWdhBjDWS99jcbLkxnaL1tInJAGQ';
const DOWNLOADS = path.join(os.homedir(), 'Downloads');
const BATCH = 500;

const headers = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates',
};

async function upsert(table, rows) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const r = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows),
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`[${table}] HTTP ${r.status}: ${err.substring(0, 300)}`);
  }
}

async function batchUpsert(table, rows, label) {
  const total = rows.length;
  let done = 0;
  for (let i = 0; i < total; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    await upsert(table, chunk);
    done += chunk.length;
    process.stdout.write(`\r  ${label}: ${done}/${total}`);
  }
  console.log(`\r  ${label}: ${total}/${total} ✅`);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  找不到檔案：${filePath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function main() {
  console.log('=== Poker Dinosaur 資料上傳 ===\n');

  // 1. Projects
  console.log('[1/3] 上傳 projects...');
  const rawProjects = readJson(path.join(DOWNLOADS, 'projects_all.json'));
  if (!rawProjects) process.exit(1);
  const projects = rawProjects.map(p => ({
    id: p.id,
    name: p.name,
    actions: p.actions || {},
    description: p.description || null,
    created_at: p.created_at || null,
  }));
  await batchUpsert('pd_projects', projects, 'projects');

  // 2. Scenarios — 選最大版本 (12865 > 8000)，避免舊檔不完整
  console.log('[2/3] 上傳 scenarios...');
  const scenarioCandidates = ['scenarios_all (2).json', 'scenarios_all (1).json', 'scenarios_all.json']
    .map(f => path.join(DOWNLOADS, f))
    .filter(f => fs.existsSync(f));
  let rawScenarios = null;
  for (const f of scenarioCandidates) {
    const d = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (!rawScenarios || d.length > rawScenarios.length) {
      rawScenarios = d;
      console.log(`  使用：${path.basename(f)} (${d.length} 筆)`);
    }
  }
  if (!rawScenarios) process.exit(1);
  const scenarios = rawScenarios.map(s => ({
    id: s.id,
    project_id: s.project_id,
    parent_id: s.parent_id || null,
    name: s.name,
    order: s.order ?? 0,
    is_folder: s.is_folder ?? false,
  }));
  // Insert by depth to satisfy FK constraint (tree may have multiple levels)
  const inserted = new Set();
  let remaining = scenarios.slice();
  let level = 0;
  while (remaining.length > 0) {
    const ready = remaining.filter(s => !s.parent_id || inserted.has(s.parent_id));
    if (ready.length === 0) {
      throw new Error(`scenarios 有 ${remaining.length} 筆 parent_id 找不到，疑似資料不完整`);
    }
    await batchUpsert('pd_scenarios', ready, `scenarios L${level}`);
    ready.forEach(s => inserted.add(s.id));
    remaining = remaining.filter(s => !inserted.has(s.id));
    level++;
  }

  // 3. Tables — 掃描 *_ranges.json（新格式：{project_id, tables:[...]}）
  console.log('[3/3] 上傳 range tables...');
  const tableFiles = fs.readdirSync(DOWNLOADS).filter(f =>
    /_ranges\.json$/.test(f)
  );
  if (tableFiles.length === 0) {
    console.warn('  ⚠️  找不到任何 *_ranges.json，請確認 Downloads 資料夾');
    process.exit(1);
  }
  console.log(`  找到 ${tableFiles.length} 個 ranges 檔案`);

  let totalTables = 0;
  for (const file of tableFiles) {
    const raw = readJson(path.join(DOWNLOADS, file));
    if (!raw || !raw.tables || !raw.project_id) {
      console.warn(`  ⚠️  跳過 ${file}（格式不符）`);
      continue;
    }
    const rows = raw.tables.map(t => ({
      id: t.id,
      project_id: raw.project_id,
      scenario_id: t.scenario_id,
      name: t.name,
      order: t.order ?? 0,
      grid: t.grid || {},
      action_ids: t.action_ids || [],
    }));
    await batchUpsert('pd_tables', rows, `  ${file.substring(0,40)}`);
    totalTables += rows.length;
  }

  console.log(`\n🎉 完成！`);
  console.log(`   projects : ${projects.length}`);
  console.log(`   scenarios: ${scenarios.length}`);
  console.log(`   tables   : ${totalTables}`);
}

main().catch(e => { console.error('\n❌ 錯誤：', e.message); process.exit(1); });
