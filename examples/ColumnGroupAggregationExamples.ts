/**
 * 列分组聚合功能使用示例
 * 
 * 演示如何在 DataGridColumn 中使用 ColumnGroupMixin 的聚合功能
 * 用于对分组后的数据进行统计计算
 */

import { DataGridColumn, ColumnComponent } from '../src/core/types'

/**
 * 示例1：销售数据分组聚合
 * 按销售员分组，计算每组的销售总额、订单数量、平均订单金额
 */
export const salesAggregationExample: DataGridColumn = {
    id: 'sales-amount',
    component: {
        id: 'sales-amount',
        name: 'sales-amount',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'amount',
        label: '销售金额',
        validation: {
            required: true,
            type: 'number'
        }
    } as ColumnComponent,

    // 分组配置
    groupConfig: {
        groupFields: ['salesperson'], // 按销售员分组
        groupType: 'value',
        groupBy: 'exact',
        showGroupCount: true,
        expandable: true,
        defaultExpanded: false,

        // 聚合配置
        aggregations: [
            {
                type: 'sum',
                label: '总销售额',
                position: 'header',
                format: '¥{value:,.2f}',
                precision: 2,
                visible: true
            },
            {
                type: 'count',
                label: '订单数量',
                position: 'header',
                format: '{value}单',
                visible: true
            },
            {
                type: 'avg',
                label: '平均订单额',
                position: 'footer',
                format: '¥{value:,.2f}',
                precision: 2,
                visible: true
            }
        ],

        // 聚合显示配置
        aggregationConfig: {
            showGrandTotal: true,
            aggregationSeparator: ' | ',
            aggregationPrefix: '统计: ',
            aggregationSuffix: ''
        }
    }
}

/**
 * 示例2：产品库存分组聚合
 * 按产品类别分组，计算库存总量、最低库存、最高库存
 */
export const inventoryAggregationExample: DataGridColumn = {
    id: 'inventory-quantity',
    component: {
        id: 'inventory-quantity',
        name: 'inventory-quantity',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'quantity',
        label: '库存数量',
        validation: {
            required: true,
            type: 'number',
            min: 0
        }
    } as ColumnComponent,

    groupable: true,

    groupConfig: {
        groupField: 'category', // 按产品类别分组
        groupType: 'value',
        groupBy: 'exact',
        showGroupCount: true,
        expandable: true,
        defaultExpanded: true,

        aggregations: [
            {
                type: 'sum',
                label: '总库存',
                position: 'both',
                format: '{value:,}件',
                visible: true
            },
            {
                type: 'min',
                label: '最低库存',
                position: 'footer',
                format: '{value}件',
                visible: true
            },
            {
                type: 'max',
                label: '最高库存',
                position: 'footer',
                format: '{value}件',
                visible: true
            },
            {
                type: 'avg',
                label: '平均库存',
                position: 'footer',
                format: '{value:.1f}件',
                precision: 1,
                visible: true
            }
        ],

        aggregationConfig: {
            showGrandTotal: true,
            aggregationSeparator: ' • ',
            aggregationPrefix: '汇总: '
        }
    }
}

/**
 * 示例3：时间范围分组聚合
 * 按月份分组，计算每月的收入总和与订单数量
 */
export const monthlyRevenueExample: DataGridColumn = {
    id: 'order-date',
    component: {
        id: 'order-date',
        name: 'order-date',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'orderDate',
        label: '订单日期',
        validation: {
            required: true,
            type: 'date'
        }
    } as ColumnComponent,

    groupable: true,

    groupConfig: {
        groupType: 'date',
        dateGroupBy: 'month', // 按月分组
        showGroupCount: true,
        expandable: true,
        defaultExpanded: false,

        aggregations: [
            {
                type: 'sum',
                field: 'revenue', // 聚合不同字段的数据
                label: '月收入',
                position: 'header',
                format: '¥{value:,.2f}',
                precision: 2,
                visible: true
            },
            {
                type: 'count',
                label: '订单量',
                position: 'header',
                format: '{value}单',
                visible: true
            }
        ],

        aggregationConfig: {
            showGrandTotal: true,
            aggregationSeparator: ' | ',
            aggregationPrefix: '📊 '
        }
    }
}

/**
 * 示例4：自定义聚合函数
 * 计算加权平均价格或其他复杂统计
 */
export const customAggregationExample: DataGridColumn = {
    id: 'product-price',
    component: {
        id: 'product-price',
        name: 'product-price',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'price',
        label: '产品价格',
        validation: {
            required: true,
            type: 'number',
            min: 0
        }
    } as ColumnComponent,

    groupable: true,

    groupConfig: {
        groupField: 'brand',
        groupType: 'value',
        showGroupCount: true,

        aggregations: [
            {
                type: 'custom',
                customFunction: 'calculateWeightedAverage', // 自定义函数ID
                label: '加权平均价',
                position: 'footer',
                format: '¥{value:.2f}',
                visible: true
            },
            {
                type: 'custom',
                customFunction: 'calculatePriceRange',
                label: '价格区间',
                position: 'footer',
                format: '{value}',
                visible: true
            }
        ],

        aggregationConfig: {
            showGrandTotal: true,
            aggregationSeparator: ' | '
        }
    }
}

