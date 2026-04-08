# 创小融投资人 Skill

供第三方 AI 应用（如 OpenClaw）调用创小融投资人能力的 Skill 定义。

## 快速开始

### 第一步：获取 API Key

> ⚠️ **重要提示**：API Key 仅在创建时显示一次，请务必**立即复制**保存，关闭弹窗后将无法再次查看！

按照以下步骤，在创小融投资端创建你的 API Key：

---

**① 登录并进入 API Key 管理页**

访问 [创小融投资端](https://chat.aitoumi.com/invest-login) 登录后，点击**左下角"我的"**，在弹出菜单中选择 **"API Key"**。

![步骤1 - 点击"我的"进入 API Key 管理](https://pan.yixin.com/s/Avfo3_UpDgUMi/origin.me.png)

---

**② 创建新的 API Key**

进入 API Key 管理页后，点击 **"创建 API Key"** 按钮，在弹窗中输入一个便于识别的名称（例如 `OpenClaw`），然后点击确认。

![步骤2 - 点击"创建 API Key"](https://pan.yixin.com/s/B0v03UpDg.K03/origin.create-apikey.png)

---

**③ 复制并保存 API Key**

Key 生成后会立即显示在弹窗中（格式为 `zr-xxxxxxxx...`），点击 **"复制"** 并妥善保存到安全的地方。

![步骤3 - 复制 API Key](https://pan.yixin.com/s/CqFJqUtD.gO25/origin.copy-apikey.png)

---

### 第二步：配置认证方式

所有请求通过 `Authorization` Header 传递 API Key：

```
Authorization: Bearer zr-your-api-key-here
```

### 第三步：确认 Base URL

```
https://api.aitoumi.com/v1
```

## API 接口

### 获取当前用户信息

```
GET /me
```

返回 API Key 所属用户的基本信息和所属机构列表。

**响应示例**：

```json
{
  "phone": "138****8000",
  "name": "张三",
  "avatar": "https://...",
  "organizations": [
    {
      "uuid": "org-uuid-1",
      "shortName": "某投资机构",
      "logo": "...",
      "role": "admin"
    }
  ]
}
```

### 获取投资偏好

```
GET /preferences
```

**响应示例**：

```json
{
  "industry": "人工智能,企业服务",
  "investStage": "A轮,B轮",
  "investAmountMin": 100,
  "investAmountMax": 1000,
  "investStrategy": "关注 AI 应用和企业服务",
  "keywords": "大模型,SaaS",
  "hasPreference": true
}
```

### 更新投资偏好

```
PUT /preferences
Content-Type: application/json

{
  "industry": "人工智能,企业服务",
  "investStage": "A轮,B轮",
  "investAmountMin": 100,
  "investAmountMax": 1000,
  "investStrategy": "关注 AI 应用和企业服务",
  "keywords": "大模型,SaaS"
}
```

### 项目列表

```
GET /org/{orgUUID}/projects?page=1&pageSize=20&keyword=AI&industry=人工智能&stage=A轮
```

**参数**：

| 参数       | 类型    | 说明                                  |
|----------|-------|-------------------------------------|
| orgUUID  | path  | 机构 UUID（从 /me 接口的 organizations 获取） |
| page     | query | 页码，默认 1                             |
| pageSize | query | 每页数量，默认 20，最大 100                   |
| keyword  | query | 关键词搜索                               |
| industry | query | 行业筛选                                |
| stage    | query | 融资阶段筛选                              |
| status   | query | 状态筛选                                |

### 项目详情

```
GET /org/{orgUUID}/projects/{projectUUID}
```

返回项目的完整信息，包含描述、行业、阶段、融资金额、团队、市场分析等。

### 向量语义搜索

```
POST /org/{orgUUID}/projects/search
Content-Type: application/json

{
  "keyword": "用 AI 做企业客服的项目",
  "topK": 10,
  "industry": "人工智能",
  "stage": "A轮"
}
```

根据语义进行项目搜索，适合自然语言查询。

### 项目评估

```
GET /org/{orgUUID}/projects/{projectUUID}/evaluation
```

返回项目的 AI 评估结果，包含评分、创始人六维图、差异化分析、风险提示等。

### 获取项目联系人

```
GET /org/{orgUUID}/projects/{projectUUID}/contact
```

**响应示例**：

```json
{
  "name": "李四",
  "phone": "138****2222",
  "email": "lisi@example.com",
  "authorized": true,
  "canApply": false,
  "hasRequest": true
}
```

- `authorized=true` 时可看到完整联系方式
- `authorized=false` 且 `canApply=true` 时可发起联系方式申请

### 发起联系方式申请

```
POST /org/{orgUUID}/projects/{projectUUID}/contact-request
```

向项目负责人发起查看联系方式的授权申请。

## 错误处理

**HTTP 状态码**：

| 状态码 | 说明                    |
|-----|-----------------------|
| 200 | 成功                    |
| 400 | 请求参数错误                |
| 401 | API Key 无效/过期/已吊销     |
| 403 | 权限不足（scope 不匹配或非机构成员） |
| 404 | 资源不存在                 |

**响应格式**：

```json
{
  "success": false,
  "code": 401,
  "message": "API Key 无效"
}
```

## Scope 权限

创建 API Key 时可指定权限范围，不指定默认为 `*`（全部权限）。

| Scope               | 说明        |
|---------------------|-----------|
| `*`                 | 全部权限      |
| `me:read`           | 读取用户信息    |
| `preferences:read`  | 读取投资偏好    |
| `preferences:write` | 修改投资偏好    |
| `projects:read`     | 读取项目列表/详情 |
| `evaluation:read`   | 读取项目评估    |
| `search`            | 向量搜索      |
| `contact:read`      | 读取联系人信息   |
| `contact:request`   | 发起联系方式申请  |

多个 scope 用逗号分隔：`projects:read,contact:read,evaluation:read`

## API Key 管理

API Key 管理接口需要 JWT 登录（非 API Key 认证），在创小融投资端 UI 中操作即可。

也可通过 API 管理：

```
POST   /api/v1/apikey/create    — 创建 Key（需 JWT）
GET    /api/v1/apikey/list      — 列出 Key（需 JWT）
DELETE /api/v1/apikey/{uuid}/revoke  — 吊销 Key（需 JWT）
DELETE /api/v1/apikey/{uuid}         — 删除 Key（需 JWT）
```

## 限制

- 每个账户最多 10 个 API Key
- Key 格式：`zr-` + 64 位十六进制字符
- Key 仅在创建时显示一次，之后只保存 hash
