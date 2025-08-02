/**
 * 交叉表透视表前端 JSON 结构设计
 * Pivot Table Cross-Tab Frontend JSON Structure Design
 * 
 * 基于现有的多字段分组和聚合功能，设计完整的透视表配置结构
 * Based on existing multi-field grouping and aggregation features, design complete pivot table configuration structure
 */

/**
 * 透视表配置主接口
 * Main Pivot Table Configuration Interface
 */
export interface PivotTableConfig {
    // 基础配置
    id: string                        // 透视表唯一标识
    title?: string                   // 透视表标题
    description?: string             // 描述信息

    // 数据源配置
    dataSource: {
        type: 'static' | 'api' | 'dataset'  // 数据源类型
        data?: any[]                   // 静态数据
        apiConfig?: {
            url: string
            method?: 'GET' | 'POST'
            params?: Record<string, any>
            headers?: Record<string, string>
        }
        datasetId?: string             // 数据集ID
        refresh?: {
            auto: boolean                // 是否自动刷新
            interval?: number            // 刷新间隔（秒）
        }
    }

    // 透视表核心配置
    pivot: {
        // 行维度配置（左侧分组）
        rows: PivotDimension[]

        // 列维度配置（顶部分组）
        columns: PivotDimension[]

        // 度量值配置（中间数据区域）
        measures: PivotMeasure[]

        // 筛选器配置
        filters?: PivotFilter[]

        // 排序配置
        sorting?: PivotSorting[]
    }

    // 显示配置
    display: {
        // 表格样式
        table: {
            showRowHeaders?: boolean     // 显示行标题
            showColumnHeaders?: boolean  // 显示列标题
            showGrandTotals?: boolean   // 显示总计
            showSubTotals?: boolean     // 显示小计
            freezeHeaders?: boolean     // 冻结表头
            alternateRowColors?: boolean // 交替行颜色
            borderStyle?: 'none' | 'light' | 'medium' | 'heavy'
            compactLayout?: boolean     // 紧凑布局
            outlineLayout?: boolean     // 大纲布局
        }

        // 单元格样式
        cells: {
            numberFormat?: Record<string, string>  // 数字格式 { measure_id: format }
            conditionalFormat?: ConditionalFormat[] // 条件格式
            cellPadding?: number
            fontSize?: number
            fontFamily?: string
        }

        // 交互配置
        interaction: {
            expandable?: boolean         // 可展开/折叠
            drillDown?: boolean         // 支持下钻
            exportable?: boolean        // 可导出
            searchable?: boolean        // 可搜索
            resizable?: boolean         // 可调整大小
        }
    }

    // 高级配置
    advanced?: {
        // 计算字段
        calculatedFields?: CalculatedField[]

        // 排名设置
        topN?: {
            enabled: boolean
            field: string
            count: number
            type: 'top' | 'bottom'
        }

        // 百分比计算
        percentage?: {
            enabled: boolean
            base: 'row' | 'column' | 'grand_total'
        }

        // 累计计算
        runningTotal?: {
            enabled: boolean
            field: string
            direction: 'row' | 'column'
        }
    }
}

/**
 * 透视表维度配置
 * Pivot Table Dimension Configuration
 */
export interface PivotDimension {
    id: string                      // 维度ID
    field: string                   // 对应数据字段
    label: string                   // 显示标签
    dataType: 'string' | 'number' | 'date' | 'boolean'

    // 分组配置
    grouping?: {
        type: 'value' | 'range' | 'date' | 'custom'

        // 值分组
        valueGrouping?: {
            sortOrder?: 'asc' | 'desc' | 'custom'
            customOrder?: string[]
            showEmpty?: boolean
        }

        // 范围分组（数值）
        rangeGrouping?: {
            ranges: Array<{
                label: string
                min?: number
                max?: number
            }>
        }

        // 日期分组
        dateGrouping?: {
            unit: 'year' | 'quarter' | 'month' | 'week' | 'day'
            format?: string
        }

        // 自定义分组
        customGrouping?: {
            groups: Array<{
                label: string
                values: any[]
            }>
        }
    }

    // 显示配置
    display?: {
        width?: number
        visible?: boolean
        collapsible?: boolean
        defaultExpanded?: boolean
        showTotals?: boolean
        totalsLabel?: string
    }

    // 排序配置
    sorting?: {
        enabled: boolean
        direction?: 'asc' | 'desc'
        customSort?: string[]
    }
}

/**
 * 透视表度量值配置
 * Pivot Table Measure Configuration
 */
export interface PivotMeasure {
    id: string                      // 度量值ID
    field: string                   // 对应数据字段
    label: string                   // 显示标签

    // 聚合函数
    aggregation: {
        type: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'count_distinct' | 'custom'
        customFunction?: string       // 自定义函数表达式
    }

