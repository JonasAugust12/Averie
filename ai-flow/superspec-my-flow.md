# Superspec — flow hay dùng (cheat sheet)

Flow ngắn: **explore → propose → apply → verify → sync → archive**

Một tin nhắn = **một** lệnh `/opsx-*`. Agent quên → copy block **Nhắc** bên dưới.

Chi tiết: [global-ai-workflow.md](./global-ai-workflow.md) · [global-ai-workflow-update.md](./global-ai-workflow-update.md)

---

## Sơ đồ

```text
/opsx-explore          (tuỳ chọn — chưa chắc scope)
    ↓
/opsx-propose <name>   → bạn duyệt openspec/changes/<name>/
    ↓ (có UI) UI/UX Pro Max + @ proposal/tasks
/opsx-apply <name>
/opsx-verify <name>
/opsx-sync <name>      (nếu delta specs chưa vào openspec/specs/)
/opsx-archive <name>
```

---

## Bảng nhanh

| Bước | Lệnh                   | Bạn                 | AI phải                                                | Nhắc khi quên                     |
| ---- | ---------------------- | ------------------- | ------------------------------------------------------ | --------------------------------- |
| 1    | `/opsx-explore`        | Hỏi scope, so hướng | Đọc code, **không** implement, **không** tạo change    | [Explore](#1-explore)             |
| 2    | `/opsx-propose <name>` | Duyệt artifacts     | Planning only — brainstorm→proposal→specs→tasks→plan   | [Propose](#2-propose)             |
| —    | _(có UI)_              | Design system       | Không code UI trước design                             | [UI trước apply](#ui-trước-apply) |
| 3    | `/opsx-apply <name>`   | Review diff         | Worktree + TDD + ponytail + ponytail-review → apply.md | [Apply](#3-apply)                 |
| 4    | `/opsx-verify <name>`  | Đọc verify.md       | 5 checks + type-check/lint; PASS mới archive           | [Verify](#4-verify)               |
| 5    | `/opsx-sync <name>`    | —                   | Gộp delta specs → `openspec/specs/`                    | [Sync](#5-sync)                   |
| 6    | `/opsx-archive <name>` | —                   | Chỉ sau verify PASS (+ sync xong)                      | [Archive](#6-archive)             |

---

## 1. Explore

```text
/opsx-explore <câu hỏi>
```

**Nhắc:**

```text
Khám phá only — không implement, không scaffold, không /opsx-propose.
Dùng brainstorming — 2–3 hướng + trade-off. Chưa tạo change trừ khi tôi đồng ý.
```

---

## 2. Propose

```text
/opsx-propose ten-change
```

**Nhắc:**

```text
Planning only — không implement code.
Theo superspec DAG: brainstorm → proposal → specs → tasks → plan.
Một artifact đúng thứ tự; specs SHALL/MUST + scenario mỗi requirement.
```

**Sau propose — bạn:** đọc `openspec/changes/<name>/` (proposal, specs, tasks, plan).

---

## UI trước apply

_(Chỉ khi có màn/UI mới)_

```text
@openspec/changes/<name>/proposal.md
@openspec/changes/<name>/tasks.md

Dùng UI/UX Pro Max — generate design system (product + industry + stack + theme).
Xong rồi mới /opsx-apply.
```

---

## 3. Apply

```text
/opsx-apply ten-change
```

**Nhắc:**

```text
Theo superspec apply:
1. Worktree (using-git-worktrees)
2. subagent-driven-development — plan.md, từng micro-task
3. TDD: test fail trước → code tối thiểu
4. Ponytail ladder mỗi task — không thêm lib/file thừa
5. ponytail-review trên diff TRƯỚC apply.md (step 2c)
6. Ghi apply.md + cập nhật tasks.md checkbox

Không viết production code trước failing test.
```

**Over-engineering:**

```text
Dừng. Ponytail ladder — reuse → stdlib → native → dependency sẵn → một dòng.
Giữ TDD. Không cắt validation/security/a11y.
```

**Thiếu ponytail-review:**

```text
Chưa apply 2c. /ponytail-review trên diff worktree trước apply.md.
```

**Test fail lặp:**

```text
Dùng systematic-debugging — root cause trước khi sửa tiếp.
```

---

## 4. Verify

```text
/opsx-verify ten-change
```

**Nhắc:**

```text
Chạy đủ 5 checks superspec. Ghi verify.md.
Trước PASS: pnpm type-check (và lint nếu đụng nhiều file).
Không báo xong / không archive nếu verify FAIL hoặc chưa chạy lệnh.
```

**FAIL** → `/opsx-apply` → `/opsx-verify` lại.

**Diff vẫn dày:**

```text
/ponytail-review — cắt over-engineering, rồi apply lại nếu cần.
```

---

## 5. Sync

```text
/opsx-sync ten-change
```

**Nhắc:**

```text
Gộp delta specs từ openspec/changes/<name>/specs/ vào openspec/specs/.
Chỉ sync specs được include — không ghi đè lung tung.
Archive thường tự sync; chạy sync trước archive nếu verify báo specs chưa synced.
```

---

## 6. Archive

```text
/opsx-archive ten-change
```

**Nhắc:**

```text
Chỉ archive sau verify PASS và specs đã sync (sync hoặc archive tự sync).
Di chuyển change vào openspec/changes/archive/.
Không archive khi verify FAIL hoặc tasks còn mở không giải thích.
```

---

## Câu chữ tối thiểu (agent lệch phase)

```text
Dừng. Đọc using-superpowers — đúng skill cho phase này. Làm theo superspec trước khi code.
```

```text
Dừng. TDD trước. Ponytail ladder — reuse/stdlib/native trước file/dependency mới.
```

---

## Không dùng flow này

Typo, CSS nhỏ, bug khôi phục hành vi cũ → chat thẳng (+ UI/UX Pro Max / `/ponytail-review` nếu cần).
