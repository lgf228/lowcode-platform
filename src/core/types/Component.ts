// ===========================
// Component Types - 低代码平台组件类型系统
// ===========================

import * as React from 'react'
import { BaseEntity } from './Base'

// ===========================
// 1. 基础配置类型
// ===========================

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
// 2. 组件层次结构类型
// ===========================

/**
 * 组件接口 - 所有组件的基础接口
 * Component 表示在页面中实际使用的组件实例，包含所有配置信息
 */
export interface Component extends BaseEntity {
  // 基础属性
  type: string // 组件类型

  // 样式配置
  style?: {
    width?: string | number
    height?: string | number
    margin?: string
    padding?: string
    backgroundColor?: string
    color?: string
  }

  // 组件特定的其他配置
  [key: string]: any
}

/**
 * 数据容器组件接口 - 可包含子组件的数据驱动容器
 * 继承自 Component，具有组件的所有功能，并增加数据绑定能力
 */
export interface DataContainer extends Component {
  // 容器特有属性
  children: Component[] // 子组件列表

  // 数据绑定配置
  datamember?: string // 数据成员：绑定到dataset中的表名
  dataLevel?: 'row' | 'table' // 数据级别：'row'=行级数据（单条记录），'table'=表级数据（整个数据表）

  // 容器样式
  background?: string // 背景样式
  border?: string // 边框样式
  borderRadius?: number // 圆角
}

/**
 * 值组件接口 - 表单字段的基础组件
 * 继承自 Component，为所有输入类组件提供通用字段属性和值处理能力
 */
export interface ValueComponent extends Component {
  // 字段基础属性
  fieldName: string // 字段名称，用于数据绑定
  label?: string // 字段标签
  placeholder?: string // 占位符文本

  // 标签样式配置
  labelPosition?: 'top' | 'left' | 'right' | 'bottom' | 'inside' // 标签位置
  labelAlign?: 'left' | 'center' | 'right' // 标签对齐方式
  labelWidth?: number | string // 标签宽度（当位置为left/right时）
  labelStyle?: {
    fontSize?: string | number // 标签字体大小
    fontWeight?: string | number // 标签字体粗细
    color?: string // 标签颜色
    margin?: string // 标签边距
  }

  // 值显示配置
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

  // 状态控制
  disabled?: boolean // 是否禁用
  readonly?: boolean // 是否只读

  // 数据绑定
  value?: any // 字段值
  defaultValue?: any // 默认值

  // 事件处理
  onChange?: string // 值变化事件处理器ID
  onFocus?: string // 获得焦点事件处理器ID
  onBlur?: string // 失去焦点事件处理器ID
}

/**
 * 选项数据源接口 - 为需要选项列表的组件提供数据源配置
 * 可以与其他组件接口组合使用
 */
export interface OptionDataSource {
  // 组件类型配置
  componentType?: 'select' | 'checkbox' | 'radio' | 'cascader' | 'transfer' | 'tree-select' // 选项组件类型

  // 数据源配置
  dataSource?: string // 表名，从数据集中获取选项数据

  // 字段映射配置
  valueField?: string // 值字段名（存储的值对应的字段）
  textField?: string // 文本字段名（显示的文本对应的字段）

  // 多选配置
  multiple?: boolean // 是否支持多选
  valueSeparator?: string // 多选时值的分隔符（默认为逗号）
  textSeparator?: string // 多选时显示文本的分隔符（默认为逗号）
  maxSelections?: number // 最大选择数量（多选时）

  // 选项过滤和搜索
  filterable?: boolean // 是否可过滤
  searchable?: boolean // 是否可搜索
  searchPlaceholder?: string // 搜索占位符

  // 加载状态
  loading?: boolean // 是否正在加载数据
  loadingText?: string // 加载文本

  // 无数据状态
  emptyText?: string // 无数据时显示的文本
}

// ===========================
// 3. 表单配置类型
// ===========================

/**
 * 表单字段配置
 * 继承自 ValueComponent，用于动态表单的字段配置
 */
export interface FormField extends Omit<ValueComponent, 'fieldName'> {
  // 兼容性字段
  key?: string // 字段键名（新字段名，可选）
  field: string // 字段键名（兼容旧字段名，必需）

  // 字段名称（从field派生）
  fieldName?: string // 可选，如果不提供则使用field

  // 字段类型配置
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea' | 'email' // 字段类型
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
    layout: DataContainer[]
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
  type: 'table' // 组件类型

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
  type: 'button' // 组件类型

  // 按钮特定配置
  text?: string // 按钮文本
  variant?: 'primary' | 'secondary' | 'danger' | 'success' // 按钮样式
  size?: 'small' | 'medium' | 'large' // 按钮大小
  icon?: string // 图标
  loading?: boolean // 加载状态
  htmlType?: 'button' | 'submit' | 'reset' // HTML 类型
  onClick?: string // 点击事件处理器ID
}

/**
 * 文本组件实例
 */
