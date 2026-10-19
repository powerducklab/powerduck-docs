---
sidebar_position: 4
title: "Tham chiếu API"
description: "Tham chiếu đầy đủ cho @powerduck/conf-patch, gồm chữ ký và giá trị mặc định của từng thành phần xuất."
---

# Tham chiếu API

Tham chiếu đầy đủ cho `@powerduck/conf-patch`, gồm chữ ký và giá trị mặc định của từng thành phần xuất.

Có hai điểm nhập:

- **`@powerduck/conf-patch`** — toàn bộ chức năng bên dưới: lớp lõi, lớp tệp, xác thực OpenAPI và tiện ích.
- **`@powerduck/conf-patch/core`** — chỉ phần tương thích trình duyệt: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, các hàm kiểm tra điều kiện và kiểu `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Lớp lõi (tương thích trình duyệt)

### `patchContent`

Áp dụng mảng thao tác vá RFC 6902 cho chuỗi cấu hình. Đây là hàm thuần, không truy cập hệ thống tệp.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `content` | `string` | Nội dung cấu hình thô, phải hợp lệ theo `format` đã chọn. |
| `ops` | `JsonPatchOp[]` | Các thao tác áp dụng theo thứ tự. Mảng rỗng trả về `content` không đổi. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | Với `true` (mặc định), thao tác thất bại phát sinh ngoại lệ. Với `false`, thao tác bị bỏ qua và được báo qua `console.warn`. |

**Trả về:** nội dung cấu hình đã sửa (`string`).

**Ngoại lệ:** `TypeError` nếu `content` không phải chuỗi hoặc `ops` không hợp lệ; lỗi mô tả thao tác thất bại khi `strict` là `true`.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

Đặt hoặc tạo một giá trị. Bên trong gọi `patchContent` với một thao tác `add`. Theo RFC 6902, `add` thay thế thuộc tính đối tượng hiện có hoặc chèn tại chỉ số mảng.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `content` | `string` | Nội dung cấu hình thô. |
| `path` | `readonly (string \| number)[]` | Đường dẫn theo đoạn, ví dụ `["server", "port"]`. Không được rỗng. |
| `value` | `unknown` | Giá trị cần ghi. |
| `format` | `ConfigFormat` | Định dạng cấu hình. |

**Trả về:** nội dung đã cập nhật (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Xóa khóa hoặc phần tử mảng. Bên trong gọi `patchContent` với một thao tác `remove`. Đường dẫn phải tồn tại.

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## Lớp tệp (chỉ Node.js / Electron)

### `readConfigFile`

Đọc văn bản UTF-8 từ đường dẫn cục bộ hoặc URL `file://`.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `filePath` | `string` | Đường dẫn tuyệt đối, tương đối hoặc URL `file://`. Không được rỗng. |

**Trả về:** nội dung UTF-8 thô (`Promise<string>`).

**Ngoại lệ:** khi không đọc được tệp, phát sinh lỗi bao gồm nguyên nhân từ hệ thống tệp.

---

### `writeConfigFile`

Ghi nội dung **nguyên tử** qua tệp tạm rồi đổi tên, mặc định dùng **khóa tệp** độc quyền. Các thư mục cha được tạo trước khi lấy khóa.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `filePath` | `string` | Đường dẫn tệp cấu hình. |
| `content` | `string` | Nội dung cần ghi. Phải là chuỗi. |
| `options` | `WriteConfigOptions` | Xem bên dưới. |

**Ngoại lệ:** `TypeError` với đầu vào không hợp lệ; lỗi ghi của hệ thống tệp được bao bọc trong lỗi trả về.

