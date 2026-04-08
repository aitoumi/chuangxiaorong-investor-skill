---
name: chuangxiaorong-investor-skill
description: |
  创小融投资人 Skill。通过 API Key 访问创小融投资平台能力：查看项目列表和详情、语义搜索项目、获取 AI 项目评估、查看和更新投资偏好、获取项目联系人信息、发起联系方式申请。
  USE WHEN: 用户需要查找投资项目、分析项目、获取创业者联系方式、管理投资偏好时使用。
---

# 创小融投资人 Skill

通过创小融 Open API 为投资人提供项目发现、分析和联系能力。

**Base URL**: `https://api.aitoumi.com/api/v1`

## 认证

所有请求需携带 API Key：
```
Authorization: Bearer zr-your-api-key
```

API Key 获取方式：登录 [创小融投资端](https://chat.aitoumi.com/invest-login) → 左下角头像 → API Key → 创建。

## 工具定义

### get_me

获取当前用户信息和所属机构列表。调用其他需要 orgUUID 的接口前，先调用此接口获取机构 UUID。

```
GET /me
```

**返回字段**：phone, name, avatar, organizations[{uuid, shortName, logo, role}]

---

### get_preferences

获取投资偏好设置。

```
GET /preferences
```

**返回字段**：industry, investStage, investAmountMin, investAmountMax, investStrategy, keywords, hasPreference

---

### update_preferences

更新投资偏好。

```
PUT /preferences
Content-Type: application/json
```

**请求体**：
| 字段 | 类型 | 说明 |
|------|------|------|
| industry | string | 行业偏好，逗号分隔 |
| investStage | string | 投资阶段，逗号分隔 |
| investAmountMin | number | 最小投资金额（万元） |
| investAmountMax | number | 最大投资金额（万元） |
| investStrategy | string | 投资策略描述 |
| keywords | string | 关键词，逗号分隔 |

---

### list_projects

获取机构下的项目列表。

```
GET /org/{orgUUID}/projects
```

**参数**：
| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| orgUUID | path | string | Y | 机构 UUID |
| page | query | int | N | 页码，默认 1 |
| pageSize | query | int | N | 每页数量，默认 20 |
| keyword | query | string | N | 关键词筛选 |
| industry | query | string | N | 行业筛选 |
| stage | query | string | N | 融资阶段筛选 |
| status | query | string | N | 状态筛选 |

**返回**：total, list[{projectUUID, projectName, industry, stage, recommendationScore, ...}]

---

### get_project

获取项目详情。

```
GET /org/{orgUUID}/projects/{projectUUID}
```

**返回字段**：uuid, name, description, industry, stage, fundingAmount, businessModel, teamInfo, marketAnalysis, highlights, risks, projectScore, projectLevel, ...

---

### search_projects

基于语义的向量搜索。适合自然语言描述的查询，如"做企业客服的 AI 项目"。

```
POST /org/{orgUUID}/projects/search
Content-Type: application/json
```

**请求体**：
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | Y | 搜索关键词（支持自然语言） |
| topK | int | N | 返回数量，默认 20 |
| industry | string | N | 行业过滤 |
| stage | string | N | 阶段过滤 |

---

### get_project_evaluation

获取项目的 AI 评估报告。

```
GET /org/{orgUUID}/projects/{projectUUID}/evaluation
```

**返回字段**：projectUUID, projectName, projectScore, founderHexagon, differentiation, founderSuggestions, riskAlert, evaluatedAt

---

### get_project_contact

获取项目联系人信息。

```
GET /org/{orgUUID}/projects/{projectUUID}/contact
```

**返回字段**：
- name: 联系人姓名
- phone: 手机号（可能脱敏）
- email: 邮箱
- authorized: 是否已获授权查看完整信息
- canApply: 是否可发起授权申请
- hasRequest: 是否已有待处理的申请

---

### request_project_contact

向项目负责人发起联系方式授权申请。仅在 `get_project_contact` 返回 `authorized=false` 且 `canApply=true` 时使用。

```
POST /org/{orgUUID}/projects/{projectUUID}/contact-request
```

**返回字段**：uuid, status, createdAt

## 典型使用流程

```
1. get_me()                          → 获取 orgUUID
2. list_projects(orgUUID)            → 浏览项目
3. search_projects(orgUUID, "AI客服") → 或语义搜索
4. get_project(orgUUID, projectUUID) → 查看详情
5. get_project_evaluation(...)       → 查看 AI 评估
6. get_project_contact(...)          → 查看联系人
7. request_project_contact(...)      → 如需申请授权
```

## 错误码

| HTTP | 含义 |
|------|------|
| 401 | API Key 无效/过期/已吊销 |
| 403 | 权限不足（scope 或非机构成员） |
| 404 | 资源不存在 |
| 400 | 参数错误 |
