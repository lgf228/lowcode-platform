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
  layout?: 'horizontal' | 'vertical' | 'inline' // 布局方式
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
  layout?: 'flex' | 'grid' | 'absolute' // 布局模式
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
 * 组件配置接口 - 通用组件配置
 * 每个组件实例的具体配置参数
 */
export interface ComponentConfig {
  style?: {                   // 样式配置
    width?: string | number
    height?: string | number
    margin?: string
    padding?: string
    backgroundColor?: string
    color?: string
  }
  layout?: {                  // 布局配置
    position?: 'static' | 'relative' | 'absolute' | 'fixed'
    display?: 'block' | 'inline' | 'flex' | 'grid'
    flexDirection?: 'row' | 'column'
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  }
  data?: {                    // 数据配置
    dataSource?: string       // 数据源ID
    dataBinding?: Record<string, string> // 数据绑定映射
  }
  behavior?: {                // 行为配置
    visible?: boolean         // 是否可见
    disabled?: boolean        // 是否禁用
    interactive?: boolean     // 是否可交互
  }
  [key: string]: any          // 组件特定的其他配置
}

/**
 * 组件接口 - 组件实例
 * Component 表示在页面中实际使用的组件实例
 */
export interface Component {
  id: string                   // 组件实例唯一标识（必需）
  definitionId: string         // 引用的组件定义ID
  name?: string                // 组件实例名称
  config?: ComponentConfig     // 组件配置
}
