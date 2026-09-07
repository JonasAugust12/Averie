# Cập nhật Global AI workflow

Checklist khi nâng cấp **OpenSpec · Superspec · Superpowers · Ponytail · Caveman · UI/UX Pro Max** — bổ sung cho [global-ai-workflow.md](./global-ai-workflow.md).

---

## Phân tầng — cập nhật ở đâu?

| Thành phần                            | Phạm vi       | Vị trí / lệnh                                                           |
| ------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| OpenSpec CLI                          | Global (máy)  | `npm install -g @fission-ai/openspec`                                   |
| OpenSpec config (12 workflow)         | Global        | `%APPDATA%\openspec\config.json`                                        |
| Slash `/opsx-*` + skills OpenSpec     | Global Cursor | `%USERPROFILE%\.cursor\commands\`, `%USERPROFILE%\.cursor\skills\`      |
| Superspec schema cache                | Global        | `%USERPROFILE%\.local\share\superspec\`                                 |
| UI/UX Pro Max CLI + skill             | Global        | `uipro update --global` → `%USERPROFILE%\.cursor\skills\ui-ux-pro-max\` |
| Superpowers plugin                    | Global Cursor | Agent chat: `/add-plugin superpowers`, `/plugin-update superpowers`     |
| Ponytail rule + skills + commands     | Global Cursor | `sync-ponytail-cursor-global.ps1`                                       |
| Caveman skills + commands (+ rule)    | Global Cursor | `sync-caveman-cursor-global.ps1`                                        |
| `openspec/` (config, schema, changes) | **Từng repo** | `openspec update` trong root repo                                       |

---

## Khi nào cần chạy?

- Thông báo bản mới OpenSpec / Superspec / Superpowers / **Ponytail** / **Caveman** / UI/UX Pro Max
- Slash command `/opsx-*` thiếu hoặc hành vi lệch so với docs
- Sau khi clone Averie mới và muốn đồng bộ máy dev với repo mẫu
- Máy mới (xem [Máy mới](#máy-mới) — dùng bootstrap, không phải update)

---

## Checklist nhanh (copy)

Chạy trên **Windows**, từ bất kỳ terminal nào. Thay `f:\Averie` nếu repo mẫu ở path khác.

```powershell
# ── 1. CLI global ──
npm install -g @fission-ai/openspec@latest ui-ux-pro-max-cli@latest

# ── 2. OpenSpec profile (chỉ khi thiếu workflow — thường đã set) ──
openspec config list
# Nếu workflows < 12: openspec config profile   # interactive, chọn custom expanded

# ── 3. Superspec cache (schema mới) ──
$cache = "$env:USERPROFILE\.local\share\superspec"
New-Item -ItemType Directory -Force -Path $cache | Out-Null
git -C $cache pull 2>$null
if ($LASTEXITCODE -ne 0) {
    Remove-Item $cache\* -Recurse -Force -ErrorAction SilentlyContinue
    git clone --depth 1 https://github.com/danielhanold/superspec.git $cache
}

# ── 4. Cập nhật repo mẫu (Averie) ──
cd f:\Averie
openspec update
openspec validate

# ── 5. Sync slash commands + skills OpenSpec lên global Cursor ──
$dest = "$env:USERPROFILE\.cursor"
New-Item -ItemType Directory -Force -Path "$dest\commands", "$dest\skills" | Out-Null
Copy-Item "f:\Averie\.cursor\commands\opsx-*.md" "$dest\commands\" -Force
Copy-Item "f:\Averie\.cursor\skills\openspec-*" "$dest\skills\" -Recurse -Force

# ── 6. Superpowers plugin + global slash commands ──
# Agent chat: /plugin-update superpowers
& "f:\Averie\scripts\sync-superpowers-cursor-global.ps1"

# ── 7. Ponytail global (rule + skills + commands) ──
& "f:\Averie\scripts\sync-ponytail-cursor-global.ps1" -UpdateCache

# ── 7b. Caveman global (skills + commands; rule per-session by default) ──
& "f:\Averie\scripts\sync-caveman-cursor-global.ps1" -UpdateCache

# ── 8. Superspec cache (if schema changed in Averie) ──
Copy-Item "f:\Averie\openspec\schemas\superspec\*" "$env:USERPROFILE\.local\share\superspec\" -Recurse -Force

# ── 9. UI/UX Pro Max global ──
uipro update --global

# ── 9b. Antigravity Global (IDE & CLI: sync all 51 skills + rules + slash commands) ──
powershell -ExecutionPolicy Bypass -File "f:\Averie\scripts\sync-antigravity-global.ps1" -UpdateCache

