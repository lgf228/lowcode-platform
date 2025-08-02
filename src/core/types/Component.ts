// ===========================
// Component Types - 低代码平台组件类型系统
// ===========================

import * as React from 'react'
import { BaseEntity } from './Base'

// ===========================
// 1. 核心枚举和基础类型
// ===========================

/**
 * 组件类型枚举 - 按功能职责分类管理
 * 分类原则：
 * - 输入组件：接受用户输入的组件
 * - 选择器组件：提供选项选择的组件  
 * - 展示组件：纯展示内容，无用户交互
 * - 交互组件：响应用户操作的组件
 * - 布局组件：提供布局能力的容器
 * - 数据组件：具有数据绑定能力的复杂组件
 */
export enum ComponentType {
  // 基础输入组件（接受用户输入）
  INPUT = 'input',
  TEXTAREA = 'textarea',
  DATE_PICKER = 'datePicker',

  // 选择器组件（提供选项选择）
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',

  // 展示组件（纯展示，无交互）
  TEXT = 'text',
  CHART = 'chart',
  IMAGE = 'image',

  // 交互组件（响应用户操作）
  BUTTON = 'button',
  LINK = 'link',

  // 布局组件（提供布局能力）
  CONTAINER = 'container',
  GRID = 'grid',
  FLEX = 'flex',

  // 数据组件（数据绑定能力）
  FORM = 'form',
  DATA_GRID = 'datagrid',
  LIST = 'list',

  // 兼容性组件（向后兼容）
  TABLE = 'table' // 建议使用 DATA_GRID 替代
}

/**
 * 分页配置接口
 * 通用分页组件配置，可在多个组件中复用
 */
export interface PaginationConfig {
  page: number // 当前页码
  pageSize: number // 每页行数
  total: number // 总记录数
  onChange: (page: number, pageSize: number) => void // 页码变化处理器
}

/**
 * 传统表格列配置（兼容性接口）
 * 用于传统的 TableComponent，与 DataGridColumn 区分
 */
export interface TableColumn {
  key: string // 列键名
  title: string // 列标题
  dataType?: 'string' | 'number' | 'date' | 'boolean' // 数据类型
  width?: number // 列宽度
  sortable?: boolean // 是否可排序
  filterable?: boolean // 是否可筛选
  align?: 'left' | 'center' | 'right' // 对齐方式
  render?: (value: any, record: any) => React.ReactNode // 自定义渲染函数
}

// ===========================
// 2. 混入接口（Mixin Interfaces）
// ===========================

/**
 * 样式混入接口 - 提供通用样式属性
 */
export interface StyleMixin {
  // 基础样式配置（注意：margin 应优先使用组件级的 margin 配置）
  style?: {
    width?: string | number
    height?: string | number
    padding?: string
    backgroundColor?: string
    color?: string
    border?: string
    borderRadius?: number | string
    fontSize?: string | number
    fontWeight?: string | number
    textAlign?: 'left' | 'center' | 'right' | 'justify'
    display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none'
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
    zIndex?: number
    opacity?: number
    boxShadow?: string
  }

  // CSS 类名和内联样式
  className?: string // CSS 类名
  cssText?: string // 内联 CSS 文本
}

/**
 * 状态混入接口 - 提供通用状态属性
 */
export interface StateMixin {
  // 组件状态（公开配置）
  loading?: boolean // 是否加载中
  disabled?: boolean // 是否禁用
  visible?: boolean // 是否可见
  readonly?: boolean // 是否只读

  // 内部交互状态（私有，运行时状态）
  readonly _internalState?: {
    readonly hover?: boolean // 是否悬停状态
    readonly focus?: boolean // 是否焦点状态
    readonly active?: boolean // 是否激活状态
    readonly error?: boolean // 是否错误状态
    readonly initialized?: boolean // 是否已初始化
    readonly mounted?: boolean // 是否已挂载
  }
}

/**
 * 事件混入接口 - 提供通用事件处理
 */
export interface EventMixin {
  // 通用事件处理器
  onClick?: string // 点击事件处理器ID
  onDoubleClick?: string // 双击事件处理器ID
  onMouseEnter?: string // 鼠标进入事件处理器ID
  onMouseLeave?: string // 鼠标离开事件处理器ID
  onFocus?: string // 获得焦点事件处理器ID
  onBlur?: string // 失去焦点事件处理器ID

  // 键盘事件
  onKeyDown?: string // 键盘按下事件处理器ID
  onKeyUp?: string // 键盘释放事件处理器ID

  // 自定义事件
  customEvents?: Record<string, string> // 自定义事件处理器映射
}

/**
 * 验证混入接口 - 提供表单验证能力
 */
export interface ValidationMixin {
  // 验证规则（公开配置）
  rules?: Array<{
    type?: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom'
    value?: any // 规则值（如最小值、最大值、正则表达式等）
    message?: string // 错误消息
    trigger?: 'blur' | 'change' | 'submit' // 触发时机
    validator?: string // 自定义验证器函数ID
  }>

  // 验证配置（公开配置）
  validateOnChange?: boolean // 是否在值变化时验证
  validateOnBlur?: boolean // 是否在失去焦点时验证
  showValidationIcon?: boolean // 是否显示验证图标
  validationPosition?: 'right' | 'bottom' // 验证消息位置

  // 内部验证状态（私有，运行时状态）
  readonly _validationState?: {
    readonly isValid?: boolean // 是否通过验证
    readonly errors?: readonly string[] // 错误消息列表
    readonly warnings?: readonly string[] // 警告消息列表
    readonly touched?: boolean // 是否已被触摸
    readonly dirty?: boolean // 是否已被修改
    readonly validating?: boolean // 是否正在验证
    readonly lastValidation?: Date // 最后验证时间
  }
}

/**
 * 性能优化混入接口 - 提供性能优化配置
 */
export interface PerformanceMixin {
  // 渲染优化配置（公开配置）
  memo?: boolean // 是否使用 React.memo 优化
  shouldUpdate?: string // 自定义更新判断函数ID

  // 懒加载配置（公开配置）
  lazy?: {
    enabled?: boolean // 是否启用懒加载
    threshold?: number // 触发懒加载的距离（像素）
    placeholder?: string // 懒加载占位符组件ID
    loader?: () => Promise<Component> // 动态加载器函数
    fallback?: Component // 加载失败时的回退组件
  }

  // 虚拟化配置（公开配置，适用于大数据量组件）
  virtualization?: {
    enabled?: boolean // 是否启用虚拟化
    itemHeight?: number // 每项高度（用于计算）
    containerHeight?: number // 容器高度
    overscan?: number // 额外渲染的项目数
    estimatedSize?: number // 预估大小
    threshold?: number // 启用虚拟化的数据量阈值
  }

  // 缓存配置（公开配置）
  cache?: {
    enabled?: boolean // 是否启用缓存
    strategy?: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB' // 缓存策略
    ttl?: number // 缓存时间（毫秒）
    key?: string // 缓存键名
    version?: string // 缓存版本，用于缓存失效
    compress?: boolean // 是否压缩缓存数据
  }

  // 内部性能状态（私有，运行时状态）
  readonly _performanceState?: {
    readonly renderCount?: number // 渲染次数
    readonly lastRenderTime?: Date // 最后渲染时间
    readonly renderDuration?: number // 渲染耗时（毫秒）
    readonly cacheHits?: number // 缓存命中次数
    readonly cacheMisses?: number // 缓存未命中次数
    readonly isLazyLoaded?: boolean // 是否已懒加载
    readonly virtualizedRange?: { start: number; end: number } // 虚拟化范围
    readonly memoryUsage?: number // 内存使用量（字节）
    readonly lastOptimizationTime?: Date // 最后优化时间
  }
}

/**
 * 扩展性混入接口 - 提供插件和主题支持
 */
export interface ExtensibilityMixin {
  // 插件系统（公开配置）
  plugins?: Array<{
    name: string // 插件名称
    version: string // 插件版本
    enabled?: boolean // 是否启用
    config?: Record<string, any> // 插件配置
    dependencies?: string[] // 依赖的其他插件
    install?: (component: Component) => void // 安装函数
    uninstall?: (component: Component) => void // 卸载函数
    onUpdate?: (component: Component, changes: any) => void // 更新回调
  }>

