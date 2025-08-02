/**
 * 优化后的分组字段配置示例
 * 
 * 使用 groupFields: string[] 提供更灵活的分组配置
 * 不考虑向后兼容，直接使用最优化的设计
 */

import { DataGridColumn, ColumnComponent } from '../src/core/types'

// ===========================
// 示例1：单字段分组
// ===========================

/**
 * 单字段分组：按区域分组
 * groupFields: ['region'] - 比原来的 groupField: 'region' 更统一
 */
export const singleFieldGrouping: DataGridColumn = {
    id: 'sales-data',
    component: {
        id: 'sales-data',
        name: 'sales-data',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'amount',
        label: '销售金额'
    } as ColumnComponent,

    groupConfig: {
        groupFields: ['region'], // 统一使用数组格式
        groupType: 'value',
        groupMode: 'hierarchical',
        showGroupCount: true,

        aggregations: [
            {
                type: 'sum',
                label: '区域总计',
                position: 'header',
                format: '¥{value:,.0f}'
            }
        ]
    }
}

// ===========================
// 示例2：多字段层级分组
// ===========================

/**
 * 多字段层级分组：区域 > 销售员 > 产品
 * groupFields: ['region', 'salesperson', 'product'] - 一次配置多个层级
 */
export const multiFieldHierarchicalGrouping: DataGridColumn = {
    id: 'hierarchical-sales',
    component: {
        id: 'hierarchical-sales',
        name: 'hierarchical-sales',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'amount',
        label: '销售数据'
    } as ColumnComponent,

    groupConfig: {
        groupFields: ['region', 'salesperson', 'product'], // 多层级分组字段
        groupType: 'value',
        groupMode: 'hierarchical', // 层级展示
        groupOrder: 1,
        showGroupCount: true,
        expandable: true,
        defaultExpanded: false,

        aggregations: [
            {
                type: 'sum',
                label: '小计',
                position: 'header',
                format: '¥{value:,.0f}'
            },
            {
                type: 'count',
                label: '数量',
                position: 'header',
                format: '{value}项'
            }
        ],

        aggregationConfig: {
            showGrandTotal: true,
            aggregationSeparator: ' | '
        }
    }
}

// ===========================
// 示例3：多字段组合分组
// ===========================

/**
 * 多字段组合分组：所有字段组合成一个分组键
 * groupFields: ['region', 'salesperson', 'product'] - 组合显示
 */
export const multiFieldCombinedGrouping: DataGridColumn = {
    id: 'combined-sales',
    component: {
        id: 'combined-sales',
        name: 'combined-sales',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'amount',
        label: '销售数据'
    } as ColumnComponent,

    groupConfig: {
        groupFields: ['region', 'salesperson', 'product'], // 多字段组合
        groupType: 'value',
        groupMode: 'combined', // 组合显示

        // 组合分组显示配置
        combinedSeparator: '-', // 字段间分隔符
        groupTemplate: '{region}区-{salesperson}-{product}', // 自定义模板

        showGroupCount: false,
        expandable: false,

        aggregations: [
            {
                type: 'sum',
                label: '销售额',
                position: 'footer',
                format: '¥{value:,.0f}'
            }
        ],

        aggregationConfig: {
            showGrandTotal: true,
            aggregationPrefix: '💰 '
        }
    }
}

// ===========================
// 示例4：灵活的字段组合
// ===========================

/**
 * 灵活字段组合：支持跨表字段和计算字段
 * groupFields 可以包含任意字段，不限于当前列
 */
