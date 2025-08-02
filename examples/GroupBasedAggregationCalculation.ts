/**
 * 按组别计算聚合函数示例
 * Group-based Aggregation Calculation Examples
 * 
 * 展示如何根据不同组别层级计算聚合函数
 * Demonstrates how to calculate aggregation functions based on different group levels
 */

// 示例数据：销售记录
const salesData = [
    { region: '华北', category: '电子', department: '销售', month: '2024-01', amount: 10000, qty: 100 },
    { region: '华北', category: '电子', department: '销售', month: '2024-02', amount: 12000, qty: 120 },
    { region: '华北', category: '服装', department: '销售', month: '2024-01', amount: 8000, qty: 80 },
    { region: '华北', category: '服装', department: '技术', month: '2024-02', amount: 5000, qty: 50 },
    { region: '华南', category: '电子', department: '销售', month: '2024-01', amount: 15000, qty: 150 },
    { region: '华南', category: '电子', department: '技术', month: '2024-02', amount: 9000, qty: 90 },
    { region: '华南', category: '服装', department: '销售', month: '2024-01', amount: 7000, qty: 70 }
];

// 列配置：按组别计算聚合函数
export const groupAggregationColumns = [
    // 第一组分组：地区 + 产品类别
    {
        id: 'region',
        component: { type: 'Text', label: '地区' },
        groupConfig: {
            groupBy: 1, // 第一组分组
            aggregations: [
                {
                    type: 'sum',
                    field: 'amount',
                    label: '地区+类别销售额',
                    position: 'header',
                    groupLevel: 1, // 在第一组层级计算
                    includeSubGroups: false, // 不包含子组数据
                    format: '¥{value:,.2f}'
                },
                {
                    type: 'count',
                    label: '记录数',
                    position: 'footer',
                    groupLevel: 1,
                    aggregateAcrossGroups: false // 不跨组计算
                }
            ]
        }
    },
    {
        id: 'category',
        component: { type: 'Text', label: '产品类别' },
        groupConfig: {
            groupBy: 1, // 同属第一组分组
            aggregations: [
                {
                    type: 'avg',
                    field: 'amount',
                    label: '平均金额',
                    position: 'both',
                    groupLevel: 1,
                    precision: 2
                }
            ]
        }
    },

    // 第二组分组：部门
    {
        id: 'department',
        component: { type: 'Text', label: '部门' },
        groupConfig: {
            groupBy: 2, // 第二组分组
            aggregations: [
                {
                    type: 'sum',
                    field: 'amount',
                    label: '部门销售额',
                    position: 'header',
                    groupLevel: 2, // 在第二组层级计算
                    includeSubGroups: false
                },
                {
                    type: 'sum',
                    field: 'amount',
                    label: '包含子组销售额',
                    position: 'footer',
                    groupLevel: 1, // 在第一组层级计算（包含该部门的所有上级分组数据）
                    includeSubGroups: true // 包含子组数据
                }
            ]
        }
    },

    // 第三组分组：月份
    {
        id: 'month',
        component: { type: 'Text', label: '月份' },
        groupConfig: {
            groupBy: 3, // 第三组分组
            aggregations: [
                {
                    type: 'sum',
                    field: 'amount',
                    label: '月度销售额',
                    position: 'header',
                    groupLevel: 3 // 在第三组层级计算
                },
                {
                    type: 'sum',
                    field: 'amount',
                    label: '累计销售额',
                    position: 'footer',
                    groupLevel: 1, // 回到第一组层级计算累计
                    aggregateAcrossGroups: true, // 跨组计算总计
                    resetAtGroupChange: false // 不在组别变化时重置
                }
            ]
        }
    },

    // 数据列：金额（不参与分组，但提供聚合数据）
    {
        id: 'amount',
        component: { type: 'InputNumber', label: '销售金额' },
        // 没有 groupConfig，不参与分组
    },

    // 数据列：数量
    {
        id: 'qty',
        component: { type: 'InputNumber', label: '数量' },
        groupConfig: {
            // 不参与分组，但提供跨所有组别的总计
            aggregations: [
                {
                    type: 'sum',
                    field: 'qty',
                    label: '总数量',
                    position: 'footer',
                    aggregateAcrossGroups: true, // 跨所有组计算
                    groupLevel: 0 // 特殊值：表示跨所有组别
                }
            ]
        }
    }
];

/**
 * 按组别计算聚合函数的处理器
 * Group-based aggregation processor
 */
export class GroupAggregationProcessor {

    /**
     * 处理分组数据并计算聚合函数
     */
    static processGroupAggregation(data: any[], columns: any[]) {
        const result = {
            groupedData: {},
            aggregationResults: {}
        };

        // 1. 按组别收集字段并分层分组
        const groupsByLevel = this.collectGroupsByLevel(columns);
        const groupedData = this.createHierarchicalGroups(data, groupsByLevel);

        // 2. 为每个组别层级计算聚合函数
        const aggregationResults = this.calculateAggregationsByLevel(
            groupedData,
            columns,
            groupsByLevel
        );

        result.groupedData = groupedData;
        result.aggregationResults = aggregationResults;

        return result;
    }

    /**
     * 按层级收集分组字段
     */
    private static collectGroupsByLevel(columns: any[]): Record<number, string[]> {
        const groupsByLevel: Record<number, string[]> = {};

        columns.forEach(column => {
            if (column.groupConfig?.groupBy) {
                const level = column.groupConfig.groupBy;
                if (!groupsByLevel[level]) {
                    groupsByLevel[level] = [];
                }
                groupsByLevel[level].push(column.id);
            }
        });

        return groupsByLevel;
    }