  // 主题系统（公开配置）
  theme?: {
    name?: string // 主题名称
    colors?: {
      primary?: string // 主色调
      secondary?: string // 次要色调
      success?: string // 成功色
      warning?: string // 警告色
      error?: string // 错误色
      info?: string // 信息色
      textPrimary?: string // 主要文本色
      textSecondary?: string // 次要文本色
      background?: string // 背景色
      surface?: string // 表面色
      border?: string // 边框色
      shadow?: string // 阴影色
    }
    typography?: {
      fontFamily?: string // 字体族
      fontSize?: Record<string, string> // 字体大小映射
      fontWeight?: Record<string, string | number> // 字体粗细映射
      lineHeight?: Record<string, string | number> // 行高映射
    }
    spacing?: Record<string, string | number> // 间距映射
    borderRadius?: Record<string, string | number> // 圆角映射
    shadows?: Record<string, string> // 阴影映射
    zIndex?: Record<string, number> // 层级映射
    breakpoints?: Record<string, string> // 响应式断点
    custom?: Record<string, any> // 自定义主题变量
  }

  // 国际化支持（公开配置）
  i18n?: {
    locale?: string // 当前语言环境
    fallbackLocale?: string // 回退语言环境
    messages?: Record<string, Record<string, string>> // 多语言文本映射
    dateFormat?: string // 日期格式
    numberFormat?: string // 数字格式
    rtl?: boolean // 是否从右到左布局
  }

  // 无障碍支持（公开配置）
  accessibility?: {
    enabled?: boolean // 是否启用无障碍支持
    ariaLabel?: string // ARIA 标签
    ariaDescribedBy?: string // ARIA 描述
    role?: string // 角色
    tabIndex?: number // Tab 索引
    focusable?: boolean // 是否可聚焦
    screenReaderText?: string // 屏幕阅读器文本
    highContrast?: boolean // 是否启用高对比度模式
    reducedMotion?: boolean // 是否减少动画效果
  }

  // 内部扩展状态（私有，运行时状态）
  readonly _extensibilityState?: {
    readonly loadedPlugins?: readonly string[] // 已加载的插件
    readonly failedPlugins?: readonly string[] // 加载失败的插件
    readonly activeTheme?: string // 当前激活的主题
    readonly appliedLocale?: string // 已应用的语言环境
    readonly accessibilityScore?: number // 无障碍评分
    readonly pluginErrors?: readonly { plugin: string; error: string }[] // 插件错误信息
  }
}

/**
 * 调试支持混入接口 - 提供开发调试能力
 */
export interface DebugMixin {
  // 调试配置（公开配置）
  debug?: {
    enabled?: boolean // 是否启用调试
    level?: 'error' | 'warn' | 'info' | 'debug' | 'trace' // 日志级别
    logger?: (level: string, message: string, data?: any) => void // 自定义日志函数
    showComponentBoundary?: boolean // 是否显示组件边界
    showRenderTime?: boolean // 是否显示渲染时间
    trackStateChanges?: boolean // 是否跟踪状态变化
    profilePerformance?: boolean // 是否进行性能分析
    captureErrors?: boolean // 是否捕获错误
    debugProps?: boolean // 是否调试属性变化
  }

  // 验证配置（公开配置）
  validation?: {
    enabled?: boolean // 是否启用配置验证
    strict?: boolean // 是否严格模式
    showWarnings?: boolean // 是否显示警告
    customRules?: Array<{
      name: string // 规则名称
      validator: (config: any) => { valid: boolean; message?: string } // 验证函数
    }>
  }

  // 内部调试状态（私有，运行时状态）
  readonly _debugState?: {
    readonly renderHistory?: readonly { timestamp: Date; duration: number; props: any }[] // 渲染历史
    readonly errorHistory?: readonly { timestamp: Date; error: Error; context: any }[] // 错误历史
    readonly stateChangeHistory?: readonly { timestamp: Date; before: any; after: any }[] // 状态变化历史
    readonly performanceMetrics?: {
      readonly averageRenderTime?: number // 平均渲染时间
      readonly maxRenderTime?: number // 最大渲染时间
      readonly minRenderTime?: number // 最小渲染时间
      readonly totalRenderCount?: number // 总渲染次数
    }
    readonly validationErrors?: readonly string[] // 验证错误
    readonly validationWarnings?: readonly string[] // 验证警告
  }
}

// ===========================
// 3. 核心组件接口层次
// ===========================

/**
 * 组件接口 - 所有组件的根接口
 * Component 表示在页面中实际使用的组件实例，包含所有配置信息
 * 布局和外边距配置继承自 BaseEntity (24列Grid约定)
 * 
 * 组合设计模式：通过混入接口提供横切关注点
 * - StyleMixin: 样式配置
 * - StateMixin: 状态管理
 * - EventMixin: 事件处理
 * - PerformanceMixin: 性能优化
 * - ExtensibilityMixin: 扩展性支持
 * - DebugMixin: 调试支持
 */
export interface Component extends
  BaseEntity,
  StyleMixin,
  StateMixin,
  EventMixin,
  PerformanceMixin,
  ExtensibilityMixin,
  DebugMixin {

  // 基础属性
  type: ComponentType | string // 组件类型（支持枚举或自定义字符串）

  // 组件元数据（公开配置）
  displayName?: string // 组件显示名称（用于调试和引用）
  description?: string // 组件描述
  componentVersion?: string // 组件版本（区别于BaseEntity的version）
  author?: string // 组件作者
  tags?: string[] // 组件标签（用于分类和搜索）
  category?: string // 组件分类

  // 组件特定的其他配置
  [key: string]: any
}

/**
 * 容器组件接口 - 可包含子组件的基础容器
 * 继承自 Component，使用 CSS Grid 24列布局约定
 * 布局约定：display: grid, grid-template-columns: repeat(24, 1fr), gap: 0
 */
export interface Container extends Component {
  // 容器特有属性（公开配置）
  children: Component[] // 子组件列表

  // 容器尺寸配置（公开配置）
  minWidth?: number | string // 最小宽度
  maxWidth?: number | string // 最大宽度
  minHeight?: number | string // 最小高度
  maxHeight?: number | string // 最大高度

  // 容器交互配置（公开配置）
  scrollable?: boolean // 是否可滚动
  collapsible?: boolean // 是否可折叠
  collapsed?: boolean // 是否已折叠

  // 容器特有状态（私有，运行时状态）
  readonly _containerState?: {
    readonly empty?: boolean // 是否为空状态
    readonly childrenCount?: number // 子组件数量
    readonly renderOrder?: readonly string[] // 子组件渲染顺序
    readonly scrollPosition?: { x: number; y: number } // 滚动位置
    readonly isOverflowing?: boolean // 是否溢出
  }
}

/**
 * 数据绑定接口 - 为组件提供数据绑定能力
 * 可以与其他组件接口组合使用，支持多重继承模式
 */
export interface DataBinding {
  // 数据绑定配置（公开配置）
  datamember?: string // 数据成员：绑定到dataset中的表名
  dataLevel?: 'row' | 'table' // 数据级别：'row'=行级数据（单条记录），'table'=表级数据（整个数据表）

  // 数据事件处理（公开配置）
  onDataLoad?: string // 数据加载事件处理器ID
  onDataChange?: string // 数据变化事件处理器ID
  onDataError?: string // 数据错误事件处理器ID

  // 内部数据状态（私有，运行时状态）
  readonly _dataState?: {
    readonly loading?: boolean // 数据是否加载中
    readonly error?: string // 数据加载错误信息
    readonly empty?: boolean // 数据是否为空
    readonly total?: number // 数据总数（表级数据时）
    readonly current?: number // 当前数据索引（行级数据时）
    readonly lastUpdated?: Date // 最后更新时间
    readonly version?: number // 数据版本号
    readonly isDirty?: boolean // 数据是否已修改
  }
}

