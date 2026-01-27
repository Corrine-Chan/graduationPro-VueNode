## 绿闪桩能源（充电站）管理平台

一个基于 **Vue 3 + TypeScript + Vite** 的充电站运营与能源管理后台，用于实现充电站设备监控、营收分析、会员及运营管理等功能，适合作为毕业设计课题展示。

---

## 一、项目简介

**项目名称**：绿闪桩能源管理平台  
**项目定位**：为城市充电站运营方提供统一的 Web 管理平台，实现：

- 充电站与充电桩运行状态监控
- 能源数据可视化与营收统计
- 设备故障告警与维护管理
- 运营订单与计费数据展示
- 会员与权限管理

系统采用前后端分离思路，目前前端通过 `Mock.js` 模拟后端接口数据，便于在无真实后端服务的情况下完成演示与测试。

---

## 二、技术栈说明

- **前端框架**：`Vue 3`（组合式 API，`<script setup>` 语法）
- **语言**：`TypeScript`
- **构建工具**：`Vite`
- **UI 组件库**：`Element Plus`，`@element-plus/icons-vue`
- **状态管理**：`Pinia`
- **路由管理**：`Vue Router 4`
- **HTTP 请求**：`Axios`（二次封装，统一拦截处理）
- **图表可视化**：`ECharts`
- **数据模拟**：`Mock.js`（位于 `src/mock/index.ts`）
- **样式**：`Less` + 局部 `scoped` 样式

依赖可参考根目录 `package.json`。

---

## 三、项目运行与构建

在项目根目录下执行：

- **安装依赖**

```bash
npm install
```

- **开发环境启动**

```bash
npm run dev
```

- **生产环境构建**

```bash
npm run build
```

- **本地预览构建结果**

```bash
npm run preview
```

---

## 四、整体功能模块说明（按路由/菜单划分）

路由配置位于 `src/router/basicRouteMap.ts`，核心页面通过子路由挂载在主布局 `DefaultLayout` 下。

- **登录模块（/login）**
  - 文件：`src/views/Login.vue`
  - 功能：账号密码登录，基于 `Element Plus` 表单校验（用户名长度校验、密码 6 位数字校验）。
  - 登录成功后调用 `useUserStore.login`，将 `token`、`roles`、`menulist` 等信息写入 `Pinia` 和 `sessionStorage`，再跳转到首页。

- **仪表盘 / 数据大屏（/dashboard）**
  - 文件：`src/views/dashboard/DashBoard.vue`
  - 功能：
    - 今日设备运行状态统计（充电桩/充电柜/充电站使用率、异常设备数量等）。
    - 常用功能入口展示（营收统计、充电桩管理、电子地图、运营管理、会员卡管理等图标入口）。
    - 能源统计图表：调用 `@/api/dashboard` 中的 `chartDataApi / chartDataApi2 / chartDataApi3`，通过 `useChart` 封装的 ECharts 实例渲染折线图、饼图、雷达图。
    - 设备综合评估雷达图与城市营收排行榜列表。
    - 故障报警时间线展示近期故障与提醒信息。

