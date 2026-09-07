# Antigravity Global AI Workflow

Hướng dẫn sử dụng và quản lý toàn bộ hệ sinh thái **OpenSpec · Superspec · Superpowers · Ponytail · UI/UX Pro Max** trên **Antigravity IDE & Antigravity CLI (`agy`)**.

---

## 1. Cơ chế hoạt động: Antigravity vs Cursor

| Thành phần           | Cursor                                        | Antigravity (IDE & CLI)                                                                    |
| :------------------- | :-------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **Global Skills**    | `~/.cursor/skills/`                           | `~/.gemini/config/skills/`, `~/.agents/skills/`, `~/.gemini/config/skills.json`            |
| **Workspace Skills** | `.cursor/skills/`                             | `.agents/skills/<name>/SKILL.md`                                                           |
| **Slash Commands**   | `.cursor/commands/*.md`                       | **Tự động kích hoạt trực tiếp từ mọi Skill** có `name: <name>` trong `SKILL.md` khi gõ `/` |
| **Global Rules**     | `~/.cursor/rules/*.mdc` (`alwaysApply: true`) | `~/.gemini/GEMINI.md` (áp dụng toàn máy cho mọi workspace)                                 |
| **Project Rules**    | `.cursor/rules/*.mdc`                         | `AGENTS.md`, `GEMINI.md`, `.agents/rules/*.md`                                             |
| **Subagents**        | Plugin / Claude subagents                     | Native Antigravity Subagents (`invoke_subagent`, `self`, `research`)                       |

---

## 2. Toàn bộ 51 Slash Commands & Skills đã sẵn sàng

Khi gõ `/` trong ô chat của **Antigravity IDE** hoặc **Antigravity CLI**, hệ thống sẽ tự động gợi ý và tự động thực thi các skill sau:

### A. OpenSpec & Superspec (12 slash commands chính + 12 alias)

_Quản lý vòng đời thay đổi phần mềm bằng đặc tả kỹ thuật (Spec-driven development)._

- `/opsx-propose <tên-change>` — Đề xuất tính năng mới, tạo toàn bộ artifacts (spec, design, tasks) trong 1 bước.
- `/opsx-apply <tên-change>` — Thực thi tasks từ change spec (kết hợp Superpowers TDD + Ponytail YAGNI).
- `/opsx-verify <tên-change>` — Kiểm thử và xác minh tính đúng đắn trước khi archive.
- `/opsx-archive <tên-change>` — Lưu trữ change đã hoàn thành và đồng bộ spec vào main specs.
- `/opsx-explore` — Chế độ tư duy / Brainstorm giải pháp và làm rõ yêu cầu trước khi tạo change.
- `/opsx-new <tên-change>` — Khởi tạo change theo từng bước tương tác.
- `/opsx-continue` — Tạo artifact tiếp theo trong tiến trình.
- `/opsx-ff` — Fast-forward toàn bộ artifacts mà không cần dừng lại từng bước.
- `/opsx-sync` — Đồng bộ delta specs vào main specs mà chưa archive.
- `/opsx-update` — Cập nhật, chỉnh sửa artifacts khi yêu cầu thay đổi.
- `/opsx-onboard` — Hướng dẫn học OpenSpec thực chiến qua ví dụ mẫu.
- `/opsx-bulk-archive` — Lưu trữ hàng loạt changes đã xong.
  _(Ngoài ra vẫn hỗ trợ các skill gốc dạng `/openspec-*`)_

### B. Superpowers (20 skills)

_Quy chuẩn kỹ thuật phần mềm cao cấp, TDD, gỡ lỗi có hệ thống và điều phối subagents._

- `/brainstorming` — Khảo sát yêu cầu, làm rõ ý tưởng và thiết kế giải pháp trước khi code.
- `/writing-plans` — Lập kế hoạch thực thi chi tiết từng bước với thiết kế test-first.
- `/executing-plans` — Chạy kế hoạch theo từng batch nhỏ kèm kiểm thử tự động.
- `/test-driven-development` — Chu trình TDD nghiêm ngặt (RED → GREEN → REFACTOR).
- `/systematic-debugging` — Quy trình 4 pha gỡ lỗi: Điều tra → Giả thuyết → Kiểm chứng → Sửa tận gốc.
- `/subagent-driven-development` — Phân chia công việc cho các Antigravity subagents chạy song song.
- `/requesting-code-review` / `/receiving-code-review` — Review code tự động trước khi merge.
- `/verification-before-completion` — Kiểm chứng độc lập trước khi hoàn thành công việc.
- `/finishing-a-development-branch` — Hướng dẫn đóng nhánh, squash và tạo PR.
- `/using-git-worktrees` — Tận dụng Git worktree để cô lập context khi cần branch song song.
- `/using-superpowers` — Hướng dẫn tra cứu và kích hoạt các năng lực của Superpowers.
- `/writing-skills` — Hướng dẫn tạo thêm các Antigravity skills mới.
- `/dispatching-parallel-agents` — Điều phối nhiều agent chạy ngầm.

### C. Ponytail (6 skills + Always-on Senior Dev Rule)

_Triết lý Lazy Senior Developer: Đoán trước rủi ro, viết ít code nhất có thể, loại bỏ over-engineering._

