# Ponytail — cách dùng (global Cursor)

[Ponytail](https://github.com/DietrichGebert/ponytail) giú agent viết **ít code hơn, đúng hơn** — YAGNI ladder: reuse → stdlib → native → một dòng → tối thiểu cần thiết. Không cắt validation, security, accessibility.

Tích hợp superspec: xem [INTEGRATION.md](../openspec/schemas/superspec/INTEGRATION.md) (apply + verify).

---

## Cài global (một lần / máy)

```powershell
& "f:\Averie\scripts\sync-ponytail-cursor-global.ps1" -UpdateCache
# Restart Cursor
```

Script làm:

| Output           | Vị trí                                        |
| ---------------- | --------------------------------------------- |
| Rule always-on   | `%USERPROFILE%\.cursor\rules\ponytail.mdc`    |
| 6 skills         | `%USERPROFILE%\.cursor\skills\ponytail*\`     |
| 6 slash commands | `%USERPROFILE%\.cursor\commands\ponytail*.md` |

Không cần bootstrap từng repo — giống `/opsx-*` và `/brainstorming`.

---

## Slash commands

| Lệnh               | Khi dùng                                                         |
| ------------------ | ---------------------------------------------------------------- |
| `/ponytail`        | Bật/tắt intensity: `lite`, `full` (mặc định), `ultra`, `off`     |
| `/ponytail-review` | Review **diff hiện tại** — tìm over-engineering, đưa delete-list |
| `/ponytail-audit`  | Audit **cả repo** (không chỉ diff)                               |
| `/ponytail-debt`   | Ghi shortcuts đã hoãn vào ledger                                 |
| `/ponytail-gain`   | Xem benchmark impact                                             |
| `/ponytail-help`   | Quick reference                                                  |

Gõ trong **Agent chat**. Rule `ponytail.mdc` đã `alwaysApply: true` — hầu hết session coding tự áp ladder; slash dùng khi muốn **bật mạnh/tắt** hoặc **review chủ động**.

---

## YAGNI ladder (nhớ nhanh)

```text
1. Cần build không?           -> skip (YAGNI)
2. Codebase đã có?            -> reuse
3. Stdlib có?                 -> dùng stdlib
4. Native platform có?        -> dùng native
5. Dependency đã cài?         -> dùng sẵn
6. Một dòng đủ?               -> một dòng
7. Mới viết code tối thiểu
```

**Không lazy về:** hiểu problem trước, validation ở trust boundary, error handling, security, a11y, yêu cầu explicit.

---

## Trong flow superspec

```text
/opsx-propose ... -> duyệt plan
/opsx-apply       -> TDD + subagent + ponytail ladder (schema apply)
                  -> ponytail-review trên diff trước apply.md
/opsx-verify      -> (có thể nhắc /ponytail-review nếu diff vẫn dày)
```

Apply phase (`schema.yaml`) yêu cầu agent:

1. Implement theo TDD (Superpowers) **và** ponytail ladder (ít file, ít dependency).
2. Chạy **ponytail-review** trên diff worktree trước khi ghi `apply.md`.

Việc nhỏ (không OpenSpec): chat + rule always-on, hoặc `/ponytail-review` sau khi agent viết xong.

Block nhắc khi agent quên (copy-paste): [global-ai-workflow-update.md § Ponytail workflow](./global-ai-workflow-update.md#ponytail-trong-workflow--kết-hợp-bước-nào-nhắc-gì-khi-agent-quên).

---

## Cập nhật

```powershell
& "f:\Averie\scripts\sync-ponytail-cursor-global.ps1" -UpdateCache
# Restart Cursor
```

Hoặc pull cache thủ công:

```powershell
git -C "$env:USERPROFILE\.local\share\ponytail" pull
& "f:\Averie\scripts\sync-ponytail-cursor-global.ps1"
```

Sau khi sửa superspec schema trong Averie, sync cache superspec cho repo mới:

```powershell
Copy-Item "f:\Averie\openspec\schemas\superspec\*" "$env:USERPROFILE\.local\share\superspec\" -Recurse -Force
```

---

## Gỡ cài

```powershell
Remove-Item "$env:USERPROFILE\.cursor\rules\ponytail.mdc" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.cursor\skills\ponytail*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.cursor\commands\ponytail*.md" -Force -ErrorAction SilentlyContinue
```

---

## Liên kết

|                  |                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------- |
| Sync script      | [`scripts/sync-ponytail-cursor-global.ps1`](../scripts/sync-ponytail-cursor-global.ps1) |
| Global workflow  | [global-ai-workflow.md](./global-ai-workflow.md)                                        |
| Update checklist | [global-ai-workflow-update.md](./global-ai-workflow-update.md)                          |
| Upstream         | https://github.com/DietrichGebert/ponytail                                              |