/**
 * 示例5：条件聚合
 * 只对满足特定条件的数据进行聚合
 */
export const conditionalAggregationExample: DataGridColumn = {
    id: 'order-status',
    component: {
        id: 'order-status',
        name: 'order-status',
        version: '1.0.0',
        type: 'Select',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'status',
        label: '订单状态',
        options: [
            { value: 'pending', label: '待处理' },
            { value: 'processing', label: '处理中' },
            { value: 'completed', label: '已完成' },
            { value: 'cancelled', label: '已取消' }
        ]
    } as ColumnComponent,

    groupable: true,

    groupConfig: {
        groupType: 'value',
        groupBy: 'exact',
        showGroupCount: true,

        aggregations: [
            {
                type: 'sum',
                field: 'amount',
                label: '已完成订单总额',
                position: 'footer',
                format: '¥{value:,.2f}',
                condition: 'status === "completed"', // 只聚合已完成的订单
                visible: true
            },
            {
                type: 'count',
                label: '有效订单数',
                position: 'header',
                condition: 'status !== "cancelled"', // 排除已取消的订单
                format: '{value}单',
                visible: true
            }
        ],

        aggregationConfig: {
            aggregationPrefix: '✓ '
        }
    }
}

/**
 * 示例6：多级分组聚合
 * 先按区域分组，再按销售员分组，计算多级聚合
 */
export const multiLevelGroupingExample: DataGridColumn[] = [
    // 第一级分组：按区域
    {
        id: 'region',
        component: {
            id: 'region',
            name: 'region',
            version: '1.0.0',
            type: 'Select',
            colSpan: 1,
            rowSpan: 1,
            order: 1,
            fieldName: 'region',
            label: '销售区域',
            options: [
                { value: 'north', label: '北区' },
                { value: 'south', label: '南区' },
                { value: 'east', label: '东区' },
                { value: 'west', label: '西区' }
            ]
        } as ColumnComponent,

        groupable: true,
        groupConfig: {
            groupType: 'value',
            groupOrder: 1, // 第一级分组
            showGroupCount: true,

            aggregations: [
                {
                    type: 'sum',
                    field: 'amount',
                    label: '区域总额',
                    position: 'header',
                    format: '¥{value:,.2f}',
                    visible: true
                }
            ],

            aggregationConfig: {
                showGrandTotal: true
            }
        }
    },

    // 第二级分组：按销售员
    {
        id: 'salesperson',
        component: {
            id: 'salesperson',
            name: 'salesperson',
            version: '1.0.0',
            type: 'Input',
            colSpan: 1,
            rowSpan: 1,
            order: 2,
            fieldName: 'salesperson',
            label: '销售员'
        } as ColumnComponent,

        groupable: true,
        groupConfig: {
            groupType: 'value',
            groupOrder: 2, // 第二级分组
            showGroupCount: true,

            aggregations: [
                {
                    type: 'sum',
                    field: 'amount',
                    label: '个人销售额',
                    position: 'header',
                    format: '¥{value:,.2f}',
                    visible: true
                },
                {
                    type: 'avg',
                    field: 'amount',
                    label: '平均订单额',
                    position: 'footer',
                    format: '¥{value:,.2f}',
                    visible: true
                }
            ],

            aggregationConfig: {
                aggregationSeparator: ' • '
            }
        }
    }
]

/**
 * 使用说明：
 * 
 * 1. 聚合类型说明：
 *    - sum: 求和
 *    - count: 计数
 *    - avg: 平均值
 *    - min: 最小值  
 *    - max: 最大值
 *    - custom: 自定义聚合函数
 * 
 * 2. 显示位置配置 (position)：
 *    - header: 分组头部显示
 *    - footer: 分组尾部显示
 *    - both: 头部和尾部都显示
 *    注：每个聚合项单独控制显示位置，无需全局开关
 * 
 * 3. 格式化：
 *    - 使用 {value} 占位符表示聚合值
 *    - 支持数字格式化，如 {value:,.2f} 表示千分位分隔符和2位小数
 * 
 * 4. 条件聚合：
 *    - 使用 condition 属性设置聚合条件
 *    - 支持 JavaScript 表达式
 * 
 * 5. 多级分组：
 *    - 使用 groupOrder 属性设置分组优先级
 *    - 数字越小优先级越高
 * 
 * 6. 聚合显示配置 (aggregationConfig)：
 *    - showGrandTotal: 是否显示总计
 *    - aggregationSeparator: 聚合值分隔符
 *    - aggregationPrefix/Suffix: 聚合值前缀/后缀
 *    注：移除了 showInGroupHeader/Footer，改为每个聚合项的 position 控制
 */