#### `WriteConfigOptions`

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `lock` | `boolean` | `true` | Bật khóa tệp khi ghi. |
| `lockTimeoutMs` | `number` | Mặc định của `withFileLock` (10 giây) | Thời gian chờ lấy khóa tối đa, tính bằng mili giây. |
| `lockRetryDelayMs` | `number` | Mặc định của `withFileLock` (25 mili giây) | Độ trễ thử lại ban đầu, tính bằng mili giây, trước khi tăng theo cấp số nhân. |
| `lockStaleThresholdMs` | `number` | Mặc định của `withFileLock` | Thời gian khóa đã tồn tại, tính bằng mili giây, sau đó cho phép khôi phục. |
| `allowStaleRecovery` | `boolean` | `false` | Cho phép tự động thu hồi khóa đã cũ. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Giao dịch chính của lớp tệp: đọc trong khóa, áp dụng `patchContent`, rồi ghi lại nguyên tử **chỉ khi nội dung thay đổi**. Nếu bỏ qua `options.format`, định dạng được nhận diện từ phần mở rộng.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `filePath` | `string` | Đường dẫn tệp cấu hình. Không được rỗng. |
| `ops` | `JsonPatchOp[]` | Các thao tác cần áp dụng. Mảng rỗng trả về ngay mà không đọc hay ghi. |
| `options` | `PatchConfigOptions` | Xem bên dưới. |

**Ngoại lệ:** `TypeError` nếu `filePath` rỗng, tùy chọn khóa không hợp lệ hoặc không nhận diện được định dạng và không có `format`; lỗi thao tác khi `strict` là `true`.

#### `PatchConfigOptions`

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `format` | `ConfigFormat` | tự động nhận diện | Định dạng chỉ định rõ, ưu tiên hơn nhận diện theo phần mở rộng. |
| `strict` | `boolean` | `true` | Thao tác thất bại phát sinh ngoại lệ. |
| `lock` | `boolean` | `true` | Bật khóa tệp. |
| `lockTimeoutMs` | `number` | 10 giây | Không âm. Thời gian chờ khóa tối đa. |
| `lockRetryDelayMs` | `number` | 25 mili giây | Số dương. Độ trễ thử lại ban đầu. |
| `lockStaleThresholdMs` | `number` | được tính toán | Số dương. Thời gian tồn tại cần thiết để khôi phục khóa cũ. |
| `allowStaleRecovery` | `boolean` | `false` | Tự động thu hồi khóa cũ. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Thêm hoặc thay thế giá trị lồng nhau trong tệp. Chuyển một thao tác `add` cho `patchConfigFile`.

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

Xóa giá trị lồng nhau hiện có khỏi tệp. Chuyển một thao tác `remove` cho `patchConfigFile`.

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

Chạy hàm gọi lại bất đồng bộ qua hàng đợi trong tiến trình **và** tệp khóa độc quyền (`<file>.confedit.lock`). Khóa dùng mã xác nhận quyền sở hữu. Chỉ khôi phục khóa cũ khi `allowStaleRecovery` là `true` và thời gian tồn tại vượt `staleThresholdMs`. Không kiểm tra PID vì PID có thể được tái sử dụng.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `filePath` | `string` | Tệp cần khóa. |
| `callback` | `() => Promise<T>` | Công việc thực hiện trong khi giữ khóa. |
| `options` | `FileLockOptions` | Xem bên dưới. |

**Trả về:** kết quả của `callback` (`Promise<T>`). Khóa luôn được giải phóng trong khối `finally`, kể cả khi hàm gọi lại phát sinh ngoại lệ.

#### `FileLockOptions`

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Thời gian chờ khóa tối đa, tính bằng mili giây. Phải không âm. |
| `retryDelayMs` | `number` | `25` | Độ trễ ban đầu, tính bằng mili giây. Phải dương. Mỗi lần tăng 1,5 lần, tối đa 1000 mili giây. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Thời gian tồn tại cho phép khôi phục khóa, tính bằng mili giây. Phải dương. |
| `allowStaleRecovery` | `boolean` | `false` | Tự động thu hồi khóa cũ. Mặc định tắt cho tiến trình chính duy nhất của Electron để tránh gián đoạn giao dịch đang chạy. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Xóa mọi tệp khóa thuộc tiến trình hiện tại. Dùng khi ứng dụng tắt, sau khi các giao dịch tệp đang chạy hoàn tất. Để dọn dẹp bất đồng bộ trong Electron, chặn sự kiện thoát đầu tiên rồi tiếp tục thoát sau khi dọn dẹp, như trong ví dụ. Lỗi riêng lẻ của từng khóa được bỏ qua.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## Xác thực OpenAPI

### `validateOpenAPISpec`