export const flexibleFieldGrouping: DataGridColumn = {
    id: 'flexible-grouping',
    component: {
        id: 'flexible-grouping',
        name: 'flexible-grouping',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'revenue',
        label: '收入数据'
    } as ColumnComponent,

    groupConfig: {
        // 支持跨表字段和计算字段
        groupFields: [
            'customer.region',        // 客户表的区域字段
            'product.category',       // 产品表的类别字段
            'order.quarter',          // 订单的季度（计算字段）
            'salesperson.level'       // 销售员等级
        ],

        groupType: 'value',
        groupMode: 'combined',

        combinedSeparator: ' | ',
        groupTemplate: '{customer.region} | {product.category} | Q{order.quarter} | {salesperson.level}级',

        aggregations: [
            {
                type: 'sum',
                field: 'revenue',
                label: '收入',
                position: 'footer',
                format: '¥{value:,.0f}'
            },
            {
                type: 'avg',
                field: 'profit_margin',
                label: '利润率',
                position: 'footer',
                format: '{value:.1f}%'
            }
        ]
    }
}

// ===========================
// 示例5：动态分组字段
// ===========================

/**
 * 动态分组字段：根据用户选择动态配置分组字段
 * 支持运行时修改 groupFields
 */
export const dynamicFieldGrouping: DataGridColumn = {
    id: 'dynamic-grouping',
    component: {
        id: 'dynamic-grouping',
        name: 'dynamic-grouping',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'value',
        label: '数据'
    } as ColumnComponent,

    groupConfig: {
        // 初始分组字段（可以通过 API 动态修改）
        groupFields: ['dimension1', 'dimension2'],

        groupType: 'value',
        groupMode: 'hierarchical',

        // 支持动态配置的显示选项
        showGroupCount: true,
        expandable: true,
        defaultExpanded: true,
        displaySeparator: ' → ',

        aggregations: [
            {
                type: 'sum',
                label: '汇总',
                position: 'header',
                format: '{value:,.0f}'
            }
        ]
    }
}

// ===========================
// 示例6：复杂业务场景
// ===========================

/**
 * 复杂业务场景：电商数据分析
 * 按时间、地区、品类、渠道多维度分组
 */
export const ecommerceAnalysisGrouping: DataGridColumn = {
    id: 'ecommerce-analysis',
    component: {
        id: 'ecommerce-analysis',
        name: 'ecommerce-analysis',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'sales_amount',
        label: '电商销售数据'
    } as ColumnComponent,

    groupConfig: {
        groupFields: [
            'time_period',      // 时间维度
            'region',           // 地理维度  
            'category',         // 产品维度
            'channel',          // 渠道维度
            'customer_segment'  // 客户维度
        ],

        groupType: 'value',
        groupMode: 'combined',

        // 自定义显示模板
        groupTemplate: '[{time_period}] {region} - {category} - {channel}渠道 - {customer_segment}客户',

        showGroupCount: true,

        aggregations: [
            {
                type: 'sum',
                field: 'sales_amount',
                label: '销售额',
                position: 'footer',
                format: '¥{value:,.0f}'
            },
            {
                type: 'sum',
                field: 'order_count',
                label: '订单量',
                position: 'footer',
                format: '{value:,}单'
            },
            {
                type: 'avg',
                field: 'conversion_rate',
                label: '转化率',
                position: 'footer',
                format: '{value:.2f}%'
            }
        ],

        aggregationConfig: {
            showGrandTotal: true,
            aggregationSeparator: ' | ',
            aggregationPrefix: '📊 总计: '
        }
    }
}

/**
 * 优化后的 groupFields 配置优势：
 * 
 * 🎯 1. 统一性
 *    - 单字段和多字段使用统一的数组格式
 *    - 消除了 groupField vs groupFields 的混淆
 *    - 配置方式更加一致
 * 
 * 🔧 2. 灵活性
 *    - 支持任意数量的分组字段
 *    - 支持跨表字段和计算字段
 *    - 支持运行时动态修改分组字段
 * 
 * 📊 3. 强大功能
 *    - 层级分组：自动按字段顺序建立层级
 *    - 组合分组：所有字段组合成一个分组键
 *    - 自定义模板：灵活控制显示格式
 * 
 * 🚀 4. 扩展性
 *    - 易于添加新的分组字段
 *    - 支持复杂的多维度分析
 *    - 为未来功能扩展预留空间
 * 
 * 💡 5. 简化配置
 *    - 减少嵌套配置结构
 *    - 核心配置更加直观
 *    - 降低学习和使用成本
 */
