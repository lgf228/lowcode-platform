/**
 * 基于组别的分组使用指南
 * Group-Based Grouping Usage Guide
 * 
 * 展示新的灵活分组系统的实际使用方法
 * Demonstrates practical usage of the new flexible grouping system
 */

import groupingExamples from './GroupBasedAggregationExamples';

// 模拟数据
const sampleData = [
    { region: '华北', sales_amount: 50000, department: '销售', position: '经理', age: 35 },
    { region: '华北', sales_amount: 30000, department: '销售', position: '专员', age: 28 },
    { region: '华南', sales_amount: 45000, department: '技术', position: '经理', age: 32 },
    { region: '华南', sales_amount: 35000, department: '技术', position: '专员', age: 26 },
    { region: '华东', sales_amount: 60000, department: '销售', position: '总监', age: 40 },
    { region: '华东', sales_amount: 42000, department: '技术', position: '经理', age: 34 }
];

console.log('=== 基于组别的分组使用示例 ===');

// 示例1：基本字段分组
console.log('\n1. 基本按地区分组:');
const regionGroups = groupingExamples.utils.processGrouping(
    groupingExamples.groupConfigs.basicFieldGroup,
    sampleData
);
console.log('分组结果:', Object.keys(regionGroups));
console.log('华北地区数据:', regionGroups['华北']);

// 示例2：多字段组合分组
console.log('\n2. 多字段组合分组 (部门+职位):');
const multiFieldGroups = groupingExamples.utils.processGrouping(
    groupingExamples.groupConfigs.multiFieldGroup,
    sampleData
);
console.log('分组结果:', Object.keys(multiFieldGroups));
console.log('销售-经理组合:', multiFieldGroups['销售-经理']);

// 示例3：聚合计算
console.log('\n3. 地区分组聚合计算:');
const aggregationResults = groupingExamples.utils.calculateAggregations(
    groupingExamples.groupConfigs.basicFieldGroup,
    regionGroups,
    'sales_amount'
);
console.log('聚合结果:');
Object.entries(aggregationResults).forEach(([region, aggregations]) => {
    console.log(`${region}:`, aggregations);
});

// 示例4：年龄范围分组
console.log('\n4. 年龄范围分组:');
const ageRangeGroups = groupingExamples.utils.processGrouping(
    groupingExamples.groupConfigs.rangeGroup,
    sampleData
);
console.log('年龄段分组:', Object.keys(ageRangeGroups));

// 示例5：自定义分组函数使用
console.log('\n5. 自定义分组演示:');

// 创建一个基于薪资等级的自定义分组配置
const salaryLevelGroupConfig = {
    groupBy: 'sales_amount',
    groupFunction: 'bySalaryLevel',
    groupParameters: {
        levels: [
            { min: 0, max: 35000, label: '初级' },
            { min: 35000, max: 50000, label: '中级' },
            { min: 50000, max: Infinity, label: '高级' }
        ]
    },
    groupMode: 'hierarchical' as const,
    aggregations: [
        {
            type: 'count' as const,
            label: '人数',
            position: 'footer' as const
        },
        {
            type: 'avg' as const,
            field: 'sales_amount',
            label: '平均销售额',
            position: 'footer' as const,
            format: 'currency'
        }
    ]
};

// 添加自定义分组函数
(groupingExamples.groupFunctions as any).bySalaryLevel = (groupBy: string, data: any[], params?: any) => {
    const { levels = [] } = params || {};
    return data.reduce((groups, item) => {
        const value = item[groupBy];
        const level = levels.find((l: any) => value >= l.min && value < l.max);
        const key = level ? level.label : '未分类';
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {});
};

const salaryLevelGroups = groupingExamples.utils.processGrouping(
    salaryLevelGroupConfig,
    sampleData
);
console.log('薪资等级分组:', Object.keys(salaryLevelGroups));
console.log('高级组成员:', salaryLevelGroups['高级']);

// 示例6：时间段分组模拟
const timeBasedData = [
    { order_date: '2024-01-15', order_value: 1000 },
    { order_date: '2024-03-20', order_value: 1500 },
    { order_date: '2024-06-10', order_value: 2000 },
    { order_date: '2024-09-05', order_value: 1800 }
];

console.log('\n6. 时间段分组 (按季度):');
const quarterGroups = groupingExamples.utils.processGrouping(
    groupingExamples.groupConfigs.timePeriodGroup,
    timeBasedData
);
console.log('季度分组:', Object.keys(quarterGroups));

// 总结新分组系统的优势
console.log('\n=== 新分组系统的优势 ===');
console.log('1. ✅ 灵活性：通过 groupBy 标识符支持任意分组逻辑');
console.log('2. ✅ 可扩展：通过 groupFunction 注册自定义分组函数');
console.log('3. ✅ 参数化：通过 groupParameters 支持复杂配置');
console.log('4. ✅ 模式支持：hierarchical（层级） vs combined（组合）');
console.log('5. ✅ 聚合功能：内置多种聚合函数和自定义支持');
console.log('6. ✅ 格式化：支持分组模板和聚合值格式化');

// 配置示例对比
console.log('\n=== 配置示例对比 ===');
console.log('旧方式（基于字段）:');
console.log('  groupFields: ["region", "department"]');
console.log('  groupable: true');

console.log('\n新方式（基于组别）:');
console.log('  groupBy: "sales-performance"');
console.log('  groupFunction: "byMultipleFields"');
console.log('  groupParameters: { fields: ["region", "department"] }');
console.log('  groupMode: "hierarchical"');

export default {
    sampleData,
    timeBasedData,
    salaryLevelGroupConfig,
    examples: {
        regionGroups,
        multiFieldGroups,
        aggregationResults,
        ageRangeGroups,
        salaryLevelGroups,
        quarterGroups
    }
};
