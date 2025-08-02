/**
 * 交叉表透视表前端 JSON 结构使用示例
 * Pivot Table Cross-Tab Frontend JSON Structure Usage Examples
 * 
 * 完整展示透视表配置、数据处理和渲染的整体流程
 * Complete demonstration of pivot table configuration, data processing and rendering workflow
 */

import { PivotTableConfig } from '../src/core/types/PivotTable';
import { PivotTableProcessor } from '../src/core/processors/PivotTableProcessor';

// ============================
// 1. 基础透视表示例
// Basic Pivot Table Example
// ============================

export const basicPivotExample: PivotTableConfig = {
    id: 'basic_sales_pivot',
    title: '基础销售数据透视表',
    description: '按地区和产品类别分析销售数据',

    dataSource: {
        type: 'static',
        data: [
            { region: '华北', category: '电子', quarter: 'Q1', amount: 120000, qty: 1200, orders: 50 },
            { region: '华北', category: '电子', quarter: 'Q2', amount: 150000, qty: 1500, orders: 60 },
            { region: '华北', category: '服装', quarter: 'Q1', amount: 80000, qty: 800, orders: 40 },
            { region: '华北', category: '服装', quarter: 'Q2', amount: 95000, qty: 950, orders: 45 },
            { region: '华南', category: '电子', quarter: 'Q1', amount: 180000, qty: 1800, orders: 70 },
            { region: '华南', category: '电子', quarter: 'Q2', amount: 200000, qty: 2000, orders: 80 },
            { region: '华南', category: '服装', quarter: 'Q1', amount: 70000, qty: 700, orders: 35 },
            { region: '华南', category: '服装', quarter: 'Q2', amount: 85000, qty: 850, orders: 40 }
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
                display: {
                    showTotals: true,
                    totalsLabel: '地区小计',
                    defaultExpanded: true
                },
                sorting: {
                    enabled: true,
                    direction: 'asc'
                }
            },
            {
                id: 'category_dim',
                field: 'category',
                label: '产品类别',
                dataType: 'string',
                display: {
                    showTotals: true,
                    totalsLabel: '类别小计'
                }
            }
        ],

        // 列维度：季度
        columns: [
            {
                id: 'quarter_dim',
                field: 'quarter',
                label: '季度',
                dataType: 'string',
                display: {
                    showTotals: true,
                    totalsLabel: '季度合计'
                }
            }
        ],

        // 度量值：销售金额、数量、订单数
        measures: [
            {
                id: 'amount_measure',
                field: 'amount',
                label: '销售金额',
                aggregation: { type: 'sum' },
                format: {
                    type: 'currency',
                    currency: 'CNY',
                    precision: 0,
                    thousandSeparator: true
                },
                conditionalFormat: [
                    {
                        condition: 'value >= 150000',
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
                aggregation: { type: 'sum' },
                format: {
                    type: 'number',
                    precision: 0,
                    thousandSeparator: true,
                    suffix: ' 件'
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
            borderStyle: 'light'
        },
        cells: {
            cellPadding: 12,
            fontSize: 14
        },
        interaction: {
            expandable: true,
            exportable: true,
            resizable: true
        }
    }
};

// ============================
// 2. 复杂透视表示例
// Advanced Pivot Table Example
// ============================

export const advancedPivotExample: PivotTableConfig = {
    id: 'advanced_analytics_pivot',
    title: '高级销售分析透视表',
    description: '多维度、多度量值的复杂数据分析',

    dataSource: {
        type: 'api',
        apiConfig: {
            url: '/api/sales/data',
            method: 'POST',
            params: {
                dateRange: 'last_year',
                includeDetails: true
            }
        },
        refresh: {
            auto: true,
            interval: 300 // 5分钟刷新
        }
    },

    pivot: {
        // 行维度：地区 > 城市 > 销售员
        rows: [
            {
                id: 'region_dim',
                field: 'region',
                label: '大区',
                dataType: 'string',
                grouping: {
                    type: 'value',
                    valueGrouping: {
                        sortOrder: 'custom',
                        customOrder: ['华北', '华东', '华南', '华西', '东北', '西北']
                    }
                },
                display: {
                    showTotals: true,
                    totalsLabel: '大区合计',
                    defaultExpanded: false
                }
            },
            {
                id: 'city_dim',
                field: 'city',
                label: '城市',
                dataType: 'string',
                display: {
                    showTotals: true,
                    totalsLabel: '城市小计'
                }
            },
            {
                id: 'salesperson_dim',
                field: 'salesperson',
                label: '销售员',
                dataType: 'string',
                display: {
                    showTotals: false
                }
            }
        ],

        // 列维度：年份 > 季度 > 月份
        columns: [
            {
                id: 'year_dim',
                field: 'order_date',
                label: '年份',
                dataType: 'date',
                grouping: {
                    type: 'date',
                    dateGrouping: {
                        unit: 'year',
                        format: 'YYYY年'
                    }
                }
            },
            {
                id: 'quarter_dim',
                field: 'order_date',
                label: '季度',
                dataType: 'date',
                grouping: {
                    type: 'date',
                    dateGrouping: {
                        unit: 'quarter',
                        format: 'QQ'
                    }
                }
            }
        ],

        // 多个度量值
        measures: [
            {
                id: 'revenue_measure',
                field: 'amount',
                label: '营收',
                aggregation: { type: 'sum' },
                format: {
                    type: 'currency',
                    currency: 'CNY',
                    precision: 0,
                    thousandSeparator: true
                }
            },
            {
                id: 'profit_measure',
                field: 'profit',
                label: '利润',
                aggregation: { type: 'sum' },
                format: {
                    type: 'currency',
                    currency: 'CNY',
                    precision: 0,
                    thousandSeparator: true
                },
                conditionalFormat: [
                    {
                        condition: 'value < 0',
                        style: {
                            color: '#d32f2f',
                            fontWeight: 'bold'
                        }
                    }
                ]
            },
            {
                id: 'margin_measure',
                field: 'profit_margin',
                label: '利润率',
                aggregation: { type: 'avg' },
                format: {
                    type: 'percentage',
                    precision: 1
                }
            },
            {
                id: 'order_count_measure',
                field: 'order_id',
                label: '订单数',
                aggregation: { type: 'count_distinct' },
                format: {
                    type: 'number',
                    precision: 0,
                    thousandSeparator: true
                }
            }
        ],

        // 筛选器
        filters: [
            {
                id: 'region_filter',
                field: 'region',
                label: '大区筛选',
                type: 'multiselect',
                values: ['华北', '华东', '华南', '华西'],
                selectedValues: ['华北', '华南'],
                display: {
                    position: 'top',
                    showSelectAll: true
                }
            },
            {
                id: 'amount_filter',
                field: 'amount',
                label: '销售金额范围',
                type: 'range',
                range: {
                    min: 0,
                    max: 1000000,
                    selectedMin: 10000,
                    selectedMax: 500000
                },
                display: {
                    position: 'top'
                }
            },
            {
                id: 'date_filter',
                field: 'order_date',
                label: '日期范围',
                type: 'date_range',
                dateRange: {
                    start: '2023-01-01',
                    end: '2024-12-31',
                    selectedStart: '2024-01-01',
                    selectedEnd: '2024-06-30',
                    presets: [
                        {
                            label: '本年度',
                            value: 'current_year',
                            start: '2024-01-01',
                            end: '2024-12-31'
                        },
                        {
                            label: '上半年',
                            value: 'first_half',
                            start: '2024-01-01',
                            end: '2024-06-30'
                        }
                    ]
                }
            }
        ],

        // 复杂排序
        sorting: [
            {
                target: 'measure',
                field: 'revenue_measure',
                direction: 'desc',
                priority: 1,
                measureSorting: {
                    measureId: 'revenue_measure',
                    subtotalLevel: 1
                }
            },
            {
                target: 'row',
                field: 'region',
                direction: 'asc',
                priority: 2
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
            borderStyle: 'medium',
            compactLayout: true
        },

        cells: {
            numberFormat: {
                'revenue_measure': '¥#,##0',
                'profit_measure': '¥#,##0',
                'margin_measure': '#0.0%',
                'order_count_measure': '#,##0'
            },
            conditionalFormat: [
                {
                    id: 'revenue_format',
                    name: '营收条件格式',
                    target: 'cell',
                    field: 'revenue_measure',
                    rules: [
                        {
                            condition: 'value >= 500000',
                            style: {
                                backgroundColor: '#4caf50',
                                color: 'white',
                                fontWeight: 'bold'
                            }
                        },
                        {
                            condition: 'value >= 200000 && value < 500000',
                            style: {
                                backgroundColor: '#ffeb3b',
                                color: '#333'
                            }
                        },
                        {
                            condition: 'value < 100000',
                            style: {
                                backgroundColor: '#f44336',
                                color: 'white'
                            }
                        }
                    ]
                }
            ],
            cellPadding: 10,
            fontSize: 13
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
        // 计算字段
        calculatedFields: [
            {
                id: 'avg_order_value',
                name: '平均订单价值',
                expression: 'amount / order_count',
                dataType: 'number',
                format: {
                    type: 'currency',
                    currency: 'CNY',
                    precision: 2
                }
            },
            {
                id: 'growth_rate',
                name: '同比增长率',
                expression: '(current_amount - last_year_amount) / last_year_amount',
                dataType: 'number',
                format: {
                    type: 'percentage',
                    precision: 1
                }
            }
        ],

        // 显示TOP 10
        topN: {
            enabled: true,
            field: 'revenue_measure',
            count: 10,
            type: 'top'
        },

        // 显示百分比
        percentage: {
            enabled: true,
            base: 'row' // 按行总计计算百分比
        },

        // 累计值
        runningTotal: {
            enabled: true,
            field: 'revenue_measure',
            direction: 'column'
        }
    }
};

// ============================
// 3. 透视表数据处理示例
// Pivot Table Data Processing Example
// ============================

export function demonstratePivotTableUsage() {
    console.log('=== 透视表前端 JSON 结构演示 ===\n');

    // 处理基础透视表
    console.log('1. 处理基础透视表...');
    const basicResult = PivotTableProcessor.processPivotData(
        basicPivotExample,
        basicPivotExample.dataSource.data || []
    );

    console.log('基础透视表处理结果：');
    console.log('- 行标题数量:', basicResult.data.rowHeaders.length);
    console.log('- 列标题数量:', basicResult.data.columnHeaders.length);
    console.log('- 度量值数量:', basicResult.data.metadata.measureCount);
    console.log('- 总记录数:', basicResult.data.metadata.totalRecords);
    console.log('- 处理耗时:', basicResult.data.metadata.processingTime, 'ms');

    // 展示数据结构
    console.log('\n2. 数据结构示例：');
    console.log('行标题结构：', basicResult.data.rowHeaders.slice(0, 2));
    console.log('列标题结构：', basicResult.data.columnHeaders.slice(0, 2));

    if (basicResult.data.cells.length > 0) {
        console.log('单元格数据示例：', basicResult.data.cells[0].slice(0, 2));
    }

    // 展示状态管理
    console.log('\n3. 运行时状态：');
    console.log('- 活动筛选器:', basicResult.state.activeFilters);
    console.log('- 当前排序:', basicResult.state.currentSorting);
    console.log('- 加载状态:', basicResult.state.loading);
    console.log('- 最后更新:', basicResult.state.lastUpdated?.toISOString());

    return {
        basicResult,
        configs: {
            basic: basicPivotExample,
            advanced: advancedPivotExample
        }
    };
}

// ============================
// 4. JSON 配置验证和工具函数
// JSON Configuration Validation and Utility Functions
// ============================

export class PivotTableConfigValidator {

    /**
     * 验证透视表配置
     * Validate pivot table configuration
     */
    static validateConfig(config: PivotTableConfig): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // 基础验证
        if (!config.id) {
            errors.push('透视表ID不能为空');
        }

        if (!config.dataSource) {
            errors.push('数据源配置不能为空');
        }

        if (!config.pivot) {
            errors.push('透视配置不能为空');
        }

        // 维度验证
        if (config.pivot?.rows && config.pivot.rows.length === 0 &&
            config.pivot?.columns && config.pivot.columns.length === 0) {
            warnings.push('建议至少配置一个行维度或列维度');
        }

        // 度量值验证
        if (!config.pivot?.measures || config.pivot.measures.length === 0) {
            errors.push('至少需要配置一个度量值');
        }

        // 数据源验证
        if (config.dataSource?.type === 'static' && !config.dataSource.data) {
            errors.push('静态数据源必须提供data属性');
        }

        if (config.dataSource?.type === 'api' && !config.dataSource.apiConfig?.url) {
            errors.push('API数据源必须提供URL');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * 生成透视表配置模板
     * Generate pivot table configuration template
     */
    static generateTemplate(
        tableName: string,
        fields: Array<{ name: string; type: 'dimension' | 'measure'; dataType: string }>
    ): PivotTableConfig {
        const dimensions = fields.filter(f => f.type === 'dimension');
        const measures = fields.filter(f => f.type === 'measure');

        return {
            id: `pivot_${tableName.toLowerCase().replace(/\s+/g, '_')}`,
            title: `${tableName}透视表`,

            dataSource: {
                type: 'static',
                data: []
            },

            pivot: {
                rows: dimensions.slice(0, 2).map((dim, index) => ({
                    id: `${dim.name}_dim`,
                    field: dim.name,
                    label: dim.name,
                    dataType: dim.dataType as any,
                    display: {
                        showTotals: index === 0,
                        defaultExpanded: index === 0
                    }
                })),

                columns: dimensions.slice(2, 3).map(dim => ({
                    id: `${dim.name}_dim`,
                    field: dim.name,
                    label: dim.name,
                    dataType: dim.dataType as any
                })),

                measures: measures.map(measure => ({
                    id: `${measure.name}_measure`,
                    field: measure.name,
                    label: measure.name,
                    aggregation: { type: 'sum' },
                    format: {
                        type: measure.dataType === 'number' ? 'number' : 'currency',
                        precision: 0,
                        thousandSeparator: true
                    }
                }))
            },

            display: {
                table: {
                    showRowHeaders: true,
                    showColumnHeaders: true,
                    showGrandTotals: true,
                    showSubTotals: true
                },
                cells: {},
                interaction: {
                    expandable: true,
                    exportable: true
                }
            }
        };
    }
}

export default {
    basicPivotExample,
    advancedPivotExample,
    demonstratePivotTableUsage,
    PivotTableConfigValidator
};
