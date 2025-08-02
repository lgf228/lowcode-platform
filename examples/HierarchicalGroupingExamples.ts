/**
 * 分层级分组示例
 * Hierarchical Grouping Examples
 * 
 * 展示基于数字层级的分组系统
 * Demonstrates numeric level-based grouping system
 */

import { ColumnGroupMixin } from '../src/core/types/Component';

// 分组函数类型常量
export const GROUP_FUNCTIONS = {
    BY_FIELD: 1,           // 按字段分组
    MULTI_FIELD: 2,        // 多字段组合
    NUMERIC_RANGE: 3,      // 数值范围
    TIME_PERIOD: 4,        // 时间段
    CUSTOM: 5              // 自定义
} as const;

// 示例1：销售数据的三层分组
// 第一层：按地区分组（华北、华南、华东）
// 第二层：按部门分组（销售、技术、市场）
// 第三层：按季度分组（Q1、Q2、Q3、Q4）

// 地区字段配置（第一层分组）
export const regionColumn: ColumnGroupMixin['groupConfig'] = {
    groupBy: 1,                    // 第一层分组（最高层级）
    aggregations: [
        {
            type: 'sum',
            field: 'sales_amount',
            label: '地区总销售额',
            position: 'header'
        },
        {
            type: 'count',
            label: '地区记录数',
            position: 'footer'
        }
    ]
};// 部门字段配置（第二层分组）
export const departmentColumn: ColumnGroupMixin['groupConfig'] = {
    groupBy: 2,                    // 第二层分组
    groupFunction: GROUP_FUNCTIONS.BY_FIELD,
    aggregations: [
        {
            type: 'sum',
            field: 'sales_amount',
            label: '部门总销售额',
            position: 'header'
        },
        {
            type: 'avg',
            field: 'sales_amount',
            label: '部门平均销售额',
            position: 'footer'
        }
    ]
};

// 季度字段配置（第三层分组）
export const quarterColumn: ColumnGroupMixin['groupConfig'] = {
    groupBy: 3,                    // 第三层分组
    groupFunction: GROUP_FUNCTIONS.TIME_PERIOD,
    aggregations: [
        {
            type: 'sum',
            field: 'sales_amount',
            label: '季度销售额',
            position: 'header'
        }
    ]
};

// 示例2：更复杂的多字段层级分组
// 第一层：按地区+产品类别组合分组
// 第二层：按年龄段范围分组

// 第一层：地区+产品类别组合
export const regionProductCombo: ColumnGroupMixin['groupConfig'] = {
    groupBy: 1,                    // 第一层分组
    groupFunction: GROUP_FUNCTIONS.MULTI_FIELD,
    groupTemplate: '{region}-{product_category}',
    aggregations: [
        {
            type: 'sum',
            field: 'revenue',
            label: '区域产品总收入',
            position: 'header'
        }
    ]
};

// 第二层：年龄段范围分组
export const ageRangeGroup: ColumnGroupMixin['groupConfig'] = {
    groupBy: 2,                    // 第二层分组
    groupFunction: GROUP_FUNCTIONS.NUMERIC_RANGE,
    aggregations: [
        {
            type: 'avg',
            field: 'purchase_amount',
            label: '年龄段平均消费',
            position: 'footer'
        }
    ]
};

// 示例数据结构
export const sampleHierarchicalData = [
    {
        region: '华北',
        department: '销售',
        order_date: '2024-01-15',
        sales_amount: 50000,
        product_category: '电子产品',
        customer_age: 35,
        revenue: 45000,
        purchase_amount: 3200
    },
    {
        region: '华北',
        department: '销售',
        order_date: '2024-04-20',
        sales_amount: 60000,
        product_category: '电子产品',
        customer_age: 28,
        revenue: 52000,
        purchase_amount: 2800
    },
    {
        region: '华北',
        department: '技术',
        order_date: '2024-07-10',
        sales_amount: 40000,
        product_category: '服装',
        customer_age: 42,
        revenue: 35000,
        purchase_amount: 4100
    },
    {
        region: '华南',
        department: '销售',
        order_date: '2024-02-25',
        sales_amount: 55000,
        product_category: '电子产品',
        customer_age: 31,
        revenue: 48000,
        purchase_amount: 3600
    }
];

// 分层处理函数示例
export function processHierarchicalGrouping(
    data: any[],
    groupConfigs: ColumnGroupMixin['groupConfig'][]
): Record<string, any> {
    // 按groupBy数字排序，确保层级顺序
    const sortedConfigs = groupConfigs
        .filter((config): config is NonNullable<typeof config> => config?.groupBy != null)
        .sort((a, b) => (a.groupBy || 0) - (b.groupBy || 0));

    let result: Record<string, any> = { all: data };

    // 逐层处理分组
    for (const config of sortedConfigs) {
        const newResult: Record<string, any> = {};

        Object.entries(result).forEach(([parentKey, parentData]) => {
            if (Array.isArray(parentData)) {
                // 根据当前层级的配置进行分组
                const groups = processLevel(parentData, config);

                Object.entries(groups).forEach(([groupKey, groupData]) => {
                    const combinedKey = parentKey === 'all' ? groupKey : `${parentKey}/${groupKey}`;
                    newResult[combinedKey] = groupData;
                });
            }
        });

        result = newResult;
    }

    return result;
}

