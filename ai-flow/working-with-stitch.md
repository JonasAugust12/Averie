# Cách làm việc: Stitch + OpenSpec/Superspec + Superpowers + UI/UX Pro Max

Hướng dẫn **prompt & quy trình** khi đã có design trên **Google Stitch** và muốn agent implement vào Averie, kèm yêu cầu thêm; đồng thời cách chỉnh UI sau bằng **UI/UX Pro Max**.

Liên quan: [overview.md](./overview.md) · [advanced-workflow.md](./advanced-workflow.md) · [superpowers.md](./superpowers.md)

---

## 0. Trả lời nhanh: OpenSpec dùng khi nào?

**Không phải lúc nào cũng dùng OpenSpec.**

| Tình huống                                                         | Dùng gì                                                                             |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Sửa typo, CSS nhỏ, đổi copy, bug nhỏ rõ nguyên nhân                | **Chat thẳng** với agent — **không** mở OpenSpec                                    |
| Chỉnh 1 component / 1 màn polish UI                                | **UI/UX Pro Max** (+ @ file) — thường **không** cần OpenSpec                        |
| Feature mới, nhiều màn, đổi API/auth/DB, Stitch → app nhiều screen | **OpenSpec / Superspec** → rồi mới implement                                        |
| Không chắc lớn hay nhỏ                                             | Hỏi 1 câu: _“Nếu làm sai sẽ đụng nhiều file / khó rollback không?”_ → Có = OpenSpec |

### Rule ngón tay cái

```text
≤ ~1–2 giờ, 1–2 file, không đổi hành vi hệ thống  →  làm thẳng
> đó, hoặc đổi flow / data / auth / nhiều màn Stitch →  OpenSpec trước
```

OpenSpec không phải để “trông chuyên nghiệp” — mà để **chốt WHAT trước khi đốt token code HOW**.

---

## 0.1 Quy trình chung (chỉ cần nhớ cái này)

Một vòng lặp, 4 bước:

```text
1. HIỂU   → Stitch / mô tả / bug (thu thập)
2. CHỐT   → OpenSpec chỉ khi việc LỚN (bước 0)
3. LÀM    → Superpowers (+ UI/UX Pro Max nếu đụng UI)
4. XEM    → Bạn review; chưa ưng UI → Pro Max; xong feature lớn → archive OpenSpec
```

Phiên bản siêu ngắn để nhớ:

```text
Nhỏ: nói → làm → xem
Lớn: nói → OpenSpec → (bạn duyệt) → làm → xem → archive
Có design Stitch: đọc Stitch → (lớn thì OpenSpec) → làm → xem
Chưa ưng UI: Pro Max (không cần OpenSpec mới)
```

### Ví dụ chọn đường

| Việc của bạn                                        | Đường đi                                                                   |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| “Nút login lệch 4px”                                | Chat + UI/UX Pro Max                                                       |
| “Implement cả app từ Stitch `10694160950357827758`” | Stitch → **OpenSpec** → Superpowers                                        |
| “Thêm 1 field email vào form có sẵn”                | Có thể làm thẳng; nếu kèm API + validation + i18n nhiều chỗ → OpenSpec nhẹ |
| “Đổi toàn bộ auth sang OAuth”                       | **OpenSpec** bắt buộc                                                      |

Chi tiết Stitch / prompt dài nằm ở các mục dưới — **hàng ngày chỉ cần nhớ mục 0 + 0.1**.

---

## 1. Ai làm việc gì

| Tool                     | Vai trò ngắn                                             | Khi nào dùng                                                 |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------ |
| **Stitch MCP**           | Nguồn LOOK từ design (screenshot / HTML screen)          | Đã thiết kế trên Stitch, muốn “port” sang code               |
| **OpenSpec + Superspec** | WHAT — proposal, specs, tasks, plan, verify, archive     | **Chỉ việc lớn** (nhiều bước / đổi hành vi) — xem mục 0      |
| **Superpowers**          | HOW — brainstorm, plan micro, TDD, subagent, review      | Implement (có hoặc không kèm OpenSpec)                       |
| **UI/UX Pro Max**        | LOOK & FEEL — polish, a11y, spacing, palette, typography | Chưa ưng UI / chốt design system — thường không cần OpenSpec |