/**
 * 列排序混入接口 - 提供列级排序能力
 */
export interface ColumnSortMixin {
  // 排序基础配置（公开配置）
  sortable?: boolean // 是否可排序

  // 排序配置（公开配置）
  sortConfig?: {
    sortType?: 'string' | 'number' | 'date' | 'currency' | 'percent' | 'custom' // 排序类型
    defaultSort?: 'asc' | 'desc' // 默认排序方向
    sortOrder?: number // 排序优先级（多列排序时使用，数字越小优先级越高）
    customSort?: string // 自定义排序函数ID
    nullsFirst?: boolean // 空值是否排在前面
    caseSensitive?: boolean // 字符串排序是否区分大小写
  }

  // 内部排序状态（私有，运行时状态）
  readonly _columnSortState?: {
    readonly currentSortDirection?: 'asc' | 'desc' | null // 当前排序方向
    readonly sortIndex?: number // 在多列排序中的索引
    readonly isSorting?: boolean // 是否正在排序
    readonly lastSortTime?: Date // 最后排序时间
  }
}

/**
 * 组别聚合计算器接口
 * Group-based aggregation calculator interface
 */
export interface GroupAggregationCalculator {
  /**
   * 计算指定组别的聚合值
   * Calculate aggregation values for specific group level
   */
  calculateForGroup(
    data: any[],
    groupLevel: number,
    aggregationConfig: {
      type: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'custom'
      field: string
      includeSubGroups?: boolean
      aggregateAcrossGroups?: boolean
      condition?: string
      customFunction?: string
    }
  ): number | any

  /**
   * 获取组别层级结构
   * Get group level hierarchy
   */
  getGroupHierarchy(data: any[], columns: any[]): Record<number, string[]>

  /**
   * 重置指定组别的聚合缓存
   * Reset aggregation cache for specific group
   */
  resetGroupCache(groupLevel: number, groupKey: string): void

  /**
   * 获取跨组总计
   * Get grand totals across all groups
   */
  getGrandTotals(data: any[], aggregationConfigs: any[]): Record<string, any>
}

/**
 * 列分组混入接口 - 提供列级分组能力
 */
export interface ColumnGroupMixin {
  // 分组配置（公开配置）
  groupConfig?: {
    groupBy: number // 分组组别（1=第一组，2=第二组，依此类推）
    // 同一组别包含多个字段时，这些字段会组合成复合分组键
    // 例如：地区(groupBy=1) + 产品类别(groupBy=1) = "华北 + 电子产品"
    // Multiple fields with same groupBy will combine into composite key
    // 聚合函数按组别分层计算，第一组别层级最高

    // 分组显示配置
    groupTemplate?: string // 分组显示模板，如 '{region} - {period}'
    groupSeparator?: string // 组合分组的分隔符（默认 '-'）
    showGroupCount?: boolean // 是否显示分组计数
    expandable?: boolean // 分组是否可展开/折叠
    defaultExpanded?: boolean // 默认是否展开
    displaySeparator?: string // 分组标题显示分隔符

    // 分组聚合配置
    aggregations?: Array<{
      type: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'custom' // 聚合类型
      field?: string // 聚合字段（如果与当前列不同）
      label?: string // 聚合显示标签
      position?: 'header' | 'footer' | 'both' // 聚合值显示位置
      format?: string // 聚合值格式化字符串
      precision?: number // 数值精度
      customFunction?: string // 自定义聚合函数ID
      condition?: string // 聚合条件表达式
      visible?: boolean // 是否显示聚合值

      // 根据组别计算的配置
      groupLevel?: number // 在哪个组别层级计算聚合（默认为当前列的 groupBy）
      includeSubGroups?: boolean // 是否包含子组别的数据（默认 false）
      aggregateAcrossGroups?: boolean // 是否跨组计算（用于总计，默认 false）
      resetAtGroupChange?: boolean // 组别变化时是否重置累计值（默认 true）
    }>

    // 聚合显示配置
    aggregationConfig?: {
      showGrandTotal?: boolean // 是否显示总计
      aggregationSeparator?: string // 聚合值分隔符
      aggregationPrefix?: string // 聚合值前缀
      aggregationSuffix?: string // 聚合值后缀
    }
  }

  // 内部分组状态（私有，运行时状态）
  readonly _columnGroupState?: {
    readonly isGrouped?: boolean // 是否已分组
    readonly groupIndex?: number // 在多列分组中的索引
    readonly groupValues?: readonly any[] // 当前分组值列表
    readonly expandedGroups?: readonly any[] // 展开的分组
    readonly groupCount?: Record<any, number> // 各分组的计数
    readonly lastGroupTime?: Date // 最后分组时间

    // 聚合计算状态 - 按组别分层存储
    readonly aggregationCache?: Record<number, { // 第一层：组别层级
      readonly groupResults?: Record<string, { // 第二层：组别键值
        readonly sum?: number // 求和结果
        readonly count?: number // 计数结果
        readonly avg?: number // 平均值结果
        readonly min?: number // 最小值结果
        readonly max?: number // 最大值结果
        readonly custom?: any // 自定义聚合结果
        readonly lastUpdate?: Date // 最后更新时间
        readonly dataCount?: number // 参与计算的数据条数
        readonly subGroupTotals?: Record<string, any> // 子组合计
      }>
      readonly levelGrandTotal?: { // 该层级的总计
        readonly sum?: number
        readonly count?: number
        readonly avg?: number
        readonly min?: number
        readonly max?: number
        readonly custom?: any
      }
    }> // 按组别分层的聚合计算缓存

    readonly overallGrandTotals?: {
      readonly sum?: number
      readonly count?: number
      readonly avg?: number
      readonly min?: number
      readonly max?: number
      readonly custom?: any
    } // 跨所有组别的总计聚合结果
  }
}

/**
 * 数据网格列配置接口 - 包装任何组件作为列使用
 * 
 * 设计理念：使用组合模式而非继承模式
 * - 组合模式：DataGridColumn 包含 component 属性，支持任意组件类型
 * - 继承模式：为每种组件创建对应的列组件接口 (如 InputColumn, SelectColumn)
 * 
 * 选择组合模式的原因：
 * 1. 简单直观：一个配置接口，清晰的组件属性
 * 2. 易于扩展：新增组件类型只需修改联合类型
 * 3. 维护便利：列相关属性集中管理
 * 4. 类型安全：通过联合类型提供强类型约束
 * 
 * 列头标题和样式直接使用组件的 label 相关属性
 * 
 * 使用示例：
 * ```typescript
 * const idColumn: DataGridColumn = {
 *   id: 'userId',
 *   isPrimaryKey: true,              // 标识为主键列
 *   width: 80,
 *   sortable: true,
 *   sortConfig: {
 *     sortType: 'number',
 *     sortOrder: 1,                  // 排序优先级
 *     defaultSort: 'asc'
 *   },
 *   component: {
 *     type: ComponentType.TEXT,
 *     label: 'ID',
 *     labelAlign: 'center'
 *   }
 * }
 * 
 * const nameColumn: DataGridColumn = {
 *   id: 'name',
 *   isPrimaryKey: false,
 *   width: 200,
 *   sortable: true,
 *   groupable: true,                 // 支持分组
 *   groupConfig: {
 *     groupType: 'value',
 *     groupBy: 'prefix',             // 按首字母分组
 *     groupOrder: 1,
 *     showGroupCount: true
 *   },
 *   component: {
 *     type: ComponentType.INPUT,
 *     fieldName: 'name',
 *     label: '姓名',                    // 直接作为列标题
 *     labelAlign: 'center',            // 列头居中对齐
 *     labelStyle: {                    // 列头样式
 *       fontWeight: 'bold',
 *       color: '#333'
 *     }
 *   }
 * }
 * 
 * // 货币格式分组示例
 * const priceColumn: DataGridColumn = {
 *   id: 'price',
 *   isPrimaryKey: false,
 *   sortable: true,
 *   groupable: true,
 *   sortConfig: {
 *     sortType: 'currency',
 *     sortOrder: 2                   // 次要排序
 *   },
 *   groupConfig: {
 *     groupType: 'range',
 *     groupOrder: 2,
 *     ranges: [
 *       { label: '经济型', max: 100 },
 *       { label: '标准型', min: 100, max: 500 },
 *       { label: '豪华型', min: 500 }
 *     ],
 *     showGroupCount: true,
 *     expandable: true,
 *     defaultExpanded: false
 *   },
 *   component: {
 *     type: ComponentType.INPUT,
 *     fieldName: 'price',
 *     label: '价格',
 *     dataFormat: {                    // 使用组件自身的格式化配置
 *       type: 'currency',
 *       currency: '¥',
 *       precision: 2,
 *       thousandSeparator: true
 *     },
 *     valueAlign: 'right'              // 数值右对齐
 *   }
 * }
 * 
 * // 日期分组示例
 * const createTimeColumn: DataGridColumn = {
 *   id: 'createTime',
 *   isPrimaryKey: false,
 *   sortable: true,
 *   groupable: true,
 *   sortConfig: {
 *     sortType: 'date',
 *     defaultSort: 'desc'
 *   },
 *   groupConfig: {
 *     groupType: 'date',
 *     dateGroupBy: 'month',           // 按月分组
 *     groupOrder: 3,
 *     showGroupCount: true
 *   },
 *   component: {
 *     type: ComponentType.DATE_PICKER,
 *     fieldName: 'createTime',
 *     label: '创建时间',
 *     dataFormat: {
 *       type: 'datetime',
 *       dateFormat: 'YYYY-MM-DD HH:mm'
 *     }
 *   }
 * }
 * ```
 */
