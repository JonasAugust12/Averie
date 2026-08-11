# Averie — Quy trình nâng cao (OpenSpec + Superspec + Superpowers + UI/UX Pro Max)

Tài liệu này mô tả quy trình AI coding **nâng cao** đã gắn vào dự án.  
Kiến trúc app: [overview.md](./overview.md) · Superpowers skills: [superpowers.md](./superpowers.md) · Stitch workflow: [working-with-stitch.md](./working-with-stitch.md).

---

## 1. Bộ 3 đang dùng

| Layer    | Tool                                           | Trách nhiệm                                                |
| -------- | ---------------------------------------------- | ---------------------------------------------------------- |
| **WHAT** | OpenSpec + schema **superspec**                | Spec, proposal, tasks, plan, verify, archive               |
| **HOW**  | Superpowers (Cursor plugin)                    | Brainstorm, writing-plans, worktree, subagent, TDD, review |
| **LOOK** | UI/UX Pro Max (`.cursor/skills/ui-ux-pro-max`) | Design system, style, màu, typography, UX                  |

Default schema trong `openspec/config.yaml`:

```yaml
schema: superspec
```

Schema files: `openspec/schemas/superspec/` (từ [danielhanold/superspec](https://github.com/danielhanold/superspec)).

---

## 2. Đã cài gì trong Averie

| Thành phần       | Trạng thái                           | Vị trí                                                              |
| ---------------- | ------------------------------------ | ------------------------------------------------------------------- |
| OpenSpec CLI     | Global (`openspec`)                  | npm global                                                          |
| OpenSpec project | Có                                   | `openspec/`, `.cursor/skills/openspec-*`, `.cursor/commands/opsx-*` |
| Superspec schema | Có                                   | `openspec/schemas/superspec/`                                       |
| Config           | `schema: superspec` + context Averie | `openspec/config.yaml`                                              |
| Superpowers      | Cài qua Cursor plugin                | `/add-plugin superpowers` (Agent chat)                              |
| UI/UX Pro Max    | Có                                   | `.cursor/skills/ui-ux-pro-max/`                                     |
| Agent guide      | Có                                   | `AGENTS.md`                                                         |

Kiểm tra schema:

```bash
openspec schemas
openspec validate
```

---

## 3. Luồng superspec (nâng cao)

```text
brainstorm → proposal → design? → specs → tasks → plan → apply → verify → finalize → archive
```

| Phase      | Làm gì                                              | Skill / lệnh                                  |
| ---------- | --------------------------------------------------- | --------------------------------------------- |
| brainstorm | Khám phá, 2–3 hướng                                 | `superpowers:brainstorming` → `brainstorm.md` |
| proposal   | Why / What / Capabilities                           | artifact                                      |
| design     | (optional) quyết định kỹ thuật                      | artifact                                      |
| specs      | Delta requirements SHALL/MUST                       | `openspec/changes/<name>/specs/`              |
| tasks      | Checkbox thô                                        | `tasks.md`                                    |
| plan       | Micro-steps TDD 2–5 phút                            | `superpowers:writing-plans` → `plan.md`       |
| apply      | Worktree + subagent + TDD                           | `/opsx-apply` → `apply.md`                    |
| verify     | 5 checks OpenSpec                                   | verify artifact / lệnh verify                 |
| finalize   | Git closeout (merge worktree → nhánh feature, push) | schema v4                                     |
| archive    | Đóng change                                         | `/opsx-archive`                               |

Artifacts ghi **trong** `openspec/changes/<tên>/` (không ghi `docs/superpowers/specs/`).

---

## 4. Cách chạy hàng ngày

### 4.1 Feature có hành vi mới (khuyến nghị superspec)

Trong Cursor Agent:

```text
/opsx-explore
```

hoặc tạo change rồi đi tiếp DAG:

```text
/opsx-propose ten-tinh-nang
```

Sau đó:

```text
/opsx-apply
```

Khi xong implement:

```text
/opsx-verify
/opsx-archive
```

(Tuỳ bản lệnh Cursor của bạn có thể thấy dạng `/opsx:new`, `/opsx:continue`, `/opsx:ff` — cùng họ OpenSpec; Averie đã có các file `.cursor/commands/opsx-*.md`.)

### 4.2 Manual bridge (an toàn khi mới quen)

```text
1. OpenSpec tạo / cập nhật change (proposal, tasks, …)
2. BẠN review file trong openspec/changes/<name>/
3. Prompt Superpowers:

@openspec/changes/<name>/proposal.md
@openspec/changes/<name>/tasks.md
@openspec/changes/<name>/plan.md   # nếu đã có

Dựa trên OpenSpec, dùng Superpowers:
brainstorming (nếu còn mơ hồ) → writing-plans →
subagent-driven-development + TDD.
Tuân thủ docs/overview.md (GET=API, mutations=Server Actions).

4. BẠN chạy pnpm type-check / test tay
5. /opsx-verify → /opsx-archive
```

### 4.3 Khi có UI

Chèn UI/UX Pro Max **sau khi có proposal, trước khi code UI**:

```text
@openspec/changes/<name>/proposal.md
@openspec/changes/<name>/tasks.md

Trước khi implement UI:
1. Dùng UI/UX Pro Max chọn / generate design system
   (product type + industry + stack: Next.js + Tailwind + Averie theme)
2. Sau đó implement bằng Superpowers TDD
```

Giữ theme Averie (Primary `#2B2623`, …) trừ khi proposal đổi design tokens.

---

## 5. Checklist

| Bước | Ai             | Hành động                                   |
| ---- | -------------- | ------------------------------------------- |
| 1    | Bạn + OpenSpec | `/opsx-explore` hoặc propose change         |
| 2    | **Bạn**        | Review `proposal.md` / `specs` / `tasks.md` |
| 3    | UI/UX Pro Max  | (Nếu có UI) design system                   |
| 4    | Superpowers    | plan → apply / TDD                          |
| 5    | Bạn            | `pnpm type-check`, xem diff                 |
| 6    | OpenSpec       | verify → finalize → archive                 |

**Không cần** tạo OpenSpec change cho: typo docs, chore tooling nhỏ, bug fix khôi phục hành vi cũ, bump dependency không breaking.

---

## 6. Mẹo Averie-specific

1. **@-mention** artifact khi đổi phase — đừng để agent đoán.
2. Một change ≈ một PR; conventional commits.
3. Agent nhảy thẳng vào code →:

    ```text
    Dừng lại. Làm theo superspec / Superpowers brainstorming trước.
    ```

4. Đổi về schema cũ cho 1 change nhỏ:

    ```text
    /opsx-propose my-fix --schema spec-driven
    ```

    hoặc tạm sửa `openspec/config.yaml` → `schema: spec-driven`.

5. Cập nhật sau này:

    ```bash
    npm install -g @fission-ai/openspec@latest
    openspec update
    # Superpowers: /plugin-update superpowers (Agent chat)
    # UI/UX: uipro update && uipro init --ai cursor --force
    ```

6. **Restart Cursor** sau khi cài/ cập nhật plugin hoặc skill.

---

## 7. Liên kết nhanh

| Tài nguyên    | URL / path                                              |
| ------------- | ------------------------------------------------------- |
| OpenSpec      | https://openspec.dev                                    |
| Superspec     | https://github.com/danielhanold/superspec               |
| Superpowers   | https://github.com/obra/superpowers                     |
| UI/UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| Schema local  | `openspec/schemas/superspec/`                           |
| Config        | `openspec/config.yaml`                                  |
