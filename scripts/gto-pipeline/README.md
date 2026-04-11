# TexasSolver GTO 資料管線 — POC

v1.0 HU 模擬器的**自動化 GTO 資料產生管線**概念驗證。

## 目的

驗證「**Claude 寫腳本 → 呼叫 TexasSolver CLI → 輸出 JSON → 轉成 TS 常數檔**」整條 pipeline 能通。POC 只跑一個情境：**HU 40BB SRP flop QsJh2h**。通了之後再批次產出 v1.0 所有情境。

---

## 前置條件

1. **Windows 作業系統**（console_solver.exe 是 Windows binary）
2. **Node.js** 已安裝（執行 inspector 和之後的 converter）
3. **PowerShell**（Windows 內建）

---

## 安裝步驟

### 1. 下載 TexasSolver Windows 版

從這裡下載：
https://github.com/bupticybee/TexasSolver/releases/download/v0.2.0/TexasSolver-v0.2.0-Windows.zip

### 2. 解壓到指定位置

解壓到：
```
scripts/gto-pipeline/TexasSolver-v0.2.0-Windows/
```

解壓後裡面應該有 `console_solver.exe`。完整路徑應該是：
```
scripts/gto-pipeline/TexasSolver-v0.2.0-Windows/console_solver.exe
```

### 3. 加入 .gitignore

TexasSolver binary 不要 commit 進 repo（大檔案 + AGPL）。在 `.gitignore` 新增：
```
scripts/gto-pipeline/TexasSolver-v0.2.0-Windows/
scripts/gto-pipeline/output/
```

---

## 執行 POC

### 方式 1：直接跑 PowerShell

```powershell
cd scripts\gto-pipeline
powershell -ExecutionPolicy Bypass -File run-poc.ps1
```

### 方式 2：從 Git Bash / WSL

```bash
cd scripts/gto-pipeline
powershell.exe -ExecutionPolicy Bypass -File run-poc.ps1
```

### 預期輸出流程

```
=== TexasSolver POC Runner ===
✓ 找到 console_solver.exe
✓ 找到輸入檔 hu_40bb_srp_flop_QsJh2h.txt
✓ 建立 output 目錄
✓ 輸入檔已複製到 solver 目錄

=== 開始解算 ===
（根據機器效能，單一 flop 解算約 30 秒到 5 分鐘）

... (solver 進度) ...

=== 解算結束 ===
耗時: 87.3 秒
✓ 輸出檔: ...\output\hu_40bb_srp_flop_QsJh2h.json (245.8 KB)
✓ JSON 已複製到 scripts/gto-pipeline/output/

=== 執行 JSON 結構檢查 ===
=== 讀取 .../hu_40bb_srp_flop_QsJh2h.json ===
檔案大小: 245.8 KB
=== Top-level keys ===
...
```

---

## POC 流程

```
 ┌──────────────────────────────┐
 │ 1. 輸入範本                  │   hu_40bb_srp_flop_QsJh2h.txt
 │  set_pot 5                   │
 │  set_effective_stack 37.5    │
 │  set_board Qs,Jh,2h          │
 │  set_range_ip ...            │
 │  set_range_oop ...           │
 │  set_bet_sizes ...           │
 │  build_tree / start_solve    │
 │  dump_result output.json     │
 └──────────┬───────────────────┘
            │
            ▼
 ┌──────────────────────────────┐
 │ 2. TexasSolver 解算           │   console_solver.exe -i input.txt
 │  CFR + isomorphism            │
 │  約 30 秒到 5 分鐘            │
 └──────────┬───────────────────┘
            │
            ▼
 ┌──────────────────────────────┐
 │ 3. JSON 輸出                  │   hu_40bb_srp_flop_QsJh2h.json
 │  策略樹（結構待確認）          │
 └──────────┬───────────────────┘
            │
            ▼
 ┌──────────────────────────────┐
 │ 4. 結構檢查                   │   inspect-json.mjs
 │  找出策略資料的 shape          │
 └──────────┬───────────────────┘
            │
            ▼
 ┌──────────────────────────────┐
 │ 5. Converter（待做）          │   convert-to-ts.mjs
 │  JSON → TS 常數檔             │
 │  格式對齊 gtoData_tourn_*.ts  │
 └──────────────────────────────┘
```

---

## POC 完成標準

- [x] 範本輸入檔可被 solver 讀取
- [ ] solver 能成功解算並產出 JSON（**等你跑**）
- [ ] inspector 能印出 JSON 結構（**等你跑**）
- [ ] 根據 JSON 結構完成 converter（**solver 跑完後由 Claude 完成**）
- [ ] converter 能產出格式符合 `gtoData_*.ts` 的 TS 檔

---

## 下一步（你要做的事）

1. **下載 TexasSolver**（上述 zip 連結）
2. **解壓到 `scripts/gto-pipeline/TexasSolver-v0.2.0-Windows/`**
3. **執行 `run-poc.ps1`**
4. **把結果貼回給 Claude**：
   - 完整 terminal 輸出（含 inspector 結果）
   - JSON 檔 `scripts/gto-pipeline/output/hu_40bb_srp_flop_QsJh2h.json` 的前 100-200 行
5. Claude 會根據實際 JSON 結構**完成 converter**

---

## 可能的問題 & 對策

| 問題 | 原因 | 對策 |
|---|---|---|
| `console_solver.exe 不是有效執行檔` | v0.2.0 可能 binary 有問題 | 改試 TexasSolver-v0.2.0-Linux 在 WSL 跑 |
| `range parse error` | 範例用的 range 語法不合法 | 查官方 range 語法規則，簡化到最小 |
| `OOM / memory error` | flop 樹太大 | 降低 `set_accuracy` 到 1.0、減少 bet sizes |
| `解算時間過長（>30 min）` | 預設參數太精細 | 改 `set_max_iteration 50`、`set_accuracy 1.0` |
| 找不到輸出 JSON | `dump_result` 路徑問題 | 用絕對路徑或檢查 cwd |

---

## 授權提醒

**TexasSolver 為 AGPL-3.0 授權**。使用方式限制：

- ✅ **本機跑 solver 產出資料 → 把資料（不是程式碼）放進 Poker Goal**：**合法**
- ❌ 把 TexasSolver binary 打包進 Poker Goal 或線上服務：**需要商業授權**
- ❌ fork / 修改 TexasSolver 後發布：**必須以 AGPL 授權發布**

因此：
- TexasSolver 檔案加入 `.gitignore`，**不 commit**
- 產出的資料（`.ts` 檔）**可以** commit 並商業使用