/**
 * 数据网格列配置接口 - 包装任何组件作为列使用
 * 
 * 设计理念：使用组合模式而非继承模式
 * - 组合模式：DataGridColumn 包含 component 属性，支持任意组件类型
 * - 混入模式：通过 ColumnSortMixin 和 ColumnGroupMixin 提供排序和分组能力
 * 
 * 选择组合模式的原因：
 * 1. 简单直观：一个配置接口，清晰的组件属性
 * 2. 易于扩展：新增组件类型只需修改联合类型
 * 3. 维护便利：列相关属性集中管理
 * 4. 类型安全：通过联合类型提供强类型约束
 * 
 * 列头标题和样式直接使用组件的 label 相关属性
 * 
 * 使用示例：
 * ```typescript
 * const nameColumn: DataGridColumn = {
 *   id: 'name',
 *   isPrimaryKey: false,
 *   width: 200,
 *   sortable: true,
 *   sortConfig: {
 *     sortType: 'string',
 *     sortOrder: 1
 *   },
 *   component: {
 *     type: ComponentType.INPUT,
 *     fieldName: 'name',
 *     label: '姓名',                    // 直接作为列标题
 *     labelAlign: 'center',            // 列头居中对齐
 *     labelStyle: {                    // 列头样式
 *       fontWeight: 'bold',
 *       color: '#333'
 *     }
 *   }
 * }
 * 
 * // 货币格式示例
 * const priceColumn: DataGridColumn = {
 *   id: 'price',
 *   isPrimaryKey: false,
 *   groupable: true,
 *   groupConfig: {
 *     groupType: 'range',
 *     ranges: [
 *       { label: '低价', max: 100 },
 *       { label: '中价', min: 100, max: 500 },
 *       { label: '高价', min: 500 }
 *     ]
 *   },
 *   component: {
 *     type: ComponentType.INPUT,
 *     fieldName: 'price',
 *     label: '价格',
 *     dataFormat: {                    // 使用组件自身的格式化配置
 *       type: 'currency',
 *       currency: '¥',
 *       precision: 2,
 *       thousandSeparator: true
 *     },
 *     valueAlign: 'right'              // 数值右对齐
 *   }
 * }
 * ```
 */
export interface DataGridColumn extends ColumnSortMixin, ColumnGroupMixin {
  // 列标识和基础属性
  id: string // 列唯一标识
  isPrimaryKey?: boolean // 是否为主键列
  // 注意：列标题使用组件的 label 属性，列头样式使用组件的 labelStyle 等属性

  // 列显示配置（也可使用值组件对应属性）
  width?: number | string // 列宽度
  minWidth?: number // 最小宽度
  maxWidth?: number // 最大宽度
  fixed?: 'left' | 'right' | boolean // 是否固定列
  align?: 'left' | 'center' | 'right' // 对齐方式
  hidden?: boolean // 是否隐藏

  // 列功能配置
  filterable?: boolean // 是否可筛选
  resizable?: boolean // 是否可调整大小
  copyable?: boolean // 是否可复制
  exportable?: boolean // 是否参与导出

  // 列中的组件配置（核心改变：直接使用具体组件类型）
  // 当使用 ValueComponent 时，其相关属性直接用于列配置：
  // - component.label: 列标题文本
  // - component.labelStyle: 列头样式（fontSize, fontWeight, color, margin）
  // - component.labelAlign: 列头文本对齐方式（'left' | 'center' | 'right'）
  // - component.labelPosition: 在单元格中控制标签位置（'top' | 'left' | 'right' | 'bottom' | 'inside'）
  // - component.labelWidth: 列头区域宽度（当需要固定列头宽度时）
  // - component.dataFormat: 数据格式化配置（类型、精度、货币、日期格式等）
  // - component.valueAlign: 列值对齐方式
  component: ColumnComponent

  // 数据类型（从组件的 dataFormat.type 推断，或手动指定）
  // 注意：通常可以从 component.dataFormat.type 自动推断，无需手动设置
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'percent'

  // 筛选配置
  filterConfig?: {
    filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean' | 'range' | 'multi-select' // 筛选类型
    filterOptions?: Array<{ label: string; value: any }> // 选择型筛选的选项
    filterPlaceholder?: string // 筛选占位符
    filterOperator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' // 筛选操作符
    caseSensitive?: boolean // 是否区分大小写
    allowEmpty?: boolean // 是否允许空值筛选
  }

  // 列事件处理
  onCellClick?: string // 单元格点击事件处理器ID
  onCellDoubleClick?: string // 单元格双击事件处理器ID
  onHeaderClick?: string // 表头点击事件处理器ID
  onCellEdit?: string // 单元格编辑事件处理器ID
  onCellValidate?: string // 单元格验证事件处理器ID

  // 列权限控制
  permissions?: {
    view?: boolean | string // 查看权限（可以是表达式）
    edit?: boolean | string // 编辑权限（可以是表达式）
    sort?: boolean | string // 排序权限（可以是表达式）
    filter?: boolean | string // 筛选权限（可以是表达式）
    group?: boolean | string // 分组权限（可以是表达式）
    export?: boolean | string // 导出权限（可以是表达式）
  }
}

// ===========================
// 5. 数据网格专用类型
// ===========================

/**
 * 列组件类型别名 - 方便类型推断和使用
 * 支持的列组件类型：值组件、按钮组件、文本组件、模板配置
 */
export type ColumnComponent = ValueComponent | ButtonComponent | TextComponent | {
  type: 'template'
  template: {
    type: 'react' | 'html' | 'component'
    content: string
    props?: Record<string, any>
  }
  dataBinding?: {
    rowData?: string
    rowIndex?: string
    columnValue?: string
  }
  templateEvents?: {
    [eventName: string]: string
  }
}

// ===========================
// 4. 专业化组件接口
// ===========================

/**
 * 字段基础组件接口 - 提供基础字段绑定能力
 * 所有表单字段组件的基础接口
 */
export interface FieldComponent extends Component {
  // 字段基础属性（公开配置）
  fieldName: string // 字段名称，用于数据绑定
  label?: string // 字段标签
  placeholder?: string // 占位符文本

  // 数据绑定（公开配置）
  value?: any // 字段值
  defaultValue?: any // 默认值

  // 字段特有事件（公开配置）
  onChange?: string // 值变化事件处理器ID

  // 内部字段状态（私有，运行时状态）
  readonly _fieldState?: {
    readonly previousValue?: any // 上一个值
    readonly originalValue?: any // 原始值
    readonly isValueChanged?: boolean // 值是否已改变
    readonly lastChangeTime?: Date // 最后修改时间
    readonly changeCount?: number // 修改次数
  }
}

