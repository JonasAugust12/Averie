# Global AI workflow

OpenSpec + Superspec + Superpowers + Ponytail + UI/UX Pro Max — **cách dùng hàng ngày**.

Global đã cài trên máy dev → **mỗi repo chỉ bootstrap một lần**, rồi làm việc bình thường.

Flow hay dùng (cheat sheet): **[superspec-my-flow.md](./superspec-my-flow.md)** — explore → propose → apply → verify → sync → archive.

Dành cho **Antigravity (IDE & CLI)**: **[antigravity-ai-workflow.md](./antigravity-ai-workflow.md)**.

Chi tiết Averie: [advanced-workflow.md](./advanced-workflow.md) · [openspec-workflows.md](./openspec-workflows.md)

---

## Nhớ 1 câu

```text
WHAT  = OpenSpec (/opsx-*)     → spec, tasks, verify
HOW   = Superpowers            → TDD, subagent (tự chạy trong /opsx-apply)
LEAN  = Ponytail               → ít code, YAGNI ladder (apply + /ponytail-review)
LOOK  = UI/UX Pro Max           → design system trước khi code UI
```

**Superspec** nối WHAT ↔ HOW ↔ LEAN. Bạn gõ **một** lệnh `/opsx-*` mỗi bước; Superpowers và Ponytail thường **tự chạy trong `/opsx-apply`**. Chỉ nhắc thêm (text) khi agent quên — xem bảng dưới.

---

## Repo clone về — bootstrap (1 lần)

Chỉ khi repo **chưa có** `openspec/schemas/superspec/`.

**Đã cài global `/opsx-*`** (xem [global-ai-workflow-update.md](./global-ai-workflow-update.md)):

```powershell
cd D:\path\to\repo
# Dùng powershell (Windows PowerShell 5.x). pwsh chỉ khi đã cài PowerShell 7+.
powershell -File "f:\Averie\scripts\bootstrap-openspec-superspec.ps1" -SkipInit -ProjectName "Tên app" -Stack "Next.js + Tailwind"
# Sửa openspec/config.yaml → Restart Cursor
```

**Chưa có global commands** — bootstrap đầy đủ (copy commands vào repo):

```powershell
powershell -File "f:\Averie\scripts\bootstrap-openspec-superspec.ps1" -ProjectName "Tên app" -Stack "Next.js + Tailwind"
```

**Repo đã có superspec** (Averie): bỏ qua bootstrap. Chỉ `openspec update` nếu thiếu `/opsx-*`.

---

## Global slash commands (một lần / máy)

Cài **một lần** để mọi repo đều gợi ý `/opsx-*` và `/brainstorming` (không cần copy vào từng project).

| Bộ          | Lệnh sync                                                                               | Slash ví dụ                                                    |
| ----------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| OpenSpec    | Copy từ Averie sau `openspec update` (xem [update doc](./global-ai-workflow-update.md)) | `/opsx-propose`, `/opsx-apply`                                 |
| Superpowers | `& "f:\Averie\scripts\sync-superpowers-cursor-global.ps1"`                              | `/brainstorming`, `/writing-plans`, `/test-driven-development` |
| Ponytail    | `& "f:\Averie\scripts\sync-ponytail-cursor-global.ps1" -UpdateCache`                    | `/ponytail`, `/ponytail-review`, `/ponytail-audit`             |

**Ponytail — lần đầu:**

```powershell
& "f:\Averie\scripts\sync-ponytail-cursor-global.ps1" -UpdateCache
# Restart Cursor — rule always-on + slash commands
```

Chi tiết: [ponytail-workflow.md](./ponytail-workflow.md). Update: chạy lại script với `-UpdateCache`.

**Superpowers — lần đầu:**

```text
/add-plugin superpowers          # Agent chat, một lần / máy
```

```powershell
& "f:\Averie\scripts\sync-superpowers-cursor-global.ps1"
# Restart Cursor
```

Sau update plugin: `/plugin-update superpowers` rồi chạy lại script sync.

---

