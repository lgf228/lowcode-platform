# 分层级分组系统设计文档

Hierarchical Grouping System Design Document

## 📋 系统概述 System Overview

基于数字层级的分组系统，支持多层级、多字段的灵活分组，聚合函数按层级分层计算。

## 🎯 核心设计理念 Core Design Principles

### 1. 数字层级分组

```typescript
groupBy: number  // 1=第一层分组，2=第二层分组，3=第三层分组...
```

- **第一层分组** (groupBy: 1): 最高层级，优先级最高
- **第二层分组** (groupBy: 2): 在第一层基础上进一步分组  
- **第三层分组** (groupBy: 3): 在第二层基础上再次分组
- **...以此类推**

### 2. 每层支持多字段

```typescript
groupParameters: {
  fields: ['region', 'product_category']  // 该层级要分组的字段
}
```

### 3. 分层聚合计算

- 第一层聚合：汇总所有下级数据
- 第二层聚合：汇总该分组内的数据
- 第三层聚合：汇总子分组的数据

## 🛠️ 接口设计 Interface Design

### ColumnGroupMixin 核心结构

```typescript
export interface ColumnGroupMixin {
  groupConfig?: {
    groupBy: number                        // 分组层级（1, 2, 3...）
    groupFunction?: number                 // 分组函数类型（1-5）
    groupParameters?: Record<string, any>  // 分组参数（包含fields等）
    
    // 显示配置
    groupTemplate?: string
    showGroupCount?: boolean
    expandable?: boolean
    defaultExpanded?: boolean
    
    // 聚合配置
    aggregations?: Array<{
      type: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'custom'
      field?: string
      label?: string
      position?: 'header' | 'footer' | 'both'
      // ...更多配置
    }>
  }
}
```

### 分组函数类型常量

```typescript
export const GROUP_FUNCTIONS = {
  BY_FIELD: 1,           // 按字段分组
  MULTI_FIELD: 2,        // 多字段组合  
  NUMERIC_RANGE: 3,      // 数值范围
  TIME_PERIOD: 4,        // 时间段
  CUSTOM: 5              // 自定义
} as const;
```

## 📊 使用示例 Usage Examples

### 示例1：三层分组 (地区 → 部门 → 季度)

```typescript
// 字段1：地区分组配置 (第一层)
const regionGroupConfig = {
  groupBy: 1,                    // 第一层分组
  groupFunction: 1,              // 按字段分组
  groupParameters: {
    fields: ['region']           // 按region字段分组
  },
  aggregations: [
    {
      type: 'sum',
      field: 'sales_amount',
      label: '地区总销售额',
      position: 'header'
    }
  ]
};

// 字段2：部门分组配置 (第二层)
const departmentGroupConfig = {
  groupBy: 2,                    // 第二层分组
  groupFunction: 1,              // 按字段分组
  groupParameters: {
    fields: ['department']       // 按department字段分组
  },
  aggregations: [
    {
      type: 'sum',
      field: 'sales_amount',
      label: '部门总销售额',
      position: 'header'
    }
  ]
};

// 字段3：季度分组配置 (第三层)
const quarterGroupConfig = {
  groupBy: 3,                    // 第三层分组
  groupFunction: 4,              // 时间段分组
  groupParameters: {
    fields: ['order_date'],
    period: 'quarter'
  },
  aggregations: [
    {
      type: 'sum',
      field: 'sales_amount',
      label: '季度销售额',
      position: 'header'
    }
  ]
};
```

### 示例2：复合字段分组 (地区+产品 → 年龄段)

```typescript
// 第一层：地区+产品类别组合分组
const regionProductCombo = {
  groupBy: 1,                              // 第一层分组
  groupFunction: 2,                        // 多字段组合
  groupParameters: {
    fields: ['region', 'product_category'] // 多字段组合
  },
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
const ageRangeGroup = {
  groupBy: 2,                    // 第二层分组
  groupFunction: 3,              // 数值范围分组
  groupParameters: {
    fields: ['customer_age'],
    min: 18,
    max: 80,
    step: 10
  },
  aggregations: [
    {
      type: 'avg',
      field: 'purchase_amount',
      label: '年龄段平均消费',
      position: 'footer'
    }
  ]
};
```

## 🔄 分层处理逻辑 Hierarchical Processing Logic

### 数据流程

```
原始数据
    ↓
第一层分组 (groupBy: 1)
    ↓ 
华北、华南、华东...
    ↓
第二层分组 (groupBy: 2)  
    ↓
华北-销售、华北-技术、华南-销售...
    ↓
第三层分组 (groupBy: 3)
    ↓
华北-销售-Q1、华北-销售-Q2...
```

### 聚合计算层级