/**
 * 标签配置混入接口 - 提供标签显示和样式配置
 * 可与其他组件接口组合使用
 */
export interface LabelMixin {
  // 标签位置和对齐（公开配置）
  labelPosition?: 'top' | 'left' | 'right' | 'bottom' | 'inside' // 标签位置
  labelAlign?: 'left' | 'center' | 'right' // 标签对齐方式
  labelWidth?: number | string // 标签宽度（当位置为left/right时）

  // 标签样式配置（公开配置）
  labelStyle?: {
    fontSize?: string | number // 标签字体大小
    fontWeight?: string | number // 标签字体粗细
    color?: string // 标签颜色
    margin?: string // 标签边距
    textDecoration?: string // 文本装饰
    lineHeight?: string | number // 行高
  }

  // 标签行为配置（公开配置）
  labelClickable?: boolean // 标签是否可点击
  labelTooltip?: string // 标签提示信息
  labelIcon?: string // 标签图标
}

/**
 * 格式化混入接口 - 提供数据格式化能力
 * 可与其他组件接口组合使用
 */
export interface FormatMixin {
  // 值显示配置（公开配置）
  valueAlign?: 'left' | 'center' | 'right' // 值的对齐方式

  // 数据格式化配置（公开配置）
  dataFormat?: {
    type?: 'currency' | 'percent' | 'decimal' | 'date' | 'datetime' | 'time' | 'custom' // 数据格式类型
    precision?: number // 数字精度（小数位数）
    currency?: string // 货币符号（如: ¥, $, €）
    dateFormat?: string // 日期格式（如: YYYY-MM-DD, DD/MM/YYYY）
    timeFormat?: string // 时间格式（如: HH:mm:ss, hh:mm A）
    customFormat?: string // 自定义格式化字符串或函数ID
    thousandSeparator?: boolean // 是否显示千位分隔符
    prefix?: string // 前缀
    suffix?: string // 后缀
    locale?: string // 本地化设置（如: zh-CN, en-US）
  }

  // 内部格式化状态（私有，运行时状态）
  readonly _formatState?: {
    readonly formattedValue?: string // 格式化后的显示值
    readonly rawValue?: any // 原始值
    readonly formatError?: string // 格式化错误信息
    readonly lastFormatTime?: Date // 最后格式化时间
  }
}

/**
 * 值组件接口 - 组合字段、标签、格式化和验证能力
 * 为所有输入类组件提供完整的值处理能力
 * 
 * 设计理念：通过组合多个混入接口实现功能模块化
 * - FieldComponent: 基础字段绑定
 * - LabelMixin: 标签配置
 * - FormatMixin: 格式化配置  
 * - ValidationMixin: 验证规则
 */
export interface ValueComponent extends FieldComponent, LabelMixin, FormatMixin, ValidationMixin {
  // ValueComponent 作为组合接口，不添加额外属性
  // 所有功能通过混入接口提供，保持接口职责单一
}

/**
 * 选项数据源接口 - 为需要选项列表的组件提供数据源配置
 * 可以与 ValueComponent 组合使用
 */
export interface OptionDataSource {
  // 组件类型配置（公开配置）
  componentType?: 'select' | 'checkbox' | 'radio' | 'cascader' | 'transfer' | 'tree-select' // 选项组件类型

  // 数据源配置（公开配置）
  dataSource?: string // 表名，从数据集中获取选项数据

  // 字段映射配置（公开配置）
  valueField?: string // 值字段名（存储的值对应的字段）
  textField?: string // 文本字段名（显示的文本对应的字段）

  // 多选配置（公开配置）
  multiple?: boolean // 是否支持多选
  valueSeparator?: string // 多选时值的分隔符（默认为逗号）
  textSeparator?: string // 多选时显示文本的分隔符（默认为逗号）
  maxSelections?: number // 最大选择数量（多选时）

  // 选项过滤和搜索（公开配置）
  filterable?: boolean // 是否可过滤
  searchable?: boolean // 是否可搜索
  searchPlaceholder?: string // 搜索占位符

  // 加载状态（公开配置）
  loading?: boolean // 是否正在加载数据
  loadingText?: string // 加载文本

  // 无数据状态（公开配置）
  emptyText?: string // 无数据时显示的文本

  // 内部选项状态（私有，运行时状态）
  readonly _optionState?: {
    readonly options?: readonly any[] // 当前选项列表
    readonly filteredOptions?: readonly any[] // 过滤后的选项列表
    readonly selectedValues?: readonly any[] // 选中的值列表
    readonly searchKeyword?: string // 当前搜索关键词
    readonly loadedTime?: Date // 选项加载时间
  }
}

/**
 * 数据网格工具栏配置接口 - 独立的工具栏配置类型
 * 提供给DataGridComponent使用，也可以独立使用
 */
export interface DataGridToolbarConfig {
  // 工具栏显示配置
  visible?: boolean // 是否显示工具栏
  position?: 'top' | 'bottom' | 'both' // 工具栏位置
  align?: 'left' | 'center' | 'right' | 'space-between' // 工具栏对齐方式
  size?: 'small' | 'medium' | 'large' // 工具栏大小

  // 内置功能按钮
  add?: boolean | {
    text?: string // 按钮文本
    icon?: string // 图标
    type?: 'primary' | 'default' | 'dashed' // 按钮类型
    size?: 'small' | 'medium' | 'large' // 按钮大小
    disabled?: boolean | string // 是否禁用（可以是表达式）
    tooltip?: string // 提示文本
    modal?: boolean // 是否在模态框中打开
    permission?: string // 权限控制
  } // 添加按钮配置

  refresh?: boolean | {
    text?: string
    icon?: string
    type?: 'default' | 'primary' | 'ghost'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean | string
    tooltip?: string
    auto?: boolean // 是否自动刷新
    interval?: number // 自动刷新间隔（秒）
  } // 刷新按钮配置

  export?: boolean | {
    text?: string
    icon?: string
    type?: 'default' | 'primary' | 'ghost'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean | string
    tooltip?: string
    formats?: ('excel' | 'csv' | 'pdf' | 'json')[] // 支持的导出格式
    fileName?: string // 默认文件名
    includeHeaders?: boolean // 是否包含表头
    selectedOnly?: boolean // 是否只导出选中行
    permission?: string // 权限控制
  } // 导出按钮配置

  // 搜索和筛选功能
  search?: boolean | {
    visible?: boolean // 是否显示搜索框
    placeholder?: string // 搜索占位符
    position?: 'toolbar' | 'table-header' | 'both' // 搜索框位置
    size?: 'small' | 'medium' | 'large' // 搜索框大小
    debounce?: number // 防抖延迟（毫秒）
    clearable?: boolean // 是否可清空
    enterSearch?: boolean // 是否回车触发搜索
    searchFields?: string[] // 搜索字段范围
    caseSensitive?: boolean // 是否区分大小写
    fuzzySearch?: boolean // 是否模糊搜索
  } // 搜索配置

  filter?: boolean | {
    visible?: boolean // 是否显示筛选器
    position?: 'toolbar' | 'column-header' | 'both' // 筛选器位置
    showReset?: boolean // 是否显示重置按钮
    showApply?: boolean // 是否显示应用按钮
    autoApply?: boolean // 是否自动应用筛选
    filterMode?: 'simple' | 'advanced' // 筛选模式
    saveFilters?: boolean // 是否保存筛选条件
    quickFilters?: Array<{
      key: string // 筛选键
      label: string // 筛选标签
      value: any // 筛选值
      icon?: string // 图标
    }> // 快速筛选按钮
  } // 筛选配置

