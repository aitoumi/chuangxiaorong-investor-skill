# chuangxiaorong-investor-skill
创小融投资人skill

为投资人提供接入创小融平台、获取创业项目信息的 RESTful API 服务。投资人可以浏览、筛选、收藏创业项目，并一键登记投资意向。

---

## 功能特性

- **项目搜索与筛选** – 按行业、融资阶段、地域、标签、融资金额等多维度筛选创业项目
- **项目详情查看** – 查看项目简介、团队规模、营收、联系人等详细信息
- **智能推荐** – 根据投资人的行业偏好与阶段偏好推荐匹配度最高的项目
- **投资意向登记** – 在线登记对指定项目的投资意向，平台将在 1-2 个工作日内回访
- **元数据查询** – 获取有效的行业分类与融资阶段列表，方便前端渲染筛选控件

---

## 快速开始

### 环境要求

- Node.js >= 18

### 安装

```bash
npm install
```

### 启动服务

```bash
npm start
```

服务默认监听 `http://localhost:3000`。可通过环境变量 `PORT` 修改端口。

### 运行测试

```bash
npm test
```

---

## API 文档

所有接口均以 JSON 格式返回，统一响应结构：

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "错误描述" }
```

### 健康检查

```
GET /health
```

**响应示例**

```json
{ "status": "ok", "service": "创小融投资人Skill", "version": "1.0.0" }
```

---

### 项目列表

```
GET /api/projects
```

**查询参数（均可选）**

| 参数        | 类型   | 说明                         |
|-------------|--------|------------------------------|
| industry    | string | 行业（精确匹配）             |
| stage       | string | 融资阶段（精确匹配）         |
| location    | string | 城市/省份（模糊匹配）        |
| tag         | string | 标签（模糊匹配）             |
| minAmount   | number | 最小融资金额（元）           |
| maxAmount   | number | 最大融资金额（元）           |
| page        | number | 页码（从 1 开始，默认 1）    |
| pageSize    | number | 每页条数（默认 10，最大 50） |

**响应示例**

```json
{
  "success": true,
  "data": {
    "total": 2,
    "page": 1,
    "pageSize": 10,
    "projects": [
      {
        "id": "proj_001",
        "name": "智能供应链优化平台",
        "company": "链智科技有限公司",
        "industry": "企业服务",
        "stage": "A轮",
        "fundingAmount": "2000万元",
        "location": "上海",
        "tags": ["AI", "SaaS", "供应链", "B2B"],
        "status": "active"
      }
    ]
  }
}
```

---

### 项目详情

```
GET /api/projects/:id
```

**响应示例**

```json
{
  "success": true,
  "data": {
    "id": "proj_001",
    "name": "智能供应链优化平台",
    "company": "链智科技有限公司",
    "industry": "企业服务",
    "stage": "A轮",
    "fundingAmount": "2000万元",
    "description": "利用AI和大数据技术优化供应链管理...",
    "founded": "2022",
    "location": "上海",
    "teamSize": 35,
    "annualRevenue": "500万元",
    "tags": ["AI", "SaaS", "供应链", "B2B"],
    "contact": {
      "name": "张明",
      "title": "CEO",
      "email": "zhang.ming@lianzhi.tech"
    },
    "status": "active"
  }
}
```

---

### 元数据（行业 & 阶段）

```
GET /api/projects/meta
```

返回全部有效的行业分类与融资阶段列表，可用于前端筛选控件。

---

### 推荐项目

```
GET /api/projects/recommendations
```

**查询参数（均可选）**

| 参数        | 类型   | 说明                                         |
|-------------|--------|----------------------------------------------|
| industries  | string | 偏好行业，多个用英文逗号分隔                 |
| stages      | string | 偏好融资阶段，多个用英文逗号分隔             |
| maxAmount   | number | 可接受的最大单笔融资金额（元）               |
| limit       | number | 返回条数（默认 5，最大 20）                 |

**示例请求**

```
GET /api/projects/recommendations?industries=AI,医疗健康&stages=A轮,B轮&limit=5
```

---

### 登记投资意向

```
POST /api/investors/interest
Content-Type: application/json
```

**请求体**

```json
{
  "projectId":     "proj_001",
  "investorName":  "张三",
  "investorEmail": "zhangsan@example.com",
  "note":          "希望了解更多财务数据"
}
```

| 字段           | 必填 | 说明                 |
|----------------|------|----------------------|
| projectId      | 是   | 项目 ID              |
| investorName   | 是   | 投资人姓名           |
| investorEmail  | 是   | 投资人邮箱           |
| note           | 否   | 备注                 |

**响应示例**

```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "感谢您对项目 proj_001 的关注，我们的团队将在1-2个工作日内联系您。",
    "registrationId": "reg_1712534400000_a3f7b2"
  }
}
```

---

## 项目结构

```
chuangxiaorong-investor-skill/
├── index.js                   # 服务入口
├── src/
│   ├── app.js                 # Express 应用工厂
│   ├── data/
│   │   └── mockData.js        # 模拟创业项目数据
│   ├── handlers/
│   │   ├── projectHandler.js  # 项目搜索、详情、推荐逻辑
│   │   └── investorHandler.js # 投资意向登记逻辑
│   ├── models/
│   │   └── project.js         # 项目数据模型与格式化工具
│   └── routes/
│       ├── projects.js        # 项目相关路由
│       └── investors.js       # 投资人相关路由
└── tests/
    └── skill.test.js          # API 集成测试（Jest + Supertest）
```

---

## License

ISC