## Flow lớn (copy)

```text
/opsx-propose ten-change     (hoặc /opsx-new + /opsx-continue …)
    ↓  bạn duyệt artifacts
    ↓  (có UI) nhắc UI/UX Pro Max
/opsx-apply                  ← TDD (Superpowers) + YAGNI ladder (Ponytail)
                             ← ponytail-review trên diff trước apply.md
/opsx-verify
/opsx-continue               ← finalize
/opsx-archive
```

**Việc nhỏ:** chat thẳng — rule Ponytail always-on; `/ponytail-review` sau khi agent code xong nếu diff phình.

---

## Bảng lệnh — kèm gì khi agent quên

Quy tắc chung:

- **Gõ slash:** một lệnh OpenSpec mỗi tin nhắn (`/opsx-propose`, `/opsx-apply`, …).
- **Không gõ kèm** skill Superpowers hoặc `/ponytail` cùng lúc với `/opsx-*` — superspec đã map sẵn.
- **Nhắc bằng text** (copy block bên dưới) khi agent: nhảy code, bỏ TDD, over-engineering, bỏ ponytail-review, nói "xong" sớm, bỏ qua UI skill.

---

### `/opsx-explore` — khám phá, chưa cam kết change

|                   |                                                            |
| ----------------- | ---------------------------------------------------------- |
| **Khi dùng**      | Chưa biết build gì; so sánh hướng; **chưa** muốn mở change |
| **Tự động**       | Stance OpenSpec: đọc code, không implement                 |
| **Nên nhắc thêm** | `brainstorming` (cấu trúc 2–3 hướng)                       |
| **Không**         | `/opsx-propose`, code, scaffold, **ponytail** (chưa code)  |

```text
/opsx-explore <câu hỏi>

Dùng superpowers:brainstorming — đưa 2–3 hướng + trade-off.
Chưa implement code. Chưa tạo change trừ khi tôi đồng ý hướng.
```

---

### `/opsx-new` — tạo change, artifact đầu tiên

|                   |                                                                |
| ----------------- | -------------------------------------------------------------- |
| **Khi dùng**      | Muốn đi **từng artifact**, review từng file                    |
| **Tự động**       | Artifact đầu superspec = `brainstorm.md` → gọi `brainstorming` |
| **Nên nhắc thêm** | `using-superpowers` nếu agent nhảy thẳng proposal              |
| **Không**         | `/opsx-propose` (trùng mục đích khác)                          |

```text
/opsx-new ten-change

Một artifact mỗi lượt. Artifact brainstorm: đọc skill brainstorming trước.
Không skip sang proposal/specs.
```

---

### `/opsx-propose` — planning một lượt

|                   |                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Khi dùng**      | Đã rõ scope; muốn sinh hết planning (brainstorm → … → plan)                         |
| **Tự động**       | `brainstorming` (brainstorm), `writing-plans` (plan), proposal/specs/tasks          |
| **Nên nhắc thêm** | Chỉ khi agent bỏ bước hoặc viết code                                                |
| **Không gõ kèm**  | `/brainstorming`, `/writing-plans`, `/ponytail` (schema tự map; planning chưa code) |

```text
/opsx-propose ten-change

Planning only — không implement code.
Theo superspec DAG: brainstorm → proposal → specs → tasks → plan.
Dùng brainstorming cho brainstorm.md, writing-plans cho plan.md.
```

**Sau propose — bạn làm:** đọc `openspec/changes/<name>/` (proposal, specs, tasks, plan).

---

### `/opsx-continue` — artifact tiếp theo (hoặc finalize)

Mỗi lần gõ = **một** artifact. Artifact kế tiếp phụ thuộc trạng thái change.