    /**
     * 创建层级分组数据
     */
    private static createHierarchicalGroups(
        data: any[],
        _groupsByLevel: Record<number, string[]>
    ): Record<string, any> {
        const levels = Object.keys(_groupsByLevel).map(Number).sort();
        let currentData: Record<string, any> = { 'root': data };

        // 按层级顺序逐层分组
        for (const level of levels) {
            const fields = _groupsByLevel[level];
            const newData: Record<string, any> = {};

            Object.entries(currentData).forEach(([parentKey, parentData]) => {
                if (Array.isArray(parentData)) {
                    // 按当前层级的多字段组合分组
                    const groups = this.groupByFields(parentData, fields);

                    Object.entries(groups).forEach(([groupKey, groupData]) => {
                        const fullKey = parentKey === 'root'
                            ? `L${level}:${groupKey}`
                            : `${parentKey}/L${level}:${groupKey}`;
                        newData[fullKey] = groupData;
                    });
                }
            });

            currentData = newData;
        }

        return currentData;
    }

    /**
     * 按多字段分组
     */
    private static groupByFields(data: any[], fields: string[]): Record<string, any[]> {
        return data.reduce((groups, item) => {
            const key = fields.map(field => item[field] || 'N/A').join(' + ');
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {});
    }

    /**
     * 按层级计算聚合函数
     */
    private static calculateAggregationsByLevel(
        groupedData: Record<string, any[]>,
        columns: any[],
        _groupsByLevel: Record<number, string[]>
    ): Record<string, Record<string, any>> {
        const results: Record<string, Record<string, any>> = {};

        // 为每个分组计算聚合函数
        Object.entries(groupedData).forEach(([groupKey, data]) => {
            results[groupKey] = {};

            // 处理每个列的聚合配置
            columns.forEach(column => {
                if (column.groupConfig?.aggregations) {
                    column.groupConfig.aggregations.forEach((agg: any) => {
                        const targetLevel = agg.groupLevel || column.groupConfig.groupBy;

                        // 判断当前分组是否应该计算此聚合函数
                        if (this.shouldCalculateAggregation(groupKey, targetLevel, agg)) {
                            const value = this.calculateSingleAggregation(data, agg);
                            const key = `${column.id}_${agg.type}_${agg.label || agg.type}`;
                            results[groupKey][key] = {
                                value,
                                label: agg.label,
                                position: agg.position,
                                format: agg.format
                            };
                        }
                    });
                }
            });
        });

        return results;
    }

    /**
     * 判断是否应该计算聚合函数
     */
    private static shouldCalculateAggregation(
        groupKey: string,
        targetLevel: number,
        agg: any
    ): boolean {
        // 从分组键中提取层级信息
        const currentLevel = this.extractLevelFromGroupKey(groupKey);

        if (agg.aggregateAcrossGroups) {
            // 跨组计算：在最终层级或指定层级计算
            return targetLevel === 0 || currentLevel === targetLevel;
        } else {
            // 当前组计算：只在指定层级计算
            return currentLevel === targetLevel;
        }
    }

    /**
     * 从分组键中提取层级
     */
    private static extractLevelFromGroupKey(groupKey: string): number {
        const parts = groupKey.split('/');
        const lastPart = parts[parts.length - 1];
        const match = lastPart.match(/^L(\d+):/);
        return match ? parseInt(match[1]) : 1;
    }

    /**
     * 计算单个聚合函数
     */
    private static calculateSingleAggregation(data: any[], agg: any): any {
        const field = agg.field;
        const values = data.map(item => item[field]).filter(v => v != null && v !== '');

        switch (agg.type) {
            case 'sum':
                return values.reduce((a, b) => Number(a) + Number(b), 0);
            case 'count':
                return data.length;
            case 'avg':
                return values.length > 0 ? values.reduce((a, b) => Number(a) + Number(b), 0) / values.length : 0;
            case 'min':
                return values.length > 0 ? Math.min(...values.map(Number)) : 0;
            case 'max':
                return values.length > 0 ? Math.max(...values.map(Number)) : 0;
            case 'custom':
                // 自定义聚合函数处理
                return this.executeCustomAggregation(data, agg);
            default:
                return 0;
        }
    }

    /**
     * 执行自定义聚合函数
     */
    private static executeCustomAggregation(_data: any[], _agg: any): any {
        // 这里可以根据 agg.customFunction 执行相应的自定义逻辑
        return 0;
    }
}

// 使用示例
console.log('=== 按组别计算聚合函数示例 ===');

const result = GroupAggregationProcessor.processGroupAggregation(
    salesData,
    groupAggregationColumns
);

console.log('\n分组数据结构：');
Object.keys(result.groupedData).forEach(key => {
    console.log(`${key}: ${result.groupedData[key].length} 条记录`);
});

console.log('\n聚合计算结果：');
Object.entries(result.aggregationResults).forEach(([groupKey, aggregations]) => {
    console.log(`\n${groupKey}:`);
    if (aggregations && typeof aggregations === 'object') {
        Object.entries(aggregations as Record<string, any>).forEach(([_aggKey, aggResult]) => {
            const result = aggResult as { label: string; value: any; position: string };
            console.log(`  ${result.label}: ${result.value} (${result.position})`);
        });
    }
});

export default {
    salesData,
    columns: groupAggregationColumns,
    processor: GroupAggregationProcessor,
    processedResult: result
};
