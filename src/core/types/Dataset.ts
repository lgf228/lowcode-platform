// ===========================
// Dataset Types - 数据集状态类型
// ===========================

import { PageDataSet } from './DataModel'

/**
 * 数据源配置
 */
export interface DataSource {
    type: 'static' | 'api' | 'computed' // 数据源类型
    data?: any[] // 静态数据
    url?: string // API 地址
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' // HTTP 方法
    headers?: Record<string, string> // 请求头
    params?: Record<string, any> // 请求参数
    dependencies?: string[] // 依赖的数据集ID
    computation?: (deps: any[]) => any[] // 计算函数
}

/**
 * 缓存配置
 */
export interface CacheConfig {
    enabled: boolean // 是否启用缓存
    duration: number // 缓存时长（毫秒）
    key?: string // 自定义缓存键
}

/**
 * 数据集 - 运行时数据容器
 */
export interface Dataset {
    id: string // 数据集标识
    name: string // 数据集名称
    schema: PageDataSet // 数据集架构（从 DataModel 来）
    source: DataSource // 数据源配置
    cache?: CacheConfig // 缓存配置
    data: Record<string, any[]> // 实际数据，按表名组织
    state: DataState // 数据状态
    lastModified: Date // 最后修改时间
}

/**
 * 数据状态
 */
export interface DataState {
    data?: any[] // 数据（兼容旧代码）
    loading: boolean // 是否正在加载
    error?: string // 错误信息
    dirty: boolean // 是否有未保存的修改
    selectedRows: Record<string, number[]> // 每个表的选中行索引
    currentPage: Record<string, number> // 每个表的当前页码
    pageSize: Record<string, number> // 每个表的每页行数
    filters: Record<string, Record<string, any>> // 每个表的筛选条件
    sorts: Record<string, Array<{ column: string; direction: 'asc' | 'desc' }>> // 每个表的排序条件
}

/**
 * 数据操作结果
 */
export interface DataOperationResult {
    success: boolean // 操作是否成功
    message?: string // 操作消息
    data?: any // 返回的数据
    errors?: Array<{
        field?: string // 出错字段
        message: string // 错误消息
    }>
}

/**
 * 数据查询条件
 */
export interface QueryCondition {
    field: string // 字段名
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'notin' // 操作符
    value: any // 值
    logical?: 'and' | 'or' // 逻辑连接符（用于多条件）
}

/**
 * 数据查询参数
 */
export interface QueryParams {
    tableName: string // 表名
    conditions?: QueryCondition[] // 查询条件
    orderBy?: Array<{ field: string; direction: 'asc' | 'desc' }> // 排序
    page?: number // 页码
    pageSize?: number // 每页行数
    fields?: string[] // 指定返回字段
}
