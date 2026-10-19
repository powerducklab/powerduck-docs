---
sidebar_position: 5
title: "Ví dụ"
description: "Các ví dụ thực tế có thể chạy, dùng API công khai. Chọn lớp phù hợp: @powerduck/conf-patch/core an toàn cho trình duyệt để xử lý chuỗi, hoặc @powerduck/conf-patch để xử lý tệp."
---

# Ví dụ

Các ví dụ thực tế có thể chạy, dùng API công khai. Chọn lớp phù hợp: `@powerduck/conf-patch/core` an toàn cho trình duyệt để xử lý chuỗi, hoặc `@powerduck/conf-patch` để xử lý tệp.

---

## 1. Thao tác JSON Patch (lớp lõi)

Áp dụng nhiều thao tác RFC 6902 cho chuỗi JSON. `add` chèn phần tử mảng hoặc thêm/thay thế thuộc tính đối tượng; `replace` và `remove` yêu cầu đích đã tồn tại.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

const source = JSON.stringify(
  {
    name: "my-app",
    version: "1.0.0",
    tags: ["web"],
  },
  null,
  2,
);

const patched = patchContent(
  source,
  [
    { op: "add", path: ["description"], value: "Demos patchContent" },
    { op: "replace", path: ["version"], value: "1.1.0" },
    { op: "add", path: ["tags", 1], value: "api" }, // inserts, does not overwrite
  ],
  "json",
);

console.log(patched);
```

Kết quả:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Đặt `strict: false` để bỏ qua thao tác thất bại thay vì ném ngoại lệ:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Đặt giá trị YAML lồng nhau (lớp tệp)

Đặt `database.port` trong tệp YAML. Đường dẫn cha (`database`) phải tồn tại; việc ghi là nguyên tử và được bảo vệ bằng khóa.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Để tạo đối tượng lồng nhau chưa tồn tại, hãy tạo đối tượng cha trước:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Thao tác mảng trong YAML

Dùng đoạn đường dẫn dạng số cho chỉ mục chuỗi. `add` **chèn**, `replace` thay thế tại chỗ, `remove` xóa:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC giữ nguyên chú thích

Chỉnh sửa JSONC dựa trên phạm vi văn bản, nên chú thích và dấu phẩy cuối quanh các dòng được sửa vẫn được giữ lại.

```typescript
import { patchContent, deleteContentValue } from "@powerduck/conf-patch/core";

const jsonc = `{
  // Application name
  "name": "my-app",
  // Legacy feature flag
  "legacyFeature": true,
  "version": "1.0.0",
}`;

// Replace a value — the surrounding comments stay put.
const updated = patchContent(
  jsonc,
  [{ op: "replace", path: ["version"], value: "1.2.0" }],
  "jsonc",
);

// Delete a key — its own line is removed, other comments remain.
const cleaned = deleteContentValue(updated, ["legacyFeature"], "jsonc");

console.log(cleaned);
```

Kết quả với chú thích được giữ lại:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Kiểm tra tài liệu OpenAPI

Kiểm tra nội dung đặc tả thô, rồi kiểm tra từ tệp. Chế độ tệp yêu cầu `allowedRootDirectory` để giới hạn đường dẫn được phép.

```typescript
import {
  validateOpenAPISpec,
  validateOpenAPIFile,
  OpenApiValidationError,
} from "@powerduck/conf-patch";

// (a) Validate raw content (JSON or YAML)
const specContent = `openapi: 3.0.0
info:
  title: Demo API
  version: 1.0.0
paths: {}`;

try {
  const doc = await validateOpenAPISpec(specContent);
  console.log("Valid. openapi =", doc.openapi);
} catch (error) {
  if (error instanceof OpenApiValidationError) {
    console.error(`Validation failed [${error.code}]:`, error.message);
  } else {
    throw error;
  }
}

// (b) Validate from a file (requires allowedRootDirectory)
const fileDoc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
  // Optional hardening:
  // timeoutMs: 10000,
  // maxInputBytes: 2 * 1024 * 1024,
});
```

Hủy bằng `AbortSignal`:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await validateOpenAPISpec(specContent, { signal: controller.signal }).catch(
  (error) => {
    // Throws OpenApiValidationError with code "OPERATION_ABORTED" on abort.
    console.error(error.code);
  },
);
```

---

## 5. Truy cập đồng thời an toàn bằng khóa tệp

Khi nhiều tiến trình, hoặc nhiều thao tác đồng thời trong một tiến trình, truy cập cùng tệp, `patchConfigFile` đã tuần tự hóa truy cập. Dùng trực tiếp `withFileLock` để gom nhiều thao tác tệp vào cùng một vùng tới hạn.

```typescript
import { readConfigFile, writeConfigFile, withFileLock } from "@powerduck/conf-patch";

async function bumpCounter(file: string): Promise<number> {
  return withFileLock(
    file,
    async () => {
      // Read-inside-lock prevents a lost read between workers.
      const raw = await readConfigFile(file);
      const data = JSON.parse(raw);
      data.count = (data.count ?? 0) + 1;
      await writeConfigFile(file, JSON.stringify(data, null, 2), { lock: false });
      return data.count;
    },
    {
      timeoutMs: 5000, // give up after 5s
      retryDelayMs: 25, // initial delay; grows by 1.5x up to 1s
      allowStaleRecovery: false,
    },
  );
}
```

Lưu ý:

- `withFileLock` xếp hàng thao tác trên **cùng một tệp** trong một tiến trình và dùng tệp `.confedit.lock` độc quyền giữa các tiến trình.
- Khi giải phóng khóa, mã sở hữu được kiểm tra trước khi xóa, nên thao tác giải phóng cũ không thể xóa khóa mới thay thế khóa hết hạn.
- Khi tắt, chẳng hạn trong Electron `will-quit`, hãy giải phóng các khóa còn lại:

```typescript
import { app } from "electron";
import { releaseAllLocalLocks } from "@powerduck/conf-patch";

let locksReleased = false;
app.on("will-quit", (event) => {
  if (locksReleased) return;
  event.preventDefault();
  void releaseAllLocalLocks()
    .catch((error) => console.error("Lock cleanup failed", error))
    .finally(() => {
      locksReleased = true;
      app.quit();
    });
});
```

---

## 6. Ví dụ tổng hợp: sửa đặc tả OpenAPI trên đĩa

Quy trình minh họa từ chính thư viện: đọc đặc tả, đặt giá trị, thêm phản hồi, rồi kiểm tra.

```typescript
import {
  readConfigFile,
  setConfigValue,
  patchConfigFile,
  validateOpenAPIFile,
} from "@powerduck/conf-patch";

const specPath = "./openapi.yaml";

// Read the raw text.
await readConfigFile(specPath);

// Set info.version and the first server URL.
await setConfigValue(specPath, ["info", "version"], "1.1.0");
await setConfigValue(specPath, ["servers", 0, "url"], "https://api.prod.example.com/v1");

// Add a 404 response to GET /pets.
await patchConfigFile(specPath, [
  {
    op: "add",
    path: ["paths", "/pets", "get", "responses", "404"],
    value: { description: "Resource not found" },
  },
]);

// Confirm the edited document still validates.
await validateOpenAPIFile(specPath, { allowedRootDirectory: "." });
```

---

## Các bước tiếp theo

- [Tham chiếu API](../api-reference/) — chữ ký đầy đủ và giá trị mặc định của mọi tùy chọn.
- [Bắt đầu nhanh](../quickstart/) — lần chạy đầu tiên từ đầu đến cuối.