```
第一层聚合: 地区总销售额
    ├── 第二层聚合: 部门总销售额  
    │   ├── 第三层聚合: 季度销售额
    │   └── 第三层聚合: 季度销售额
    └── 第二层聚合: 部门总销售额
        ├── 第三层聚合: 季度销售额
        └── 第三层聚合: 季度销售额
```

## 🎮 核心工具函数 Core Utility Functions

### 分层分组处理

```typescript
function processHierarchicalGrouping(
  data: any[],
  groupConfigs: ColumnGroupMixin['groupConfig'][]
): Record<string, any> {
  // 1. 按groupBy数字排序，确保层级顺序
  const sortedConfigs = groupConfigs
    .filter(config => config?.groupBy != null)
    .sort((a, b) => (a.groupBy || 0) - (b.groupBy || 0));

  // 2. 逐层处理分组
  let result: Record<string, any> = { all: data };
  
  for (const config of sortedConfigs) {
    // 3. 对每个父分组进行子分组
    const newResult: Record<string, any> = {};
    
    Object.entries(result).forEach(([parentKey, parentData]) => {
      if (Array.isArray(parentData)) {
        const groups = processLevel(parentData, config);
        
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
```

### 层级聚合计算

```typescript
function calculateHierarchicalAggregations(
  groupedData: Record<string, any[]>,
  groupConfigs: ColumnGroupMixin['groupConfig'][]
): Record<string, Record<string, any>> {
  const results: Record<string, Record<string, any>> = {};
  
  Object.entries(groupedData).forEach(([key, data]) => {
    // 根据层级深度确定使用哪个配置
    const levels = key.split('/');
    const configIndex = Math.min(levels.length - 1, groupConfigs.length - 1);
    const config = groupConfigs[configIndex];
    
    // 按该层级的聚合配置计算
    if (config?.aggregations) {
      results[key] = calculateAggregationsForLevel(data, config.aggregations);
    }
  });
  
  return results;
}
```

## ✅ 系统优势 System Advantages

### 1. 层级清晰 Clear Hierarchy

- ✅ 数字层级 (1, 2, 3...) 比字符串更直观
- ✅ 优先级顺序明确，第一层级最高
- ✅ 支持无限层级扩展

### 2. 多字段支持 Multi-Field Support  

- ✅ 每一层都可以有多个字段参与分组
- ✅ 字段组合灵活，支持复合分组
- ✅ 分组模板自定义显示格式

### 3. 分层聚合 Hierarchical Aggregation

- ✅ 聚合函数按层级分层计算
- ✅ 第一层级聚合优先级最高
- ✅ 支持每层级独立的聚合配置

### 4. 配置简化 Simplified Configuration

- ✅ 数字类型比字符串更简洁
- ✅ 减少了冗余的配置项
- ✅ 统一的配置结构

### 5. 处理高效 Efficient Processing

- ✅ 按数字排序，处理顺序确定
- ✅ 逐层处理，逻辑清晰
- ✅ 支持大数据量的分层分组

## 🎯 实际应用场景 Real-World Use Cases

### 1. 销售报表分析

```
第一层: 地区分组 (华北、华南、华东)
第二层: 部门分组 (销售、技术、市场)  
第三层: 时间分组 (Q1、Q2、Q3、Q4)
```

### 2. 电商数据分析

```
第一层: 产品类别+地区组合 (电子产品-华北)
第二层: 用户年龄段 (18-30、30-40、40-50)
第三层: 购买时间段 (工作日、周末)
```

### 3. 人事管理系统

```
第一层: 部门分组 (研发、销售、行政)
第二层: 职级分组 (初级、中级、高级)
第三层: 入职年份 (2020、2021、2022)
```

### 4. 财务统计分析

```  
第一层: 业务类型+地区 (零售-华北、批发-华南)
第二层: 客户规模 (大客户、中客户、小客户)
第三层: 交易季度 (Q1、Q2、Q3、Q4)
```

## 🏆 项目完成状态 Project Completion Status

- ✅ **接口设计**: ColumnGroupMixin 完整重构
- ✅ **数字层级**: groupBy 改为数字类型
- ✅ **分组函数**: groupFunction 改为数字常量
- ✅ **移除冗余**: 删除了 groupOrder 和 groupMode
- ✅ **多字段支持**: 每层级支持多字段分组
- ✅ **分层处理**: 完整的分层分组处理逻辑
- ✅ **聚合计算**: 按层级的分层聚合系统
- ✅ **代码示例**: 完整的使用演示和工具函数
- ✅ **类型安全**: 无编译错误，类型完整

**新的分层级分组系统现在完全符合您的需求！** 🚀

支持：

- 数字层级分组 (1, 2, 3...)
- 每层多字段支持
- 分层聚合计算  
- 第一层级最高优先级
- 灵活的分组函数类型
