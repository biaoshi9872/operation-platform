# V链API开放平台 - 项目说明文档

## 项目概述

**V链API开放平台**（supplychainapi_platform）是一个面向供应链业务的 API 管理与运营后台系统。平台提供供应商管理、订单管理、财务管理、API 接入管理等核心功能，帮助企业统一管控供应链上下游的 API 对接与数据流转。

| 属性 | 说明 |
|------|------|
| 项目名称 | operate_admin_page_v3 |
| 平台名称 | V链API开放平台 |
| 项目类型 | 前端 SPA（单页应用） |
| 访问路径 | `/api_platform/` |
| 运行时 | Node.js v18.16.0 / pnpm 8+ |

---

## 技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.5.17 | 前端框架 |
| TypeScript | - | 类型系统 |
| Vite | ^4.2.0 | 构建工具 |
| Vue Router | ^4.1.6 | 路由管理 |
| Pinia | ^2.0.34 | 全局状态管理 |

### UI 与样式

| 技术 | 版本 | 用途 |
|------|------|------|
| Element Plus | ^2.10.3 | UI 组件库 |
| UnoCSS | ^0.51.2 | 原子化 CSS |
| SCSS | - | 样式预处理器 |
| ECharts | ^5.5.0 | 数据可视化图表 |

### 工具库

| 技术 | 用途 |
|------|------|
| Axios | HTTP 请求 |
| dayjs | 日期处理 |
| lodash-es | 工具函数 |
| crypto-js | 加解密 |
| ali-oss | 阿里云 OSS 文件上传 |
| TinyMCE / Mavon Editor | 富文本编辑器 |
| CodeMirror 6 | 代码编辑器 |
| SortableJS / Vuedraggable | 拖拽排序 |
| pinyin-pro | 拼音转换 |
| decimal.js-light | 精确数字计算 |

---

## 项目结构

```
supplychainapi_platform/
├── src/
│   ├── api/              # 接口请求层（按业务模块划分）
│   ├── assets/           # 静态资源
│   ├── base/             # 基础配置
│   ├── components/       # 公共组件（42个）
│   ├── hooks/            # 自定义 Hooks（15个）
│   ├── icons/            # SVG 图标（109个）
│   ├── layout/           # 布局组件（含侧边栏、顶栏、标签页等）
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态模块
│   │   ├── app           # 应用全局状态
│   │   ├── user          # 用户信息
│   │   ├── router        # 动态路由
│   │   ├── viewTags      # 标签页
│   │   └── pictureInformation  # 图片信息
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数（22个）
│   ├── views/            # 页面视图（按业务模块）
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口
├── public/               # 公共静态资源
├── types/                # 全局类型声明
├── Dockerfile            # Docker 镜像构建
├── .gitlab-ci.yml        # GitLab CI/CD 流水线
├── vite.config.ts        # Vite 构建配置
├── unocss.config.ts      # UnoCSS 配置
└── tsconfig.json         # TypeScript 配置
```

---

## 业务模块

### 1. 首页（home）
平台数据总览仪表盘。

### 2. API 管理（apiManger）
- API 关联商品管理（apiLinkProduct）
- API 文件管理（apiFiles）

### 3. 应用管理（application）
- 应用列表
- 应用分发管理

### 4. 财务管理（financialManagement）
- 财务总览（financialOverview）
- 充值记录（financialTopUps / applyForATopUpRecord）
- 对账单（statementAccount / statementAccountDetal）
- 消费历史（consumptionHistory / applicationConsumptionRecord）

### 5. 订单管理（orderManagement）
- 普通订单（order）
- 售后订单（afterSaleOrder）
- 线下售后订单（unLineAfterSaleOrder）
- 赔付订单（compensationOrder）

### 6. 供应商管理（supplierManagement）
- 供应商信息（supplierInfo）
- 供应商账号（supplierAccount）
- 供应商权限（supplierAuthority）

### 7. 系统管理（system）
- 用户管理（user）
- 角色管理（role）
- 菜单管理（menu）
- 组织管理（org / orgDetail / orgDistribute）
- 权限配置（auth）
- 地址映射（addressMapping）
- H5 配置（H5config）
- 系统公告（systemAnnouncement）
- 加解密配置（decrypt）
- 导出模板（exportTemplate）
- 限售区域（restrictedSalesArea）
- 消息管理（message）
- 开放配置（open）
- 配置项（configSet）

### 8. 虚拟卡包（virtualCardPack）
- 虚拟卡包商品管理（virtualCardPackProduct）

### 9. 其他模块
- 下载中心（downloadCenter）
- 商品池（goodPool）
- 商品管理（goods）
- 商品分类（productCategory）
- 奖励模型（bonusModel）
- 公告管理（announcement）
- H5 配置（configH5）

---

## 路由机制

平台采用**动态路由**机制，菜单与路由权限从后端接口获取，根据用户角色动态注册路由：

- 未登录用户自动重定向到 `/login`
- 登录后根据权限动态加载菜单路由
- 支持路由缓存（keep-alive）
- 支持 iframe 嵌入页面
- 404 / 无权限页面兜底处理

---

## 环境配置

| 环境 | Git 分支 | 构建命令 | 说明 |
|------|---------|---------|------|
| 开发环境 | `test` | `pnpm run staging` | 自动触发部署 |
| 预发布环境 | `uat` | `pnpm run build` | 手动触发部署 |
| 生产环境 | `master` | `pnpm run build` | 手动触发部署 |

相关环境变量文件：
- `.env` - 通用变量
- `.env.development` - 开发环境
- `.env.staging` - 预发布环境
- `.env.production` - 生产环境

代理目标（开发调试）：`https://supply-test.ycb51.cn`

---

## CI/CD 流程

平台使用 **GitLab CI/CD** + **Docker** + **Kubernetes** 完成自动化构建与部署：

```
代码推送 → GitLab CI 触发
    → pnpm install（私有 npm 源）
    → vite build 构建
    → docker build 打镜像
    → docker push 推送至阿里云容器镜像仓库
    → kubectl replace 更新 K8s 部署
```

镜像仓库：`registry-vpc.cn-hangzhou.aliyuncs.com/nfc/supplychainapi_platform`

---

## 本地开发

### 安装依赖

```bash
pnpm install --registry http://npm.ycb51.cn
```

### 启动开发服务

```bash
pnpm run dev
# 服务运行在 http://localhost:7070/api_platform/
```

### 构建

```bash
# 生产构建
pnpm run build

# 预发布构建
pnpm run staging

# 开发构建（保留 console）
pnpm run build-dev
```

---

## 代码规范

- **ESLint** + **Prettier** 代码格式化
- **TypeScript** 严格类型检查
- **Commitizen（czg）** 规范化提交信息（`pnpm run commit`）
- **lint-staged** 提交前自动格式化