| Artifact sắp tạo               | Skill superspec gọi | Nhắc nếu agent quên                                    |
| ------------------------------ | ------------------- | ------------------------------------------------------ |
| `brainstorm.md`                | `brainstorming`     | _"2–3 hướng + Alternatives Considered, chưa code"_     |
| `proposal.md`                  | — (OpenSpec WHAT)   | _"Why/What/Capabilities, không implementation detail"_ |
| `specs/**/*.md`                | —                   | _"SHALL/MUST + ít nhất 1 scenario mỗi requirement"_    |
| `tasks.md`                     | —                   | _"Checkbox thô, chunk ~2h"_                            |
| `plan.md`                      | `writing-plans`     | _"Micro-step 2–5 phút, TDD-ready, có file path"_       |
| `design.md`                    | — (optional)        | Chỉ khi quyết định kỹ thuật phức tạp                   |
| **finalize** (sau verify PASS) | schema git closeout | _"Merge worktree → feature branch, push"_              |

```text
/opsx-continue ten-change

Tạo đúng artifact tiếp theo trong DAG — một artifact mỗi lượt.
Đọc dependency artifacts từ disk trước khi viết.
```

**Sau verify PASS** — `continue` = finalize, không phải planning:

```text
/opsx-continue ten-change

Verify đã PASS. Chạy bước finalize — merge worktree về feature branch và push.
```

---

### `/opsx-ff` — fast-forward planning

|               |                                                          |
| ------------- | -------------------------------------------------------- |
| **Khi dùng**  | Giống propose: sinh hết planning một lượt, đã quen scope |
| **Tự động**   | Giống `/opsx-propose`                                    |
| **Nhắc thêm** | Giống propose block ở trên                               |

```text
/opsx-ff ten-change

Fast-forward toàn bộ planning artifacts. Không code. Dùng brainstorming + writing-plans theo schema.
```

---

### Trước `/opsx-apply` — có UI (không phải lệnh slash)

Chèn **giữa duyệt plan và apply** — không thuộc OpenSpec DAG.

```text
@openspec/changes/<name>/proposal.md
@openspec/changes/<name>/tasks.md

Dùng UI/UX Pro Max — chọn/generate design system (product type + industry + stack + theme).
Xong rồi mới /opsx-apply.
```

---

### `/opsx-apply` — implement + TDD + Ponytail

|                   |                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Khi dùng**      | Đã duyệt xong planning; sẵn sàng code                                                                                                              |
| **Tự động**       | Worktree → subagent → **TDD** → code-review; **Ponytail ladder** (rule always-on) mỗi micro-task; **ponytail-review** trước `apply.md` (schema 2c) |
| **Nên nhắc thêm** | TDD nếu viết code trước test; Ponytail nếu thêm lib/file thừa; `systematic-debugging` nếu test fail lặp                                            |
| **Không gõ kèm**  | `/executing-plans`, `/ponytail` kèm cùng tin `/opsx-apply`                                                                                         |

```text
/opsx-apply ten-change

Theo superspec apply:
1. Worktree (using-git-worktrees)
2. subagent-driven-development — đọc plan.md, từng micro-task
   - TDD: test fail trước → code tối thiểu → refactor
   - Ponytail: reuse → stdlib → native → dependency sẵn → một dòng → tối thiểu
3. ponytail-review trên diff worktree TRƯỚC khi ghi apply.md (schema 2c)
4. Cập nhật tasks.md checkbox khi xong task thô
5. Ghi apply.md (receipt)

Không viết production code trước failing test.
Không thêm package/file mới trừ khi spec/plan yêu cầu.
```

**Over-engineering (thêm lib, wrapper, file thừa):**

```text
Dừng over-engineering. Áp ponytail ladder: reuse codebase → stdlib → native → dependency đã có → một dòng → tối thiểu.
Giữ TDD. Không cắt validation, security, accessibility.
```

**Agent ghi apply.md mà chưa ponytail-review:**

```text
Chưa đủ apply 2c. Chạy /ponytail-review trên diff worktree trước apply.md.
```

**Bug / test fail giữa apply:**

```text
Dùng systematic-debugging — tìm root cause trước khi sửa tiếp. Không skip verify cuối.
```

---

### `/opsx-verify` — so artifacts vs code

