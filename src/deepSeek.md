---
title: deepSeek
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.28"

---

# deepSeek

Base URLs:

# 会话相关

## POST 发送对话请求

POST /deepSeek/sendMessage

> Body 请求参数

```json
"{\n    \"user\":\"chihao\",\n    \"query\":\"你好\",\n    \"responseMode\": \"streaming\",\n    \"conversationId\":\"\"//可以为空\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 获取会话列表

POST /deepSeek/getConversations

> Body 请求参数

```json
{
  "user": "chihao"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 获取会话历史消息

POST /deepSeek/getMessages

> Body 请求参数

```json
"{\n    \"user\":\"chihao\",\n    \"conversationId\":\"b7c92380-ea43-4399-b406-1f2245208bc1\",\n    \"limit\":\"\",//可以为空\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 会话重命名

POST /deepSeek/renameConversation

> Body 请求参数

```json
{
  "user": "chihao",
  "conversationId": "b7c92380-ea43-4399-b406-1f2245208bc1",
  "newName": "TYRO测试"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 删除会话

POST /deepSeek/deleteConversation

> Body 请求参数

```json
{
  "user": "chihao",
  "conversationId": "233f3a71-d463-45db-9d6a-9be51d475863"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 知识库

## POST 新建空知识库

POST /dataset/create

> Body 请求参数

```json
{
  "name": "TYRO",
  "description": "TYRO测试",
  "indexing_technique": "economy",
  "permission": "all_team_members"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取知识库列表

GET /dataset/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|string| 否 |none|
|limit|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除知识库（id拼接在路径）

DELETE /dataset/delete/9ca6bbf7-d024-49b5-9c17-f513549eaa75

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 无用

POST /dataset/status

> Body 请求参数

```json
{
  "datasetId": "17fc0385-1e4d-4892-98fe-f8d277752c17"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 文档

## POST 通过text创建文档

POST /document/create

> Body 请求参数

```json
"{\n    \"datasetId\":\"17fc0385-1e4d-4892-98fe-f8d277752c17\",\n    \"name\":\"TYRO自传\",\n    \"text\":\"TYRO最厉害\",\n    \"indexingTechnique\":\"economy\",\n    \"processRule\":{\"mode\":\"automatic\"}//automatic自动\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 获取知识库中文档列表

POST /document/list

> Body 请求参数

```json
{
  "datasetId": "17fc0385-1e4d-4892-98fe-f8d277752c17"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|string| 否 |none|
|limit|query|string| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 删除知识库中文档

POST /document/delete

> Body 请求参数

```json
{
  "datasetId": "17fc0385-1e4d-4892-98fe-f8d277752c17",
  "documentId": "1fb0f497-2155-4e74-afd6-3ce698702151"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 通过text更新文档text或name

POST /document/update

> Body 请求参数

```json
{
  "datasetId": "17fc0385-1e4d-4892-98fe-f8d277752c17",
  "documentId": "515ecb42-1e35-4109-9c64-aaabe4e9919d",
  "name": "TYRO自传",
  "text": "TYRO&CCC||TYRO是最帅的"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 文档分段

## POST 新建分段

POST /segment/create

> Body 请求参数

```json
{
  "datasetId": "17fc0385-1e4d-4892-98fe-f8d277752c17",
  "documentId": "515ecb42-1e35-4109-9c64-aaabe4e9919d",
  "segments": {
    "content": "谁是最帅的？",
    "answer": "当然是TYRO",
    "keywords": [
      "帅"
    ]
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取分段列表

GET /segment/list

> Body 请求参数

```json
{
  "datasetId": "17fc0385-1e4d-4892-98fe-f8d277752c17",
  "documentId": "515ecb42-1e35-4109-9c64-aaabe4e9919d"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|string| 否 |none|
|limit|query|string| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 删除分段

POST /segment/delete

> Body 请求参数

```json
{
  "datasetId": "17fc0385-1e4d-4892-98fe-f8d277752c17",
  "documentId": "515ecb42-1e35-4109-9c64-aaabe4e9919d",
  "segmentId": "1cbc8847-dee5-4e8b-94ec-54799d34f9e0"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 数据模型

