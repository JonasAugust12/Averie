# Caveman — cách dùng (global Cursor)

[Caveman](https://github.com/JuliusBrussee/caveman) nén **lời agent** (ít token, vẫn đúng kỹ thuật). **Không** rút gọn code/commit — khác Ponytail (ít code).

|           | Caveman                       | Ponytail                      |
| --------- | ----------------------------- | ----------------------------- |
| Cắt gì    | Prose, filler, hedging        | Code, dependency, abstraction |
| Khi       | Chat, status, giải thích ngắn | Implement, review diff        |
| Cùng dùng | Có — bổ sung nhau             | Có                            |

---

## Cài global (một lần / máy)

```powershell
& "f:\Averie\scripts\sync-caveman-cursor-global.ps1" -UpdateCache
# Restart Cursor
```

Tuỳ chọn rule **always-on** (mọi session terse):

```powershell
& "f:\Averie\scripts\sync-caveman-cursor-global.ps1" -UpdateCache -AlwaysOnRule
```

Mặc định: **per-session** — gõ `/caveman` khi muốn bật.

---

## Slash thường dùng

| Lệnh               | Khi dùng                                                  |
| ------------------ | --------------------------------------------------------- |
| `/caveman`         | Bật mode: `lite`, `full`, `ultra`, `wenyan-*`, hoặc `off` |
| `/caveman-help`    | Quick reference                                           |
| `/caveman-stats`   | Xem tiết kiệm token (nếu host hỗ trợ)                     |
| `/caveman-review`  | Review ngắn gọn                                           |
| `/caveman-explore` | Khám phá codebase — output terse                          |

Gõ trong **Agent chat**. Các skill khác (`caveman-commit`, `caveman-compress`, …) cũng có slash sau sync.

---

## Khi nào bật / tắt

| Phase                                | Caveman?                                               |
| ------------------------------------ | ------------------------------------------------------ |
| `/opsx-explore`, chat hỏi nhanh      | **Có** — `/caveman full` tiết kiệm token               |
| `/opsx-propose` … planning artifacts | **Tắt** — proposal/specs/plan cần prose đầy đủ         |
| `/opsx-apply` (implement)            | **Tùy** — status ngắn OK; **code/commits bình thường** |
| Viết `openspec/changes/**`           | **Tắt** — `stop caveman` hoặc `/caveman off`           |
| Pair với Ponytail                    | Caveman = nói ít; Ponytail = code ít                   |

```text
/caveman off

Đang viết OpenSpec artifacts — prose đầy đủ, không caveman style.
```

---

## Block nhắc khi agent quên

**Agent verbose trong explore/chat:**

```text
/caveman full

Trả lời terse — drop filler, giữ technical terms. Code blocks unchanged.
```

**Agent caveman khi đang propose/specs/plan:**

```text
stop caveman

Planning artifacts cần prose đầy đủ (Why/What/SHALL/scenarios). Không rút gọn artifact files.
```

**Muốn cả terse chat + ít code:**

```text
/caveman full
Ponytail ladder khi implement — reuse/stdlib trước dependency mới.
```

---

## Cập nhật

```powershell
& "f:\Averie\scripts\sync-caveman-cursor-global.ps1" -UpdateCache
```

Hoặc cài chính thức (Cursor global skills):

```powershell
npx skills add JuliusBrussee/caveman -a cursor -g
```

Rồi chạy lại sync script để có slash commands trong `%USERPROFILE%\.cursor\commands\`.

---

## Gỡ cài

```powershell
Remove-Item "$env:USERPROFILE\.cursor\rules\caveman.mdc" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.cursor\skills\caveman*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.cursor\commands\caveman*.md" -Force -ErrorAction SilentlyContinue
npx skills remove caveman
```

---

## Liên kết

|                  |                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------- |
| Sync script      | [`scripts/sync-caveman-cursor-global.ps1`](../scripts/sync-caveman-cursor-global.ps1) |
| Global workflow  | [global-ai-workflow.md](./global-ai-workflow.md)                                      |
| Flow cheat sheet | [superspec-my-flow.md](./superspec-my-flow.md)                                        |
| Ponytail (code)  | [ponytail-workflow.md](./ponytail-workflow.md)                                        |
| Upstream         | https://github.com/JuliusBrussee/caveman                                              |
