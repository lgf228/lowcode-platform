// ===========================
// Component Types - 低代码平台组件类型系统
// ===========================

import * as React from 'react'
import { BaseEntity } from './Base'

// ===========================
// 1. 基础配置类型
// ===========================

/**
 * 组件类型枚举 - 统一管理所有组件类型
 */
export enum ComponentType {
  // 值组件类型
  INPUT = 'input',
  TEXTAREA = 'textarea',
  DATE_PICKER = 'datePicker',

  // 选项组件类型
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',

  // 容器组件类型
  CONTAINER = 'container',
  FORM = 'form',
  DATA_GRID = 'datagrid',

  // 列组件类型
  GRID_COLUMN = 'gridColumn',
  TEXT_COLUMN = 'textColumn',
  ACTION_COLUMN = 'actionColumn',
  TEMPLATE_COLUMN = 'templateColumn',
  VALUE_COLUMN = 'valueColumn',

  // 其他组件类型
  BUTTON = 'button',
  TEXT = 'text',
  TABLE = 'table',
  CHART = 'chart'
}

/**
 * 表格列配置
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

/**
 * 分页配置
 */
export interface PaginationConfig {
  page: number // 当前页码
  pageSize: number // 每页行数
  total: number // 总记录数
  onChange: (page: number, pageSize: number) => void // 页码变化处理器
}

// ===========================
// 2. 基础混入接口
// ===========================

/**
 * 样式混入接口 - 提供通用样式属性
 */
export interface StyleMixin {
  // 基础样式配置
  style?: {
    width?: string | number
    height?: string | number
    margin?: string
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
  }

  // 虚拟化配置（公开配置，适用于大数据量组件）
  virtualization?: {
    enabled?: boolean // 是否启用虚拟化
    itemHeight?: number // 每项高度（用于计算）
    overscan?: number // 额外渲染的项目数
    estimatedSize?: number // 预估大小
  }

  // 缓存配置（公开配置）
  cache?: {
    enabled?: boolean // 是否启用缓存
    strategy?: 'memory' | 'localStorage' | 'sessionStorage' // 缓存策略
    ttl?: number // 缓存时间（毫秒）
    key?: string // 缓存键名
  }

  // 内部性能状态（私有，运行时状态）
  readonly _performanceState?: {
    readonly renderCount?: number // 渲染次数
    readonly lastRenderTime?: Date // 最后渲染时间
    readonly cacheHits?: number // 缓存命中次数
    readonly cacheMisses?: number // 缓存未命中次数
    readonly isLazyLoaded?: boolean // 是否已懒加载
    readonly virtualizedRange?: { start: number; end: number } // 虚拟化范围
  }
}

// ===========================
// 3. 组件层次结构类型
// ===========================

/**
 * 组件接口 - 所有组件的基础接口
 * Component 表示在页面中实际使用的组件实例，包含所有配置信息
 */
export interface Component extends BaseEntity, StyleMixin, StateMixin, EventMixin, PerformanceMixin {
  // 基础属性
  type: ComponentType | string // 组件类型（支持枚举或自定义字符串）

  // 组件特定的其他配置
  [key: string]: any
}

/**
 * 容器组件接口 - 可包含子组件的基础容器
 * 继承自 Component，提供基础的容器功能和样式配置
 */
export interface Container extends Component {
  // 容器特有属性（公开配置）
  children: Component[] // 子组件列表

  // 容器布局配置（公开配置）
  layout?: {
    direction?: 'horizontal' | 'vertical' // 布局方向
    wrap?: boolean // 是否允许换行
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' // 主轴对齐
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' // 交叉轴对齐
    gap?: number | string // 子组件间距
  }

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
 * 可以与其他组件接口组合使用，支持双继承模式
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
 * 列组件接口 - 数据网格列的基础组件
 * 继承自 Component，为所有列类型提供通用属性
 */
export interface ColumnComponent extends Component {
  // 列基础属性
  dataKey: string // 数据字段名（绑定到数据源的字段）
  title: string // 列标题

  // 列显示配置
  width?: number | string // 列宽度
  minWidth?: number // 最小宽度
  maxWidth?: number // 最大宽度
  fixed?: 'left' | 'right' | boolean // 是否固定列
  align?: 'left' | 'center' | 'right' // 对齐方式