Xác thực nội dung OpenAPI/Swagger thô ở dạng JSON hoặc YAML. Mặc định coi đầu vào là **nội dung**; chỉ hiểu là đường dẫn khi `inputKind: "file"`. Việc xác thực được giao cho `@powerduck/openapi-parser`; hàm này bổ sung bảo vệ cho xử lý đầu vào.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `input` | `string` | Nội dung đặc tả thô, hoặc đường dẫn tệp khi `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | Xem bên dưới. |

**Trả về:** tài liệu đã xác thực khi thành công (`Promise<AnyOpenAPIDocument>`).

**Ngoại lệ:** `TypeError` nếu đầu vào rỗng hoặc không phải chuỗi; [`OpenApiValidationError`](#openapivalidationerror) nếu tùy chọn không hợp lệ hoặc xác thực thất bại.

---

### `validateOpenAPIFile`

Hàm tiện ích gọi `validateOpenAPISpec` với `inputKind: "file"` và `baseFilePath` là đường dẫn đã cho. Yêu cầu `allowedRootDirectory`.

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | Cách diễn giải `input`. |
| `baseFilePath` | `string` | — | Đường dẫn cơ sở cho ngữ cảnh phân giải tham chiếu. |
| `allowedRootDirectory` | `string` | — | Thư mục gốc của tệp đầu vào. **Bắt buộc** khi `inputKind` là `"file"`. |
| `timeoutMs` | `number` | `15000` | Thời hạn thao tác, tính bằng mili giây. |
| `maxInputBytes` | `number` | `5242880` (5 MB) | Kích thước đầu vào thô tối đa, tính bằng byte. |
| `maxDocumentNodes` | `number` | `100000` | Số nút tối đa trong tài liệu đã phân tích, để chống DoS. |
| `maxDocumentDepth` | `number` | `100` | Độ sâu lồng nhau tối đa, để chống DoS. |
| `maxValidationErrors` | `number` | `50` | Số lỗi tối đa trong thông báo. |
| `maxErrorMessageLength` | `number` | `1000` | Số ký tự tối đa cho mỗi lỗi xác thực. |
| `signal` | `AbortSignal` | — | Tín hiệu hủy tùy chọn. |

---

### `OpenApiValidationError`

Lỗi có cấu trúc khi xác thực thất bại. Hãy chuyển đổi lỗi tại ranh giới ứng dụng trước khi trả về máy khách; thông báo và nguyên nhân có thể chứa đường dẫn cục bộ hoặc chi tiết tài liệu.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Thuộc tính | Kiểu | Mô tả |
|---|---|---|
| `code` | `string` | Mã lỗi để chương trình xử lý; xem bảng bên dưới. |
| `message` | `string` | Chi tiết dễ đọc cho người dùng. |
| `cause` | `unknown` | Lỗi gốc tùy chọn. |

#### Mã lỗi

| Mã | Ý nghĩa |
|---|---|
| `INVALID_OPTION` | Giá trị tùy chọn được cung cấp không hợp lệ. |
| `INPUT_TOO_LARGE` | Nội dung thô vượt `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | Tệp đầu vào vượt giới hạn kích thước. |
| `FILE_INPUT_FORBIDDEN` | Dùng đầu vào tệp mà không có `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | Đường dẫn sau phân giải nằm ngoài `allowedRootDirectory`. |
| `PARSE_ERROR` | Không phân tích được nội dung JSON/YAML. |
| `INVALID_DOCUMENT_SHAPE` | Tài liệu không phải đối tượng JSON. |
| `UNSUPPORTED_VERSION` | Tài liệu không khai báo phiên bản OpenAPI/Swagger được hỗ trợ; chỉ chấp nhận phiên bản chính `2` và `3`. |
| `DOCUMENT_TOO_DEEP` | Độ sâu vượt `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | Số nút vượt `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | Đặc tả không vượt qua xác thực OpenAPI. |
| `OPERATION_TIMEOUT` | Thao tác vượt `timeoutMs`. |
| `OPERATION_ABORTED` | Thao tác bị hủy qua `signal`. |
| `UNKNOWN_ERROR` | Lỗi ngoài dự kiến. |

---

## Tiện ích

### `detectFormat`

Nhận diện [`ConfigFormat`](#configformat) từ phần mở rộng của đường dẫn hoặc URL `file://`.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Phần mở rộng | Kết quả |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| mọi phần mở rộng khác | phát sinh lỗi |