|                   |                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Khi dùng**      | Sau apply; trước finalize/archive                                                                       |
| **Tự động**       | 5 checks OpenSpec → `verify.md` (PASS / WARN / FAIL)                                                    |
| **Nên nhắc thêm** | `verification-before-completion` + `pnpm type-check` / `pnpm lint`; `/ponytail-review` nếu diff vẫn dày |
| **Không**         | Nói "xong" / archive khi verify FAIL                                                                    |

```text
/opsx-verify ten-change

Chạy đủ 5 checks superspec. Ghi verify.md.
Trước khi báo PASS: chạy pnpm type-check (và lint nếu đụng nhiều file) — verification-before-completion.
Không claim xong nếu chưa có output lệnh.
```

**FAIL** → quay lại `/opsx-apply` → `/opsx-verify` lại (tối đa ~5 vòng).

**Diff vẫn dày sau apply:**

```text
/ponytail-review

Review over-engineering trên diff hiện tại. Nếu còn cắt được mà không phá spec/TDD, quay lại apply rồi verify lại.
```

---

### `/opsx-continue` (lần 2) — finalize

|               |                                                                       |
| ------------- | --------------------------------------------------------------------- |
| **Khi dùng**  | **Sau verify PASS**                                                   |
| **Tự động**   | Merge worktree → nhánh feature, push, comment PR (schema v4)          |
| **Nhắc thêm** | Hiếm — escape hatch: `finishing-a-development-branch` nếu flow git lạ |

```text
/opsx-continue ten-change

Verify đã PASS. Finalize: merge worktree, push branch, ghi finalize.md.
```

---

### `/opsx-archive` — đóng change

|               |                                                         |
| ------------- | ------------------------------------------------------- |
| **Khi dùng**  | Sau finalize (hoặc verify PASS nếu không dùng finalize) |
| **Tự động**   | Sync delta specs → archive folder                       |
| **Nhắc thêm** | Đảm bảo verify PASS trước                               |

```text
/opsx-archive ten-change

Chỉ archive sau verify PASS (+ finalize xong). Sync specs vào openspec/specs/.
```

---

### Ponytail — slash (việc nhỏ & nhắc chủ động)

Rule `ponytail.mdc` **always-on** — không cần slash mỗi session. Dùng slash khi cần ép mạnh hoặc review diff.

| Lệnh                                   | Khi dùng                  | Nhắc nếu agent quên                                   |
| -------------------------------------- | ------------------------- | ----------------------------------------------------- |
| `/ponytail` `[lite\|full\|ultra\|off]` | Bật/tắt intensity         | Over-build liên tục → `/ponytail ultra`               |
| `/ponytail-review`                     | Review diff — delete-list | Sau code việc nhỏ; thiếu apply 2c; verify mà diff dày |
| `/ponytail-audit`                      | Audit cả repo             | Refactor lớn, không trong OpenSpec DAG                |
| `/ponytail-help`                       | Quick reference           | —                                                     |

```text
/ponytail-review

Chỉ review over-engineering trên diff — không mở rộng scope.
```