# ── 10. Superpowers plugin (nếu chưa cài) ──
# /add-plugin superpowers   # Agent chat, một lần / máy

# ── 11. Restart Cursor (bắt buộc) ──

# ── 12. Cập nhật từng repo đang làm việc ──
# cd D:\path\to\other-repo
# Copy-Item "$env:USERPROFILE\.local\share\superspec\*" "openspec\schemas\superspec\" -Recurse -Force
# openspec update
# openspec validate
```

---

## Chi tiết từng bước

### 1. OpenSpec CLI

```powershell
npm install -g @fission-ai/openspec@latest
openspec --version
```

Kiểm tra config global:

```powershell
openspec config list
```

Kỳ vọng:

- `profile: custom`
- `delivery: both` (commands + skills)
- `workflows`: 12 mục (`propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`)

Nếu thiếu workflow:

```powershell
openspec config profile    # interactive — chọn custom, tick đủ workflow
```

Config file: `%APPDATA%\openspec\config.json`.

---

### 2. Superspec schema cache

Bootstrap repo mới đọc schema từ cache này — **cập nhật cache trước**, rồi mới sync vào từng repo.

```powershell
$cache = "$env:USERPROFILE\.local\share\superspec"
git clone --depth 1 https://github.com/danielhanold/superspec.git $cache   # lần đầu
# hoặc
git -C $cache pull                                                           # lần sau
```

---

### 3. Repo mẫu / repo chính (Averie)

```powershell
cd f:\Averie

# Schema superspec trong repo (nếu cache vừa pull)
Copy-Item "$env:USERPROFILE\.local\share\superspec\*" "openspec\schemas\superspec\" -Recurse -Force

