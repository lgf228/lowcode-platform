// ===========================
// Project Organization Types - 项目组织架构类型定义
// ===========================

import { BaseEntity } from './Base'
import { Component } from './Component'

/**
 * 页面接口 - 继承 BaseEntity
 * Page 是一个特殊的实体，具有页面特有的属性
 */
export interface Page extends Component {
  route?: string // 页面路由
  title?: string // 页面标题
}

/**
 * 模块接口 - 模块是页面和功能的集合
 * Module 用于组织相关的页面、组件和业务功能
 */
export interface Module extends BaseEntity {
  homePageId?: string // 模块首页ID - 点击模块时默认显示的页面
  pages: Page[] // 模块包含的页面 - 用于构建子导航
  subModules?: Module[] // 子模块 - 用于构建模块导航
}

/**
 * 项目接口 - 继承 BaseEntity
 * Project 是最高级别的组织单位，可以包含多个模块
 */
export interface Project extends BaseEntity {
  homePageId?: string // 项目首页ID - 点击项目时默认显示的页面（通常是项目概览/仪表板）
  modules: Module[] // 项目包含的子模块 - 用于构建模块导航
}