Chi tiết cài/update: [ponytail-workflow.md](./ponytail-workflow.md) · block đầy đủ: [global-ai-workflow-update.md § Ponytail](./global-ai-workflow-update.md#ponytail-trong-workflow--kết-hợp-bước-nào-nhắc-gì-khi-agent-quên).

---

### Các lệnh khác (ít dùng)

| Lệnh                 | Khi dùng                                    | Nhắc nếu cần                                            |
| -------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `/opsx-update`       | Scope đổi — **sửa** artifact cũ, không code | _"Chỉ planning artifacts, giữ coherent với code đã có"_ |
| `/opsx-sync`         | Gộp delta specs vào main specs (thủ công)   | Archive thường tự sync                                  |
| `/opsx-bulk-archive` | Dọn nhiều change cũ                         | —                                                       |
| `/opsx-onboard`      | Học workflow lần đầu                        | —                                                       |

---

## Tóm tắt: gõ kèm hay không?

| Lệnh                                       | Gõ kèm slash skill?                   | Nhắc text khi agent quên                         |
| ------------------------------------------ | ------------------------------------- | ------------------------------------------------ |
| `/opsx-explore`                            | Không                                 | `brainstorming`, không code, không ponytail      |
| `/opsx-new` / `/opsx-propose` / `/opsx-ff` | Không `/brainstorming`                | planning only; DAG đúng thứ tự                   |
| `/opsx-continue`                           | Không                                 | theo artifact (bảng trên)                        |
| Trước apply (UI)                           | Không                                 | **UI/UX Pro Max** + @ proposal/tasks             |
| `/opsx-apply`                              | Không `/executing-plans`, `/ponytail` | TDD + ponytail ladder + ponytail-review (2c)     |
| `/opsx-verify`                             | Không                                 | type-check/lint; `/ponytail-review` nếu diff dày |
| `/opsx-continue` (finalize)                | Không                                 | sau verify PASS                                  |
| `/opsx-archive`                            | Không                                 | sau verify (+ finalize)                          |
| Việc nhỏ (chat)                            | Tuỳ chọn `/ponytail-review`           | rule always-on; review sau khi code              |

**Câu chữ tối thiểu mọi lúc agent lệch:**

```text
Dừng. Đọc using-superpowers — chọn đúng skill cho phase này. Làm theo superspec trước khi code.
```

**Agent vừa over-build vừa bỏ TDD:**

```text
Dừng. TDD trước (test fail → code tối thiểu). Ponytail ladder — reuse/stdlib/native trước khi thêm file hoặc dependency.
```

---

## Không cần OpenSpec

Typo, CSS nhỏ, bug khôi phục hành vi cũ, polish 1 component (UI/UX Pro Max + @ file). Rule Ponytail always-on; `/ponytail-review` nếu agent viết diff dài.

---

## Cập nhật

Checklist đầy đủ (CLI, superspec cache, global `/opsx-*`, từng repo, verify): **[global-ai-workflow-update.md](./global-ai-workflow-update.md)**.

Tóm tắt:

```powershell
npm install -g @fission-ai/openspec@latest ui-ux-pro-max-cli@latest
# → openspec update ở repo mẫu → sync global /opsx-* (xem file update)
& "f:\Averie\scripts\sync-superpowers-cursor-global.ps1"
& "f:\Averie\scripts\sync-ponytail-cursor-global.ps1" -UpdateCache
uipro update --global
# /plugin-update superpowers → restart Cursor
```

---

## Máy mới

<details>
<summary>Cài global (chỉ máy chưa setup)</summary>

```powershell
npm install -g @fission-ai/openspec@latest ui-ux-pro-max-cli@latest
openspec config set profile custom && openspec config set delivery both
uipro init --ai cursor --global
# Cache superspec: xem scripts/bootstrap-openspec-superspec.ps1
# Cursor Agent: /add-plugin superpowers
# Ponytail: sync-ponytail-cursor-global.ps1 -UpdateCache
```

</details>

---

## Links

|                                                    |                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Cập nhật (checklist)**                           | [global-ai-workflow-update.md](./global-ai-workflow-update.md)                              |
| **Flow cheat sheet**                               | [superspec-my-flow.md](./superspec-my-flow.md)                                              |
| **Ponytail**                                       | [ponytail-workflow.md](./ponytail-workflow.md)                                              |
| Sync Ponytail global                               | [`scripts/sync-ponytail-cursor-global.ps1`](../scripts/sync-ponytail-cursor-global.ps1)     |
| Bootstrap                                          | [`scripts/bootstrap-openspec-superspec.ps1`](../scripts/bootstrap-openspec-superspec.ps1)   |
| Superspec chi tiết                                 | [`openspec/schemas/superspec/INTEGRATION.md`](../openspec/schemas/superspec/INTEGRATION.md) |
| OpenSpec · Superspec · Superpowers · UI/UX Pro Max | [GitHub links](https://github.com/Fission-AI/OpenSpec)                                      |