---

### `normalizeFilePath`

Chuyển đường dẫn cục bộ hoặc URL `file:` thành đường dẫn tuyệt đối theo hệ điều hành. Giữ lại khoảng trắng hợp lệ và tên tệp Unicode.

```typescript
function normalizeFilePath(filePath: string): string;
```

URL `file:` được giải mã bằng `fileURLToPath`; đường dẫn tuyệt đối được trả nguyên trạng; đường dẫn tương đối được phân giải theo `process.cwd()`.

---

## Hàm kiểm tra điều kiện

Được xuất lại cho cách dùng nâng cao và mô-đun nội bộ. Mã ứng dụng hiếm khi cần gọi trực tiếp.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Phát sinh `TypeError` nếu `value` không phải chuỗi không rỗng.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Phát sinh ngoại lệ nếu `path` không phải mảng không rỗng gồm các đoạn là chuỗi không rỗng hoặc số nguyên an toàn không âm.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Kiểm tra từng thao tác: `op` phải là `"add" | "replace" | "remove"`, `path` phải vượt qua `assertPatchPath`, và `add`/`replace` phải có thuộc tính riêng `value`.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Phát sinh ngoại lệ nếu `format` không phải `"json"`, `"jsonc"` hoặc `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Trả về `error.message` với thực thể `Error`, nếu không thì trả về `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Tạo `Error` và gắn thuộc tính `cause` bằng `Object.defineProperty`, có phương án thay thế cho môi trường chạy cũ.

---

## Kiểu

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
Chỉ hỗ trợ `"add"`, `"replace"` và `"remove"`. `"move"`, `"copy"` và `"test"` được chủ động loại trừ.
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

Kiểu hợp của các cấu trúc tài liệu OpenAPI/Swagger được hỗ trợ mà xác thực trả về:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` là kiểu cấu trúc cho phép linh hoạt:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Tóm tắt thành phần xuất

| Ký hiệu | Điểm nhập chính | Đường dẫn con lõi | Loại |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | hàm |
| `setContentValue` | ✓ | ✓ | hàm |
| `deleteContentValue` | ✓ | ✓ | hàm |
| `PatchContentOptions` | ✓ | ✓ | kiểu |
| `assertNonEmptyString` | ✓ | ✓ | hàm |
| `assertPatchPath` | ✓ | ✓ | hàm |
| `assertPatchOperations` | ✓ | ✓ | hàm |
| `assertConfigFormat` | ✓ | ✓ | hàm |
| `getErrorMessage` | ✓ | ✓ | hàm |
| `createError` | ✓ | ✓ | hàm |
| `ConfigFormat` | ✓ | ✓ | kiểu |
| `JsonPatchOp` | ✓ | ✓ | kiểu |
| `JsonPathSegment` | ✓ | ✓ | kiểu |
| `readConfigFile` | ✓ | — | hàm |
| `writeConfigFile` | ✓ | — | hàm |
| `WriteConfigOptions` | ✓ | — | kiểu |
| `patchConfigFile` | ✓ | — | hàm |
| `setConfigValue` | ✓ | — | hàm |
| `deleteConfigValue` | ✓ | — | hàm |
| `withFileLock` | ✓ | — | hàm |
| `releaseAllLocalLocks` | ✓ | — | hàm |
| `PatchConfigOptions` | ✓ | — | kiểu |
| `FileLockOptions` | ✓ | — | kiểu |
| `detectFormat` | ✓ | — | hàm |
| `normalizeFilePath` | ✓ | — | hàm |
| `validateOpenAPISpec` | ✓ | — | hàm |
| `validateOpenAPIFile` | ✓ | — | hàm |
| `OpenApiValidationError` | ✓ | — | lớp |
| `ValidateOpenApiOptions` | ✓ | — | kiểu |
| `OpenApiInputKind` | ✓ | — | kiểu |
| `AnyOpenAPIDocument` | ✓ | — | kiểu |