- **充电站监控管理模块（/chargingstation/**）**
  - 1）**站点监控列表（/chargingstation/monitor）**
    - 文件：`src/views/chargingstation/Monitor.vue`
    - 功能：
      - 按站点名称 / ID 和状态（使用中、空闲中、维护中、待维修）筛选充电站列表。
      - 统计卡片展示累计充电量、充电次数、服务区域、累计效益等指标。
      - 充电站列表表格展示城市、快充/慢充数量、状态、正在充电数量、故障数、负责人及电话等。
      - 支持分页、条件查询与重置。
      - 集成 `新增/编辑/删除` 充电站：
        - 新增/编辑通过弹窗组件 `StationForm`（`src/views/chargingstation/components/StationForm.vue`）完成。
        - 删除通过 `el-popconfirm` 二次确认后调用 `deleteApi`。
      - 与 `Pinia` 的 `useStationStore` 配合，在列表与表单之间共享当前行数据。
      - 数据接口：`src/api/chargingstation.ts` 中的 `listApi`（分页+条件查询）、`editApi`、`deleteApi`。

  - 2）**营收统计（/chargingstation/revenue）**
    - 文件：`src/views/chargingstation/Revenue.vue`
    - 功能：
      - 顶部多张营收小卡片，展示不同维度的收入汇总。
      - 使用 `formatNumberToThousands` 工具对金额进行千分位格式化。
      - ECharts 柱状图 + 折线图组合：调用 `chartApi` 获取“销售/访问量”等月度统计。
      - 站点营收列表：可按照站点名称搜索，展示日收入、月收入、电费营收、停车费营收、服务费、会员储值金等，并计算日总收入。
      - 分页逻辑通过 `usePagination` 统一封装。
      - 数据接口：`revenueApi`、`chartApi`。

  - 3）**故障管理（/chargingstation/fault）**
    - 文件：`src/views/chargingstation/Fault.vue`
    - 功能：用于展示充电站/充电桩故障相关列表或统计（具体实现可在界面中展示，路由已预留）。

- **电子地图模块（/map）**
  - 文件：`src/views/map/ElectronicMap.vue`
  - 功能：占位为“电子地图”，用于展示城市或区域充电站分布、位置可视化等（可扩展集成高德/百度地图 SDK）。

- **运营管理模块（/operations/**）**
  - 1）**订单管理（/operations/orders）**
    - 文件：`src/views/operations/Orders.vue`
    - 功能：占位“订单管理”，用于展示充电订单列表、订单详情、结算状态等。

  - 2）**运营详情（/operations/detail）**
    - 文件：`src/views/operations/Detail.vue`
    - 功能：展示单个站点或区域的运营详细指标。

  - 3）**计费管理 / 运营汇总（/operations/total）**
    - 文件：`src/views/operations/Total.vue`
    - 功能：页面内容为“计费管理”，用于展示充电计费策略、价格规则与汇总数据。

- **告警管理模块（/alarm）**
  - 文件：`src/views/alarm/Alarm.vue`
  - 功能：用于统一展示告警记录、告警等级和处理状态（路由已配置，可扩展表格/图表展示）。

- **会员管理模块（/membership）**
  - 文件：`src/views/membership/Membership.vue`
  - 功能：页面内容为“会员卡管理”，主要用于后续扩展会员信息、会员充值、折扣策略等功能。

- **文档管理模块（/document）**（带权限控制）
  - 文件：`src/views/document/Document.vue`
  - 路由：`meta.needAuth: ["admin", "manager"]`
  - 功能：只有拥有 `admin` 或 `manager` 角色的用户才能访问，用于管理运营文档、制度规范或说明资料。

- **系统管理模块（/system）**（管理员权限）
  - 文件：`src/views/system/System.vue`
  - 路由：`meta.needAuth: ["admin"]`
  - 功能：系统级别配置，如角色管理、菜单配置、参数设置等，仅管理员可访问。

- **个人中心模块（/personal）**
  - 文件：`src/views/personal/Personal.vue`
  - 功能：展示个人信息、操作日志、通知等，顶部头像下拉“个人中心”菜单会跳转到该路由。

- **404 页面（/:pathMatch(.*)*）**
  - 文件：`src/views/NotFound.vue`
  - 功能：处理未匹配到的路由，给出友好提示。

---

## 五、权限与菜单机制

- **路由守卫**：`src/router/guard.ts`
  - 在全局前置守卫 `router.beforeEach` 中，使用 `useUserStore` 获取 `token` 和 `roles`。
  - 未登录用户访问除 `/login` 外任意页面会被重定向到 `/login`。
  - 已登录用户访问 `/login` 时会被重定向到首页 `/`。
  - 针对设置了 `meta.needAuth` 的路由，判断当前用户角色与所需角色是否有交集，否则重定向到首页。

- **用户与角色状态管理**：`src/store/auth.ts`
  - `token`、`roles`、`username`、`menu` 等字段通过 Pinia 统一管理，并与 `sessionStorage` 做持久化。
  - `login` 方法调用 `loginApi`（`/login` 接口），从后端返回中解析 `token`、`roles`、`username`、`menulist`。
  - `logout` 方法清空本地状态并清除 `sessionStorage`。

- **侧边菜单渲染**：`src/components/navMenu/Menu.vue`
  - 基于 `userStore.menu` 动态渲染菜单项，支持多级菜单（通过 `MenuItem` 组件递归）。
  - 配合 `:router="true"` 和 `:default-active="$route.path"` 实现路由联动高亮。

---

## 六、主要目录与文件说明

### 1. 入口与全局布局

- `src/main.ts`：应用入口文件，完成以下工作：
  - 创建 Vue 应用实例并挂载到 `#app`。
  - 引入全局样式 `style.less`。
  - 注册 `Vue Router`、`Element Plus`、`Pinia`。
  - 全局注册 `Element Plus` 图标组件。
  - 引入路由守卫 `@/router/guard` 与本地 mock 数据 `./mock`。

- `src/App.vue`：顶层应用组件（可作为路由占位，具体主体由 `layouts` 与路由子组件组成）。
- `src/layouts/DefaultLayout.vue`：
  - 左侧为侧边菜单 `Menu`，右侧包含顶部 `TopHeader` 与主体内容区域。
  - 主体区域通过 `TabsLayout` 组件实现多标签页切换，承载实际业务页面。
- `src/layouts/TabsLayout.vue`：
  - 结合 `useTabsStore` 管理多标签页（打开、关闭、高亮当前页签）。

### 2. 路由与状态管理

- `src/router/index.ts`：创建路由实例，使用 `createWebHistory` 管理浏览历史。
- `src/router/basicRouteMap.ts`：集中定义所有路由配置，包含首页、各业务模块以及 404 页面。
- `src/router/guard.ts`：全局导航守卫，实现登录拦截和基于角色的权限控制。

- `src/store/auth.ts`：用户认证与权限 Store。
- `src/store/station.ts`：充电站行数据共享 Store，在站点列表和表单弹窗之间传递当前编辑数据。
- `src/store/tabs.ts`：标签页 Store，管理打开的页签和当前激活的路由。

### 3. 接口封装与工具

- `src/utils/axios.ts`：
  - 对 `axios` 进行实例化与拦截器配置。
  - 设置统一 `baseURL` 和 `timeout`。
  - 在请求/响应失败或返回码非 200 时，通过 `ElNotification` 统一提示错误。

- `src/utils/http.ts`：
  - 基于 `axios` 实例进一步封装 `get`、`post` 方法。
  - 通过泛型 `ResponseData` 约束响应结构，统一返回 `Promise<ResponseData>`。

- `src/utils/toThousands.ts`：
  - 用于金额千分位格式化，在营收模块中大量使用，提升数据可读性。

- `src/api/user.ts`：
  - `loginApi(data: LoginParams)`：登录接口。

- `src/api/dashboard.ts`：
  - `chartDataApi`、`chartDataApi2`、`chartDataApi3`：仪表盘各类图表数据接口。

- `src/api/chargingstation.ts`：
  - `listApi`：充电站分页查询。
  - `editApi`：新增/编辑充电站。
  - `deleteApi`：根据 ID 删除充电站。
  - `chartApi`、`revenueApi`：营收图表与列表接口。
  - `currentListApi`：充电桩列表接口。

- `src/mock/index.ts`：
  - 使用 `Mock.js` 拦截接口请求，返回模拟数据，支持站点列表、营收数据、图表数据等，方便前端独立开发与演示。

### 4. 公共组件与 Hooks

- `src/components/navMenu/Menu.vue` / `MenuItem.vue`：
  - 左侧导航菜单组件，根据用户角色返回的 `menu` 动态生成结构。

- `src/components/topHeader/TopHeader.vue`：
  - 顶部个人信息与消息提醒栏，包含“个人中心”和“退出登录”等功能。

- `src/hooks/useCharts.ts`：
  - 对 ECharts 使用逻辑进行封装，传入 DOM 容器 `ref` 和获取配置项的异步函数，内部自动完成初始化、设置 `option`、窗口 `resize` 监听和销毁释放。

- `src/hooks/usePagination.ts`：
  - 抽离分页逻辑，统一维护 `pageInfo`、`totals`，并提供分页切换和重置方法。

### 5. 类型定义

- `src/types/station/index.ts`：
  - 定义充电站相关的 `RowType` 等类型，用于表格数据、接口入参等。

- `src/types/user/index.ts`：
  - 定义用户菜单 `MenuItem` 等类型，用于动态菜单渲染与标签页管理。

---

## 七、可扩展与优化方向（可在答辩中说明）

- 接入真实后端服务，替换当前 `Mock.js` 模拟数据。
- 为电子地图模块接入地图 SDK，实现充电站空间分布可视化与导航能力。
- 完善运营管理与会员管理页面，增加更多查询条件与导出报表功能。
- 将 `baseURL` 抽离为多环境配置（开发/测试/生产）并结合 `.env` 管理。
- 引入单元测试与 E2E 测试，提升系统可靠性。

---

## 八、总结

本项目完整实现了一个充电站能源管理后台的核心框架与主要功能模块，涵盖了登录认证、权限控制、数据可视化、表格增删改查、分页、图表封装等前端工程化能力，体现了对 **Vue 3 + TypeScript + Vite** 生态的综合运用，适合作为毕业设计进行展示与答辩。 
