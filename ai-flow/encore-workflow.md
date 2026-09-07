# Encore — cài skills + MCP cho Cursor

[Encore](https://github.com/encoredev/encore) = backend framework (TypeScript/Go) + infra declarative (DB, Pub/Sub, cron, …). AI integration: [encore.dev/docs/ai-integration](https://encore.dev/docs/ai-integration).

| Thành phần             | Phạm vi       | Mục đích                                               |
| ---------------------- | ------------- | ------------------------------------------------------ |
| **Encore skills** (31) | Global Cursor | Workflow: API, DB, Pub/Sub, auth, migrate, …           |
| **Project rules**      | Per repo      | `encore llm-rules init` → Cursor rules                 |
| **MCP `encore-local`** | Per repo      | Inspect app model, schema, DB, traces khi `encore run` |

---

## Đã cài global (máy dev)

```powershell
# Skills (31) + slash /encore-*
& "f:\Averie\scripts\sync-encore-cursor-global.ps1"

# Hoặc cài/update trực tiếp:
npx skills add encoredev/skills -a cursor -g -y
& "f:\Averie\scripts\sync-encore-cursor-global.ps1"
```

Restart Cursor → gõ `/encore` để thấy danh sách slash.

**Chưa có:** Encore CLI (cần cho `encore run` và MCP). Cài một lần:

```powershell
powershell -ExecutionPolicy Bypass -File "f:\Averie\scripts\install-encore-cli.ps1"
# Mở terminal mới → encore version
```

---

## Khi có dự án Encore mới

### 1. Tạo app

```powershell
encore app create
# Chọn TypeScript hoặc Go
# Chọn Cursor khi hỏi AI tool (tự sinh rules + MCP nếu CLI mới)
```

### 2. Bootstrap Cursor (nếu chưa chọn Cursor lúc create)

```powershell
cd D:\path\to\my-encore-app
& "f:\Averie\scripts\bootstrap-encore-project.ps1" -ProjectPath .
```

Script chạy `encore llm-rules init` và ghi `.cursor/mcp.json`:

```json
{
    "mcpServers": {
        "encore-local": {
            "command": "encore",
            "args": ["mcp", "run", "--app=YOUR-APP-ID"]
        }
    }
}
```

### 3. Bật MCP trong Cursor

**Global (đã cấu hình):** `%USERPROFILE%\.cursor\mcp.json` có server `encore-local` — wrapper tự tìm `encore.app` khi mở folder Encore.

1. Mở **folder root Encore app** làm workspace
2. Settings → MCP → bật `encore-local` (nếu chưa bật)
3. Restart Cursor

Tuỳ chọn override app id:

```powershell
$env:ENCORE_APP_ID = "your-app-slug"
$env:ENCORE_PROJECT_PATH = "D:\path\to\app"
```

Per-project (khuyến nghị khi đã có app id cố định): chạy `bootstrap-encore-project.ps1` → `.cursor/mcp.json` trong repo.

### 4. Chạy local + agent inspect

```powershell
encore run
# Dashboard: http://localhost:9400
```

Agent qua MCP có thể: đọc services/APIs, schema DB, query local DB, gọi API, xem traces.

---

## Slash thường dùng (TypeScript)

| Lệnh                      | Khi                                |
| ------------------------- | ---------------------------------- |
| `/encore-getting-started` | Dự án Encore.ts mới từ zero        |
| `/encore-api`             | Thêm endpoint typed                |
| `/encore-database`        | Postgres + migrations              |
| `/encore-pubsub`          | Topic / subscription               |
| `/encore-auth`            | Auth handler                       |
| `/encore-architecture`    | Thiết kế service boundaries        |
| `/encore-migrate`         | Migrate backend có sẵn sang Encore |
| `/encore-code-review`     | Review code Encore.ts              |

Go: prefix `encore-go-*` (ví dụ `/encore-go-api`).

---

## Workflow gợi ý với agent

```text
1. /encore-getting-started hoặc encore app create
2. bootstrap-encore-project.ps1
3. encore run
4. "Thêm endpoint X, gọi qua MCP verify trace + DB"
```

Ví dụ prompt (từ [docs](https://encore.dev/docs/ai-integration)):

- "Inspect users database schema and add an endpoint that returns accounts created in the last week."
- "Add an endpoint that publishes to Pub/Sub, call it, and verify the publish in the trace."

---

## Cập nhật skills

```powershell
npx skills add encoredev/skills -a cursor -g -y
& "f:\Averie\scripts\sync-encore-cursor-global.ps1" -UpdateCache
```

---

## Lưu ý

- **MCP global** — `%USERPROFILE%\.cursor\mcp.json` + wrapper `~\.cursor\encore\encore-mcp-run.ps1` (cần mở folder có `encore.app` + app id). Per-repo: `bootstrap-encore-project.ps1`.
- **Docker** — `encore run` cần Docker cho Postgres/Redis local.
- **Secrets** — MCP không expose secret values (chỉ metadata).
- Encore **không thay** OpenSpec/Superspec của Averie — dùng cho **dự án backend Encore riêng**.

---

## Links

|                 |                                                                                     |
| --------------- | ----------------------------------------------------------------------------------- |
| Sync skills     | [`scripts/sync-encore-cursor-global.ps1`](../scripts/sync-encore-cursor-global.ps1) |
| Cài CLI         | [`scripts/install-encore-cli.ps1`](../scripts/install-encore-cli.ps1)               |
| Bootstrap MCP   | [`scripts/bootstrap-encore-project.ps1`](../scripts/bootstrap-encore-project.ps1)   |
| Skills upstream | [github.com/encoredev/skills](https://github.com/encoredev/skills)                  |
| Encore repo     | [github.com/encoredev/encore](https://github.com/encoredev/encore)                  |
| AI integration  | [encore.dev/docs/ai-integration](https://encore.dev/docs/ai-integration)            |