  // 列功能配置
  sortable?: boolean // 是否可排序
  filterable?: boolean // 是否可筛选
  resizable?: boolean // 是否可调整大小
  hidden?: boolean // 是否隐藏

  // 数据类型配置
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'percent' // 数据类型

  // 格式化配置
  formatter?: {
    type?: 'currency' | 'percent' | 'decimal' | 'date' | 'datetime' | 'time' | 'custom'
    precision?: number // 数字精度
    currency?: string // 货币符号
    dateFormat?: string // 日期格式
    thousandSeparator?: boolean // 是否显示千位分隔符
    prefix?: string // 前缀
    suffix?: string // 后缀
    customFormat?: string // 自定义格式化字符串
  }

  // 排序配置
  sortConfig?: {
    sortField?: string // 排序字段（如果与dataKey不同）
    sortType?: 'string' | 'number' | 'date' // 排序类型
    defaultSort?: 'asc' | 'desc' // 默认排序方向
  }

  // 筛选配置
  filterConfig?: {
    filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean' // 筛选类型
    filterOptions?: Array<{ label: string; value: any }> // 选择型筛选的选项
    filterPlaceholder?: string // 筛选占位符
  }

  // 列事件处理
  onCellClick?: string // 单元格点击事件处理器ID
  onCellDoubleClick?: string // 单元格双击事件处理器ID
  onHeaderClick?: string // 表头点击事件处理器ID
}

/**
 * 值组件接口 - 表单字段的基础组件
 * 继承自 Component，为所有输入类组件提供通用字段属性和值处理能力
 */
export interface ValueComponent extends Component, ValidationMixin {
  // 字段基础属性（公开配置）
  fieldName: string // 字段名称，用于数据绑定
  label?: string // 字段标签
  placeholder?: string // 占位符文本

  // 标签样式配置（公开配置）
  labelPosition?: 'top' | 'left' | 'right' | 'bottom' | 'inside' // 标签位置
  labelAlign?: 'left' | 'center' | 'right' // 标签对齐方式
  labelWidth?: number | string // 标签宽度（当位置为left/right时）
  labelStyle?: {
    fontSize?: string | number // 标签字体大小
    fontWeight?: string | number // 标签字体粗细
    color?: string // 标签颜色
    margin?: string // 标签边距
  }

  // 值显示配置（公开配置）
  valueAlign?: 'left' | 'center' | 'right' // 值的对齐方式
  dataFormat?: {
    type?: 'currency' | 'percent' | 'decimal' | 'date' | 'datetime' | 'time' | 'custom' // 数据格式类型
    precision?: number // 数字精度（小数位数）
    currency?: string // 货币符号（如: ¥, $, €）
    dateFormat?: string // 日期格式（如: YYYY-MM-DD, DD/MM/YYYY）
    timeFormat?: string // 时间格式（如: HH:mm:ss, hh:mm A）
    customFormat?: string // 自定义格式化字符串
    thousandSeparator?: boolean // 是否显示千位分隔符
    prefix?: string // 前缀
    suffix?: string // 后缀
  }

  // 数据绑定（公开配置）
  value?: any // 字段值
  defaultValue?: any // 默认值

  // 值组件特有事件（公开配置，继承 EventMixin 的通用事件）
  onChange?: string // 值变化事件处理器ID

  // 内部值状态（私有，运行时状态）
  readonly _valueState?: {
    readonly previousValue?: any // 上一个值
    readonly originalValue?: any // 原始值
    readonly formattedValue?: string // 格式化后的显示值
    readonly isValueChanged?: boolean // 值是否已改变
    readonly lastChangeTime?: Date // 最后修改时间
    readonly changeCount?: number // 修改次数
  }
}

/**
 * 选项数据源接口 - 为需要选项列表的组件提供数据源配置
 * 可以与其他组件接口组合使用
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
// 3. 表单配置类型
// ===========================

/**
 * 表单字段配置
 * 继承自 ValueComponent，用于动态表单的字段配置
 */
export interface FormField extends ValueComponent {
  // 字段类型配置
  type: ComponentType.INPUT | ComponentType.TEXTAREA | ComponentType.DATE_PICKER |
  ComponentType.SELECT | ComponentType.CHECKBOX | ComponentType.RADIO
}

// ===========================
// 4. React 组件 Props 类型
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
// 5. 具体组件实例类型
// ===========================

/**
 * 表格组件实例
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
 * 表单组件实例 - 双继承：容器组件 + 数据绑定
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
 * 数据网格组件实例 - 双继承：容器组件 + 数据绑定
 * 默认为表级数据，用于多条记录的展示和操作
 */
export interface DataGridComponent extends Container, DataBinding {
  type: ComponentType.DATA_GRID // 组件类型