  // 批量操作功能
  batchActions?: {
    visible?: boolean // 是否显示批量操作
    position?: 'toolbar' | 'selection-info' // 批量操作位置
    showCount?: boolean // 是否显示选中数量
    countText?: string // 数量显示文本模板
    actions?: Array<{
      key: string // 操作键
      text: string // 操作文本
      icon?: string // 图标
      type?: 'primary' | 'default' | 'danger' | 'warning' // 按钮类型
      size?: 'small' | 'medium' | 'large' // 按钮大小
      disabled?: boolean | string // 是否禁用
      tooltip?: string // 提示文本
      confirm?: {
        title?: string // 确认标题
        content?: string // 确认内容
        okText?: string // 确认按钮文本
        cancelText?: string // 取消按钮文本
      } // 确认配置
      action: string // 操作事件处理器ID
      permission?: string // 权限控制
    }>
  } // 批量操作配置

  // 表格设置功能
  settings?: boolean | {
    visible?: boolean // 是否显示设置按钮
    icon?: string // 设置图标
    tooltip?: string // 提示文本
    position?: 'toolbar' | 'dropdown' // 设置按钮位置
    features?: {
      columnVisibility?: boolean // 列显示/隐藏设置
      columnOrder?: boolean // 列排序设置
      columnWidth?: boolean // 列宽设置
      pageSize?: boolean // 页面大小设置
      density?: boolean // 表格密度设置
      export?: boolean // 导出设置
      print?: boolean // 打印设置
      fullscreen?: boolean // 全屏设置
    }
  } // 表格设置配置

  // 信息展示区域
  info?: {
    visible?: boolean // 是否显示信息区域
    position?: 'left' | 'center' | 'right' // 信息区域位置
    showTotal?: boolean // 是否显示总数
    showSelected?: boolean // 是否显示选中数
    showFiltered?: boolean // 是否显示筛选后数量
    totalText?: string // 总数文本模板
    selectedText?: string // 选中数文本模板
    filteredText?: string // 筛选数文本模板
    customInfo?: string // 自定义信息组件ID
  } // 信息展示配置

  // 自定义工具栏项目
  custom?: Array<{
    key: string // 工具项键
    type: 'button' | 'dropdown' | 'input' | 'select' | 'component' // 工具项类型
    position?: 'left' | 'center' | 'right' // 位置
    order?: number // 排序优先级

    // 按钮类型配置
    text?: string // 按钮文本
    icon?: string // 图标
    buttonType?: 'primary' | 'default' | 'danger' | 'warning' | 'ghost' | 'link' // 按钮样式
    size?: 'small' | 'medium' | 'large' // 大小
    disabled?: boolean | string // 是否禁用
    loading?: boolean | string // 是否加载中
    tooltip?: string // 提示文本

    // 下拉菜单配置
    dropdownItems?: Array<{
      key: string // 菜单项键
      text: string // 菜单项文本
      icon?: string // 图标
      disabled?: boolean | string // 是否禁用
      divider?: boolean // 是否显示分割线
      action: string // 操作事件处理器ID
    }>

    // 输入框配置
    inputProps?: {
      placeholder?: string // 占位符
      clearable?: boolean // 是否可清空
      maxLength?: number // 最大长度
      width?: number | string // 宽度
    }

    // 选择器配置
    selectProps?: {
      options?: Array<{ label: string; value: any }> // 选项列表
      placeholder?: string // 占位符
      clearable?: boolean // 是否可清空
      multiple?: boolean // 是否多选
      width?: number | string // 宽度
    }

    // 自定义组件配置
    componentId?: string // 自定义组件ID
    componentProps?: Record<string, any> // 组件属性

    // 事件处理
    action?: string // 操作事件处理器ID
    onChange?: string // 值变化事件处理器ID

    // 权限和显示控制
    permission?: string // 权限控制
    visible?: boolean | string // 是否可见
  }>

  // 工具栏样式配置
  style?: {
    backgroundColor?: string // 背景色
    borderColor?: string // 边框颜色
    padding?: string | number // 内边距
    margin?: string | number // 外边距
    borderRadius?: number | string // 圆角
    boxShadow?: string // 阴影
    minHeight?: number | string // 最小高度
  }

  // 工具栏响应式配置
  responsive?: {
    breakpoints?: {
      xs?: { visible?: boolean; collapsed?: boolean } // 超小屏幕
      sm?: { visible?: boolean; collapsed?: boolean } // 小屏幕
      md?: { visible?: boolean; collapsed?: boolean } // 中等屏幕
      lg?: { visible?: boolean; collapsed?: boolean } // 大屏幕
      xl?: { visible?: boolean; collapsed?: boolean } // 超大屏幕
    }
    collapseThreshold?: number // 折叠阈值（像素）
    collapsedItems?: ('search' | 'filter' | 'export' | 'settings' | 'custom')[] // 优先折叠的项目
  }
}

// ===========================
// 6. 复杂组件类型
// ===========================

/**
 * 表单字段配置 - 动态表单字段定义
 * 继承自 ValueComponent，用于动态表单的字段配置
 */
export interface FormField extends ValueComponent {
  // 字段类型配置
  type: ComponentType.INPUT | ComponentType.TEXTAREA | ComponentType.DATE_PICKER |
  ComponentType.SELECT | ComponentType.CHECKBOX | ComponentType.RADIO
}

// ===========================
// 7. React 组件 Props 接口
// ===========================

/**
 * 动态表单 Props
 */
export interface DynamicFormProps {
  fields: FormField[] // 表单字段配置
  datasetId?: string // 数据集ID
  onSubmit?: (data: Record<string, any>) => void // 提交处理器
  onFieldChange?: (field: string, value: any) => void // 字段变化处理器
  onCancel?: () => void // 取消处理器
  initialValues?: Record<string, any> // 初始值
  readonly?: boolean // 是否只读
  submitText?: string // 提交按钮文本
  cancelText?: string // 取消按钮文本
  className?: string // CSS 类名
}

/**
 * 动态表格 Props
 */
export interface DynamicTableProps {
  columns: TableColumn[] // 列配置
  data?: Record<string, any>[] // 表格数据（可选，可能从datasetId加载）
  datasetId?: string // 数据集ID
  pagination?: boolean | PaginationConfig // 分页配置
  pageSize?: number // 每页行数
  onRowSelect?: (selectedRows: Record<string, any>[]) => void // 行选择处理器
  onRowClick?: (record: Record<string, any>) => void // 行点击处理器
  onSort?: (column: string, direction: 'asc' | 'desc') => void // 排序处理器
  loading?: boolean // 加载状态
  className?: string // CSS 类名
}

/**
 * 组件页面 Props
 */
export interface ComponentPageProps {
  title?: string // 页面标题
  children?: React.ReactNode // 子元素
  pageConfig?: {
    id: string
    name: string
    layout: Container[] // 改为使用Container，页面布局可以包含任何容器组件
  }
  dataState?: Record<string, any> // 页面数据状态
  onDataChange?: (key: string, value: any) => void // 数据变化处理器
}

// ===========================
// 8. 具体组件实现类型
// ===========================

// ===========================
// 8.1 基础展示组件
// ===========================

/**
 * 按钮组件实例
 */
export interface ButtonComponent extends Component {
  type: ComponentType.BUTTON // 组件类型

  // 按钮特定配置
  text?: string // 按钮文本
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' // 按钮样式
  size?: 'small' | 'medium' | 'large' // 按钮大小
  icon?: string // 图标
  iconPosition?: 'left' | 'right' | 'top' | 'bottom' // 图标位置
  htmlType?: 'button' | 'submit' | 'reset' // HTML 类型

  // 按钮状态（继承 StateMixin，不需要重复定义 loading、disabled）
  block?: boolean // 是否块级按钮
}

/**
 * 文本组件实例
 */
export interface TextComponent extends Component {
  type: ComponentType.TEXT // 组件类型

  // 文本特定配置
  content?: string // 文本内容
  textType?: 'title' | 'subtitle' | 'body' | 'caption' // 文本类型
  editable?: boolean // 是否可编辑
  maxLength?: number // 最大长度
  placeholder?: string // 占位符（可编辑时）
  align?: 'left' | 'center' | 'right' | 'justify' // 对齐方式
}

/**
 * 图表组件实例
 */
export interface ChartComponent extends Component {
  type: ComponentType.CHART // 组件类型