openspec update
openspec validate
openspec schemas    # phải thấy superspec (project)
```

`openspec update` ghi `.cursor/commands/opsx-*` và `.cursor/skills/openspec-*` **trong repo**. Bước 4 bên dưới copy sang global.

---

### 4. Sync slash commands global (Cursor)

OpenSpec **không có** `openspec update --global` cho Cursor — copy thủ công sau khi `openspec update` ở repo mẫu:

```powershell
$src = "f:\Averie\.cursor"
$dest = "$env:USERPROFILE\.cursor"
Copy-Item "$src\commands\opsx-*.md" "$dest\commands\" -Force
Copy-Item "$src\skills\openspec-*" "$dest\skills\" -Recurse -Force
```

Kiểm tra:

```powershell
Get-ChildItem "$env:USERPROFILE\.cursor\commands\opsx-*.md" | Measure-Object
# Count = 12
```

---

### 5. UI/UX Pro Max

```powershell
npm install -g ui-ux-pro-max-cli@latest
uipro update --global
```

Skill global: `%USERPROFILE%\.cursor\skills\ui-ux-pro-max\`.

Repo Averie có bản project-local tại `.cursor/skills/ui-ux-pro-max/` — chỉ cần `uipro update` (không `--global`) nếu muốn sync riêng repo đó.

---

### 6. Superpowers (plugin + global slash commands)

Superpowers cài qua **Cursor plugin** (không phải npm). Slash `/brainstorming` **không tự global** như `/opsx-*` — cần sync skills + commands vào home folder.

**Lần đầu (một lần / máy)** — Agent chat:

```text
/add-plugin superpowers
```

**Sau mỗi update plugin** — Agent chat:

```text
/plugin-update superpowers
```

**Sync slash commands global** (mọi repo đều gợi ý `/brainstorming`, `/writing-plans`, …):

```powershell
& "f:\Averie\scripts\sync-superpowers-cursor-global.ps1"
```

Script copy 14 skills từ plugin cache → `%USERPROFILE%\.cursor\skills\` và tạo `%USERPROFILE%\.cursor\commands\*.md`.

Kiểm tra:

```powershell
Test-Path "$env:USERPROFILE\.cursor\commands\brainstorming.md"
Get-ChildItem "$env:USERPROFILE\.cursor\commands\brainstorming.md", "$env:USERPROFILE\.cursor\skills\brainstorming\SKILL.md"
```

Slash thường dùng:

| Lệnh                       | Khi dùng                |
| -------------------------- | ----------------------- |
| `/brainstorming`           | Thiết kế trước khi code |
| `/writing-plans`           | Micro-plan TDD          |
| `/test-driven-development` | RED-GREEN-REFACTOR      |
| `/using-superpowers`       | Agent lệch phase        |
| `/systematic-debugging`    | Debug có method         |

Trong flow superspec, các skill này thường **tự chạy** trong `/opsx-apply` — slash riêng dùng khi làm việc nhỏ không qua OpenSpec.

---

### 7. Ponytail (rule + global slash commands)

Ponytail không dùng Cursor plugin — sync từ GitHub qua script Averie.

**Lần đầu / update:**

```powershell
& "f:\Averie\scripts\sync-ponytail-cursor-global.ps1" -UpdateCache
```

Cài:

- `%USERPROFILE%\.cursor\rules\ponytail.mdc` — **always-on** (YAGNI ladder mọi session)
- 6 skills + 6 commands: `/ponytail`, `/ponytail-review`, …

Chi tiết: [ponytail-workflow.md](./ponytail-workflow.md).

Superspec **apply** gọi ponytail trong step 2 (implement) và **ponytail-review** ở step 2c (trước `apply.md`). Xem [Ponytail trong workflow](#ponytail-trong-workflow--kết-hợp-bước-nào-nhắc-gì-khi-agent-quên).

---

### 7b. Caveman (global slash commands)

Caveman nén **prose** agent (ít token) — **không** rút gọn code/commit. Bổ sung Ponytail (LEAN = code).

**Lần đầu / update:**

```powershell
& "f:\Averie\scripts\sync-caveman-cursor-global.ps1" -UpdateCache
```

Cài:

- 13+ skills + slash: `/caveman`, `/caveman-help`, `/caveman-review`, …
- `%USERPROFILE%\.cursor\rules\caveman.mdc` — **alwaysApply: false** (mặc định); bật bằng `/caveman full` mỗi session
- Tuỳ chọn always-on: `-AlwaysOnRule`

Chi tiết: [caveman-workflow.md](./caveman-workflow.md).

**Khi nào dùng:** explore/chat (`/caveman full`); **tắt** khi viết OpenSpec artifacts (`stop caveman` hoặc `/caveman off`).

---

## Ponytail trong workflow — kết hợp bước nào, nhắc gì khi agent quên

Ponytail = **LEAN** (ít code, YAGNI). Rule `ponytail.mdc` **always-on** — agent đáng lẽ luôn leo ladder; slash chỉ dùng khi cần **ép mạnh** hoặc **review diff**.

### Bản đồ theo phase

| Phase                                        | Ponytail                             | Tự động?                      | Slash / nhắc khi quên                                         |
| -------------------------------------------- | ------------------------------------ | ----------------------------- | ------------------------------------------------------------- |
| `/opsx-explore` … `/opsx-propose`            | **Không** (chưa code)                | —                             | Không nhắc ponytail — tránh lẫn planning                      |
| Trước apply (UI)                             | **Không**                            | —                             | Chỉ UI/UX Pro Max                                             |
| **`/opsx-apply` step 2** (implement)         | **Có** — YAGNI ladder mỗi micro-task | Rule always-on + schema apply | Text block **Apply — over-engineering** (bên dưới)            |
| **`/opsx-apply` step 2c** (trước `apply.md`) | **Có** — `ponytail-review` trên diff | Schema apply bắt buộc         | `/ponytail-review` hoặc block **Apply — thiếu review**        |
| `/opsx-verify`                               | Tuỳ chọn                             | Không                         | Nếu diff vẫn dày: `/ponytail-review` trước khi chấp nhận PASS |
| `/opsx-continue` / archive                   | **Không**                            | —                             | Không nhắc                                                    |
| **Việc nhỏ** (không OpenSpec)                | **Có** — rule always-on              | Rule                          | Sau khi agent code xong: `/ponytail-review`                   |
| Audit repo / refactor lớn                    | Chủ động                             | —                             | `/ponytail-audit` hoặc `/ponytail ultra`                      |

**Không gõ kèm** `/ponytail` cùng một tin với `/opsx-apply` — superspec apply đã map ponytail; chỉ **nhắc text** khi agent over-build hoặc bỏ step 2c.

### Flow tóm tắt (copy)

```text
Planning (/opsx-propose …)     → KHÔNG ponytail (chưa code)
Duyệt plan + (UI) UI/UX Pro Max
/opsx-apply                    → TDD (Superpowers) + ladder (Ponytail rule) trong lúc code
                               → ponytail-review trên diff TRƯỚC apply.md (schema 2c)
