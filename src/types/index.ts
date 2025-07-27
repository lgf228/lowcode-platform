// 基本树节点类型
export interface TreeNode {
  id: string
  name: string
  type: NodeType
  children?: TreeNode[]
}

export type NodeType = 'project' | 'module' | 'page' | 'region' | 'component'

// 项目节点
export interface ProjectNode extends TreeNode {
  type: 'project'
  children: ModuleNode[]
  version: string
  description: string
  theme: any
  routing: {
    mode: 'hash' | 'browser'
  }
  globalDatasetIds: string[]
}

// 模块节点
export interface ModuleNode extends TreeNode {
  type: 'module'
  children: (ModuleNode | PageNode)[]
}

// 页面节点
export interface PageNode extends TreeNode {
  type: 'page'
  route: string
  children: ComponentNode[]
}

// 组件节点
export interface ComponentNode extends TreeNode {
  type: 'component'
}
