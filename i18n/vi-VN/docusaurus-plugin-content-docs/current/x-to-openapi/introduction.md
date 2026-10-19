---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi là framework TypeScript có thể mở rộng, chuyển lệnh curl và bộ sưu tập Postman (v2.0 / v2.1.0) thành tài liệu OpenAPI 3.2. Framework phù hợp với quy trình CI, tạo tài liệu API và tái dựng giao diện từ các yêu cầu HTTP."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** là framework TypeScript có thể mở rộng, chuyển **lệnh curl** và **bộ sưu tập Postman (v2.0 / v2.1.0)** thành tài liệu **OpenAPI 3.2**. Framework phù hợp với quy trình CI, tạo tài liệu API và tái dựng giao diện từ các yêu cầu HTTP.

Framework dùng [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) để xác thực tài liệu.

- **Phiên bản:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Giấy phép:** MIT
- **Yêu cầu Node.js:** `>= 22.12.0`
- **Đầu ra:** chỉ OpenAPI **3.2.0**
- **Mã nguồn:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Cách hoạt động

```text
lệnh curl → CurlAdapter
bộ sưu tập Postman → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → tài liệu OpenAPI 3.2
             ↓
     validateOpenApi32() → chẩn đoán
```

1. **Bộ chuyển đổi** phân tích nguồn, như văn bản curl hoặc bộ sưu tập Postman, thành danh sách đối tượng [`NormalizedRequest`](./api-reference.md#normalizedrequest).
2. **Bộ dựng** hợp nhất yêu cầu theo phương thức và đường dẫn, suy luận lược đồ, tham số đường dẫn và cấu hình bảo mật, rồi tạo tài liệu OpenAPI 3.2.
3. **Bộ xác thực** kiểm tra đầu ra theo lược đồ OpenAPI qua `@powerduck/openapi-parser` và trả về thông tin chẩn đoán.

---

## Tính năng

- **Hai bộ chuyển đổi tích hợp:** [`CurlAdapter`](./api-reference.md#curladapter) hỗ trợ lệnh đơn, lệnh hàng loạt và đầu ra “Copy all as cURL” của trình duyệt; [`PostmanAdapter`](./api-reference.md#postmanadapter) hỗ trợ v2.0/v2.1.0, thư mục lồng nhau và kế thừa xác thực.
- **Hàm tiện ích không cần cấu hình:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) và [`postmanToOpenApi`](./api-reference.md) đăng ký bộ chuyển đổi và chuyển đổi trong một lần gọi.
- **Đầu ra OpenAPI 3.2:** mỗi tài liệu khai báo `openapi: "3.2.0"`. Xác thực được bật mặc định. Hãy kiểm tra chẩn đoán hoặc bật chế độ nghiêm ngặt để từ chối khi có lỗi.
- **Hợp nhất nhiều yêu cầu:** kết hợp các thao tác cùng phương thức và đường dẫn; hợp nhất theo cấu trúc các tham số truy vấn, tiêu đề, cookie và lược đồ nội dung.
- **Suy luận tham số đường dẫn:** ID số, UUID, ULID và đoạn thập lục phân dài được đổi thành mẫu như `/users/{userId}` khi thay đổi trên ít nhất N mẫu.
- **Suy luận bảo mật:** phát hiện Bearer, Basic và khóa API trong tiêu đề, truy vấn hoặc cookie, rồi tạo `securitySchemes` tương ứng.
- **Nhiều kiểu nội dung:** JSON, XML, form-urlencoded, multipart/form-data gồm văn bản và tệp, GraphQL, văn bản và nhị phân.
- **Giữ lại kịch bản kiểm thử Postman:** `pm.test()` / `pm.expect()` được xuất thành `x-postman-scripts` trên từng thao tác.
- **Chẩn đoán:** mỗi vấn đề có mức độ nghiêm trọng, mã và chi tiết nguồn nếu có; chế độ [`strict`](./api-reference.md#convertoptions) phát sinh ngoại lệ khi gặp lỗi.
- **Có thể mở rộng:** triển khai [`SourceAdapter`](./api-reference.md) để thêm nguồn HAR, HTTPie hoặc Insomnia.

---

## Kiến trúc plugin

Framework dựa trên một giao diện bộ chuyển đổi nhỏ gọn:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Các bộ chuyển đổi được đăng ký vào thực thể [`XToOpenApi`](./api-reference.md#xtoopenapi) qua [`AdapterRegistry`](./api-reference.md#adapterregistry):

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

Các hàm tiện ích không cần cấu hình đã tích hợp hai bộ chuyển đổi, nên thông thường bạn không cần thao tác trực tiếp với bộ đăng ký.

---

## Chọn hàm tiện ích hay lớp

| Trường hợp sử dụng | API |
|---|---|
| Chuyển đổi một hoặc nhiều lệnh curl | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Chuyển đổi bộ sưu tập Postman dạng đối tượng hoặc chuỗi | [`postmanToOpenApi`](./api-reference.md) |
| Tùy chọn riêng, nhiều bộ chuyển đổi, phát hiện `"auto"` hoặc bộ chuyển đổi tùy chỉnh | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Bước tiếp theo

- [Cài đặt](./installation.md) — thêm gói và tìm hiểu hàm tiện ích không cần cấu hình.
- [Bắt đầu nhanh](./quickstart.md) — chuyển đổi lệnh curl, bộ sưu tập Postman và dùng bộ chuyển đổi tùy chỉnh.
- [Tham chiếu API](./api-reference.md) — mọi thành phần xuất, kiểu, tùy chọn, giá trị mặc định và mã chẩn đoán.
- [Ví dụ](./examples.md) — curl, lệnh hàng loạt, bộ sưu tập Postman, bộ chuyển đổi tùy chỉnh và suy luận đường dẫn.
