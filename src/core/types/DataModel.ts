// ===========================
// Data Model Types - 数据模型类型定义
// ===========================
// 基于 .NET DataSet 结构设计，以页面为单位管理数据

/**
 * 数据类型枚举 - 对应 .NET 基础类型
 */
export type DataType =
    | 'string'     // String
    | 'int'        // Int32
    | 'long'       // Int64
    | 'decimal'    // Decimal
    | 'double'     // Double
    | 'boolean'    // Boolean
    | 'datetime'   // DateTime
    | 'guid'       // Guid
    | 'byte[]'     // Byte[]
    | 'object'     // Object

/**
 * 关系类型枚举 - 对应 .NET DataRelation
 */
export type RelationType =
    | 'OneToOne'     // 一对一
    | 'OneToMany'    // 一对多
    | 'ManyToOne'    // 多对一
    | 'ManyToMany'   // 多对多

/**
 * 约束类型枚举
 */
export type ConstraintType =
    | 'PrimaryKey'   // 主键约束
    | 'ForeignKey'   // 外键约束
    | 'Unique'       // 唯一约束
    | 'Check'        // 检查约束
    | 'NotNull'      // 非空约束

/**
 * 数据列定义 - 对应 .NET DataColumn
 */
export interface DataColumn {
    tableName: string           // 所属表名
    columnName: string          // 列名
    dataType: DataType          // 数据类型
    allowDBNull: boolean        // 是否允许空值
    defaultValue?: any          // 默认值
    maxLength?: number          // 最大长度（字符串类型）
    autoIncrement?: boolean     // 是否自增（数值类型）
    autoIncrementSeed?: number  // 自增起始值
    autoIncrementStep?: number  // 自增步长
    readOnly?: boolean          // 是否只读
    unique?: boolean            // 是否唯一
    caption?: string            // 显示标题
    expression?: string         // 计算列表达式
    ordinal: number             // 列顺序
}

/**
 * 数据约束定义 - 对应 .NET Constraint
 */
export interface DataConstraint {
    constraintName: string      // 约束名称
    tableName: string           // 所属表名
    constraintType: ConstraintType // 约束类型
    columnNames: string[]       // 约束列名

    // 外键约束特有属性
    referencedTableName?: string    // 引用表名
    referencedColumnNames?: string[] // 引用列名
    deleteRule?: 'None' | 'Cascade' | 'SetNull' | 'SetDefault' // 删除规则
    updateRule?: 'None' | 'Cascade' | 'SetNull' | 'SetDefault' // 更新规则

    // 检查约束特有属性
    expression?: string         // 检查表达式
}

/**
 * 数据表定义 - 对应 .NET DataTable
 */
export interface DataTable {
    tableName: string           // 表名
    displayName?: string        // 显示名称
    namespace?: string          // 命名空间
    prefix?: string             // 表前缀
    caseSensitive?: boolean     // 是否区分大小写
    locale?: string             // 本地化设置
    minimumCapacity?: number    // 最小容量

    // 表结构
    columns: DataColumn[]       // 列集合
    constraints: DataConstraint[] // 约束集合

    // 表数据（可选，用于静态数据或缓存）
    rows?: DataRow[]            // 行数据

    // 扩展属性
    extendedProperties?: Record<string, any> // 扩展属性
}

/**
 * 数据行定义 - 对应 .NET DataRow
 */
export interface DataRow {
    id: string                  // 行唯一标识
    values: Record<string, any> // 列值映射
    rowState: 'Added' | 'Modified' | 'Deleted' | 'Unchanged' // 行状态
    originalValues?: Record<string, any> // 原始值（用于变更跟踪）
    errors?: Record<string, string> // 列错误信息
    hasErrors: boolean          // 是否有错误
    itemArray?: any[]           // 值数组（按列顺序）
}

/**
 * 数据关系定义 - 对应 .NET DataRelation
 */
export interface DataRelation {
    relationName: string        // 关系名称
    relationType: RelationType  // 关系类型

    // 父表信息
    parentTableName: string     // 父表名
    parentColumnNames: string[] // 父表列名

    // 子表信息
    childTableName: string      // 子表名
    childColumnNames: string[]  // 子表列名

    // 关系属性
    nested?: boolean            // 是否嵌套关系
    createConstraints?: boolean // 是否创建约束

    // 扩展属性
    extendedProperties?: Record<string, any>
}

/**
 * 页面数据集定义 - 对应 .NET DataSet
 */
export interface PageDataSet {
    pageId: string              // 页面ID
    dataSetName: string         // 数据集名称
    namespace?: string          // 命名空间
    prefix?: string             // 前缀
    caseSensitive?: boolean     // 是否区分大小写
    locale?: string             // 本地化设置
    enforceConstraints: boolean // 是否强制约束

    // 数据集内容
    tables: DataTable[]         // 表集合
    relations: DataRelation[]   // 关系集合

    // 扩展属性
    extendedProperties?: Record<string, any>

    // 序列化选项
    remoteSerializationFormat?: 'Xml' | 'Binary' // 远程序列化格式
    schemaSerializationMode?: 'IncludeSchema' | 'ExcludeSchema' // 架构序列化模式
}

/**
 * 数据适配器定义 - 对应 .NET DataAdapter
 */
export interface DataAdapter {
    adapterName: string         // 适配器名称
    tableName: string           // 关联表名