export interface TextComponent extends Component {
  type: 'text' // 组件类型

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
  type: 'chart' // 组件类型

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
 * 表单组件实例 - 继承自数据容器组件
 * 默认为行级数据，用于单条记录的编辑和展示
 */
export interface FormComponent extends DataContainer {
  type: 'form' // 组件类型

  // 表单特定配置
  dataLevel: 'row' // 固定为行级数据
  layout?: 'vertical' | 'horizontal' | 'inline' // 表单布局方式
  labelCol?: { span?: number; offset?: number } // 标签列配置
  wrapperCol?: { span?: number; offset?: number } // 包装器列配置

  // 表单行为配置
  submitOnEnter?: boolean // 是否回车提交
  resetAfterSubmit?: boolean // 提交后是否重置
  validateOnChange?: boolean // 是否实时验证

  // 表单事件处理
  onSubmit?: string // 提交事件处理器ID
  onReset?: string // 重置事件处理器ID
  onValuesChange?: string // 值变化事件处理器ID

  // 表单按钮配置
  showSubmitButton?: boolean // 是否显示提交按钮
  showResetButton?: boolean // 是否显示重置按钮
  submitButtonText?: string // 提交按钮文本
  resetButtonText?: string // 重置按钮文本

  // 表单状态
  loading?: boolean // 是否加载中
  disabled?: boolean // 是否禁用整个表单
}

/**
 * 数据网格组件实例 - 继承自数据容器组件
 * 默认为表级数据，用于多条记录的展示和操作
 */
export interface DataGridComponent extends DataContainer {
  type: 'datagrid' // 组件类型

  // 数据网格特定配置
  dataLevel: 'table' // 固定为表级数据
  columns?: TableColumn[] // 列配置

  // 分页配置
  pagination?: boolean | PaginationConfig // 分页配置
  pageSize?: number // 每页行数
  showSizeChanger?: boolean // 是否显示页面大小选择器
  pageSizeOptions?: string[] // 页面大小选项

  // 表格功能配置
  sortable?: boolean // 是否可排序
  filterable?: boolean // 是否可筛选
  searchable?: boolean // 是否可搜索
  exportable?: boolean // 是否可导出

  // 行选择配置
  rowSelection?: {
    type?: 'single' | 'multiple' // 选择类型
    showSelectAll?: boolean // 是否显示全选
    selectedRowKeys?: (string | number)[] // 选中的行key
    onChange?: string // 选择变化事件处理器ID
  }

  // 表格样式配置
  size?: 'small' | 'middle' | 'large' // 表格大小
  bordered?: boolean // 是否显示边框
  showHeader?: boolean // 是否显示表头
  sticky?: boolean // 是否固定表头
  scroll?: { x?: number; y?: number } // 滚动配置

  // 行操作配置
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

  // 工具栏配置
  toolbar?: {
    add?: boolean // 是否显示添加按钮
    refresh?: boolean // 是否显示刷新按钮
    export?: boolean // 是否显示导出按钮
    search?: boolean // 是否显示搜索框
    filter?: boolean // 是否显示筛选器
    custom?: Array<{
      text: string // 按钮文本
      action: string // 操作事件处理器ID
      icon?: string // 图标
      type?: 'primary' | 'default' | 'danger' // 按钮类型
    }>
  }

  // 数据网格事件处理
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

  // 数据网格状态
  loading?: boolean // 是否加载中
  empty?: {
    text?: string // 空数据文本
    image?: string // 空数据图片
  }
}

// ===========================
// 6. 字段组件实例类型（基于 Field 和 OptionField）
// ===========================

/**
 * 输入框组件实例
 */
export interface InputComponent extends ValueComponent {
  type: 'input' // 组件类型

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
  type: 'textarea' // 组件类型

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
  type: 'datePicker' // 组件类型

  // 日期选择器特定配置
  format?: string // 日期格式
  showTime?: boolean // 是否显示时间
  range?: boolean // 是否范围选择
  minDate?: Date | string // 最小日期
  maxDate?: Date | string // 最大日期
  disabledDates?: Date[] | string[] // 禁用的日期
}

// ===========================
// 7. 选项组件实例类型（基于 OptionField）
// ===========================

/**
 * 选择框组件实例
 */
export interface SelectComponent extends ValueComponent, OptionDataSource {
  type: 'select' // 组件类型

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
  type: 'checkbox' // 组件类型

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
  type: 'radio' // 组件类型

  // 单选框特定配置
  direction?: 'horizontal' | 'vertical' // 排列方向
  columns?: number // 分列显示（水平排列时）
  spacing?: number // 选项间距

  // 按钮样式单选框
  buttonStyle?: boolean // 是否使用按钮样式
  size?: 'small' | 'medium' | 'large' // 按钮大小（按钮样式时）
}

// ===========================
// 8. 联合类型导出
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
 * 所有组件的联合类型
 */
export type AllComponents = Component | DataContainer | FormComponent | DataGridComponent | TableComponent | ButtonComponent | TextComponent | ChartComponent | ValueComponents