    // 数据类型和格式
    format: {
        type: 'number' | 'currency' | 'percentage' | 'date'
        precision?: number
        currency?: string
        dateFormat?: string
        thousandSeparator?: boolean
        prefix?: string
        suffix?: string
    }

    // 显示配置
    display?: {
        visible?: boolean
        width?: number
        alignment?: 'left' | 'center' | 'right'
        showInTooltip?: boolean
    }

    // 条件格式
    conditionalFormat?: Array<{
        condition: string             // 条件表达式
        style: {
            backgroundColor?: string
            color?: string
            fontWeight?: 'normal' | 'bold'
            icon?: string
        }
    }>
}

/**
 * 透视表筛选器配置
 * Pivot Table Filter Configuration
 */
export interface PivotFilter {
    id: string
    field: string
    label: string
    type: 'select' | 'multiselect' | 'range' | 'date_range' | 'search'

    // 筛选值
    values?: any[]
    selectedValues?: any[]

    // 范围筛选
    range?: {
        min?: number
        max?: number
        selectedMin?: number
        selectedMax?: number
    }

    // 日期范围筛选
    dateRange?: {
        start?: string
        end?: string
        selectedStart?: string
        selectedEnd?: string
        presets?: Array<{
            label: string
            value: string
            start: string
            end: string
        }>
    }

    // 显示配置
    display?: {
        position: 'top' | 'left' | 'right' | 'popup'
        showSelectAll?: boolean
        searchable?: boolean
        collapsible?: boolean
    }
}

/**
 * 透视表排序配置
 * Pivot Table Sorting Configuration
 */
export interface PivotSorting {
    target: 'row' | 'column' | 'measure'
    field: string
    direction: 'asc' | 'desc'
    priority: number                // 排序优先级

    // 度量值排序特殊配置
    measureSorting?: {
        measureId: string
        subtotalLevel?: number        // 在哪个层级的小计上排序
    }
}

/**
 * 计算字段配置
 * Calculated Field Configuration
 */
export interface CalculatedField {
    id: string
    name: string
    expression: string              // 计算表达式
    dataType: 'number' | 'string' | 'date' | 'boolean'
    description?: string

    // 格式配置
    format?: {
        type: 'number' | 'currency' | 'percentage'
        precision?: number
        currency?: string
    }
}

/**
 * 条件格式配置
 * Conditional Format Configuration
 */
export interface ConditionalFormat {
    id: string
    name: string
    target: 'cell' | 'row' | 'column'
    field?: string                  // 应用到哪个字段

    // 条件规则
    rules: Array<{
        condition: string             // 条件表达式
        style: {
            backgroundColor?: string
            color?: string
            fontWeight?: 'normal' | 'bold'
            fontStyle?: 'normal' | 'italic'
            border?: string
            icon?: {
                type: 'arrow' | 'flag' | 'shape' | 'indicator'
                name: string
                color?: string
            }
        }
    }>

    // 应用范围
    scope?: {
        rows?: string[]               // 应用到哪些行维度
        columns?: string[]            // 应用到哪些列维度
        measures?: string[]           // 应用到哪些度量值
    }
}

/**
 * 透视表运行时状态
 * Pivot Table Runtime State
 */
export interface PivotTableState {
    // 当前数据
    rawData: any[]
    processedData: PivotTableData

    // 展开/折叠状态
    expandedRows: Set<string>
    expandedColumns: Set<string>

    // 筛选状态
    activeFilters: Record<string, any>

    // 排序状态
    currentSorting: PivotSorting[]

    // 选择状态
    selectedCells: Array<{
        row: number
        column: number
        value: any
    }>

    // 加载状态
    loading: boolean
    error?: string
    lastUpdated?: Date
}

/**
 * 透视表数据结构
 * Pivot Table Data Structure
 */
export interface PivotTableData {
    // 行标题结构
    rowHeaders: PivotHeader[]

    // 列标题结构
    columnHeaders: PivotHeader[]

    // 数据单元格
    cells: PivotCell[][]

    // 小计和总计
    totals: {
        rowTotals: Record<string, PivotCell[]>
        columnTotals: Record<string, PivotCell[]>
        grandTotal: PivotCell
    }

    // 元数据
    metadata: {
        rowCount: number
        columnCount: number
        measureCount: number
        totalRecords: number
        processingTime?: number
    }
}

/**
 * 透视表标题
 * Pivot Table Header
 */
export interface PivotHeader {
    id: string
    label: string
    level: number                   // 层级深度
    path: string[]                  // 从根到当前节点的路径
    parentId?: string
    children?: PivotHeader[]

    // 聚合信息
    aggregation?: {
        type: string
        value: any
        count: number
    }

    // 显示状态
    expanded?: boolean
    visible?: boolean
    colspan?: number
    rowspan?: number
}

/**
 * 透视表单元格
 * Pivot Table Cell
 */
