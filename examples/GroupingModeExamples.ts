/**
 * 分组模式使用示例
 * 
 * 演示层级分组 vs 组合分组的不同使用场景和配置方式
 */

import { DataGridColumn, ColumnComponent } from '../src/core/types'

// ===========================
// 方式一：层级分组（默认方式）
// ===========================

/**
 * 层级分组示例：区域 > 销售员 > 产品
 * 
 * 显示效果：
 * ├─ 北区 (总计: ¥200,000)
 * │  ├─ 销售员A (小计: ¥80,000)
 * │  │  ├─ 产品X: ¥30,000
 * │  │  └─ 产品Y: ¥50,000
 * │  └─ 销售员B (小计: ¥120,000)
 * │     ├─ 产品X: ¥70,000
 * │     └─ 产品Z: ¥50,000
 * └─ 南区 (总计: ¥150,000)
 *    └─ 销售员C (小计: ¥150,000)
 *       └─ 产品Y: ¥150,000
 */
export const hierarchicalGroupingExample: DataGridColumn[] = [
    // 第一层：按区域分组
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
                { value: 'south', label: '南区' }
            ]
        } as ColumnComponent,

        groupable: true,
        groupConfig: {
            groupMode: 'hierarchical', // 层级分组模式
            groupType: 'value',
            groupOrder: 1, // 第一层
            showGroupCount: true,
            expandable: true,
            defaultExpanded: true,

            aggregations: [
                {
                    type: 'sum',
                    field: 'amount',
                    label: '区域总计',
                    position: 'header',
                    format: '¥{value:,.0f}',
                    visible: true
                }
            ]
        }
    },

    // 第二层：按销售员分组
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
            groupMode: 'hierarchical',
            groupType: 'value',
            groupOrder: 2, // 第二层
            showGroupCount: true,
            expandable: true,
            defaultExpanded: false,

            aggregations: [
                {
                    type: 'sum',
                    field: 'amount',
                    label: '个人小计',
                    position: 'header',
                    format: '¥{value:,.0f}',
                    visible: true
                }
            ]
        }
    },

    // 第三层：按产品分组
    {
        id: 'product',
        component: {
            id: 'product',
            name: 'product',
            version: '1.0.0',
            type: 'Input',
            colSpan: 1,
            rowSpan: 1,
            order: 3,
            fieldName: 'product',
            label: '产品'
        } as ColumnComponent,

        groupable: true,
        groupConfig: {
            groupMode: 'hierarchical',
            groupType: 'value',
            groupOrder: 3, // 第三层
            showGroupCount: false,
            expandable: false,

            aggregations: [
                {
                    type: 'sum',
                    field: 'amount',
                    label: '产品销量',
                    position: 'footer',
                    format: '¥{value:,.0f}',
                    visible: true
                }
            ]
        }
    }
]

// ===========================
// 方式二：组合分组
// ===========================

/**
 * 组合分组示例：区域-销售员-产品 组合
 * 
 * 显示效果：
 * ├─ 北区-销售员A-产品X (¥30,000)
 * ├─ 北区-销售员A-产品Y (¥50,000)
 * ├─ 北区-销售员B-产品X (¥70,000)
 * ├─ 北区-销售员B-产品Z (¥50,000)
 * ├─ 南区-销售员C-产品Y (¥150,000)
 * └─ 总计: ¥350,000
 */
export const combinedGroupingExample: DataGridColumn = {
    id: 'combined-group',
    component: {
        id: 'combined-group',
        name: 'combined-group',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'amount',
        label: '销售金额'
    } as ColumnComponent,

    groupable: true,
    groupConfig: {
        groupMode: 'combined', // 组合分组模式
        groupType: 'value',

        // 组合分组配置
        combinedGroupConfig: {
            groupFields: ['region', 'salesperson', 'product'], // 参与组合的字段
            groupSeparator: '-', // 分组分隔符
            groupTemplate: '{region}-{salesperson}-{product}' // 显示模板
        },

        showGroupCount: false,
        expandable: false,

        aggregations: [
            {
                type: 'sum',
                label: '销售额',
                position: 'footer',
                format: '¥{value:,.0f}',
                visible: true
            }
        ],

        aggregationConfig: {
            showGrandTotal: true,
            aggregationPrefix: '总计: '
        }
    }
}

// ===========================
// 方式三：自定义模板组合分组
// ===========================

/**
 * 自定义模板组合分组：支持更灵活的显示格式
 * 
 * 显示效果：
 * ├─ 【北区】销售员A → 产品X (¥30,000, 5单)
 * ├─ 【北区】销售员A → 产品Y (¥50,000, 8单)
 * ├─ 【北区】销售员B → 产品X (¥70,000, 12单)
 * └─ 【南区】销售员C → 产品Y (¥150,000, 25单)
 */
export const customTemplateGroupingExample: DataGridColumn = {
    id: 'custom-template-group',
    component: {
        id: 'custom-template-group',
        name: 'custom-template-group',
        version: '1.0.0',
        type: 'Input',
        colSpan: 1,
        rowSpan: 1,
        order: 1,
        fieldName: 'amount',
        label: '销售数据'
    } as ColumnComponent,

    groupable: true,
    groupConfig: {
        groupMode: 'combined',
        groupType: 'value',

        combinedGroupConfig: {
            groupFields: ['region', 'salesperson', 'product'],
            groupTemplate: '【{region}】{salesperson} → {product}' // 自定义显示模板
        },

        showGroupCount: false,
        expandable: false,

        aggregations: [
            {
                type: 'sum',
                field: 'amount',
                label: '',
                position: 'footer',
                format: '¥{value:,.0f}',
                visible: true
            },
            {
                type: 'count',
                label: '',
                position: 'footer',
                format: '{value}单',
                visible: true
            }
        ],

        aggregationConfig: {
            aggregationSeparator: ', ',
            aggregationPrefix: '(',
            aggregationSuffix: ')'
        }
    }
}

// ===========================
// 使用场景对比
// ===========================

/**
 * 层级分组 vs 组合分组的使用场景对比：
 * 
 * 📊 层级分组 (Hierarchical Grouping)
 * ✅ 适用场景：
 *    - 需要逐层展开查看详细数据
 *    - 每一层都需要独立的聚合统计
 *    - 数据具有明确的层级关系
 *    - 用户需要在不同层级之间导航
 * 
 * 🎯 典型应用：
 *    - 财务报表（地区 > 部门 > 项目）
 *    - 组织架构数据（公司 > 部门 > 团队 > 员工）
 *    - 产品销售数据（品类 > 品牌 > 型号）
 * 
 * 🔄 组合分组 (Combined Grouping)
 * ✅ 适用场景：
 *    - 需要基于多个维度的平铺分组
 *    - 关注组合条件的聚合结果
 *    - 数据维度较多但层级关系不明确
 *    - 需要快速查看所有组合的汇总
 * 
 * 🎯 典型应用：
 *    - 交叉分析报表（地区-产品-时间组合）
 *    - 标签组合分析（用户标签A+标签B+标签C）
 *    - 多维度KPI统计（渠道-时段-类型组合）
 * 
 * 💡 选择建议：
 *    - 数据层级关系明确 → 选择层级分组
 *    - 需要多维度交叉分析 → 选择组合分组
 *    - 用户习惯逐层查看 → 选择层级分组
 *    - 用户需要快速对比 → 选择组合分组
 */
