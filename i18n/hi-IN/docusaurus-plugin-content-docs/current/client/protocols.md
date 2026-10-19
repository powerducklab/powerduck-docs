---
sidebar_position: 5
title: "प्रोटोकॉल"
description: "वास्तविक प्रणालियाँ केवल REST तक सीमित नहीं हैं। Powerduck, x-protocol एक्सटेंशन से सामान्य OpenAPI पथ आइटम पर सात प्रोटोकॉल मॉडल करता है। स्ट्रीमिंग और RPC कार्रवाइयाँ HTTP के साथ एक ही विनिर्देश में रहती हैं; उन्हें अलग टूल में रखने या चुपचाप REST में बदलने की ज़रूरत नहीं होती।"
---

# प्रोटोकॉल

वास्तविक प्रणालियाँ केवल REST तक सीमित नहीं हैं। Powerduck, `x-protocol` एक्सटेंशन से सामान्य OpenAPI पथ आइटम पर सात प्रोटोकॉल मॉडल करता है। स्ट्रीमिंग और RPC कार्रवाइयाँ HTTP के साथ एक ही विनिर्देश में रहती हैं; उन्हें अलग टूल में रखने या चुपचाप REST में बदलने की ज़रूरत नहीं होती।

हर गैर-HTTP कार्रवाई भी सामान्य पथ आइटम होती है, जिसमें HTTP विधि और `responses."200".description` होता है:

- `graphql`, `grpc`, `mcp` और `a2a` में **post** इस्तेमाल होता है;
- `sse` और `websocket` में आम तौर पर **get** इस्तेमाल होता है;
- `http` डिफ़ॉल्ट है और इसमें `x-protocol` नहीं दिया जाता।

## SSE

HTTP पर सर्वर से भेजे जाने वाले इवेंट के लिए `x-protocol: "sse"` इस्तेमाल होता है। स्ट्रीम का मीडिया प्रकार `text/event-stream` है और एक इवेंट का पेलोड `schema` के बजाय `itemSchema` से बताया जाता है:

```yaml
paths:
  /events:
    get:
      x-protocol: sse
      responses:
        "200":
          description: Event stream
          content:
            text/event-stream:
              itemSchema:
                type: object
                properties:
                  type:
                    type: string
                  data:
                    type: string
```

## WebSocket

WebSocket में `x-websocket` ब्लॉक के साथ `x-protocol: "websocket"` इस्तेमाल होता है। URL की शुरुआत `ws://` या `wss://` से होनी चाहिए:

```yaml
paths:
  /ws:
    get:
      x-protocol: websocket
      x-websocket:
        url: wss://example.com/ws
        subprotocols: []
        headers: {}
      responses:
        "200":
          description: Operation response
```

`subprotocols` और `headers` वैकल्पिक हैं।

## GraphQL

GraphQL में `/graphql/query/fieldName` जैसे पथ पर post और `x-graphql` इस्तेमाल होते हैं। एंडपॉइंट पूरा HTTP(S) URL होना चाहिए और क्वेरी देना अनिवार्य है:

```yaml
paths:
  /graphql/query/product:
    post:
      x-protocol: graphql
      x-graphql:
        endpoint: https://example.com/graphql
        query: query Product($id: ID!) { product(id: $id) { id name } }
        operationName: Product
        variablesSchema:
          type: object
        variables: {}
      responses:
        "200":
          description: Operation response
```

`operationName`, `variablesSchema` और `variables` वैकल्पिक हैं।

## gRPC

gRPC में `/grpc/pkg.Service/Method` जैसे पथ पर post और `x-grpc` इस्तेमाल होते हैं। सर्वर reflection का समर्थन करे तो `reflection: true` सेट करें; नहीं तो `protoPaths` और ज़रूरत होने पर `includeDirs` दें:

```yaml
paths:
  /grpc/products.ProductService/GetProduct:
    post:
      x-protocol: grpc
      x-grpc:
        address: host:port
        service: products.ProductService
        method: GetProduct
        kind: unary
        reflection: true
      responses:
        "200":
          description: Operation response
```

`kind` का मान `unary`, `server_streaming`, `client_streaming` या `bidi_streaming` में से एक होता है।

## MCP

MCP डिफ़ॉल्ट रूप से Streamable HTTP इस्तेमाल करता है, जिसमें `/mcp/tools/tool-name` जैसे पथ पर post और `x-mcp` ब्लॉक होता है:

```yaml
paths:
  /mcp/tools/create-product:
    post:
      x-protocol: mcp
      x-mcp:
        endpoint: http://127.0.0.1:3000/mcp
        transport: streamable-http
        method: tools/call
        name: create-product
        argumentsSchema:
          type: object
        arguments: {}
      responses:
        "200":
          description: Operation response
```

`method` से MCP कार्रवाई चुनी जाती है: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get` या `prompts/list`। `name`, `uri`, `argumentsSchema` और `arguments` का उपयोग विधि की ज़रूरत के अनुसार होता है।

## संरचना के नियम

- सहायक से बनवाए गए अनुबंधों में `requestBody` या `responses` के मीडिया प्रकारों के लिए `schema` या `$ref` दें; `text/event-stream` में हर इवेंट के लिए OAS 3.2 का `itemSchema` इस्तेमाल होता है। यह Powerduck में लिखने की परंपरा है, हर OpenAPI दस्तावेज़ की सार्वभौमिक आवश्यकता नहीं।
- हर पैरामीटर में `schema` या `content` होना चाहिए।
- कार्रवाई **संपादित करते समय** चुना हुआ प्रोटोकॉल और उसकी कॉन्फ़िगरेशन सुरक्षित रखी जाती है। RPC और स्ट्रीमिंग कार्रवाइयाँ चुपचाप REST में नहीं बदली जातीं।
- ऊपर दिए एक्सटेंशन का सटीक ढाँचा इस्तेमाल करें; `externalUrl` जैसी कुंजियाँ न गढ़ें और प्रोटोकॉल नाम के रूप में `ws` न दें।

## यह क्यों ज़रूरी है

इन प्रोटोकॉल को एक दस्तावेज़ में मॉडल करने से डिज़ाइन, डीबगिंग और दस्तावेज़ एक ही स्रोत पर आधारित रहते हैं। निष्पादन, मॉक और बनाए गए MCP का समर्थन ट्रांसपोर्ट पर निर्भर करता है। A2A 1.0 में JSON-RPC, REST और डेस्कटॉप gRPC की डीबगिंग तथा दस्तावेज़ीकरण के साथ स्टेटलेस संदेश-अडैप्टर सर्वर बनाना समर्थित है। स्थायी टास्क और पुश डिलीवरी के लिए अपना कार्यान्वयन चाहिए। स्ट्रीमिंग या RPC एंडपॉइंट जोड़ने को कहने पर सहायक प्रोटोकॉल की कॉन्फ़िगरेशन सुरक्षित रखता है, उसे केवल REST वाले ढाँचे में नहीं बदलता।

संबंधित: [सहायक के साथ डिज़ाइन](./design.md), [डेटा मॉडल](./data-model.md)।

## A2A

JSON-RPC, REST या डेस्कटॉप gRPC पर एजेंट संदेश और टास्क के लिए `x-protocol: a2a` के साथ `x-a2a` इस्तेमाल करें। A2A 1.0 तीनों बाइंडिंग का समर्थन करता है; 0.3 में JSON-RPC समर्थित है। अलग संस्करणों में भेजे जाने वाले डेटा की संरचना अलग होती है। कॉन्फ़िगरेशन, उदाहरण, खोज और सीमाओं के लिए [A2A एजेंट](./a2a.md) देखें।