export interface PivotCell {
    id: string
    value: any
    formattedValue: string

    // 位置信息
    row: number
    column: number
    measureId?: string

    // 聚合信息
    aggregation?: {
        type: string
        sourceValues: any[]
        count: number
    }

    // 样式信息
    style?: {
        backgroundColor?: string
        color?: string
        fontWeight?: string
        alignment?: string
    }

    // 交互信息
    clickable?: boolean
    drillable?: boolean
    tooltip?: string
}

// 示例配置
export const samplePivotConfig: PivotTableConfig = {
    id: 'sales_pivot_001',
    title: '销售数据透视分析',
    description: '按地区、产品类别和时间维度分析销售业绩',

    dataSource: {
        type: 'static',
        data: [
            { region: '华北', category: '电子', department: '销售', month: '2024-01', amount: 10000, qty: 100 },
            { region: '华北', category: '服装', department: '销售', month: '2024-01', amount: 8000, qty: 80 },
            { region: '华南', category: '电子', department: '技术', month: '2024-02', amount: 15000, qty: 150 },
            // ... 更多数据
        ]
    },

    pivot: {
        // 行维度：地区 + 产品类别
        rows: [
            {
                id: 'region_dim',
                field: 'region',
                label: '地区',
                dataType: 'string',
                grouping: {
                    type: 'value',
                    valueGrouping: {
                        sortOrder: 'asc',
                        showEmpty: false
                    }
                },
                display: {
                    showTotals: true,
                    totalsLabel: '地区小计',
                    defaultExpanded: true
                }
            },
            {
                id: 'category_dim',
                field: 'category',
                label: '产品类别',
                dataType: 'string',
                grouping: {
                    type: 'value'
                },
                display: {
                    showTotals: true,
                    totalsLabel: '类别小计'
                }
            }
        ],

        // 列维度：月份
        columns: [
            {
                id: 'month_dim',
                field: 'month',
                label: '月份',
                dataType: 'date',
                grouping: {
                    type: 'date',
                    dateGrouping: {
                        unit: 'month',
                        format: 'YYYY-MM'
                    }
                },
                display: {
                    showTotals: true,
                    totalsLabel: '月度合计'
                }
            }
        ],

        // 度量值：销售金额 + 数量
        measures: [
            {
                id: 'amount_measure',
                field: 'amount',
                label: '销售金额',
                aggregation: {
                    type: 'sum'
                },
                format: {
                    type: 'currency',
                    currency: 'CNY',
                    precision: 2,
                    thousandSeparator: true
                },
                conditionalFormat: [
                    {
                        condition: 'value > 50000',
                        style: {
                            backgroundColor: '#e8f5e8',
                            color: '#2d5a2d',
                            fontWeight: 'bold'
                        }
                    }
                ]
            },
            {
                id: 'qty_measure',
                field: 'qty',
                label: '销售数量',
                aggregation: {
                    type: 'sum'
                },
                format: {
                    type: 'number',
                    precision: 0,
                    thousandSeparator: true,
                    suffix: ' 件'
                }
            }
        ],

        // 筛选器
        filters: [
            {
                id: 'department_filter',
                field: 'department',
                label: '部门',
                type: 'multiselect',
                values: ['销售', '技术', '市场'],
                selectedValues: ['销售', '技术'],
                display: {
                    position: 'top',
                    showSelectAll: true
                }
            }
        ],

        // 排序
        sorting: [
            {
                target: 'measure',
                field: 'amount_measure',
                direction: 'desc',
                priority: 1,
                measureSorting: {
                    measureId: 'amount_measure',
                    subtotalLevel: 1
                }
            }
        ]
    },

    display: {
        table: {
            showRowHeaders: true,
            showColumnHeaders: true,
            showGrandTotals: true,
            showSubTotals: true,
            freezeHeaders: true,
            alternateRowColors: true,
            borderStyle: 'light',
            compactLayout: false
        },

        cells: {
            numberFormat: {
                'amount_measure': '¥#,##0.00',
                'qty_measure': '#,##0'
            },
            cellPadding: 8,
            fontSize: 14
        },

        interaction: {
            expandable: true,
            drillDown: true,
            exportable: true,
            searchable: true,
            resizable: true
        }
    },

    advanced: {
        // 计算字段：平均单价
        calculatedFields: [
            {
                id: 'avg_price',
                name: '平均单价',
                expression: 'amount / qty',
                dataType: 'number',
                format: {
                    type: 'currency',
                    currency: 'CNY',
                    precision: 2
                }
            }
        ],

        // 显示销售额前5的组合
        topN: {
            enabled: true,
            field: 'amount_measure',
            count: 5,
            type: 'top'
        },

        // 显示占比
        percentage: {
            enabled: true,
            base: 'grand_total'
        }
    }
};

export default {
    samplePivotConfig
};
