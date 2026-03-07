# 校园流浪动物平台（Campus Stray Animal Platform）

这是一个面向校园流浪猫狗救助与管理的全栈项目，技术栈为 **Next.js App Router + TypeScript + TailwindCSS + PostgreSQL + MinIO**。

## 项目结构

- `app/`：页面与 Next.js API Route Handlers
- `components/`：可复用 UI 组件
- `lib/`：数据库、鉴权、MinIO 与通用工具
- `database/schema.sql`：PostgreSQL 数据库建表脚本
- `uploads/`：本地占位上传目录
- `ecosystem.config.js`：PM2 配置示例
- `nginx.campus-stray.conf`：Nginx 反向代理配置示例

## 已实现核心功能

- 动物图鉴（浏览、筛选/搜索 API、管理员 CRUD）
- 论坛（发帖、点赞、评论）
- 委托/求助（发布求助、管理员更新状态）
- 领养申请（提交申请、管理员审批）
- 救助知识（文章浏览、管理员 CRUD）
- 用户认证（注册/登录/退出、`user`/`admin` 角色）
- 管理后台页面（管理入口）
- MinIO 图片上传（桶结构）：
  - `animal-images`
  - `post-images`
  - `help-images`

## 本地运行

1. 安装依赖：
   ```bash
   npm install
   ```
2. 复制环境变量文件并按需修改：
   ```bash
   cp .env.example .env
   ```
3. 初始化 PostgreSQL 数据库并执行建表：
   ```bash
   createdb campus_animals
   psql -d campus_animals -f database/schema.sql
   ```
4. 启动 MinIO（示例）：
   ```bash
   minio server /data --console-address ':9001'
   ```
5. 启动开发环境：
   ```bash
   npm run dev
   ```
6. 构建并启动生产环境：
   ```bash
   npm run build
   npm start
   ```

## REST API 一览

- 认证：`/api/auth/register`、`/api/auth/login`、`/api/auth/logout`、`/api/auth/me`
- 动物：`/api/animals`、`/api/animals/:id`
- 帖子：`/api/posts`、`/api/posts/:id`、`/api/posts/:id/like`
- 评论：`/api/comments`
- 求助：`/api/help-requests`、`/api/help-requests/:id`
- 领养申请：`/api/adoption-requests`、`/api/adoption-requests/:id`
- 知识文章：`/api/articles`、`/api/articles/:id`
- MinIO 上传：`/api/upload`（表单字段 `file` + `kind=animal|post|help`）

## MinIO 上传示例

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: token=<your_token>" \
  -F "kind=animal" \
  -F "file=@/path/to/photo.jpg"
```

返回示例：

```json
{ "url": "http://127.0.0.1:9000/animal-images/1720000000000-photo.jpg" }
```


## 管理员登录说明

- 系统内置单一管理员账号：`admin`
- 初始密码：`1234`
- 在登录页输入以上账号密码后会自动进入 `/admin` 管理员操作台。
- 本项目按低安全要求设计，不提供新增/删除管理员功能。

## Linux 部署说明（Node.js + PM2 + Nginx）

1. 安装 Node.js 20+、PostgreSQL、Nginx、PM2、MinIO。
2. 拉取代码并安装依赖：
   ```bash
   npm install
   ```
3. 配置生产环境 `.env`（数据库、JWT、MinIO 等）。
4. 初始化数据库：
   ```bash
   psql -d campus_animals -f database/schema.sql
   ```
5. 构建项目：
   ```bash
   npm run build
   ```
6. 使用 PM2 启动：
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```
7. 配置 Nginx：
   - 将 `nginx.campus-stray.conf` 放到 `/etc/nginx/sites-available/`
   - 启用站点并重载：
   ```bash
   sudo ln -s /etc/nginx/sites-available/nginx.campus-stray.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