/opsx-verify                   → (tuỳ chọn) /ponytail-review nếu diff vẫn phình
Việc nhỏ                       → rule always-on; /ponytail-review sau khi xong
```

### Block nhắc — copy khi agent quên

**Apply — over-engineering** (agent thêm lib/file/abstraction không cần):

```text
Dừng over-engineering. Áp ponytail ladder: reuse codebase → stdlib → native → dependency đã có → một dòng → tối thiểu.
Không thêm package/file mới trừ khi spec/plan yêu cầu. Giữ TDD — test fail trước, code tối thiểu sau.
Không cắt validation, security, accessibility.
```

**Apply — thiếu ponytail-review** (agent ghi `apply.md` mà chưa review diff):

```text
Chưa đủ bước apply 2c. Chạy /ponytail-review trên diff worktree trước khi ghi apply.md.
Cắt over-engineering rõ ràng (stdlib/native/dead code); ghi tóm tắt vào apply.md.
```

**Apply — thêm dependency / wrapper không cần:**

```text
/ponytail full

Task này có thể dùng stdlib hoặc code sẵn trong repo không? Nếu có — bỏ dependency/wrapper, diff ngắn hơn.
```

**Verify — diff vẫn dày sau apply:**

```text
/ponytail-review

Review diff hiện tại — delete-list over-engineering. Nếu còn cắt được mà không phá spec/TDD, quay lại apply rồi verify lại.
```

**Việc nhỏ — agent vừa viết xong, chưa review:**

```text
/ponytail-review

Chỉ review over-engineering trên diff vừa viết — không refactor scope ngoài task.
```

**Bật mạnh / tắt tạm:**

```text
/ponytail ultra          # ép tối đa YAGNI (feature phình, nhiều file thừa)
/ponytail off            # tắt tạm (debug sâu, spike — nhớ bật lại)
/ponytail full           # về mặc định
```

**Audit cả repo (hiếm, không trong DAG):**

```text
/ponytail-audit

Audit over-engineering toàn repo — không implement, chỉ delete-list ưu tiên.
```

### Tóm tắt: gõ slash hay chỉ nhắc text?

| Tình huống                     | Gõ slash?                   | Nhắc text                               |
| ------------------------------ | --------------------------- | --------------------------------------- |
| Flow `/opsx-apply` bình thường | Không `/ponytail` kèm apply | Chỉ khi over-build hoặc thiếu 2c        |
| Agent thêm lib/wrapper thừa    | Tuỳ chọn `/ponytail full`   | Block **Apply — over-engineering**      |
| Thiếu review trước `apply.md`  | `/ponytail-review`          | Block **Apply — thiếu ponytail-review** |
| Verify PASS nhưng diff dày     | `/ponytail-review`          | Block **Verify — diff vẫn dày**         |
| Chat thẳng, không OpenSpec     | `/ponytail-review` sau code | Rule always-on đủ phần lớn              |

**Câu chữ tối thiểu** (agent vừa over-build vừa bỏ TDD):

```text
Dừng. TDD trước (test fail → code tối thiểu). Ponytail ladder — reuse/stdlib/native trước khi thêm file hoặc dependency.
```

---

### 8. Restart Cursor

Bắt buộc sau khi đổi commands, skills, hoặc plugin — đóng hẳn Cursor rồi mở lại.

---

### 9. Các repo khác (đã bootstrap superspec)

Mỗi repo **không cần** copy lại global commands. Chỉ sync schema + chạy update:

```powershell
cd D:\path\to\repo