    // SQL 命令
    selectCommand?: DataCommand // 查询命令
    insertCommand?: DataCommand // 插入命令
    updateCommand?: DataCommand // 更新命令
    deleteCommand?: DataCommand // 删除命令

    // 适配器选项
    acceptChangesDuringFill?: boolean    // 填充时是否接受更改
    acceptChangesDuringUpdate?: boolean  // 更新时是否接受更改
    continueUpdateOnError?: boolean      // 出错时是否继续更新
    fillLoadOption?: 'OverwriteChanges' | 'PreserveChanges' | 'Upsert' // 填充选项
    missingMappingAction?: 'Passthrough' | 'Ignore' | 'Error' // 缺失映射操作
    missingSchemaAction?: 'Add' | 'AddWithKey' | 'Ignore' | 'Error' // 缺失架构操作
    returnProviderSpecificTypes?: boolean // 是否返回提供程序特定类型

    // 表映射
    tableMappings?: DataTableMapping[]   // 表映射集合
}

/**
 * 数据命令定义 - 对应 .NET DbCommand
 */
export interface DataCommand {
    commandName: string         // 命令名称
    commandText: string         // 命令文本（SQL）
    commandType: 'Text' | 'StoredProcedure' | 'TableDirect' // 命令类型
    commandTimeout?: number     // 命令超时时间
    connection?: string         // 连接字符串ID

    // 参数集合
    parameters?: DataParameter[]

    // 事务支持
    transaction?: string        // 事务ID
}

/**
 * 数据参数定义 - 对应 .NET DbParameter
 */
export interface DataParameter {
    parameterName: string       // 参数名
    dbType: DataType           // 数据库类型
    direction: 'Input' | 'Output' | 'InputOutput' | 'ReturnValue' // 参数方向
    value?: any                // 参数值
    size?: number              // 参数大小
    precision?: number         // 精度
    scale?: number             // 小数位数
    sourceColumn?: string      // 源列名
    sourceVersion?: 'Current' | 'Original' | 'Proposed' | 'Default' // 源版本
    sourceColumnNullMapping?: boolean // 源列空值映射
}

/**
 * 表映射定义 - 对应 .NET DataTableMapping
 */
export interface DataTableMapping {
    mappingName: string        // 映射名称
    sourceTable: string        // 源表名
    dataSetTable: string       // 数据集表名

    // 列映射集合
    columnMappings: DataColumnMapping[]
}

/**
 * 列映射定义 - 对应 .NET DataColumnMapping
 */
export interface DataColumnMapping {
    mappingName: string        // 映射名称
    sourceColumn: string       // 源列名
    dataSetColumn: string      // 数据集列名
}

/**
 * 数据视图定义 - 对应 .NET DataView
 */
export interface DataView {
    viewName: string           // 视图名称
    tableName: string          // 关联表名

    // 视图设置
    rowFilter?: string         // 行筛选器
    sort?: string              // 排序表达式
    rowStateFilter?: 'CurrentRows' | 'Added' | 'Deleted' | 'ModifiedCurrent' | 'ModifiedOriginal' | 'New' | 'OriginalRows' | 'Unchanged' // 行状态筛选器

    // 视图选项
    allowDelete?: boolean      // 是否允许删除
    allowEdit?: boolean        // 是否允许编辑
    allowNew?: boolean         // 是否允许新增

    // 应用默认排序
    applyDefaultSort?: boolean
}

// ===========================
// 便利函数
// ===========================

/**
 * 创建数据列
 */
export function createDataColumn(
    columnName: string,
    dataType: DataType,
    tableName: string,
    options?: {
        allowDBNull?: boolean
        defaultValue?: any
        maxLength?: number
        autoIncrement?: boolean
        unique?: boolean
        caption?: string
        ordinal?: number
    }
): DataColumn {
    return {
        tableName,
        columnName,
        dataType,
        allowDBNull: options?.allowDBNull ?? true,
        defaultValue: options?.defaultValue,
        maxLength: options?.maxLength,
        autoIncrement: options?.autoIncrement ?? false,
        unique: options?.unique ?? false,
        caption: options?.caption ?? columnName,
        ordinal: options?.ordinal ?? 0
    }
}

/**
 * 创建数据表
 */
export function createDataTable(
    tableName: string,
    columns: DataColumn[],
    options?: {
        displayName?: string
        namespace?: string
        constraints?: DataConstraint[]
    }
): DataTable {
    return {
        tableName,
        displayName: options?.displayName ?? tableName,
        namespace: options?.namespace,
        columns,
        constraints: options?.constraints ?? [],
        rows: []
    }
}

/**
 * 创建数据关系
 */
export function createDataRelation(
    relationName: string,
    parentTableName: string,
    parentColumnNames: string[],
    childTableName: string,
    childColumnNames: string[],
    relationType: RelationType = 'OneToMany'
): DataRelation {
    return {
        relationName,
        relationType,
        parentTableName,
        parentColumnNames,
        childTableName,
        childColumnNames,
        nested: false,
        createConstraints: true
    }
}

/**
 * 创建页面数据集
 */
export function createPageDataSet(
    pageId: string,
    dataSetName: string,
    tables: DataTable[],
    relations?: DataRelation[]
): PageDataSet {
    return {
        pageId,
        dataSetName,
        enforceConstraints: true,
        tables,
        relations: relations ?? []
    }
}
