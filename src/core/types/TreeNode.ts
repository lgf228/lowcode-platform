// ===========================
// Tree Node Types
// ===========================

export interface TreeNode {
  id: string
  name: string
  type: NodeType
  children?: TreeNode[]
  props: NodeProps
}

export type NodeType = 'project' | 'module' | 'page' | 'component'

export type NodeProps = ProjectProps | ModuleProps | PageProps | ComponentProps

export interface ModuleNode extends TreeNode {
  id: string
  name: string
  type: 'module' | 'project'
  children: (ModuleNode | PageNode)[]
  props: ModuleProps
}

export interface ProjectNode extends ModuleNode {
  type: 'project'
  children: ModuleNode[]
  props: ProjectProps & ModuleProps
}

export interface ComponentNode extends TreeNode {
  type: 'component' | 'page'
  children?: ComponentNode[]
  props: ComponentProps
}

export interface PageNode extends ComponentNode {
  type: 'page'
  children: ComponentNode[]
  props: PageProps & ComponentProps
}

export interface ProjectProps {
  version: string
  description: string
  theme: ThemeConfig
  routing: RoutingConfig
  globalDatasetIds: string[]
}

export interface ModuleProps {
  description: string
  icon?: string
  order: number
  level: number
  permissions?: string[]
  isExpanded?: boolean
}

export interface PageProps {
  title: string
  description: string
  route: string
  layout: LayoutType
  meta: PageMeta
}

export interface ComponentProps {
  type: ComponentType
  displayName: string
  region?: ComponentRegion
  datasetId?: string
  dataBinding?: DataBinding
  style?: StyleProps
  config: ComponentConfig
  handlers?: EventHandler[]
}

// 新增缺失的类型定义
export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: string
}

export interface RoutingConfig {
  mode: 'hash' | 'history'
  basePath: string
}

export type LayoutType = 'default' | 'sidebar' | 'header' | 'fullscreen'

export interface PageMeta {
  title: string
  description?: string
  keywords?: string[]
}

export type ComponentType =
  | 'form'
  | 'table'
  | 'chart'
  | 'button'
  | 'input'
  | 'select'

export interface ComponentRegion {
  x: number
  y: number
  width: number
  height: number
}

export interface DataBinding {
  datasetId: string
  field?: string
  expression?: string
}

export interface StyleProps {
  className?: string
  style?: Record<string, any>
}

export interface ComponentConfig {
  props?: Record<string, any>
  validation?: Record<string, any>
}

export interface EventHandler {
  event: string
  action: string
  params?: Record<string, any>
}