  // 数据网格特定配置（公开配置）
  dataLevel: 'table' // 固定为表级数据
  columns: ColumnComponent[] // 列组件配置（使用组件化的列定义）

  // 分页配置（公开配置）
  pagination?: boolean | PaginationConfig // 分页配置
  pageSize?: number // 每页行数
  showSizeChanger?: boolean // 是否显示页面大小选择器
  pageSizeOptions?: string[] // 页面大小选项

  // 表格功能配置（公开配置）
  sortable?: boolean // 是否可排序
  filterable?: boolean // 是否可筛选
  searchable?: boolean // 是否可搜索
  exportable?: boolean // 是否可导出

  // 行选择配置（公开配置）
  rowSelection?: {
    type?: 'single' | 'multiple' // 选择类型
    showSelectAll?: boolean // 是否显示全选
    selectedRowKeys?: (string | number)[] // 选中的行key
    onChange?: string // 选择变化事件处理器ID
  }

  // 表格样式配置（公开配置）
  size?: 'small' | 'middle' | 'large' // 表格大小
  bordered?: boolean // 是否显示边框
  showHeader?: boolean // 是否显示表头
  sticky?: boolean // 是否固定表头
  scroll?: { x?: number; y?: number } // 滚动配置

  // 行操作配置（公开配置）
  rowActions?: {
    edit?: boolean // 是否显示编辑按钮
    delete?: boolean // 是否显示删除按钮
    view?: boolean // 是否显示查看按钮
    custom?: Array<{
      text: string // 按钮文本
      action: string // 操作事件处理器ID
      icon?: string // 图标
    }>
  }

  // 工具栏配置（公开配置）
  toolbar?: DataGridToolbarConfig

  // 数据网格事件处理（公开配置）
  onRowClick?: string // 行点击事件处理器ID
  onRowDoubleClick?: string // 行双击事件处理器ID
  onCellClick?: string // 单元格点击事件处理器ID
  onSort?: string // 排序事件处理器ID
  onFilter?: string // 筛选事件处理器ID
  onSearch?: string // 搜索事件处理器ID
  onAdd?: string // 添加事件处理器ID
  onEdit?: string // 编辑事件处理器ID
  onDelete?: string // 删除事件处理器ID
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

  // 数据网格状态配置（公开配置）
  emptyState?: {
    text?: string // 空数据文本
    image?: string // 空数据图片
  }

  // 内部数据网格状态（私有，运行时状态）
  readonly _gridState?: {
    readonly currentSort?: { column: string; direction: 'asc' | 'desc' }[] // 当前排序状态
    readonly currentFilters?: Record<string, any> // 当前筛选状态
    readonly searchKeyword?: string // 当前搜索关键词
    readonly expandedRows?: readonly (string | number)[] // 展开的行
    readonly hoveredRow?: string | number // 悬停的行
    readonly editingCell?: { row: string | number; column: string } // 正在编辑的单元格
    
    // 工具栏状态
    readonly toolbarState?: {
      readonly collapsed?: boolean // 工具栏是否折叠
      readonly activeFilters?: Record<string, any> // 活跃的筛选条件
      readonly quickFilters?: readonly string[] // 活跃的快速筛选
      readonly searchHistory?: readonly string[] // 搜索历史
      readonly columnSettings?: {
        readonly visibility?: Record<string, boolean> // 列可见性设置
        readonly order?: readonly string[] // 列顺序设置
        readonly widths?: Record<string, number> // 列宽设置
      }
      readonly density?: 'compact' | 'middle' | 'comfortable' // 表格密度
      readonly isFullscreen?: boolean // 是否全屏状态
      readonly autoRefresh?: {
        readonly enabled?: boolean // 是否启用自动刷新
        readonly interval?: number // 刷新间隔
        readonly lastRefresh?: Date // 最后刷新时间
      }
      readonly exportState?: {
        readonly inProgress?: boolean // 是否正在导出
        readonly format?: string // 导出格式
        readonly progress?: number // 导出进度
      }
      readonly batchSelection?: {
        readonly count?: number // 批量选中数量
        readonly allSelected?: boolean // 是否全选
        readonly partialSelected?: boolean // 是否部分选中
      }
    }
  }
}

// ===========================
// 6. 字段组件实例类型（基于 Field 和 OptionField）
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
// 7. 列组件实例类型
// ===========================

/**
 * 文本列组件 - 显示纯文本内容
 */
export interface TextColumnComponent extends ColumnComponent {
  type: ComponentType.TEXT_COLUMN // 组件类型

