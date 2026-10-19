---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch là thư viện chỉnh sửa cấu hình với kiến trúc hai lớp rõ ràng. Thư viện áp dụng ngữ nghĩa RFC 6902 JSON Patch cho chuỗi JSON, JSONC và YAML, giữ lại chú thích và định dạng, đồng thời cung cấp cơ chế ghi nguyên tử và khóa tệp giữa các tiến trình cho Node.js và Electron."
---

# @powerduck/conf-patch

**@powerduck/conf-patch** là thư viện chỉnh sửa cấu hình với **kiến trúc hai lớp** rõ ràng. Thư viện áp dụng ngữ nghĩa [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) cho chuỗi JSON, JSONC và YAML, giữ lại chú thích và định dạng, đồng thời cung cấp cơ chế ghi nguyên tử và khóa tệp giữa các tiến trình cho Node.js và Electron.

- **Phiên bản:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **Giấy phép:** MIT
- **Yêu cầu Node.js:** `>= 22.12.0`
- **Mã nguồn:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## Vì sao nên dùng conf-patch?

Chỉnh sửa tệp cấu hình bằng mã thường buộc bạn phải chọn giữa việc tuần tự hóa lại toàn bộ tài liệu, có thể làm thay đổi chú thích và định dạng, hoặc tự xử lý văn bản với nguy cơ phát sinh lỗi. conf-patch cung cấp:

- **Chỉnh sửa từng phần và giữ lại chú thích** cho JSON/JSONC bằng `jsonc-parser`, và sửa AST của YAML bằng `yaml`. JSON/JSONC không cần tuần tự hóa lại toàn bộ; YAML tuần tự hóa lại AST đã sửa.
- **Ghi nguyên tử** bằng cách ghi vào tệp tạm rồi đổi tên, tránh để tệp đích chỉ chứa dữ liệu được ghi một phần.
- **Khóa giữa các tiến trình** với mã xác nhận quyền sở hữu, thời gian chờ thử lại tăng theo cấp số nhân và khôi phục khóa đã cũ.
- **API dùng được trong nhiều môi trường:** lớp lõi cũng chạy trong trình duyệt, hàm Edge và ứng dụng sử dụng IndexedDB.

---

## Kiến trúc hai lớp

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Lớp lõi — `@powerduck/conf-patch/core` (tương thích trình duyệt)

Các hàm thuần xử lý **chuỗi**, không phụ thuộc vào `node:fs`, `node:path` hay API riêng của Node.js. Đường dẫn con này có thể được đóng gói vào mã trình duyệt, hàm Edge hoặc service worker.

| Hàm | Công dụng |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | Áp dụng các thao tác RFC 6902 cho chuỗi cấu hình |
| [`setContentValue`](../api-reference/#setcontentvalue) | Đặt hoặc tạo giá trị lồng nhau (dùng `add`) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | Xóa khóa hoặc phần tử mảng (dùng `remove`) |

### Lớp tệp — `@powerduck/conf-patch` (Node.js / Electron)

Các hàm bất đồng bộ đọc và ghi tệp thực tế, bổ sung cơ chế ghi nguyên tử và khóa cho lớp lõi.

| Hàm | Công dụng |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | Đọc văn bản UTF-8 từ đường dẫn tệp hoặc URL `file://` |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | Ghi nội dung nguyên tử, có thể dùng khóa |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | Thực hiện giao dịch đọc–sửa–ghi trong phạm vi khóa tệp |
| [`setConfigValue`](../api-reference/#setconfigvalue) | Đặt giá trị lồng nhau trong tệp |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | Xóa giá trị lồng nhau khỏi tệp |
| [`withFileLock`](../api-reference/#withfilelock) | Thực hiện tác vụ trong phạm vi khóa độc quyền |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | Giải phóng mọi khóa do tiến trình hiện tại sở hữu |

---

## Định dạng được hỗ trợ

| Định dạng | Phần mở rộng | Cách hoạt động |
|---|---|---|
| **JSON** | `.json` | JSON tiêu chuẩn. Chỉnh sửa từng phần bằng `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON có chú thích và dấu phẩy cuối. Giữ lại chú thích. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. Sửa AST và giữ lại chú thích, điểm neo, thụt lề. |

[`detectFormat`](../api-reference/#detectformat) ánh xạ phần mở rộng tệp sang [`ConfigFormat`](../api-reference/#configformat). Phần mở rộng khác gây lỗi, trừ khi bạn chỉ định `format` rõ ràng.

---

## Thao tác RFC 6902

conf-patch triển khai một phần của RFC 6902. Chỉ các thao tác sau được hỗ trợ:

| `op` | Cách hoạt động |
|---|---|
| `"add"` | Chèn tại chỉ số mảng hoặc thêm/thay thế thuộc tính đối tượng |
| `"replace"` | Thay thế giá trị hiện có; đường dẫn phải tồn tại |
| `"remove"` | Xóa khóa hoặc phần tử hiện có; đường dẫn phải tồn tại |

:::caution
`"move"`, `"copy"` và `"test"` **không được hỗ trợ**. Kiểu [`JsonPatchOp`](../api-reference/#jsonpatchop) giới hạn `op` ở `"add" | "replace" | "remove"`.
:::

Lưu ý về cách hoạt động:

- `add` tại chỉ số mảng sẽ **chèn** phần tử (RFC 6902). Để thay thế phần tử hiện có, dùng `replace`.
- `add` yêu cầu đường dẫn cha đã tồn tại. Hãy tạo cha trước con.
- `replace` và `remove` yêu cầu đường dẫn đích tồn tại.
- Với `strict: true` (mặc định), thao tác thất bại sẽ phát sinh ngoại lệ. Với `strict: false`, thao tác bị bỏ qua và một cảnh báo được ghi lại.

---

## Giữ lại chú thích và định dạng

- **JSON/JSONC:** các thay đổi được tính thành phạm vi văn bản dựa trên cây cú pháp, giữ nguyên chú thích xung quanh, dấu phẩy cuối và thụt lề.
- **YAML:** AST của `yaml` được sửa trực tiếp rồi tuần tự hóa lại, giữ lại chú thích, điểm neo, bí danh và thụt lề.

---

## Xác thực OpenAPI

conf-patch xác thực tài liệu OpenAPI/Swagger thông qua giao diện có thêm biện pháp bảo vệ cho `@powerduck/openapi-parser`:

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) xác thực nội dung JSON hoặc YAML thô.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) xác thực tài liệu từ đường dẫn tệp.
- Xử lý đầu vào áp dụng giới hạn kích thước, phạm vi đường dẫn cho phép (`allowedRootDirectory`), kiểm tra độ phức tạp cấu trúc, thời hạn và hủy bằng `AbortSignal`.
- Khi thất bại, thư viện phát sinh [`OpenApiValidationError`](../api-reference/#openapivalidationerror) có `code` để chương trình xử lý.

---

## Bước tiếp theo

- [Cài đặt](../installation/) — thêm conf-patch và tìm hiểu hai điểm nhập.
- [Bắt đầu nhanh](../quickstart/) — sửa chuỗi trong trình duyệt và tệp trên ổ đĩa.
- [Tham chiếu API](../api-reference/) — toàn bộ thành phần xuất, kiểu và tùy chọn.
- [Ví dụ](../examples/) — ví dụ chạy được về JSON, YAML, JSONC, xác thực OpenAPI và khóa tệp.