  // 图表特定配置
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter' // 图表类型
  title?: string // 图表标题
  xAxisLabel?: string // X轴标签
  yAxisLabel?: string // Y轴标签
  showLegend?: boolean // 是否显示图例
  showGrid?: boolean // 是否显示网格
  colors?: string[] // 颜色配置
}

/**
 * 传统表格组件实例（兼容性组件）
 */
export interface TableComponent extends Component {
  type: ComponentType.TABLE // 组件类型

  // 表格特定配置
  columns?: TableColumn[] // 列配置
  pagination?: boolean // 是否分页
  sortable?: boolean // 是否可排序
  filterable?: boolean // 是否可筛选
  pageSize?: number // 每页行数
  showHeader?: boolean // 是否显示表头
  rowSelection?: 'single' | 'multiple' | 'none' // 行选择模式
}

// ===========================
// 8.2 输入组件
// ===========================

/**
 * 输入框组件实例
 */
export interface InputComponent extends ValueComponent {
  type: ComponentType.INPUT // 组件类型

  // 输入框特定配置
  inputType?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' // 输入类型
  maxLength?: number // 最大字符长度
  minLength?: number // 最小字符长度
  autoComplete?: string // 自动完成类型
  autoFocus?: boolean // 是否自动获得焦点
}

/**
 * 文本域组件实例
 */
export interface TextareaComponent extends ValueComponent {
  type: ComponentType.TEXTAREA // 组件类型

  // 文本域特定配置
  rows?: number // 行数
  cols?: number // 列数
  maxLength?: number // 最大字符长度
  resize?: 'none' | 'vertical' | 'horizontal' | 'both' // 是否可调整大小
  autoFocus?: boolean // 是否自动获得焦点
}

/**
 * 日期选择器组件实例
 */
export interface DatePickerComponent extends ValueComponent {
  type: ComponentType.DATE_PICKER // 组件类型

  // 日期选择器特定配置
  format?: string // 日期格式
  showTime?: boolean // 是否显示时间
  range?: boolean // 是否范围选择
  minDate?: Date | string // 最小日期
  maxDate?: Date | string // 最大日期
  disabledDates?: Date[] | string[] // 禁用的日期
}

// ===========================
// 8.3 选择器组件
// ===========================

/**
 * 选择框组件实例
 */
export interface SelectComponent extends ValueComponent, OptionDataSource {
  type: ComponentType.SELECT // 组件类型

  // 选择框特定配置
  clearable?: boolean // 是否可清空
  optionHeight?: number // 选项高度
  maxVisibleOptions?: number // 最大可见选项数

  // 下拉面板配置
  dropdownWidth?: number | string // 下拉面板宽度
  dropdownMaxHeight?: number // 下拉面板最大高度
  dropdownPlacement?: 'bottom' | 'top' | 'auto' // 下拉面板位置
}

/**
 * 复选框组件实例
 */
export interface CheckboxComponent extends ValueComponent, OptionDataSource {
  type: ComponentType.CHECKBOX // 组件类型

  // 复选框特定配置
  checkboxType?: 'single' | 'group' // 复选框类型：单个或组
  text?: string // 单个复选框的文本
  checked?: boolean // 单个复选框的选中状态
  indeterminate?: boolean // 是否半选状态

  // 复选框组配置
  direction?: 'horizontal' | 'vertical' // 排列方向
  columns?: number // 分列显示（水平排列时）
  spacing?: number // 选项间距

  // 全选配置
  showSelectAll?: boolean // 是否显示全选
  selectAllText?: string // 全选文本
}

/**
 * 单选框组件实例
 */
export interface RadioComponent extends ValueComponent, OptionDataSource {
  type: ComponentType.RADIO // 组件类型

  // 单选框特定配置
  direction?: 'horizontal' | 'vertical' // 排列方向
  columns?: number // 分列显示（水平排列时）
  spacing?: number // 选项间距

  // 按钮样式单选框
  buttonStyle?: boolean // 是否使用按钮样式
  size?: 'small' | 'medium' | 'large' // 按钮大小（按钮样式时）
}

// ===========================
// 9. 联合类型导出
// ===========================

/**
 * 表单组件实例 - 多重继承：容器组件 + 数据绑定
 * 默认为行级数据，用于单条记录的编辑和展示
 */
export interface FormComponent extends Container, DataBinding {
  type: ComponentType.FORM // 组件类型

  // 表单特定配置（公开配置）
  dataLevel: 'row' // 固定为行级数据
  formLayout?: 'vertical' | 'horizontal' | 'inline' // 表单布局方式（重命名避免冲突）
  labelCol?: { span?: number; offset?: number } // 标签列配置
  wrapperCol?: { span?: number; offset?: number } // 包装器列配置

  // 表单行为配置（公开配置）
  submitOnEnter?: boolean // 是否回车提交
  resetAfterSubmit?: boolean // 提交后是否重置
  validateOnChange?: boolean // 是否实时验证

  // 表单事件处理（公开配置）
  onSubmit?: string // 提交事件处理器ID
  onReset?: string // 重置事件处理器ID
  onValuesChange?: string // 值变化事件处理器ID

  // 表单按钮配置（公开配置）
  showSubmitButton?: boolean // 是否显示提交按钮
  showResetButton?: boolean // 是否显示重置按钮
  submitButtonText?: string // 提交按钮文本
  resetButtonText?: string // 重置按钮文本

  // 内部表单状态（私有，运行时状态）
  readonly _formState?: {
    readonly isSubmitting?: boolean // 是否正在提交
    readonly isDirty?: boolean // 表单是否已修改
    readonly isValid?: boolean // 表单是否有效
    readonly fieldErrors?: Record<string, readonly string[]> // 字段错误信息
    readonly touchedFields?: readonly string[] // 已触摸的字段
    readonly changedFields?: readonly string[] // 已修改的字段
    readonly lastSubmitTime?: Date // 最后提交时间
    readonly submitCount?: number // 提交次数
  }
}

/**
 * 基础数据网格接口 - 提供核心表格功能
 * 继承容器和数据绑定能力，专注于表格基础功能
 */
export interface BaseDataGrid extends Container, DataBinding {
  // 数据网格基础配置（公开配置）
  dataLevel: 'table' // 固定为表级数据
  columns: DataGridColumn[] // 列配置（使用新的列配置接口）

  // 表格基础样式配置（公开配置）
  size?: 'small' | 'middle' | 'large' // 表格大小
  bordered?: boolean // 是否显示边框
  showHeader?: boolean // 是否显示表头
  sticky?: boolean // 是否固定表头
  scroll?: { x?: number; y?: number } // 滚动配置

  // 空数据状态配置（公开配置）
  emptyState?: {
    text?: string // 空数据文本
    image?: string // 空数据图片
    showIcon?: boolean // 是否显示默认图标
  }
}

/**
 * 分页功能混入接口 - 提供分页相关配置
 */
export interface PaginationMixin {
  // 分页配置（公开配置）
  pagination?: boolean | PaginationConfig // 分页配置
  pageSize?: number // 每页行数
  showSizeChanger?: boolean // 是否显示页面大小选择器
  pageSizeOptions?: string[] // 页面大小选项
  showQuickJumper?: boolean // 是否显示快速跳转
  showTotal?: boolean // 是否显示总数信息

  // 内部分页状态（私有，运行时状态）
  readonly _paginationState?: {
    readonly currentPage?: number // 当前页码
    readonly totalPages?: number // 总页数
    readonly startIndex?: number // 当前页起始索引
    readonly endIndex?: number // 当前页结束索引
    readonly hasMore?: boolean // 是否有更多数据
  }
}

/**
 * 行选择功能混入接口 - 提供行选择相关配置
 */
export interface SelectionMixin {
  // 行选择配置（公开配置）
  rowSelection?: {
    type?: 'single' | 'multiple' // 选择类型
    showSelectAll?: boolean // 是否显示全选
    selectedRowKeys?: (string | number)[] // 选中的行key
    onChange?: string // 选择变化事件处理器ID
    onSelectAll?: string // 全选事件处理器ID
    checkStrictly?: boolean // 是否严格模式（父子不关联）
    preserveSelectedRowKeys?: boolean // 是否保留已选择的key
    columnWidth?: number // 选择列宽度
    columnTitle?: string // 选择列标题
    fixed?: boolean // 选择列是否固定
  }

