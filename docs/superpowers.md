# Superpowers — Hướng dẫn sử dụng

Plugin **Superpowers** bổ sung bộ skill cho quy trình làm việc với agent trong Cursor: brainstorm, lập kế hoạch, TDD, debug, review code và hoàn tất nhánh.

## Cách gọi

Có 3 cách dùng:

1. **Gõ lệnh `/`** trong chat, ví dụ: `/brainstorming`, `/test-driven-development`
2. **Nhắc skill theo tên** trong tin nhắn, ví dụ: “dùng brainstorming rồi viết plan”
3. **Tự động** — agent sẽ chọn skill phù hợp khi nhận diện nhiệm vụ (debug, feature, review, …)

Rules và hooks (ví dụ hook khi bắt đầu session) được áp dụng sẵn, không cần cấu hình thêm.

## Skills chính

| Skill                            | Khi nào dùng                                       |
| -------------------------------- | -------------------------------------------------- |
| `brainstorming`                  | Trước khi làm tính năng / component / đổi hành vi  |
| `writing-plans`                  | Đã có yêu cầu, trước khi đụng code đa bước         |
| `executing-plans`                | Chạy plan đã viết, có checkpoint review            |
| `subagent-driven-development`    | Chạy plan bằng các task độc lập trong cùng session |
| `test-driven-development`        | Viết test trước khi implement                      |
| `systematic-debugging`           | Bug, test fail, hành vi lạ                         |
| `verification-before-completion` | Trước khi nói “xong / đã fix / đã pass”            |
| `requesting-code-review`         | Sau feature lớn hoặc trước khi merge               |
| `receiving-code-review`          | Khi nhận feedback review — kiểm chứng rồi mới sửa  |
| `finishing-a-development-branch` | Code xong — chọn merge / PR / dọn nhánh            |
| `using-git-worktrees`            | Làm feature trên workspace tách biệt               |
| `dispatching-parallel-agents`    | ≥ 2 task độc lập, chạy song song                   |
| `writing-skills`                 | Tạo / sửa / kiểm chứng skill                       |
| `using-superpowers`              | Cách tìm và dùng các skill trên                    |

## Lưu ý nhanh

- Nếu skill có vẻ liên quan, agent nên đọc và làm theo skill đó trước khi hành động.
- Luồng thường gặp: **brainstorm → plan → TDD / implement → verify → review → finish branch**.
- Hướng dẫn trực tiếp từ bạn (ví dụ trong `AGENTS.md` hoặc tin nhắn) ưu tiên hơn workflow mặc định của skill.
