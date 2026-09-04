# Global AI workflow

OpenSpec + Superspec + Superpowers + UI/UX Pro Max — **cách dùng hàng ngày**.

Global đã cài trên máy dev → **mỗi repo chỉ bootstrap một lần**, rồi làm việc bình thường.

Chi tiết Averie: [advanced-workflow.md](./advanced-workflow.md) · [openspec-workflows.md](./openspec-workflows.md)

---

## Nhớ 1 câu

```text
WHAT  = OpenSpec (/opsx-*)     → spec, tasks, verify
HOW   = Superpowers            → TDD, subagent (tự chạy trong /opsx-apply)
LOOK  = UI/UX Pro Max           → design system trước khi code UI
```

**Superspec** nối WHAT ↔ HOW. Bạn gõ **một** lệnh `/opsx-*` mỗi bước; skill Superpowers thường **tự chạy bên trong**. Chỉ nhắc thêm (text) khi agent quên — xem bảng dưới.

---

## Repo clone về — bootstrap (1 lần)

Chỉ khi repo **chưa có** `openspec/schemas/superspec/`.

```powershell
cd D:\path\to\repo
pwsh -File "f:\Averie\scripts\bootstrap-openspec-superspec.ps1" -ProjectName "Tên app" -Stack "Next.js + Tailwind"
# Sửa openspec/config.yaml → Restart Cursor
```

**Repo đã có superspec** (Averie): bỏ qua. Chỉ `openspec update` nếu thiếu `/opsx-*`.

---

## Flow lớn (copy)

```text
/opsx-propose ten-change     (hoặc /opsx-new + /opsx-continue …)
    ↓  bạn duyệt artifacts
    ↓  (có UI) nhắc UI/UX Pro Max
/opsx-apply
/opsx-verify
/opsx-continue               ← finalize
/opsx-archive
```

**Việc nhỏ:** chat thẳng, không OpenSpec.

---

## Bảng lệnh — kèm gì khi agent quên

Quy tắc chung:

- **Gõ slash:** một lệnh OpenSpec mỗi tin nhắn (`/opsx-propose`, `/opsx-apply`, …).
- **Không gõ kèm** skill Superpowers cùng lúc — superspec đã map sẵn.
- **Nhắc bằng text** (copy block bên dưới) chỉ khi agent: nhảy code, bỏ TDD, nói "xong" sớm, bỏ qua UI skill.

---

### `/opsx-explore` — khám phá, chưa cam kết change

|                   |                                                            |
| ----------------- | ---------------------------------------------------------- |
| **Khi dùng**      | Chưa biết build gì; so sánh hướng; **chưa** muốn mở change |
| **Tự động**       | Stance OpenSpec: đọc code, không implement                 |
| **Nên nhắc thêm** | `brainstorming` (cấu trúc 2–3 hướng)                       |
| **Không**         | `/opsx-propose`, code, scaffold                            |

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

|                   |                                                                            |
| ----------------- | -------------------------------------------------------------------------- |
| **Khi dùng**      | Đã rõ scope; muốn sinh hết planning (brainstorm → … → plan)                |
| **Tự động**       | `brainstorming` (brainstorm), `writing-plans` (plan), proposal/specs/tasks |
| **Nên nhắc thêm** | Chỉ khi agent bỏ bước hoặc viết code                                       |
| **Không gõ kèm**  | `/brainstorming`, `/writing-plans` (schema tự gọi)                         |

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

### `/opsx-apply` — implement + TDD

|                   |                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Khi dùng**      | Đã duyệt xong planning; sẵn sàng code                                                                                        |
| **Tự động**       | `using-git-worktrees` → `subagent-driven-development` → **`test-driven-development`** (RED-GREEN) → `requesting-code-review` |
| **Nên nhắc thêm** | TDD nếu agent viết code trước test; `systematic-debugging` nếu test fail lặp                                                 |
| **Không gõ kèm**  | `/executing-plans` (Cursor có subagent — dùng subagent-driven-development)                                                   |

