// ===========================
// Component Types - 组件实例类型
// ===========================

import { BaseEntity } from './Base'

// ===========================
// 区域和布局相关类型
// ===========================

/**
 * 布局配置
 */
export interface LayoutConfig {
  type: 'grid' | 'flex' | 'absolute' | 'flow'
  props: {
    columns?: number
    gap?: number
    direction?: 'row' | 'column'
    wrap?: boolean
    [key: string]: any
  }
  responsive?: ResponsiveConfig
}

/**
 * 响应式配置
 */
export interface ResponsiveConfig {
  breakpoints: {
    mobile?: LayoutConfig
    tablet?: LayoutConfig
    desktop?: LayoutConfig
  }
}



/**
 * 区域接口 - 复合组件容器
 */
export interface Region extends BaseEntity {
  layout: LayoutConfig         // 布局配置
  components: Component[]      // 子组件列表
}

/**
 * 组件布局参数
 */
export interface ComponentLayout {
  gridArea?: string             // Grid 布局中的区域
  flexOrder?: number            // Flex 布局中的顺序
  position?: { x: number, y: number }  // 绝对定位
  size?: { width: number, height: number }  // 尺寸约束
  responsive?: ResponsiveLayout  // 响应式配置
}

/**
 * 响应式布局配置
 */
export interface ResponsiveLayout {
  mobile?: Partial<ComponentLayout>
  tablet?: Partial<ComponentLayout>
  desktop?: Partial<ComponentLayout>
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
 * 组件接口 - 组件实例（合并配置）
 * Component 表示在页面中实际使用的组件实例，包含所有配置信息
 */
export interface Component extends BaseEntity {
  // 基础属性
  type: string                 // 组件类型

  // 区域支持 - 复合组件
  regions?: Region[]           // 包含的区域列表

  // 布局参数 - 在父区域中的位置
  layout?: ComponentLayout     // 在区域中的布局参数

  // 样式配置
  style?: {
    width?: string | number
    height?: string | number
    margin?: string
    padding?: string
    backgroundColor?: string
    color?: string
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
  type: 'table'               // 组件类型

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
 * 按钮组件实例
 */
export interface ButtonComponent extends Component {
  type: 'button'              // 组件类型

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
  type: 'text'                // 组件类型

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
  type: 'chart'               // 组件类型

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
  type: 'container'           // 组件类型

  // 容器特定配置
  containerLayout?: 'flex' | 'grid' | 'absolute' // 容器布局模式
  direction?: 'row' | 'column' // flex 方向
  spacing?: number            // 间距
  padding?: number            // 内边距
  background?: string         // 背景样式
  border?: string             // 边框样式
  borderRadius?: number       // 圆角

  // 支持区域的复合组件
  regions?: Region[]          // 容器内的区域
}