// 处理单个层级的分组
function processLevel(data: any[], config: ColumnGroupMixin['groupConfig']): Record<string, any[]> {
    if (!config) return { all: data };

    const { groupFunction } = config;

    switch (groupFunction) {
        case GROUP_FUNCTIONS.BY_FIELD:
            // 简化实现，实际应用中会根据具体字段名进行分组
            return groupByField(data, 'region'); // 示例用 region 字段

        case GROUP_FUNCTIONS.MULTI_FIELD:
            // 简化实现，实际应用中会根据具体字段组合进行分组
            return groupByMultipleFields(data, ['region', 'product_category']);

        case GROUP_FUNCTIONS.NUMERIC_RANGE:
            // 简化实现，实际应用中会根据具体数值字段进行范围分组
            return groupByNumericRange(data, 'customer_age', { min: 18, step: 10 });

        case GROUP_FUNCTIONS.TIME_PERIOD:
            // 简化实现，实际应用中会根据具体时间字段进行时间段分组
            return groupByTimePeriod(data, 'order_date', { period: 'quarter' });

        default:
            return { all: data };
    }
}

// 分组函数实现
function groupByField(data: any[], field: string): Record<string, any[]> {
    return data.reduce((groups, item) => {
        const key = item[field] || 'undefined';
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
}

function groupByMultipleFields(data: any[], fields: string[]): Record<string, any[]> {
    return data.reduce((groups, item) => {
        const key = fields.map(field => item[field] || 'undefined').join('-');
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
}

function groupByNumericRange(data: any[], field: string, params: any): Record<string, any[]> {
    const { min = 0, step = 10 } = params || {};
    return data.reduce((groups, item) => {
        const value = item[field];
        const rangeStart = Math.floor((value - min) / step) * step + min;
        const key = `${rangeStart}-${rangeStart + step}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
}

function groupByTimePeriod(data: any[], field: string, params: any): Record<string, any[]> {
    const { period = 'quarter' } = params || {};
    return data.reduce((groups, item) => {
        const date = new Date(item[field]);
        let key: string;

        switch (period) {
            case 'quarter': {
                const quarter = Math.ceil((date.getMonth() + 1) / 3);
                key = `${date.getFullYear()}-Q${quarter}`;
                break;
            }
            case 'month':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            default:
                key = date.getFullYear().toString();
        }

        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
}

// 使用示例
export const hierarchicalGroupingExample = {
    // 三层分组配置
    threeLayerGrouping: [
        regionColumn,
        departmentColumn,
        quarterColumn
    ],

    // 复合分组配置
    compositeGrouping: [
        regionProductCombo,
        ageRangeGroup
    ],

    // 示例数据
    sampleData: sampleHierarchicalData,

    // 处理函数
    process: processHierarchicalGrouping
};

// 聚合计算按层级进行
export function calculateHierarchicalAggregations(
    groupedData: Record<string, any[]>,
    groupConfigs: ColumnGroupMixin['groupConfig'][]
): Record<string, Record<string, any>> {
    const results: Record<string, Record<string, any>> = {};

    Object.entries(groupedData).forEach(([key, data]) => {
        results[key] = {};

        // 根据层级深度确定使用哪个配置
        const levels = key.split('/');
        const configIndex = Math.min(levels.length - 1, groupConfigs.length - 1);
        const config = groupConfigs[configIndex];

        if (config?.aggregations) {
            config.aggregations.forEach(aggregation => {
                const { type, field = 'sales_amount' } = aggregation;
                const values = data.map(item => item[field]).filter(v => v != null);

                let result: any;
                switch (type) {
                    case 'sum':
                        result = values.reduce((a, b) => a + b, 0);
                        break;
                    case 'count':
                        result = data.length;
                        break;
                    case 'avg':
                        result = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
                        break;
                    // ... 其他聚合类型
                }

                results[key][aggregation.label || type] = result;
            });
        }
    });

    return results;
}

console.log('=== 分层级分组示例 ===');
console.log('1. 三层分组：地区 → 部门 → 季度');
console.log('2. 复合分组：地区+产品 → 年龄段');
console.log('3. 每一层都可以有多个字段参与分组');
console.log('4. 聚合函数按层级分层计算，第一层级最高');

export default hierarchicalGroupingExample;