**Nguyên tắc Averie (không đổi):**

- `GET` → Route Handler (`src/app/api`)
- `POST / PUT / PATCH / DELETE` → Server Action (`src/actions`)
- Response: `{ status, message, data }`
- Theme hiện tại: Primary `#2B2623`, Secondary `#D4C5B9`, Tertiary `#F5EFEA`, Neutral `#FDFCFB` (có thể override nếu Stitch/design system quyết định khác — ghi rõ trong OpenSpec)

---

## 2. Stitch MCP — lệnh/tool hữu ích

Trong Cursor, agent gọi MCP server `user-stitch` (cần đã auth nếu bị hỏi `mcp_auth`).

| Tool                                          | Dùng để                                             |
| --------------------------------------------- | --------------------------------------------------- |
| `list_projects`                               | Liệt kê project Stitch (lấy / xác nhận `projectId`) |
| `get_screen_image`                            | Lấy screenshot màn hình (để agent “nhìn” UI)        |
| `get_screen_code`                             | Lấy HTML / URL code của screen                      |
| `scaffold_project_files`                      | Xuất HTML screen ra path trong repo                 |
| `generate_screen` / `generate_and_fetch_code` | Tạo screen mới trong project bằng prompt            |
| `edit_screen`                                 | Sửa 1 screen trên Stitch theo prompt                |
| `generate_variants`                           | Sinh biến thể (màu / layout / typography…)          |

Bạn cần ít nhất:

- **Project ID** — ví dụ: `10694160950357827758`
- **Screen ID** (từng màn) — lấy trên Stitch UI hoặc nhờ agent sau khi list/inspect project

Gợi ý: dán link Stitch + ID vào chat để khỏi nhầm project.

---

## 3. Luồng khi việc LỚN: từ Stitch → code Averie

> Chỉ dùng full pipeline này khi đã qua rule mục 0 (nhiều màn / feature lớn).  
> Việc nhỏ: đọc Stitch (nếu cần) → code thẳng → Pro Max nếu chưa ưng.

```text
Stitch (design)
    ↓  MCP: image + code
OpenSpec / Superspec (WHAT + tasks)
    ↓  bạn review
UI/UX Pro Max (map design → design tokens / sanity check)
    ↓
Superpowers (HOW: plan → TDD → implement)
    ↓
Bạn verify UI
    ↓  (nếu chưa ưng) UI/UX Pro Max iterate
OpenSpec verify → finalize → archive
```

### Bước A — Đọc design từ Stitch

Prompt mẫu (đổi ID / screen nếu cần):

```text
Dùng Stitch MCP với projectId: 10694160950357827758

1. list_projects để xác nhận đúng project
2. Với từng screen tôi nêu (hoặc bạn liệt kê nếu lấy được):
   - get_screen_image
   - get_screen_code
3. Tóm tắt lại:
   - Danh sách màn hình
   - Layout / spacing / typography / màu chính
   - Component lặp lại (button, input, card, nav…)
4. Map thô sang cấu trúc Averie (app router paths gợi ý)
   Tuân thủ docs/overview.md
```

Nếu đã biết `screenId`:

```text
Stitch projectId=10694160950357827758
screenId=<SCREEN_ID>

Hãy get_screen_image + get_screen_code.
Sau đó scaffold HTML tạm vào docs/stitch/<screen-name>.html
(chỉ để tham chiếu, chưa port React).
```

### Bước B — Mở OpenSpec change + yêu cầu thêm

```text
/opsx-propose import-stitch-10694160950357827758
```