- **Rule Always-on**: Đã được cài vào `~/.gemini/GEMINI.md` (toàn máy) và `.agents/rules/ponytail.md` (project). Agent luôn tuân thủ 7 nấc thang YAGNI trước khi viết bất kỳ dòng code nào.
- `/ponytail` — Đánh giá tổng quan về tính đơn giản và khả năng tái sử dụng.
- `/ponytail-review` — Review chuyên sâu diff chỉ để **xóa code thừa**, code over-engineered, thay thế bằng standard library / native platform.
- `/ponytail-audit` — Quét tìm nợ kỹ thuật và phình to kiến trúc.
- `/ponytail-debt` — Liệt kê và thanh lý technical debt.
- `/ponytail-gain` — Tối ưu hóa hiệu năng và độ gọn nhẹ của code.
- `/ponytail-help` — Hướng dẫn chi tiết triết lý Ponytail.

### D. UI/UX Pro Max (Design Intelligence)

_Hệ thống tri thức thiết kế giao diện cho web và mobile: 79 styles, 192 palettes, 74 font pairings, 119 UX guidelines._

- `/ui-ux-pro-max` — Hướng dẫn thiết kế giao diện, phối màu, typography, responsive và accessibility.
- `/design` & `/design-system` — Tạo bộ Design System đồng nhất trước khi bắt đầu code UI.
- `/ui-styling` — Hướng dẫn cấu trúc CSS/Tailwind tối ưu.
- `/brand` & `/banner-design` & `/slides` — Tạo hình ảnh thương hiệu, banners và slide thuyết trình.
- **Python CLI Tra Cứu**:
    ```powershell
    python .agents/skills/ui-ux-pro-max/scripts/search.py "dashboard" --design-system
    python .agents/skills/ui-ux-pro-max/scripts/search.py "landing page saas" --design-system
    ```

---

## 3. Quy trình làm việc hàng ngày (Cheat Sheet)

```text
1. Bắt đầu tính năng / chỉnh sửa lớn:
   Gõ: /opsx-propose ten-tinh-nang

2. Nếu có phần giao diện UI/UX:
   Gõ: /ui-ux-pro-max (hoặc tra cứu design system với search.py)

3. Duyệt xong spec, chuyển sang code:
   Gõ: /opsx-apply ten-tinh-nang
   (Antigravity tự động áp dụng TDD của Superpowers và nguyên tắc YAGNI của Ponytail)

4. Code xong, kiểm tra độ gọn gàng và xóa code thừa:
   Gõ: /ponytail-review

5. Xác minh chất lượng:
   Gõ: /opsx-verify ten-tinh-nang

6. Hoàn tất và lưu trữ:
   Gõ: /opsx-archive ten-tinh-nang
```

Đối với các task nhỏ (bug fix nhanh, sửa CSS, refactor nhỏ):

- Chat trực tiếp với Antigravity. Rule Ponytail luôn chạy ngầm để giữ diff ngắn nhất và chuẩn nhất.

---

## 4. Script đồng bộ & cập nhật định kỳ

Mỗi khi bạn muốn cập nhật Ponytail, Superpowers, UI/UX Pro Max hoặc OpenSpec lên bản mới nhất cho toàn máy và workspace, chỉ cần chạy 1 lệnh:

```powershell
powershell -ExecutionPolicy Bypass -File "f:\Averie\scripts\sync-antigravity-global.ps1" -UpdateCache
```

Script này tự động:

1. Cập nhật `ui-ux-pro-max` qua `uipro`.
2. Cập nhật Git cache của `ponytail` và sync rule + skills.
3. Đồng bộ toàn bộ skills của `superpowers`.
4. Sinh toàn bộ slash commands `/opsx-*` và `openspec-*`.
5. Đăng ký tự động vào Antigravity global `~/.gemini/config/skills.json` và `~/.gemini/GEMINI.md`.
6. Cập nhật trực tiếp vào thư mục `.agents/skills` và `.agents/rules` của project.

---

## 5. Cấu hình Tự động thực thi Tool & Chống hỏi xác nhận (Auto-Approve / Always-Proceed)

Đã cấu hình tự động phê duyệt mọi lệnh terminal, đọc/ghi file và artifact review trên cả **Antigravity CLI** và **Antigravity IDE**:

### A. Antigravity CLI (`~/.gemini/antigravity-cli/settings.json`)

```json
{
    "toolPermission": "always-proceed",
    "artifactReviewPolicy": "always-proceed",
    "permissions": {
        "allow": ["command(*)", "read_file(*)", "write_file(*)", "edit_file(*)", "manage_task(*)"]
    }
}
```

_Lưu ý khi chạy CLI tự động / headless:_ Bạn có thể truyền thêm cờ `agy --dangerously-skip-permissions`.

### B. Antigravity IDE (`%APPDATA%\Antigravity\User\settings.json`)

```json
{
    "antigravity.agent.autoApprove": true,
    "antigravity.agent.toolPermission": "always-proceed",
    "antigravity.agent.artifactReviewPolicy": "always-proceed",
    "antigravity.agent.allowedCommands": ["*"],
    "antigravity.mcp.autoApprove": true,
    "antigravity.toolPermission": "always-proceed",
    "antigravity.artifactReviewPolicy": "always-proceed"
}
```

_Sau khi cấu hình, bạn không cần phải bấm accept hay trả lời "yes/approve" thủ công mỗi khi agent thực thi lệnh._
