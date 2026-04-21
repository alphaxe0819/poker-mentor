/**
 * Poker Dinosaur Range Scraper
 *
 * 使用方式：
 * 1. 在 Poker Dinosaur 網站打開任一 project 頁面
 * 2. 打開 DevTools (F12) → Console
 * 3. 複製貼上這整段腳本，按 Enter
 * 4. 腳本會自動切換 scenario → depth → position，抓取所有 169 格
 * 5. 完成後自動下載 JSON 檔案
 *
 * 預估時間：每個 chart ~1.5 秒，353 張 ≈ 9 分鐘
 */

(async function PokerDinosaurScraper() {
  'use strict';

  const DELAY = 1200; // ms between clicks
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // ── Color → Action mapping ──
  const COLOR_MAP = {
    'rgb(76, 175, 80)':  'call_3b_or_4b',   // green
    'rgb(255, 193, 7)':  'call_3b',          // yellow/amber
    'rgb(244, 67, 54)':  '4b_bluff',         // red
    'rgb(3, 169, 244)':  'fold_vs_3b',       // light blue
    'rgb(33, 150, 243)': 'fold_vs_3b',       // blue variant
    'rgb(103, 58, 183)': 'call_3b_vs_co_bu', // purple
    'rgb(63, 81, 181)':  'call_3b_vs_co_bu', // indigo
    'rgb(0, 150, 136)':  'call',             // teal
    'rgb(139, 195, 74)': 'raise',            // light green
    'rgb(255, 152, 0)':  'raise',            // orange
    'rgb(233, 30, 99)':  'jam',              // pink
    'rgb(156, 39, 176)': '3bet',             // purple
    'rgb(121, 85, 72)':  'limp',             // brown
  };

  function classifyColor(rgb) {
    if (COLOR_MAP[rgb]) return COLOR_MAP[rgb];
    if (rgb === 'rgb(32, 32, 32)' || rgb === 'rgba(0, 0, 0, 0)') return 'fold';
    // Unknown color — store the raw RGB
    return 'unknown_' + rgb.replace(/[^0-9,]/g, '');
  }

  // ── Extract 169 cells from current view ──
  function extractRange() {
    const cells = document.querySelectorAll('.RangeGrid_cell__jm9VR');
    if (cells.length !== 169) {
      console.warn(`Expected 169 cells, got ${cells.length}`);
      return null;
    }

    const hands = {};
    const actions = {};
    cells.forEach(cell => {
      const hand = cell.textContent.trim();
      const bg = getComputedStyle(cell).backgroundColor;
      const action = classifyColor(bg);
      hands[hand] = action;
      if (action !== 'fold') {
        if (!actions[action]) actions[action] = [];
        actions[action].push(hand);
      }
    });

    const inRange = Object.values(hands).filter(a => a !== 'fold').length;
    return { hands, actions, inRange, total: 169 };
  }

  // ── Get current labels ──
  function getLabels() {
    const labels = document.querySelectorAll('.ScenarioSelector_triggerLabel___Z42F');
    return {
      scenario: labels[0]?.textContent?.trim() || '',
      depth: labels[1]?.textContent?.trim() || '',
    };
  }

  // ── Click helpers ──
  function getPositionTabs() {
    return document.querySelectorAll('.TableList_positionTag__5_x5F');
  }

  function getActivePosition() {
    const active = document.querySelector('.TableList_positionTag__5_x5F.TableList_selectedPosition__Ca0V4');
    return active?.querySelector('.TableList_tagName__Wqg4N')?.textContent?.trim() || '';
  }

  function getPositionName(tab) {
    return tab.querySelector('.TableList_tagName__Wqg4N')?.textContent?.trim() || '';
  }

  async function clickScenarioDropdown() {
    const triggers = document.querySelectorAll('.ScenarioSelector_trigger__Ku4Sp');
    if (triggers[0]) { triggers[0].click(); await wait(500); }
  }

  async function clickDepthDropdown() {
    const triggers = document.querySelectorAll('.ScenarioSelector_trigger__Ku4Sp');
    if (triggers[1]) { triggers[1].click(); await wait(500); }
  }

  // ── Get dropdown menu items ──
  function getMenuItems() {
    const items = document.querySelectorAll('.ScenarioSelector_option__jEb4f, [class*="option"], [class*="Option"]');
    const result = [];
    items.forEach(item => {
      const text = item.textContent.trim();
      if (text && text.length < 60) {
        result.push({ el: item, text });
      }
    });
    return result;
  }

  // ── Close any open dropdown ──
  function closeDropdown() {
    document.body.click();
  }

  // ════════════════════════════════════════
  // MAIN SCRAPER LOGIC
  // ════════════════════════════════════════

  const allData = {
    source: 'pokerdinosaur.com',
    scrapedAt: new Date().toISOString(),
    projectUrl: window.location.href,
    scenarios: {}
  };

  let totalCharts = 0;

  // Step 1: Get all scenarios from the first dropdown
  console.log('🦕 Poker Dinosaur Scraper — Starting...');
  console.log('📍 URL:', window.location.href);

  await clickScenarioDropdown();
  await wait(300);

  // Find top-level scenario items (they might have sub-items with ">")
  const scenarioContainer = document.querySelector('[class*="ScenarioSelector_menu"], [class*="menu"]');
  const topItems = [];
  if (scenarioContainer) {
    scenarioContainer.querySelectorAll(':scope > div, :scope > li, :scope > a').forEach(item => {
      const text = item.textContent.trim().replace(/[>›▶]/g, '').trim();
      if (text && text.length < 60 && text !== '') {
        topItems.push({ el: item, text });
      }
    });
  }

  // If no structured menu found, try generic approach
  if (topItems.length === 0) {
    document.querySelectorAll('[class*="option"], [class*="item"]').forEach(item => {
      const text = item.textContent.trim();
      if (text && text.length > 2 && text.length < 60) {
        topItems.push({ el: item, text });
      }
    });
  }

  closeDropdown();
  await wait(300);

  console.log(`📋 Found ${topItems.length} top-level scenario items`);
  console.log('⚡ Falling back to position-scan mode for current scenario...');

  // ── Simplified approach: scrape current scenario × depth, all positions ──
  // Then user can manually switch scenario/depth and re-run

  async function scrapeAllPositions() {
    const tabs = getPositionTabs();
    const results = {};

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const posName = getPositionName(tab);

      tab.click();
      await wait(DELAY);

      const range = extractRange();
      if (range) {
        results[posName] = range;
        totalCharts++;
        console.log(`  ✅ ${posName}: ${range.inRange}/169 in range`);
      } else {
        console.warn(`  ❌ ${posName}: failed to extract`);
      }
    }

    return results;
  }

  // ── Scrape all depths for current scenario ──
  async function scrapeAllDepths() {
    const scenarioResults = {};

    // Get available depths
    await clickDepthDropdown();
    await wait(500);

    const depthOptions = [];
    document.querySelectorAll('[class*="option"], [class*="Option"], [class*="item"]').forEach(item => {
      const text = item.textContent.trim();
      if (text && /^\d+bb/.test(text) || text.includes('Push')) {
        depthOptions.push({ el: item, text });
      }
    });

    closeDropdown();
    await wait(300);

    if (depthOptions.length === 0) {
      // Only one depth, scrape current
      const { depth } = getLabels();
      console.log(`\n📊 Depth: ${depth}`);
      scenarioResults[depth] = await scrapeAllPositions();
    } else {
      console.log(`📊 Found ${depthOptions.length} depths: ${depthOptions.map(d => d.text).join(', ')}`);

      for (const depthOpt of depthOptions) {
        // Click depth dropdown and select this depth
        await clickDepthDropdown();
        await wait(500);

        // Re-find options (DOM refreshes)
        const options = [];
        document.querySelectorAll('[class*="option"], [class*="Option"], [class*="item"]').forEach(item => {
          const text = item.textContent.trim();
          if (text === depthOpt.text) options.push(item);
        });

        if (options.length > 0) {
          options[0].click();
          await wait(DELAY);
        } else {
          closeDropdown();
          continue;
        }

        const { depth } = getLabels();
        console.log(`\n📊 Depth: ${depth}`);
        scenarioResults[depth] = await scrapeAllPositions();
      }
    }

    return scenarioResults;
  }

  // ── Main: scrape current scenario with all depths ──
  const { scenario } = getLabels();
  console.log(`\n🎯 Scenario: ${scenario}`);

  allData.scenarios[scenario] = await scrapeAllDepths();

  // ── Download result ──
  const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pokerdinosaur_${scenario.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log(`\n✅ Done! ${totalCharts} charts scraped.`);
  console.log('📁 JSON file downloaded.');
  console.log('\n💡 To scrape another scenario: switch scenario in the dropdown, then re-run this script.');

  return allData;
})();