hoặc trong chat:

```text
Tạo OpenSpec change (schema superspec) để implement UI từ Stitch
projectId=10694160950357827758

Yêu cầu thêm (bắt buộc ghi vào proposal / tasks):
- i18n next-intl (vi mặc định, en sẵn sàng)
- Auth: dùng Auth.js đã setup; trang login gọi loginAction
- GET data qua /api/* ; mutate qua Server Actions
- Envelope API { status, message, data }
- AppShell max-width 1280px
- Không copy nguyên HTML Stitch — port sang React + Tailwind + component Averie
- Mobile-first, a11y cơ bản (label, contrast, focus)

Sau brainstorm/proposal, dừng lại để tôi review.
```

**Bạn review** `openspec/changes/.../proposal.md` + `tasks.md` trước khi cho code.

### Bước C — Design system sanity (UI/UX Pro Max)

Trước khi implement nặng:

```text
@openspec/changes/<ten-change>/proposal.md

Dựa trên tóm tắt Stitch + proposal:
1. Dùng UI/UX Pro Max để chốt design system
   (product type / industry theo Averie, stack Next.js + Tailwind)
2. Ưu tiên bám màu & layout Stitch; nếu lệch theme Averie thì nêu rõ trade-off
3. Ghi kết quả vào docs/design-system.md (hoặc design.md trong change)
4. Chưa code UI cho đến khi tôi OK
```

### Bước D — Implement bằng Superpowers

```text
@openspec/changes/<ten-change>/proposal.md
@openspec/changes/<ten-change>/tasks.md
@openspec/changes/<ten-change>/plan.md
@docs/stitch/   (nếu đã scaffold HTML tham chiếu)

Implement theo Superpowers:
writing-plans (nếu chưa có plan) → subagent-driven-development + TDD.

Ràng buộc Averie:
- GET = Route Handler; mutations = Server Actions
- Alias @components @services @actions @validations …
- Không hardcode string user-facing — dùng next-intl khi đụng copy

Làm từng màn theo tasks; sau mỗi màn chính dừng để tôi xem.
```

Hoặc đi superspec apply:

```text
/opsx-apply
```

### Bước E — Đóng change

```text
/opsx-verify
/opsx-archive
```

---

## 4. Prompt “all-in-one” (copy nhanh)

Dùng khi muốn agent chạy gần full pipeline trong một lần (vẫn nên review giữa chừng):

```text
Mình đã design trên Stitch.
projectId: 10694160950357827758

Hãy làm theo thứ tự:

1) Stitch MCP — đọc project, lấy image + code các screen chính,
   tóm tắt UI và lưu HTML tham chiếu vào docs/stitch/ nếu hữu ích.

2) OpenSpec (superspec) — tạo change implement-stitch-ui
   với proposal + tasks. Ghi thêm yêu cầu:
   - Auth.js loginAction cho màn auth
   - GET/API + Server Actions theo docs/overview.md
   - next-intl, AppShell 1280px
   - Port sang React/Tailwind, không dán HTML nguyên khối

3) DỪNG để tôi review proposal/tasks.

4) Sau khi tôi OK: UI/UX Pro Max chốt design tokens,
   rồi Superpowers implement TDD theo tasks (từng màn một).
```

---

## 5. Khi chưa ưng UI — dùng UI/UX Pro Max thế nào

Không cần tạo Stitch project mới mỗi lần chỉnh nhỏ. Phân loại:

### 5.1 Chỉnh nhẹ (spacing, contrast, typography, a11y)

```text
@src/app/(...).tsx
@src/components/...

Review UI component này bằng UI/UX Pro Max:
- spacing / hierarchy
- contrast & a11y
- mobile
Đề xuất thay đổi cụ thể rồi implement trên file này.
Giữ token màu Averie / design-system hiện tại, trừ khi tôi bảo đổi.
```

