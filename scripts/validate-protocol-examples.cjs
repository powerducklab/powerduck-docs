const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { validate } = require('@powerduck/openapi-parser');
const { operationEntries } = require('@powerduck/openapi-parser/methods');

(async () => {
  const directory = path.resolve(__dirname, '../static/examples/protocols');
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.yaml'));
  assert.equal(files.length, 8);
  for (const file of files) {
    const result = await validate(fs.readFileSync(path.join(directory, file), 'utf8'));
    assert.equal(result.valid, true, `${file}: ${JSON.stringify(result.errors)}`);
    const document = result.specification;
    assert.ok(document, `${file}: parsed specification missing`);
    const ids = new Set();
    for (const item of Object.values(document.paths)) {
      for (const [, operation] of operationEntries(item)) {
        assert.ok(operation.operationId);
        assert.ok(!ids.has(operation.operationId), `${file}: duplicate operationId`);
        ids.add(operation.operationId);
        assert.ok(!('x-powerduck-request' in operation));
        const protocol = operation['x-protocol'];
        if (protocol && protocol !== 'sse') assert.ok(operation[`x-${protocol}`]);
        if (protocol === 'grpc') for (const proto of operation['x-grpc'].protoPaths) assert.ok(fs.existsSync(path.join(directory, proto)));
      }
    }
    console.log(`PASS ${file}: ${ids.size} operations`);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