Copy-Item "$env:USERPROFILE\.local\share\superspec\*" "openspec\schemas\superspec\" -Recurse -Force
openspec update
openspec validate
```

Repo dùng global commands có thể xóa bản trùng trong repo (tuỳ chọn):

```powershell
Remove-Item ".cursor\commands\opsx-*.md" -Force -ErrorAction SilentlyContinue
Remove-Item ".cursor\skills\openspec-*" -Recurse -Force -ErrorAction SilentlyContinue
```

---

## Verify sau update

| Kiểm tra    | Lệnh / hành vi                                                                         |
| ----------- | -------------------------------------------------------------------------------------- |
| CLI         | `openspec --version`                                                                   |
| Config      | `openspec config list` → 12 workflows                                                  |
| Schema      | `openspec schemas` (trong repo) → có `superspec (project)`                             |
| Validate    | `openspec validate` → pass                                                             |
| Slash menu  | Agent chat → `/opsx`, `/brainstorming`, `/ponytail-review`, `/caveman` hiện ở mọi repo |
| Superpowers | Agent vẫn tuân TDD khi `/opsx-apply`                                                   |
| Ponytail    | Rule always-on; apply chạy `ponytail-review` trước `apply.md` (schema 2c)              |
| UI skill    | Agent nhận `ui-ux-pro-max` khi nhắc design system                                      |

---

## Máy mới

Không dùng checklist update — dùng bootstrap trong [global-ai-workflow.md](./global-ai-workflow.md):

1. Cài CLI + config global
2. Clone superspec cache
3. `uipro init --ai cursor --global`
4. `/add-plugin superpowers` trong Cursor
5. Copy global `/opsx-*` từ Averie (bước 4 ở trên)
6. `sync-superpowers-cursor-global.ps1` + `sync-ponytail-cursor-global.ps1 -UpdateCache` + `sync-caveman-cursor-global.ps1 -UpdateCache`
7. Bootstrap từng repo: `bootstrap-openspec-superspec.ps1 -SkipInit`

---

## Repo mới (chưa có superspec)

Global commands đã có → chỉ bootstrap data OpenSpec:

```powershell
cd D:\path\to\repo
powershell -File "f:\Averie\scripts\bootstrap-openspec-superspec.ps1" -SkipInit -ProjectName "Tên app" -Stack "Next.js + Tailwind"
# Sửa openspec/config.yaml → Restart Cursor
```

---

## Xử lý sự cố

| Triệu chứng                             | Cách xử lý                                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| Gõ `/` không thấy `/opsx-*`             | Chạy lại bước 4 (sync global) + restart Cursor; mở đúng folder root repo                     |
| Chỉ thiếu vài lệnh (verify, ff, …)      | `openspec config profile` → chọn đủ workflow → `openspec update` → sync global               |
| `Unknown schema 'superspec'`            | Copy cache → `openspec\schemas\superspec\`; kiểm tra `schema: superspec` trong `config.yaml` |
| Lệnh có nhưng agent không theo DAG      | `/plugin-update superpowers`; kiểm tra plugin đã bật                                         |
| Agent over-engineering khi apply        | Block **Apply — over-engineering** (mục Ponytail workflow); `/ponytail-review`               |
| Agent bỏ ponytail-review trước apply.md | Block **Apply — thiếu ponytail-review**; chạy `/ponytail-review`                             |
| Repo và global commands khác phiên bản  | `openspec update` ở Averie → sync global (bước 3–4)                                          |

---

## Tần suất gợi ý

| Thành phần       | Gợi ý                                                           |
| ---------------- | --------------------------------------------------------------- |
| OpenSpec CLI     | Khi có release mới hoặc ~1 tháng                                |
| Superspec cache  | Khi schema/DAG đổi trên GitHub                                  |
| Global `/opsx-*` | Sau mỗi lần `openspec update` ở repo mẫu                        |
| Superpowers      | `/plugin-update` + `sync-superpowers-cursor-global.ps1`         |
| Ponytail         | `sync-ponytail-cursor-global.ps1 -UpdateCache` khi upstream đổi |
| Caveman          | `sync-caveman-cursor-global.ps1 -UpdateCache` khi upstream đổi  |
| UI/UX Pro Max    | `uipro update --global` cùng chu kỳ OpenSpec                    |
| Repo đang làm    | `openspec update` + copy schema khi đổi superspec               |

---

## Liên kết

|                         |                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Dùng hàng ngày          | [global-ai-workflow.md](./global-ai-workflow.md)                                              |
| **Flow cheat sheet**    | [superspec-my-flow.md](./superspec-my-flow.md)                                                |
| Bootstrap repo mới      | [`scripts/bootstrap-openspec-superspec.ps1`](../scripts/bootstrap-openspec-superspec.ps1)     |
| Sync Superpowers global | [`scripts/sync-superpowers-cursor-global.ps1`](../scripts/sync-superpowers-cursor-global.ps1) |
| Sync Ponytail global    | [`scripts/sync-ponytail-cursor-global.ps1`](../scripts/sync-ponytail-cursor-global.ps1)       |
| Sync Caveman global     | [`scripts/sync-caveman-cursor-global.ps1`](../scripts/sync-caveman-cursor-global.ps1)         |
| Ponytail usage          | [ponytail-workflow.md](./ponytail-workflow.md)                                                |
| Caveman usage           | [caveman-workflow.md](./caveman-workflow.md)                                                  |
| Superspec chi tiết      | [`openspec/schemas/superspec/INTEGRATION.md`](../openspec/schemas/superspec/INTEGRATION.md)   |
| OpenSpec workflows      | [openspec-workflows.md](./openspec-workflows.md)                                              |
