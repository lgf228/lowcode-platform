/**
 * 基于分组优先级的分组聚合例子
 * Priority-Based Grouping Aggregation Examples
 * 
 * 展示使用数字优先级的分组方法（1=第一分组，2=第二分组）
 * Demonstrates grouping using numeric priorities (1=first group, 2=second group)
 */

import { ColumnGroupMixin } from '../src/core/types/Component';

// 分组优先级常量定义
// Group priority constants
export const GROUP_PRIORITIES = {
    PRIMARY: 1,     // 第一优先级分组
    SECONDARY: 2,   // 第二优先级分组
    TERTIARY: 3,    // 第三优先级分组
    QUATERNARY: 4   // 第四优先级分组
} as const;

// 分组函数类型常量定义
// Group function type constants
export const GROUP_FUNCTIONS = {
    BY_FIELD: 1,           // 按字段分组
    BY_MULTIPLE_FIELDS: 2, // 多字段组合分组
    BY_RANGE: 3,           // 数值范围分组
    BY_TIME_PERIOD: 4,     // 时间段分组
    CUSTOM: 5              // 自定义分组
} as const;

// 基础分组函数注册表
// Basic group function registry
export const GroupFunctions = {
    // 按字段值分组
    byField: (groupBy: string, data: any[]) => {
        return data.reduce((groups, item) => {
            const key = item[groupBy];
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {});
    },

    // 按多字段组合分组
    byMultipleFields: (groupBy: string, data: any[], params?: any) => {
        const fields = params?.fields || [groupBy];
        return data.reduce((groups, item) => {
            const key = fields.map((field: string) => item[field]).join('-');
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {});
    },

    // 按数值范围分组
    byRange: (groupBy: string, data: any[], params?: any) => {
        const { min = 0, step = 10 } = params || {};
        return data.reduce((groups, item) => {
            const value = item[groupBy];
            const rangeStart = Math.floor((value - min) / step) * step + min;
            const key = `${rangeStart}-${rangeStart + step}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {});
    },

    // 按时间段分组
    byTimePeriod: (groupBy: string, data: any[], params?: any) => {
        const { period = 'month' } = params || {};
        return data.reduce((groups, item) => {
            const date = new Date(item[groupBy]);
            let key: string;

            switch (period) {
                case 'year':
                    key = date.getFullYear().toString();
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'quarter': {
                    const quarter = Math.ceil((date.getMonth() + 1) / 3);
                    key = `${date.getFullYear()}-Q${quarter}`;
                    break;
                }
                default:
                    key = date.toDateString();
            }

            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {});
    },

    // 自定义分类分组
    customCategoryGroup: (groupBy: string, data: any[], params?: any) => {
        const { categoryMapping = {} } = params || {};
        return data.reduce((groups, item) => {
            const category = item[groupBy];
            const displayName = categoryMapping[category] || category;
            if (!groups[displayName]) groups[displayName] = [];
            groups[displayName].push(item);
            return groups;
        }, {});
    }
};

// 例子1：销售数据按地区分组（第一优先级）
// Example 1: Sales data grouped by region (primary priority)
export const salesColumnGroupConfig: ColumnGroupMixin['groupConfig'] = {
    groupBy: GROUP_PRIORITIES.PRIMARY,
    groupFunction: GROUP_FUNCTIONS.BY_FIELD,
    groupParameters: { field: 'region' },

    // 聚合函数
    aggregations: [
        {
            type: 'sum',
            field: 'sales_amount',
            label: '总销售额',
            position: 'header',
            format: 'currency'
        },
        {
            type: 'count',
            label: '记录数',
            position: 'footer'
        },
        {
            type: 'avg',
            field: 'sales_amount',
            label: '平均销售额',
            position: 'footer',
            format: 'currency',
            precision: 0
        }
    ]
};

// 例子2：多字段组合分组（第二优先级）
// Example 2: Multiple fields combination grouping (secondary priority)
export const employeeMultiFieldGroupConfig: ColumnGroupMixin['groupConfig'] = {
    groupBy: GROUP_PRIORITIES.SECONDARY,
    groupFunction: GROUP_FUNCTIONS.BY_MULTIPLE_FIELDS,
    groupParameters: {
        fields: ['department', 'position']
    },
    groupTemplate: '{department} - {position}',

    aggregations: [
        {
            type: 'sum',
            field: 'salary',
            label: '部门总薪资',
            position: 'header',
            format: 'currency'
        },
        {
            type: 'avg',
            field: 'salary',
            label: '平均薪资',
            position: 'footer',
            format: 'currency',
            precision: 0
        },
        {
            type: 'count',
            label: '人数',
            position: 'footer'
        }
    ]
};

// 例子3：数值范围分组（年龄段）
// Example 3: Numeric range grouping (age ranges)
export const customerAgeRangeGroupConfig: ColumnGroupMixin['groupConfig'] = {
    groupBy: GROUP_PRIORITIES.PRIMARY,
    groupFunction: GROUP_FUNCTIONS.BY_RANGE,
    groupParameters: {
        field: 'age',
        min: 18,
        max: 80,
        step: 10
    },
    showGroupCount: true,

    aggregations: [
        {
            type: 'sum',
            field: 'purchase_amount',
            label: '年龄段总消费',
            position: 'header',
            format: 'currency'
        },
        {
            type: 'avg',
            field: 'purchase_amount',
            label: '平均消费',
            position: 'footer',
            format: 'currency',
            precision: 0
        },
        {
            type: 'custom',
            field: 'age',
            label: '平均年龄',
            position: 'footer',
            customFunction: 'averageAge',
            format: 'age'
        }
    ]
};

// 例子4：时间段分组（按季度）
// Example 4: Time period grouping (by quarter)
export const orderQuarterGroupConfig: ColumnGroupMixin['groupConfig'] = {
    groupBy: GROUP_PRIORITIES.PRIMARY,
    groupFunction: GROUP_FUNCTIONS.BY_TIME_PERIOD,
    groupParameters: {
        field: 'order_date',
        period: 'quarter'
    },
    expandable: true,
    defaultExpanded: false,

    aggregations: [
        {
            type: 'sum',
            field: 'order_value',
            label: '季度总订单额',
            position: 'header',
            format: 'currency'
        },
        {
            type: 'count',
            label: '订单数量',
            position: 'footer'
        },
        {
            type: 'custom',
            field: 'order_value',
            label: '最大订单',
            position: 'footer',
            customFunction: 'maxValue',
            format: 'currency'
        }
    ],

    // 聚合显示配置
    aggregationConfig: {
        showGrandTotal: true,
        aggregationSeparator: ' | ',
        aggregationPrefix: '汇总: ',
        aggregationSuffix: ''
    }
};

// 例子5：复杂自定义分组函数
// Example 5: Complex custom grouping function
export const productCustomGroupConfig: ColumnGroupMixin['groupConfig'] = {
    groupBy: GROUP_PRIORITIES.PRIMARY,
    groupFunction: GROUP_FUNCTIONS.CUSTOM,
    groupParameters: {
        field: 'product_category',
        categoryMapping: {
            'electronics': '电子产品',
            'clothing': '服装',
            'books': '图书',
            'food': '食品'
        }
    },
    groupSeparator: ' & ',

    aggregations: [
        {
            type: 'sum',
            field: 'revenue',
            label: '分类总收入',
            position: 'header',
            format: 'currency'
        },
        {
            type: 'custom',
            field: 'profit_margin',
            label: '平均利润率',
            position: 'footer',
            customFunction: 'averagePercentage',
            format: 'percentage'
        }
    ]
};

// 自定义聚合函数注册表
// Custom aggregation functions registry
export const CustomAggregationFunctions = {
    averageAge: (values: number[]) => {
        const sum = values.reduce((a, b) => a + b, 0);
        return Math.round(sum / values.length);
    },

    maxValue: (values: number[]) => {
        return Math.max(...values);
    },

    averagePercentage: (values: number[]) => {
        const sum = values.reduce((a, b) => a + b, 0);
        return (sum / values.length * 100).toFixed(1);
    }
};

// 格式化函数注册表
// Format functions registry
export const FormatFunctions = {
    currency: (value: number) => `¥${value.toLocaleString()}`,
    percentage: (value: string) => `${value}%`,
    age: (value: number) => `${value}岁`
};

// 分组配置使用示例
// Group configuration usage examples
export const groupConfigExamples = {
    // 基本按字段分组
    basicFieldGroup: salesColumnGroupConfig,

    // 多字段组合分组
    multiFieldGroup: employeeMultiFieldGroupConfig,

    // 数值范围分组
    rangeGroup: customerAgeRangeGroupConfig,

    // 时间段分组
    timePeriodGroup: orderQuarterGroupConfig,

    // 自定义分组
    customGroup: productCustomGroupConfig
};

// 分组函数映射表
// Group function mapping
const GROUP_FUNCTION_MAP = {
    [GROUP_FUNCTIONS.BY_FIELD]: GroupFunctions.byField,
    [GROUP_FUNCTIONS.BY_MULTIPLE_FIELDS]: GroupFunctions.byMultipleFields,
    [GROUP_FUNCTIONS.BY_RANGE]: GroupFunctions.byRange,
    [GROUP_FUNCTIONS.BY_TIME_PERIOD]: GroupFunctions.byTimePeriod,
    [GROUP_FUNCTIONS.CUSTOM]: GroupFunctions.customCategoryGroup
};

// 数据处理示例
// Data processing example
export function processGrouping(
    groupConfig: ColumnGroupMixin['groupConfig'],
    data: any[]
): { [groupKey: string]: any[] } {
    if (!groupConfig) return { 'all': data };

    const { groupFunction, groupParameters } = groupConfig;
    const groupFn = groupFunction ? GROUP_FUNCTION_MAP[groupFunction] : null;

    if (!groupFn) {
        console.warn(`Group function '${groupFunction}' not found`);
        return { 'all': data };
    }

    // 从groupParameters中获取字段名，如果没有则使用默认
    const fieldName = groupParameters?.field || 'defaultField';
    return groupFn(fieldName, data, groupParameters);
}

// 聚合计算示例
// Aggregation calculation example
export function calculateAggregations(
    groupConfig: ColumnGroupMixin['groupConfig'],
    groupedData: { [groupKey: string]: any[] },
    targetField: string
): Record<string, Record<string, any>> {
    if (!groupConfig?.aggregations) return {};

    const results: Record<string, Record<string, any>> = {};

    Object.entries(groupedData).forEach(([groupKey, data]) => {
        results[groupKey] = {};

        groupConfig.aggregations!.forEach(aggregation => {
            const { type, field, customFunction } = aggregation;
            const sourceField = field || targetField;
            const values = data.map(item => item[sourceField]).filter(v => v != null);

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
                case 'min':
                    result = values.length > 0 ? Math.min(...values) : 0;
                    break;
                case 'max':
                    result = values.length > 0 ? Math.max(...values) : 0;
                    break;
                case 'custom':
                    if (customFunction && CustomAggregationFunctions[customFunction as keyof typeof CustomAggregationFunctions]) {
                        result = CustomAggregationFunctions[customFunction as keyof typeof CustomAggregationFunctions](values);
                    }
                    break;
            }

            results[groupKey][aggregation.label || type] = result;
        });
    });

    return results;
}

// 导出默认对象
export default {
    // 分组配置例子
    groupConfigs: groupConfigExamples,

    // 分组函数
    groupFunctions: GroupFunctions,

    // 自定义聚合函数
    aggregationFunctions: CustomAggregationFunctions,

    // 格式化函数
    formatFunctions: FormatFunctions,

    // 工具函数
    utils: {
        processGrouping,
        calculateAggregations
    }
};
