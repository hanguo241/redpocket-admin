# RedPacket 管理后台

管理后台用于平台运营人员管理项目方、红包、链配置等。

---

## 需求清单

### 1. 认证与权限

| 功能 | 说明 |
|------|------|
| 管理员登录 | 邮箱/密码或钱包签名登录 |
| JWT 鉴权 | 所有管理接口需 Bearer Token |
| 权限分级 | 超级管理员 / 运营 / 只读 |

### 2. Dashboard / 首页

| 功能 | 说明 |
|------|------|
| 数据概览 | 总红包数、总发放金额、总项目方数、活跃红包数 |
| 趋势图 | 近 7/30 天红包创建量、领取量趋势 |
| 最新动态 | 最近创建的红包、最近的领取记录 |

### 3. 项目方管理

| 功能 | 说明 |
|------|------|
| 项目方列表 | 展示所有注册项目方 (ID、名称、AppKey、创建时间) |
| 创建项目方 | 手动创建新项目方，生成 AppKey/Secret |
| 编辑/禁用 | 修改项目名称，禁用违规项目方 |
| 查看详情 | 项目方的红包统计、调用量 |

### 4. 红包管理

| 功能 | 说明 |
|------|------|
| 红包列表 | 展示所有红包 (ID、链、金额、状态、创建时间、所属项目方) |
| 筛选 | 按链、状态、项目方、时间范围筛选 |
| 查看详情 | 红包完整信息 + 领取记录列表 |
| 手动退款 | 过期红包可手动触发退款 |

### 5. 领取记录

| 功能 | 说明 |
|------|------|
| 领取列表 | 展示所有 claim 记录 (红包 ID、领取人、金额、状态、txHash) |
| 筛选 | 按红包、领取人地址、状态筛选 |

### 6. 链配置管理

| 功能 | 说明 |
|------|------|
| 链列表 | 展示所有已配置的链 (chain_configs 表) |
| 编辑 | 修改 RPC URL、合约地址、是否启用 |
| 新增 | 添加新链支持 |

### 7. 平台设置

| 功能 | 说明 |
|------|------|
| 手续费率 | 配置全局默认 fee_bps |
| 签名者地址 | 查看当前平台签名者地址 |
| 代领钱包 | 查看 Relayer 地址和余额 |

---

## 技术选型

| 项 | 建议 |
|---|------|
| 前端框架 | React + Ant Design Pro 或 Next.js |
| 后端 | 复用现有 Axum 后端，新增 admin API routes |
| 认证 | JWT + 管理员表 |

## API 路由规划

```
POST   /api/v1/admin/login              ← 管理员登录
GET    /api/v1/admin/dashboard           ← Dashboard 数据
GET    /api/v1/admin/projects            ← 项目方列表
POST   /api/v1/admin/projects            ← 创建项目方
PUT    /api/v1/admin/projects/{id}       ← 编辑项目方
GET    /api/v1/admin/packets             ← 红包列表 (筛选)
GET    /api/v1/admin/packets/{id}        ← 红包详情
POST   /api/v1/admin/packets/{id}/refund ← 手动退款
GET    /api/v1/admin/claims              ← 领取记录列表
GET    /api/v1/admin/chains              ← 链配置列表
PUT    /api/v1/admin/chains/{chain}      ← 编辑链配置
GET    /api/v1/admin/settings            ← 平台设置
PUT    /api/v1/admin/settings            ← 更新设置
```

---

> TODO: 功能清单确认后开始开发
