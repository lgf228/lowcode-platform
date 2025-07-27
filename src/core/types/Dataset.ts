// ===========================
// Dataset Types
// ===========================

export interface Dataset {
  id: string
  name: string
  description?: string
  source: DataSource
  schema: DataSchema
  fields: DataField[] // 添加 fields 属性以便向后兼容
  data?: any[]
  state?: DataState
  cache?: {
    enabled: boolean
    duration: number
  }
  metadata?: {
    createdAt: string
    updatedAt: string
    version: string
    tags?: string[]
  }
}

export interface DataState {
  loading: boolean
  error?: string
  lastUpdated?: string
  data?: any[]
}

export interface DataSource {
  type: 'static' | 'api' | 'database' | 'file' | 'computed'
  // 静态数据
  data?: any[]
  // API 配置
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  params?: Record<string, any>
  // 计算数据配置
  dependencies?: string[]
  computation?: string
  config?: {
    url?: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
    params?: Record<string, any>
    body?: any
    filePath?: string
    query?: string
  }
}

export interface DataSchema {
  fields: DataField[]
  primaryKey?: string
  relationships?: DataRelationship[]
}

export interface DataField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array'
  required?: boolean
  defaultValue?: any
  description?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: any[]
  }
}

export interface DataRelationship {
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany'
  targetDataset: string
  localField: string
  foreignField: string
}

export interface DataQuery {
  select?: string[]
  where?: Record<string, any>
  orderBy?: Array<{ field: string; direction: 'asc' | 'desc' }>
  limit?: number
  offset?: number
  groupBy?: string[]
  having?: Record<string, any>
}

export interface DataResult<T = any> {
  data: T[]
  total: number
  page?: number
  pageSize?: number
  error?: string
}