```text
/opsx-apply ten-change

Theo superspec apply:
1. Worktree (using-git-worktrees)
2. subagent-driven-development — đọc plan.md, từng micro-task
3. TDD bắt buộc: test fail trước → code tối thiểu → refactor
4. Cập nhật tasks.md checkbox khi xong task thô
5. Ghi apply.md (receipt)

Không viết production code trước failing test.
```

**Bug / test fail giữa apply:**

```text
Dùng systematic-debugging — tìm root cause trước khi sửa tiếp. Không skip verify cuối.
```

---

### `/opsx-verify` — so artifacts vs code

|                   |                                                                                  |
| ----------------- | -------------------------------------------------------------------------------- |
| **Khi dùng**      | Sau apply; trước finalize/archive                                                |
| **Tự động**       | 5 checks OpenSpec → `verify.md` (PASS / WARN / FAIL)                             |
| **Nên nhắc thêm** | `verification-before-completion` + lệnh project (`pnpm type-check`, `pnpm lint`) |
| **Không**         | Nói "xong" / archive khi verify FAIL                                             |

```text
/opsx-verify ten-change

Chạy đủ 5 checks superspec. Ghi verify.md.
Trước khi báo PASS: chạy pnpm type-check (và lint nếu đụng nhiều file) — verification-before-completion.
Không claim xong nếu chưa có output lệnh.
```

**FAIL** → quay lại `/opsx-apply` → `/opsx-verify` lại (tối đa ~5 vòng).

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

### Các lệnh khác (ít dùng)

| Lệnh                 | Khi dùng                                    | Nhắc nếu cần                                            |
| -------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `/opsx-update`       | Scope đổi — **sửa** artifact cũ, không code | _"Chỉ planning artifacts, giữ coherent với code đã có"_ |
| `/opsx-sync`         | Gộp delta specs vào main specs (thủ công)   | Archive thường tự sync                                  |
| `/opsx-bulk-archive` | Dọn nhiều change cũ                         | —                                                       |
| `/opsx-onboard`      | Học workflow lần đầu                        | —                                                       |

---

## Tóm tắt: gõ kèm hay không?

| Lệnh                                       | Gõ kèm slash skill?      | Nhắc text khi agent quên                        |
| ------------------------------------------ | ------------------------ | ----------------------------------------------- |
| `/opsx-explore`                            | Không                    | `brainstorming`, không code                     |
| `/opsx-new` / `/opsx-propose` / `/opsx-ff` | Không `/brainstorming`   | planning only; DAG đúng thứ tự                  |
| `/opsx-continue`                           | Không                    | theo artifact (bảng trên)                       |
| Trước apply (UI)                           | Không                    | **UI/UX Pro Max** + @ proposal/tasks            |
| `/opsx-apply`                              | Không `/executing-plans` | TDD, worktree, subagent                         |
| `/opsx-verify`                             | Không                    | type-check/lint, verification-before-completion |
| `/opsx-continue` (finalize)                | Không                    | sau verify PASS                                 |
| `/opsx-archive`                            | Không                    | sau verify (+ finalize)                         |

**Câu chữ tối thiểu mọi lúc agent lệch:**

```text
Dừng. Đọc using-superpowers — chọn đúng skill cho phase này. Làm theo superspec trước khi code.
```

---

## Không cần OpenSpec

Typo, CSS nhỏ, bug khôi phục hành vi cũ, polish 1 component (UI/UX Pro Max + @ file).

---

## Cập nhật

```powershell
npm install -g @fission-ai/openspec@latest ui-ux-pro-max-cli@latest
openspec update              # trong từng repo
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
```

</details>

---

## Links

|                                                    |                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Bootstrap                                          | [`scripts/bootstrap-openspec-superspec.ps1`](../scripts/bootstrap-openspec-superspec.ps1)   |
| Superspec chi tiết                                 | [`openspec/schemas/superspec/INTEGRATION.md`](../openspec/schemas/superspec/INTEGRATION.md) |
| OpenSpec · Superspec · Superpowers · UI/UX Pro Max | [GitHub links](https://github.com/Fission-AI/OpenSpec)                                      |
