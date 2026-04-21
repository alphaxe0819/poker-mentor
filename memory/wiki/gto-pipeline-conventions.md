---
name: GTO Pipeline Naming Conventions
description: solver 產出與手寫 GTO data 的檔名 / export 命名規範，避免 _flop_ 新舊混用
type: reference
updated: 2026-04-20
---

## 檔名規範

格式：`gtoData_<gameType>_<stack>_<pottype>_<slug>.ts`（**無 flop_ 前綴**）

- ✅ `gtoData_hu_40bb_srp_As7d2c.ts`
- ❌ `gtoData_hu_40bb_srp_flop_As7d2c.ts`（舊格式，T-021 / T-023 會統一）

## Export 名規範

格式：`<GAMETYPE>_<STACK>_<POTTYPE>_<SLUG>`（**無 FLOP_ 中綴**）

- ✅ `export const HU_40BB_SRP_AS7D2C`
- ❌ `export const HU_40BB_SRP_FLOP_AS7D2C`（舊格式）

## 目的

- `convert-to-ts.mjs` 產出自動遵守
- 手寫 GTO data 照此命名
- T-056 的 `batch-run.ps1 -SkipExisting` 雙命名偵測靠此定義 legacy 格式

## 當前遺留清單（待統一）

- HU 25bb SRP：13 個 `_flop_` 舊命名 → T-021 順便 rename
- HU 13bb SRP：13 個 `_flop_` 舊命名 → T-023 順便 rename
- 其他 `src/lib/gto/` 下 `_flop_` 檔 → 見各自 task

## 相關

- [[task-board]] T-056 雙命名 skip / T-021 / T-023
- [[range-collection-roadmap]]
