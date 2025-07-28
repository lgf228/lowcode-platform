// ===========================
// Component Types - 组件定义和实例类型
// ===========================

import { BaseEntity } from './Base'

/**
 * 组件定义接口 - 组件类型的定义
 * 表示低代码平台中的组件类型模板
 */
export interface ComponentDefinition extends BaseEntity {
  type: string                 // 组件类型（如表格、表单等）
}

// ===========================
// 具体组件类型定义
// ===========================

/**
 * 表格组件定义
 */
export interface TableComponentDefinition extends ComponentDefinition {
  type: 'table'
  columns?: TableColumn[]      // 默认列配置
  pagination?: boolean         // 是否支持分页
  sortable?: boolean          // 是否支持排序
  filterable?: boolean        // 是否支持筛选
}

/**
 * 表单组件定义
 */
export interface FormComponentDefinition extends ComponentDefinition {
  type: 'form'
  fields?: FormField[]         // 默认字段配置
  formLayout?: 'horizontal' | 'vertical' | 'inline' // 布局方式
  validation?: boolean         // 是否启用验证
}

/**
 * 按钮组件定义
 */
export interface ButtonComponentDefinition extends ComponentDefinition {
  type: 'button'
  variant?: 'primary' | 'secondary' | 'danger' | 'success' // 按钮样式
  size?: 'small' | 'medium' | 'large' // 按钮大小
}

/**
 * 文本组件定义
 */
export interface TextComponentDefinition extends ComponentDefinition {
  type: 'text'
  textType?: 'title' | 'subtitle' | 'body' | 'caption' // 文本类型
  editable?: boolean          // 是否可编辑
}

/**
 * 图表组件定义
 */
export interface ChartComponentDefinition extends ComponentDefinition {
  type: 'chart'
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter' // 图表类型
  dataSource?: string         // 默认数据源
}

/**
 * 容器组件定义
 */
export interface ContainerComponentDefinition extends ComponentDefinition {
  type: 'container'
  containerLayout?: 'flex' | 'grid' | 'absolute' // 布局模式
  spacing?: number            // 间距
  background?: string         // 背景样式
}

// ===========================
// 组件配置相关类型
// ===========================

/**
 * 表格列配置
 */
export interface TableColumn {
  key: string                 // 列键名
  title: string               // 列标题
  dataType?: 'string' | 'number' | 'date' | 'boolean' // 数据类型
  width?: number              // 列宽度
  sortable?: boolean          // 是否可排序
  filterable?: boolean        // 是否可筛选
  align?: 'left' | 'center' | 'right' // 对齐方式
}

/**
 * 表单字段配置
 */
export interface FormField {
  key: string                 // 字段键名
  label: string               // 字段标签
  fieldType: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' // 字段类型
  required?: boolean          // 是否必填
  placeholder?: string        // 占位符
  defaultValue?: any          // 默认值
  options?: FormFieldOption[] // 选项（用于select、radio等）
  validation?: FieldValidation // 验证规则
}

/**
 * 表单字段选项
 */
export interface FormFieldOption {
  value: string | number      // 选项值
  label: string               // 选项标签
  disabled?: boolean          // 是否禁用
}

/**
 * 字段验证规则
 */
export interface FieldValidation {
  pattern?: string            // 正则表达式
  minLength?: number          // 最小长度
  maxLength?: number          // 最大长度
  min?: number                // 最小值
  max?: number                // 最大值
  message?: string            // 错误消息
}

/**
 * 组件接口 - 组件实例（合并配置）
 * Component 表示在页面中实际使用的组件实例，包含所有配置信息
 */
export interface Component {
  // 基础属性
  id: string                   // 组件实例唯一标识（必需）
  definitionId: string         // 引用的组件定义ID
  name?: string                // 组件实例名称

  // 样式配置
  style?: {
    width?: string | number
    height?: string | number
    margin?: string
    padding?: string
    backgroundColor?: string
    color?: string
  }

  // 布局配置
  layout?: {
    position?: 'static' | 'relative' | 'absolute' | 'fixed'
    display?: 'block' | 'inline' | 'flex' | 'grid'
    flexDirection?: 'row' | 'column'
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  }

  // 数据配置
  data?: {
    dataSource?: string       // 数据源ID
    dataBinding?: Record<string, string> // 数据绑定映射
  }

  // 行为配置
  behavior?: {
    visible?: boolean         // 是否可见
    disabled?: boolean        // 是否禁用
    interactive?: boolean     // 是否可交互
  }

  // 组件特定的其他配置
  [key: string]: any
}

// ===========================
// 具体组件实例类型
// ===========================

/**
 * 表格组件实例
 */
export interface TableComponent extends Component {
  definitionId: string         // 必须引用表格组件定义

  // 表格特定配置
  columns?: TableColumn[]      // 列配置
  pagination?: boolean         // 是否分页
  sortable?: boolean          // 是否可排序
  filterable?: boolean        // 是否可筛选
  pageSize?: number           // 每页行数
  showHeader?: boolean        // 是否显示表头
  rowSelection?: 'single' | 'multiple' | 'none' // 行选择模式
}

/**
 * 表单组件实例
 */
export interface FormComponent extends Component {
  definitionId: string         // 必须引用表单组件定义

  // 表单特定配置
  fields?: FormField[]         // 字段配置
  formLayout?: 'horizontal' | 'vertical' | 'inline' // 表单布局方式
  validation?: boolean         // 是否启用验证
  submitText?: string         // 提交按钮文本
  resetText?: string          // 重置按钮文本
  showSubmitButton?: boolean  // 是否显示提交按钮
  showResetButton?: boolean   // 是否显示重置按钮
}

/**
 * 按钮组件实例
 */
export interface ButtonComponent extends Component {
  definitionId: string         // 必须引用按钮组件定义

  // 按钮特定配置
  text?: string               // 按钮文本
  variant?: 'primary' | 'secondary' | 'danger' | 'success' // 按钮样式
  size?: 'small' | 'medium' | 'large' // 按钮大小
  icon?: string               // 图标
  loading?: boolean           // 加载状态
  htmlType?: 'button' | 'submit' | 'reset' // HTML 类型
  onClick?: string            // 点击事件处理器ID
}

/**
 * 文本组件实例
 */
export interface TextComponent extends Component {
  definitionId: string         // 必须引用文本组件定义

  // 文本特定配置
  content?: string            // 文本内容
  textType?: 'title' | 'subtitle' | 'body' | 'caption' // 文本类型
  editable?: boolean          // 是否可编辑
  maxLength?: number          // 最大长度
  placeholder?: string        // 占位符（可编辑时）
  align?: 'left' | 'center' | 'right' | 'justify' // 对齐方式
}

/**
 * 图表组件实例
 */
export interface ChartComponent extends Component {
  definitionId: string         // 必须引用图表组件定义

  // 图表特定配置
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter' // 图表类型
  title?: string              // 图表标题
  xAxisLabel?: string         // X轴标签
  yAxisLabel?: string         // Y轴标签
  showLegend?: boolean        // 是否显示图例
  showGrid?: boolean          // 是否显示网格
  colors?: string[]           // 颜色配置
}

/**
 * 容器组件实例
 */
export interface ContainerComponent extends Component {
  definitionId: string         // 必须引用容器组件定义

  // 容器特定配置
  containerLayout?: 'flex' | 'grid' | 'absolute' // 容器布局模式
  direction?: 'row' | 'column' // flex 方向
  spacing?: number            // 间距
  padding?: number            // 内边距
  background?: string         // 背景样式
  border?: string             // 边框样式
  borderRadius?: number       // 圆角
  children?: Component[]      // 子组件
}