  // 内部选择状态（私有，运行时状态）
  readonly _selectionState?: {
    readonly selectedRows?: readonly any[] // 选中的行数据
    readonly selectedRowKeys?: readonly (string | number)[] // 选中的行key
    readonly isAllSelected?: boolean // 是否全选
    readonly isPartialSelected?: boolean // 是否部分选中
    readonly lastSelectedKey?: string | number // 最后选中的key
    readonly selectionCount?: number // 选中数量
  }
}

/**
 * 排序筛选功能混入接口 - 提供排序和筛选能力
 */
export interface SortFilterMixin {
  // 功能开关（公开配置）
  sortable?: boolean // 是否可排序
  filterable?: boolean // 是否可筛选
  searchable?: boolean // 是否可搜索

  // 排序配置（公开配置）
  sortConfig?: {
    multiple?: boolean // 是否支持多列排序
    defaultSort?: Array<{ column: string; direction: 'asc' | 'desc' }> // 默认排序
    sortDirections?: ('asc' | 'desc')[] // 支持的排序方向
  }

  // 筛选配置（公开配置）
  filterConfig?: {
    mode?: 'simple' | 'advanced' // 筛选模式
    showReset?: boolean // 是否显示重置按钮
    position?: 'header' | 'toolbar' // 筛选器位置
  }

  // 搜索配置（公开配置）
  searchConfig?: {
    placeholder?: string // 搜索占位符
    debounce?: number // 防抖延迟
    fields?: string[] // 搜索字段范围
    caseSensitive?: boolean // 是否区分大小写
  }

  // 内部排序筛选状态（私有，运行时状态）
  readonly _sortFilterState?: {
    readonly currentSort?: readonly { column: string; direction: 'asc' | 'desc' }[] // 当前排序状态
    readonly currentFilters?: Record<string, any> // 当前筛选状态
    readonly searchKeyword?: string // 当前搜索关键词
    readonly filteredCount?: number // 筛选后数据量
    readonly sortedColumns?: readonly string[] // 已排序的列
  }
}

/**
 * 工具栏功能混入接口 - 提供工具栏相关配置
 */
export interface ToolbarMixin {
  // 工具栏配置（公开配置）
  toolbar?: DataGridToolbarConfig

  // 内部工具栏状态（私有，运行时状态）
  readonly _toolbarState?: {
    readonly collapsed?: boolean // 工具栏是否折叠
    readonly activeFilters?: Record<string, any> // 活跃的筛选条件
    readonly quickFilters?: readonly string[] // 活跃的快速筛选
    readonly searchHistory?: readonly string[] // 搜索历史
    readonly exportInProgress?: boolean // 是否正在导出
    readonly refreshing?: boolean // 是否正在刷新
  }
}

/**
 * 行操作功能混入接口 - 提供行级操作配置
 */
export interface RowActionMixin {
  // 行操作配置（公开配置）
  rowActions?: {
    edit?: boolean // 是否显示编辑按钮
    delete?: boolean // 是否显示删除按钮
    view?: boolean // 是否显示查看按钮
    custom?: Array<{
      text: string // 按钮文本
      action: string // 操作事件处理器ID
      icon?: string // 图标
      type?: 'primary' | 'default' | 'danger' | 'warning' // 按钮类型
      disabled?: boolean | string // 是否禁用（可以是表达式）
      visible?: boolean | string // 是否可见（可以是表达式）
      tooltip?: string // 提示信息
      confirm?: {
        title?: string // 确认标题
        content?: string // 确认内容
      } // 确认配置
    }>
    position?: 'left' | 'right' // 操作列位置
    width?: number // 操作列宽度
    fixed?: boolean // 操作列是否固定
  }

  // 行交互事件（公开配置）
  onRowClick?: string // 行点击事件处理器ID
  onRowDoubleClick?: string // 行双击事件处理器ID
  onCellClick?: string // 单元格点击事件处理器ID
  onRowEdit?: string // 行编辑事件处理器ID
  onRowDelete?: string // 行删除事件处理器ID
  onRowView?: string // 行查看事件处理器ID

  // 内部行操作状态（私有，运行时状态）
  readonly _rowActionState?: {
    readonly editingRow?: string | number // 正在编辑的行
    readonly hoveredRow?: string | number // 悬停的行
    readonly expandedRows?: readonly (string | number)[] // 展开的行
    readonly editingCell?: { row: string | number; column: string } // 正在编辑的单元格
  }
}
/**
 * 数据网格组件实例 - 模块化组合设计
 * 通过组合多个功能混入接口实现完整的数据网格功能
 * 
 * 设计理念：
 * - BaseDataGrid: 核心表格功能
 * - PaginationMixin: 分页功能
 * - SelectionMixin: 行选择功能
 * - SortFilterMixin: 排序筛选功能
 * - ToolbarMixin: 工具栏功能
 * - RowActionMixin: 行操作功能
 */
export interface DataGridComponent extends
  BaseDataGrid,
  PaginationMixin,
  SelectionMixin,
  SortFilterMixin,
  ToolbarMixin,
  RowActionMixin {

  type: ComponentType.DATA_GRID // 组件类型

  // 数据网格事件处理（公开配置）
  onSort?: string // 排序事件处理器ID
  onFilter?: string // 筛选事件处理器ID
  onSearch?: string // 搜索事件处理器ID
  onAdd?: string // 添加事件处理器ID
  onRefresh?: string // 刷新事件处理器ID
  onExport?: string // 导出事件处理器ID

  // 工具栏事件处理（公开配置）
  onToolbarAction?: string // 工具栏操作事件处理器ID
  onBatchAction?: string // 批量操作事件处理器ID
  onSettingsChange?: string // 设置变化事件处理器ID
  onFilterReset?: string // 筛选重置事件处理器ID
  onSearchClear?: string // 搜索清空事件处理器ID
  onQuickFilter?: string // 快速筛选事件处理器ID
  onColumnVisibilityChange?: string // 列显示/隐藏变化事件处理器ID
  onColumnOrderChange?: string // 列顺序变化事件处理器ID
  onDensityChange?: string // 表格密度变化事件处理器ID
  onFullscreenToggle?: string // 全屏切换事件处理器ID
}

// ===========================
// 9. 联合类型导出 - 按功能职责分类
// ===========================

/**
 * 输入组件联合类型 - 接受用户输入的组件
 */
export type InputComponents = InputComponent | TextareaComponent | DatePickerComponent

/**
 * 选择器组件联合类型 - 提供选项选择的组件
 */
export type SelectorComponents = SelectComponent | CheckboxComponent | RadioComponent

/**
 * 所有值组件的联合类型 - 具有值绑定能力的组件
 * 包含输入组件和选择器组件
 */
export type ValueComponents = InputComponents | SelectorComponents

/**
 * 展示组件联合类型 - 纯展示内容，无用户交互
 */
export type DisplayComponents = TextComponent | ChartComponent

/**
 * 交互组件联合类型 - 响应用户操作的组件
 */
export type InteractiveComponents = ButtonComponent

/**
 * 布局组件联合类型 - 提供布局能力的容器
 */
export type LayoutComponents = Container

/**
 * 数据组件联合类型 - 具有数据绑定能力的复杂组件
 */
export type DataComponents = FormComponent | DataGridComponent

/**
 * 兼容性组件联合类型 - 向后兼容的组件
 */
export type LegacyComponents = TableComponent

/**
 * 所有具体组件实现的联合类型
 * 按功能职责分类组织
 */
export type ConcreteComponents =
  // 值相关组件（输入 + 选择）
  | ValueComponents
  // 展示组件  
  | DisplayComponents
  // 交互组件
  | InteractiveComponents
  // 布局组件
  | LayoutComponents
  // 数据组件
  | DataComponents
  // 兼容性组件
  | LegacyComponents

/**
 * 所有组件的联合类型
 * 包含基础组件接口和所有具体实现
 */
export type AllComponents = Component | ConcreteComponents
