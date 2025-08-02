/**
 * 按组别包含多字段分组示例
 * Multi-Field Grouping by Group Number Examples
 * 
 * 展示同一组别包含多个字段进行组合分组的概念
 * Demonstrates the concept of combining multiple fields within the same group number
 */

// 示例：销售数据的多字段组合分组
// Example: Multi-field combination grouping for sales data

// 第一组分组：地区 + 产品类别组合
// Group 1: Region + Product Category combination

// 地区字段配置（参与第一组分组）
export const regionColumn = {
    id: 'region',
    component: { type: 'Text', label: '地区' },
    groupConfig: {
        groupBy: 1,                    // 参与第一组分组
        aggregations: [
            {
                type: 'sum',
                field: 'sales_amount',
                label: '总销售额',
                position: 'header'
            }
        ]
    }
};

// 产品类别字段配置（也参与第一组分组）
export const productCategoryColumn = {
    id: 'product_category',
    component: { type: 'Text', label: '产品类别' },
    groupConfig: {
        groupBy: 1,                    // 同样参与第一组分组
        aggregations: [
            {
                type: 'count',
                label: '产品种类数',
                position: 'footer'
            }
        ]
    }
};

// 第二组分组：部门分组
// Group 2: Department grouping

// 部门字段配置（参与第二组分组）
export const departmentColumn = {
    id: 'department',
    component: { type: 'Text', label: '部门' },
    groupConfig: {
        groupBy: 2,                    // 参与第二组分组
        aggregations: [
            {
                type: 'avg',
                field: 'sales_amount',
                label: '部门平均销售额',
                position: 'header'
            }
        ]
    }
};

// 第三组分组：时间段分组
// Group 3: Time period grouping

// 订单日期字段配置（参与第三组分组）
export const orderDateColumn = {
    id: 'order_date',
    component: { type: 'DatePicker', label: '订单日期' },
    groupConfig: {
        groupBy: 3,                    // 参与第三组分组
        groupTemplate: '{year}-Q{quarter}',
        aggregations: [
            {
                type: 'sum',
                field: 'sales_amount',
                label: '季度销售额',
                position: 'header'
            }
        ]
    }
};

// 非分组字段：销售金额（只提供数据，不参与分组）
export const salesAmountColumn = {
    id: 'sales_amount',
    component: { type: 'InputNumber', label: '销售金额' },
    // 没有 groupConfig，不参与分组
};

// 示例数据
export const sampleMultiGroupData = [
    {
        region: '华北',
        product_category: '电子产品',
        department: '销售',
        order_date: '2024-01-15',
        sales_amount: 50000
    },
    {
        region: '华北',
        product_category: '服装',
        department: '销售',
        order_date: '2024-02-20',
        sales_amount: 30000
    },
    {
        region: '华南',
        product_category: '电子产品',
        department: '技术',
        order_date: '2024-03-10',
        sales_amount: 45000
    },
    {
        region: '华南',
        product_category: '电子产品',
        department: '销售',
        order_date: '2024-04-05',
        sales_amount: 60000
    }
];

// 分组处理逻辑
export function processMultiFieldGrouping(
    columns: any[],
    data: any[]
): Record<string, any[]> {
    // 1. 按组别收集字段
    const groupsByNumber: Record<number, string[]> = {};

    columns.forEach(column => {
        if (column.groupConfig?.groupBy) {
            const groupNumber = column.groupConfig.groupBy;
            if (!groupsByNumber[groupNumber]) {
                groupsByNumber[groupNumber] = [];
            }
            groupsByNumber[groupNumber].push(column.id);
        }
    });

    // 2. 按组别顺序处理分组
    const sortedGroupNumbers = Object.keys(groupsByNumber)
        .map(Number)
        .sort((a, b) => a - b);

    let result: Record<string, any[]> = { all: data };

    for (const groupNumber of sortedGroupNumbers) {
        const fields = groupsByNumber[groupNumber];
        const newResult: Record<string, any[]> = {};

        Object.entries(result).forEach(([parentKey, parentData]) => {
            if (Array.isArray(parentData)) {
                // 按当前组别的所有字段进行组合分组
                const groups = groupByMultipleFields(parentData, fields);

                Object.entries(groups).forEach(([groupKey, groupData]) => {
                    const combinedKey = parentKey === 'all'
                        ? groupKey
                        : `${parentKey}/${groupKey}`;
                    newResult[combinedKey] = groupData;
                });
            }
        });

        result = newResult;
    }

    return result;
}

// 多字段组合分组函数
function groupByMultipleFields(data: any[], fields: string[]): Record<string, any[]> {
    return data.reduce((groups, item) => {
        // 将多个字段的值组合成分组键
        const key = fields.map(field => item[field] || 'undefined').join(' + ');
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
}

// 使用示例
console.log('=== 按组别包含多字段分组示例 ===');
console.log('');
console.log('分组结构：');
console.log('第一组 (groupBy: 1): 地区 + 产品类别');
console.log('  - 华北 + 电子产品');
console.log('  - 华北 + 服装');
console.log('  - 华南 + 电子产品');
console.log('');
console.log('第二组 (groupBy: 2): 部门');
console.log('  - 华北 + 电子产品 / 销售');
console.log('  - 华北 + 电子产品 / 技术');
console.log('  - 华北 + 服装 / 销售');
console.log('  - 华南 + 电子产品 / 销售');
console.log('');
console.log('第三组 (groupBy: 3): 订单日期');
console.log('  - 华北 + 电子产品 / 销售 / 2024-Q1');
console.log('  - 华北 + 电子产品 / 销售 / 2024-Q2');
console.log('  - ...');

// 实际处理示例
const allColumns = [
    regionColumn,
    productCategoryColumn,
    departmentColumn,
    orderDateColumn,
    salesAmountColumn
];

const groupedResults = processMultiFieldGrouping(allColumns, sampleMultiGroupData);
console.log('\n实际分组结果：', Object.keys(groupedResults));

// 聚合计算示例
export function calculateGroupAggregations(
    groupedData: Record<string, any[]>,
    columns: any[]
): Record<string, Record<string, any>> {
    const results: Record<string, Record<string, any>> = {};

    Object.entries(groupedData).forEach(([key, data]) => {
        results[key] = {};

        // 计算该分组所有聚合函数
        columns.forEach(column => {
            if (column.groupConfig?.aggregations) {
                column.groupConfig.aggregations.forEach((aggregation: any) => {
                    const { type, field = column.id } = aggregation;
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
                    }

                    if (aggregation.label) {
                        results[key][aggregation.label] = result;
                    }
                });
            }
        });
    });

    return results;
}

export default {
    columns: allColumns,
    sampleData: sampleMultiGroupData,
    processGrouping: processMultiFieldGrouping,
    calculateAggregations: calculateGroupAggregations,
    groupedResults
};