  // 文本特定配置
  ellipsis?: boolean // 是否省略过长文本
  copyable?: boolean // 是否可复制
  selectable?: boolean // 是否可选择文本
}

/**
 * 值列组件 - 显示格式化的值（继承值组件的格式化能力）
 */
export interface ValueColumnComponent extends ColumnComponent {
  type: ComponentType.VALUE_COLUMN // 组件类型

  // 继承值组件的数据格式化能力
  valueAlign?: 'left' | 'center' | 'right' // 值的对齐方式
  dataFormat?: {
    type?: 'currency' | 'percent' | 'decimal' | 'date' | 'datetime' | 'time' | 'custom'
    precision?: number
    currency?: string
    dateFormat?: string
    timeFormat?: string
    customFormat?: string
    thousandSeparator?: boolean
    prefix?: string
    suffix?: string
  }
}

/**
 * 操作列组件 - 包含按钮等操作元素
 */
export interface ActionColumnComponent extends ColumnComponent {
  type: ComponentType.ACTION_COLUMN // 组件类型

  // 操作按钮配置
  actions: Array<{
    key: string // 操作键名
    text: string // 按钮文本
    icon?: string // 图标
    type?: 'primary' | 'default' | 'danger' | 'link' // 按钮类型
    size?: 'small' | 'medium' | 'large' // 按钮大小
    disabled?: boolean | string // 是否禁用（可以是表达式）
    visible?: boolean | string // 是否可见（可以是表达式）
    tooltip?: string // 提示文本
    onClick?: string // 点击事件处理器ID
    confirm?: {
      title?: string // 确认标题
      content?: string // 确认内容
    }
  }>

  // 操作列样式
  actionAlign?: 'left' | 'center' | 'right' // 操作按钮对齐方式
  actionSpacing?: number // 按钮间距
  maxActions?: number // 最大显示操作数（超出显示更多）
}

/**
 * 模板列组件 - 支持自定义模板渲染
 */
export interface TemplateColumnComponent extends ColumnComponent {
  type: ComponentType.TEMPLATE_COLUMN // 组件类型

  // 模板配置
  template: {
    type: 'react' | 'html' | 'component' // 模板类型
    content: string // 模板内容或组件ID
    props?: Record<string, any> // 传递给模板的属性
  }

  // 模板数据绑定
  dataBinding?: {
    rowData?: string // 行数据变量名（默认为 'record'）
    rowIndex?: string // 行索引变量名（默认为 'index'）
    columnValue?: string // 列值变量名（默认为 'value'）
  }

  // 模板事件处理
  templateEvents?: {
    [eventName: string]: string // 事件名 -> 事件处理器ID
  }
}

// ===========================
// 8. 选项组件实例类型
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
 * 所有值组件的联合类型
 */
export type ValueComponents = InputComponent | TextareaComponent | DatePickerComponent | SelectComponent | CheckboxComponent | RadioComponent

/**
 * 所有选项组件的联合类型（值组件 + 选项数据源）
 */
export type OptionComponents = SelectComponent | CheckboxComponent | RadioComponent

/**
 * 所有列组件的联合类型
 */
export type ColumnComponents = TextColumnComponent | ValueColumnComponent | ActionColumnComponent | TemplateColumnComponent

/**
 * 所有组件的联合类型
 */
export type AllComponents = Component | Container | FormComponent | DataGridComponent | TableComponent | ButtonComponent | TextComponent | ChartComponent | ValueComponents | ColumnComponents
