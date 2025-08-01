// ===========================
// Base Types - 基础类型定义
// ===========================

/**
 * 基础实体接口 - 通用字段和布局属性
 * 所有需要版本管理和布局的实体都应继承此接口
 * 约定：统一使用 24 列 Grid 布局，0 间隙
 */
export interface BaseEntity {
  id: string // 唯一标识
  name: string // 名称
  description?: string // 描述
  version: string // 版本

  // 统一布局属性 - 基于 24 列 Grid 约定
  colSpan: number              // 占用列数 (1-24)
  rowSpan: number              // 占用行数
  order: number                // 排序值

  // 响应式布局 - 直接集成到实体中
  mobileColSpan?: number       // 移动端列数
  mobileRowSpan?: number       // 移动端行数
  tabletColSpan?: number       // 平板端列数
  tabletRowSpan?: number       // 平板端行数
  desktopColSpan?: number      // 桌面端列数（可选，默认使用 colSpan）
  desktopRowSpan?: number      // 桌面端行数（可选，默认使用 rowSpan）

  // 外边距 - 控制间距
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

/**
 * 样式配置 - 保留作为独立类型供引用
 */
export interface StyleConfig {
  width?: string | number
  height?: string | number
  backgroundColor?: string
  color?: string
  padding?: string | number
  border?: string
  borderRadius?: string | number
  [key: string]: any
}

/**
 * 数据配置 - 保留作为独立类型供引用
 */
export interface DataConfig {
  source?: string
  binding?: Record<string, string>
  [key: string]: any
}

/**
 * 行为配置 - 保留作为独立类型供引用
 */
export interface BehaviorConfig {
  visible?: boolean
  disabled?: boolean
  interactive?: boolean
  [key: string]: any
}
