---
sidebar_position: 4
title: "Kiểm thử kịch bản và báo cáo"
description: "Một yêu cầu kiểm tra một lời gọi. **Kiểm thử kịch bản** kiểm tra cả quy trình: một chuỗi yêu cầu có thứ tự, trong đó giá trị của phản hồi trước được dùng cho yêu cầu sau và các khẳng định được kiểm tra ở từng bước. Kịch bản ghi lại các luồng đầu cuối vốn có thể chỉ nằm trong suy nghĩ của nhà phát triển."
---

# Kiểm thử kịch bản và báo cáo

Một yêu cầu kiểm tra một lời gọi. **Kiểm thử kịch bản** kiểm tra cả quy trình: một chuỗi yêu cầu có thứ tự, trong đó giá trị của phản hồi trước được dùng cho yêu cầu sau và các khẳng định được kiểm tra ở từng bước. Kịch bản ghi lại các luồng đầu cuối vốn có thể chỉ nằm trong suy nghĩ của nhà phát triển.

## Nội dung của kịch bản

- **Các bước có thứ tự**, mỗi bước tham chiếu một thao tác trong đặc tả;
- **Truyền dữ liệu** giữa các bước, chẳng hạn lấy `id` của tài nguyên vừa tạo để dùng trong yêu cầu tiếp theo;
- **Khẳng định kiểm thử** về mã trạng thái, tiêu đề hoặc trường phản hồi;
- Các giá trị người dùng phải cung cấp trước khi chạy.

Thứ tự và khẳng định là thành phần cốt lõi; chúng không bị âm thầm loại bỏ khi thực thi.

## Chạy kịch bản

Kịch bản chạy trong tiến trình chính qua bộ máy `runScenario` của `@powerduck/openapi-cli`:

- `scenario:run` bắt đầu một lần chạy với kịch bản, đặc tả và cấu hình yêu cầu;
- Tiến độ được truyền qua `scenario:event` khi các bước thực thi;
- `scenario:cancel` dừng công việc đang chạy.

Bạn có thể theo dõi từng bước, xác định nơi luồng thất bại và hủy lần chạy kéo dài.

## Cách trợ lý tạo kịch bản

Trợ lý không tự đặt ra định nghĩa kiểm thử trong đặc tả. Kịch bản là quy trình riêng do ứng dụng quản lý và **không bao giờ được lưu trong tài liệu OpenAPI**; không có khóa `x-scenarios` hay các bước nhúng.

Khi bạn yêu cầu vừa thiết kế vừa kiểm thử endpoint, công việc được thực hiện theo thứ tự:

1. Trợ lý trước tiên chỉ đề xuất **bản vá endpoint**;
2. Sau khi bạn áp dụng, trợ lý trả về **thẻ hành động** để chạy luồng:
   - `test.single` cho một endpoint;
   - `scenario.plan` để ứng dụng tìm các luồng đầu cuối;
   - `scenario.run` để chuẩn bị và chạy luồng có thứ tự.

Thẻ `scenario.run` liệt kê từ hai đến tám thao tác theo thứ tự thực thi và nêu mục tiêu, bao gồm trường phản hồi, tiêu đề hoặc trạng thái nào cung cấp dữ liệu cho yêu cầu sau. Mọi tham chiếu được sao chép nguyên văn từ đặc tả hiện tại.

## Báo cáo

Sau khi chạy, bạn có thể xuất **báo cáo HTML độc lập**. Đây là tài liệu tổng hợp, không phải đầu ra CLI thô: báo cáo trình bày luồng, kết quả từng bước, các khẳng định và kết quả chung theo bố cục dễ đọc.

Chọn ngôn ngữ khi xuất. Có sẵn mười ngôn ngữ:

1. English (tiếng Anh)
2. 简体中文 (tiếng Trung giản thể)
3. 繁體中文 (tiếng Trung phồn thể)
4. 日本語 (tiếng Nhật)
5. 한국어 (tiếng Hàn)
6. Français (tiếng Pháp)
7. Deutsch (tiếng Đức)
8. Español (tiếng Tây Ban Nha)
9. Português — Brasil (tiếng Bồ Đào Nha Brasil)
10. العربية (tiếng Ả Rập)

Tùy chọn **khác/tùy chỉnh** cho phép nhập ngôn ngữ khác, nhưng các nhãn có sẵn của báo cáo sẽ dùng tiếng Anh nếu chưa có bản dịch. Việc nhập ngôn ngữ không tự động dịch báo cáo.

Kiểm tra báo cáo đã xuất trước khi chia sẻ:

- **Các trường thông tin xác thực được nhận diện sẽ tự động che đi**. Nội dung tùy ý, URL và trường tùy chỉnh vẫn có thể chứa dữ liệu nhạy cảm; hãy kiểm tra và loại bỏ trước khi chia sẻ;
- **Nội dung lớn được thu gọn** để dễ đọc. Thu gọn một phần không xóa dữ liệu của phần đó khỏi HTML đã xuất.

HTML là tệp độc lập nên có thể đính kèm vào phiếu công việc hoặc lưu cùng bản phát hành.

## Khi nào nên dùng kịch bản

- Xác minh luồng nghiệp vụ nhiều bước như tạo, đọc, cập nhật và xóa;
- Kiểm tra xác thực và việc truyền token giữa các lời gọi;
- Cung cấp bằng chứng về hành vi API cho bản phát hành hoặc bàn giao;
- Kiểm thử hồi quy một luồng sau khi hợp đồng thay đổi.

Xem thêm: [Không gian yêu cầu](./debug.md), [Thiết kế cùng trợ lý](./design.md), [Máy chủ mock](./mock-server.md).
