---
sidebar_position: 3
title: "Bắt đầu nhanh"
description: "Bắt đầu với @powerduck/conf-patch: sửa chuỗi JSON/YAML bằng lớp lõi tương thích trình duyệt, rồi sửa tệp trong Node.js hoặc Electron."
---

# Bắt đầu nhanh

Hướng dẫn này đi qua hai lớp: **lớp lõi** chỉ xử lý chuỗi và chạy trong mọi môi trường, sau đó là **lớp tệp** làm việc với tệp thực trong Node.js hoặc Electron.

Điều kiện tiên quyết: cài đặt gói trước. [Cài đặt](/docs/vi-VN/conf-patch/installation/)

## 1. Lớp lõi — sửa chuỗi trong trình duyệt

Nhập từ `@powerduck/conf-patch/core`. Không truy cập hệ thống tệp; nội dung mới được trả về dưới dạng chuỗi để bạn lưu ở localStorage, IndexedDB, hằng chuỗi hoặc nơi khác.

```typescript
import {
  patchContent,
  setContentValue,
  deleteContentValue,
} from "@powerduck/conf-patch/core";

// --- JSON: apply multiple RFC 6902 operations ---
const json = JSON.stringify({ name: "my-app", version: "1.0.0" }, null, 2);

const updatedJson = patchContent(
  json,
  [
    { op: "add", path: ["description"], value: "My awesome application" },
    { op: "replace", path: ["version"], value: "1.1.0" },
  ],
  "json",
);

console.log(updatedJson);
// {
//   "name": "my-app",
//   "version": "1.1.0",
//   "description": "My awesome application"
// }

// Store it however you like — no fs required.
localStorage.setItem("config", updatedJson);
```

### Cách tương tự với YAML

```typescript
import { setContentValue, deleteContentValue } from "@powerduck/conf-patch/core";

// Set a nested value in YAML (the "server" parent already exists).
const yaml = "name: my-app\nserver:\n  host: localhost\n";

const updatedYaml = setContentValue(yaml, ["server", "port"], 8080, "yaml");
console.log(updatedYaml);
// name: my-app
// server:
//   host: localhost
//   port: 8080

// Delete a value.
const cleaned = deleteContentValue(updatedYaml, ["server", "host"], "yaml");
```

:::note
`setContentValue` dùng thao tác `add` để **thêm hoặc thay thế** thuộc tính đối tượng. `deleteContentValue` dùng `remove`. Xem [`patchContent`](/docs/vi-VN/conf-patch/api-reference/#patchcontent) để biết đầy đủ các thao tác.
:::

## 2. Lớp tệp — sửa tệp trên ổ đĩa

Nhập từ điểm vào chính. Các hàm này là `async`, đọc và ghi tệp thực, đồng thời sử dụng ghi nguyên tử có khóa.

```typescript
import { setConfigValue, readConfigFile, patchConfigFile } from "@powerduck/conf-patch";

// Set a nested value in a YAML file (atomic, lock-guarded).
await setConfigValue("config.yaml", ["database", "port"], 5432);

// Read the file back.
const content = await readConfigFile("config.yaml");
console.log(content);

// Apply several operations to a JSON file in one locked transaction.
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

Định dạng được tự động nhận diện qua phần mở rộng (`.json`, `.jsonc`, `.yaml`, `.yml`). Truyền rõ `format` nếu phần mở rộng không xác định được định dạng.

## 3. Xử lý lỗi

Cả hai lớp đều phát sinh lỗi khi đầu vào không hợp lệ. Trong chế độ `strict` mặc định, thao tác vá thất bại cũng phát sinh lỗi.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

try {
  // "remove" requires the path to exist.
  patchContent('{"name": "app"}', [{ op: "remove", path: ["missing"] }], "json");
} catch (error) {
  // Error: [confedit] Cannot remove a value that does not exist at path: ["missing"]
  console.error(error instanceof Error ? error.message : error);
}
```

Đặt `strict: false` để bỏ qua thao tác thất bại thay vì phát sinh lỗi:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Ví dụ Electron IPC

Một cách triển khai phổ biến là chạy lớp tệp trong tiến trình chính của Electron và cung cấp quyền gọi qua IPC:

```javascript
// Electron main process (CommonJS)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

ipcMain.handle("config:set", async (_event, { filePath, path, value }) => {
  try {
    await setConfigValue(filePath, path, value);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("config:read", async (_event, { filePath }) => {
  try {
    const data = await readConfigFile(filePath);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

## Các bước tiếp theo

- [Tham chiếu API](/docs/vi-VN/conf-patch/api-reference/) — Tất cả hàm, kiểu và tùy chọn.
- [Ví dụ](/docs/vi-VN/conf-patch/examples/) — Vá JSON, YAML, JSONC có chú thích, xác thực OpenAPI và khóa tệp.