### 5.2 Đổi hướng style (vẫn cùng layout)

```text
Màn <tên> chưa ưng: đang bị flat / thiếu nhấn mạnh CTA.

Dùng UI/UX Pro Max:
1. Đề xuất 2–3 hướng polish (không redesign toàn app)
2. Tôi chọn 1 hướng
3. Apply vào component, giữ cấu trúc thông tin hiện tại
```

### 5.3 Design lại trên Stitch rồi sync lại

```text
Stitch projectId=10694160950357827758
screenId=<SCREEN_ID>

1) edit_screen với prompt: "<mô tả chỉnh trên Stitch>"
   HOẶC generate_variants (aspects: COLOR_SCHEME, LAYOUT) để tôi chọn
2) get_screen_image + get_screen_code lại
3) Diff với code React hiện tại và cập nhật component Averie
4) Không phá API / Server Action đã ổn
```

### 5.4 Chỉ không ưng màu / font toàn app

```text
Dùng UI/UX Pro Max regenerate bảng màu + font pairing cho Averie
(product: …, industry: …, keywords: …).
Xuất vào docs/design-system.md.
Sau đó cập nhật src/app/globals.css + fonts.ts cho khớp.
Không đụng business logic.
```

### Checklist iterate UI

| Câu hỏi                                      | Hành động                                                    |
| -------------------------------------------- | ------------------------------------------------------------ |
| Sai so với Stitch?                           | MCP `get_screen_image` + đối chiếu từng khối                 |
| Đúng design nhưng “cảm giác” kém?            | UI/UX Pro Max review / polish                                |
| Muốn thử hướng khác trên Figma/Stitch trước? | `generate_variants` / `edit_screen` rồi mới code             |
| Có đổi hành vi / flow?                       | Mở lại OpenSpec change (hoặc change mới), đừng chỉ “sửa CSS” |

---

## 6. Mapping Stitch → Averie (gợi ý)

| Stitch                             | Averie                                          |
| ---------------------------------- | ----------------------------------------------- |
| Screen “Login”                     | `src/app/(auth)/login/page.tsx` + `loginAction` |
| Screen list / dashboard (đọc data) | page + `@services` → `GET /api/...`             |
| Form create/edit                   | page/modal + Server Action + Zod                |
| Buttons / inputs lặp               | `@components/common`                            |
| Copy / label                       | `messages/vi                                    | en/*.json` + next-intl |
| HTML Stitch                        | Tham chiếu only → React + Tailwind              |

---

## 7. Pitfall thường gặp

1. **Implement thẳng từ screenshot, bỏ OpenSpec** → khó review scope, dễ lệch rule backend.
2. **Dán HTML Stitch nguyên xi** → phá design system và i18n. Hãy port.
3. **Sửa UI bằng cách invent API POST** → sai convention Averie.
4. **Quên AUTH_SECRET / MONGODB_URI** khi demo màn thật.
5. **Iterate UI không @-mention file** → agent sửa nhầm chỗ.
6. **Stitch MCP chưa auth** → chạy `mcp_auth` cho server `user-stitch` rồi thử lại.

---

## 8. Mini cheat-sheet prompt

**Đọc Stitch**

```text
Stitch projectId=10694160950357827758 — đọc toàn bộ screen (image+code), tóm tắt UI.
```

**Spec + yêu cầu thêm**

```text
/opsx-propose … + ghi yêu cầu: Auth.js, GET/API, Server Actions, i18n, AppShell 1280.
```

**Code**

```text
@openspec/changes/<name>/tasks.md — Superpowers TDD, port Stitch → React/Tailwind Averie.
```

**Chưa ưng UI**

```text
UI/UX Pro Max review @path/to/component — polish spacing/contrast/CTA; giữ token hiện tại.
```

**Đổi design trên Stitch rồi sync**

```text
edit_screen / generate_variants → get_screen_image → cập nhật React tương ứng.
```
