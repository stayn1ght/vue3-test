/**
 * @name Config
 * @description 项目配置
 */

// 应用名
export const APP_TITLE = 'Fast-Vue3'

// 本地服务端口
export const VITE_PORT = 3001

// prefix
// 这个前缀似乎完全没有用到
// 可能后端要用到？
export const API_PREFIX = '/atguigu'

// serve
// 向后端请求的地址没有去除前缀/api
// 应该是根据接口文档约定，后端的接口地址都是以/api开头的
export const API_BASE_URL = '/api'
// export const API_BASE_URL = '/atguigu'
export const API_TARGET_URL = 'https://gmrepo.humangut.info'

// mock
export const MOCK_API_BASE_URL = '/mock/api'
export const MOCK_API_TARGET_URL = 'http://localhost:3000'

// iconfontUrl
export const ICONFONTURL = '//at.alicdn.com/t/font_3004192_9jmc1z9neiw.js' // 去色版

// 包依赖分析
export const ANALYSIS = true

// 是否支持Md渲染
export const MARKDOWN = true

// 代码压缩
export const COMPRESSION = true

// 删除 console
export const VITE_DROP_CONSOLE = true
