# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WeChat Mini Program (微信小程序) for couples/group food ordering. Users browse menus, order dishes for the day, collect favorites, and view order history. No build step — native WeChat Mini Program format (.wxml/.wxss/.js/.json).

## Commands

- **Preview in WeChat DevTools**: Open the project root in WeChat DevTools (微信开发者工具)
- **Lint**: Uses ESLint — run `eslint .` if ESLint is installed globally, or lint via the DevTools editor
- **No test framework** is configured in this project

## Architecture

### Global Layer (`app.js`)
- `app.globalData.api` — base URL for the backend REST API (Java Spring Boot)
- `app.globalData.vistPictureApi` — base URL for serving images
- `app.request(url, data, method, successCallback, failCallback)` — unified `wx.request` wrapper used by all pages
- `app.login(success, fail)` — WeChat OAuth login flow, sends code to backend `/passport/third/login`
- `app.visitFile(path)` — generates full image URL with encoding

### User & Group State
- User info stored in `wx.getStorageSync('userInfo')` after login
- Current group context in `wx.getStorageSync('currentVisitGroup')` — most API calls require `account` and `groupCode`
- Group list comes from `userInfo.groupResponse`; users can switch groups on the home page

### Page Structure (12 pages in `app.json`)
| Page | Purpose |
|------|---------|
| `pages/index/index` | Home — login, group switcher, navigation hub with random love poem |
| `pages/menu/menu` | Browse/search/filter menu items, order (+/-) with pagination |
| `pages/love-menu/index` | List of user's favorited/collected dishes |
| `pages/hot-spot/spot` | Hot-pot-specific food ordering (type=1) |
| `pages/foodDetail/detail` | Single dish detail view with cooking steps |
| `pages/foodCar/car` | Order cart — split into cook orders (type=0) and hotpot orders (type=1) |
| `pages/current-day/current` | Today's orders for the current group |
| `pages/new-require/index` | User profile/settings (currently empty) |
| `pages/self-info/index` | Self info (currently empty) |
| `pages/logs/logs` | Debug logs from storage |

### API Endpoints (backend at `{api}/api/objs/weapp`)
- Auth: `POST /passport/third/login`
- Food: `GET /food/type`, `GET /food/kind/page`, `GET /food/detail/overview/page`
- Cook: `GET /cook/detail`, `POST /cook/collect/`, `POST /cook/collect/good`, `POST /cook/collect/bad`
- Order: `POST /order/increaseOrder`, `DELETE /order/deOrder`, `GET /order/select`, `GET /order/sum`, `GET /order/select/current-day`
- Image: `GET /picture/visit?filePath=`

### Key Patterns
- Every page gets `app` via `const app = getApp()` and uses `app.request()` for API calls
- Image paths are resolved at render time via `app.visitFile(path)` which prepends the API image-serving URL
- Pagination is manual: `page` + `pageSize` in data, `showMore()` increments page and appends results
- Dialog state uses paired `dialog` / `dialogShow` properties for animation control
- Each page has a `LOG_PREFIX` data field for namespaced console logging

### UI Framework
- WeUI components via `weui-` CSS classes (half-screen dialogs, media boxes, cells, badges, masks)
- Custom icon font via `iconfont` CSS classes
- App-wide styles in `app.wxss`

### Project Config
- WeChat DevTools SDK version: `3.8.12`
- ESLint: ES6, browser/node env, with WeChat globals (wx, App, Page, getApp, etc.)
- Style: `v2`, `urlCheck: false` in private config (allows dev API calls without HTTPS)
