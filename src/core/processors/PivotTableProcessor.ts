/**
 * 透视表数据处理器
 * Pivot Table Data Processor
 * 
 * 基于透视表 JSON 配置进行数据处理和转换
 * Process and transform data based on pivot table JSON configuration
 */

import {
    PivotTableConfig,
    PivotTableData,
    PivotTableState,
    PivotHeader,
    PivotCell,
    PivotDimension,
    PivotMeasure
} from '../types/PivotTable';

/**
 * 透视表数据处理器类
 * Pivot Table Data Processor Class
 */
export class PivotTableProcessor {

    /**
     * 处理透视表数据
     * Process pivot table data
     */
    static processPivotData(
        config: PivotTableConfig,
        rawData: any[]
    ): { data: PivotTableData; state: PivotTableState } {

        const startTime = Date.now();

        // 1. 应用筛选器
        const filteredData = this.applyFilters(rawData, config.pivot.filters || []);

        // 2. 处理计算字段
        const enrichedData = this.processCalculatedFields(filteredData, config.advanced?.calculatedFields || []);

        // 3. 构建维度层级结构
        const rowHierarchy = this.buildDimensionHierarchy(enrichedData, config.pivot.rows, 'row');
        const columnHierarchy = this.buildDimensionHierarchy(enrichedData, config.pivot.columns, 'column');

        // 4. 生成数据矩阵
        const dataMatrix = this.generateDataMatrix(
            enrichedData,
            rowHierarchy,
            columnHierarchy,
            config.pivot.measures
        );

        // 5. 计算小计和总计
        const totals = this.calculateTotals(dataMatrix, config);

        // 6. 应用排序
        const sortedData = this.applySorting(dataMatrix, config.pivot.sorting || []);

        // 7. 应用条件格式
        const formattedData = this.applyConditionalFormatting(sortedData, config);

        const processingTime = Date.now() - startTime;

        const pivotData: PivotTableData = {
            rowHeaders: rowHierarchy.headers,
            columnHeaders: columnHierarchy.headers,
            cells: formattedData.cells,
            totals,
            metadata: {
                rowCount: rowHierarchy.headers.length,
                columnCount: columnHierarchy.headers.length,
                measureCount: config.pivot.measures.length,
                totalRecords: enrichedData.length,
                processingTime
            }
        };

        const state: PivotTableState = {
            rawData,
            processedData: pivotData,
            expandedRows: new Set(),
            expandedColumns: new Set(),
            activeFilters: this.extractActiveFilters(config.pivot.filters || []),
            currentSorting: config.pivot.sorting || [],
            selectedCells: [],
            loading: false,
            lastUpdated: new Date()
        };

        return { data: pivotData, state };
    }

    /**
     * 应用筛选器
     * Apply filters to data
     */
    private static applyFilters(data: any[], filters: any[]): any[] {
        return data.filter(row => {
            return filters.every(filter => {
                const fieldValue = row[filter.field];

                switch (filter.type) {
                    case 'select':
                    case 'multiselect':
                        return !filter.selectedValues ||
                            filter.selectedValues.length === 0 ||
                            filter.selectedValues.includes(fieldValue);

                    case 'range': {
                        const numValue = Number(fieldValue);
                        return (!filter.range?.selectedMin || numValue >= filter.range.selectedMin) &&
                            (!filter.range?.selectedMax || numValue <= filter.range.selectedMax);
                    }

                    case 'date_range': {
                        const dateValue = new Date(fieldValue);
                        const startDate = filter.dateRange?.selectedStart ? new Date(filter.dateRange.selectedStart) : null;
                        const endDate = filter.dateRange?.selectedEnd ? new Date(filter.dateRange.selectedEnd) : null;
                        return (!startDate || dateValue >= startDate) &&
                            (!endDate || dateValue <= endDate);
                    }

                    case 'search':
                        return !filter.selectedValues ||
                            filter.selectedValues.length === 0 ||
                            filter.selectedValues.some((term: string) =>
                                String(fieldValue).toLowerCase().includes(term.toLowerCase())
                            );

                    default:
                        return true;
                }
            });
        });
    }

    /**
     * 处理计算字段
     * Process calculated fields
     */
    private static processCalculatedFields(data: any[], calculatedFields: any[]): any[] {
        if (!calculatedFields || calculatedFields.length === 0) {
            return data;
        }

        return data.map(row => {
            const newRow = { ...row };

            calculatedFields.forEach(field => {
                try {
                    // 简单的表达式计算（实际项目中应使用更安全的表达式解析器）
                    // Simple expression calculation (use safer expression parser in real projects)
                    const expression = field.expression
                        .replace(/\b(\w+)\b/g, (match: string) => {
                            return Object.prototype.hasOwnProperty.call(row, match) ? `row.${match}` : match;
                        });          // 使用 Function 构造器（仅示例，生产环境应使用安全的表达式解析器）
                    // Using Function constructor (for demo only, use safe expression parser in production)
                    const func = new Function('row', `return ${expression}`);
                    newRow[field.id] = func(row);

                } catch (error) {
                    console.warn(`计算字段 ${field.id} 计算失败:`, error);
                    newRow[field.id] = null;
                }
            });

            return newRow;
        });
    }

    /**
     * 构建维度层级结构
     * Build dimension hierarchy structure
     */
    private static buildDimensionHierarchy(
        data: any[],
        dimensions: PivotDimension[],
        type: 'row' | 'column'
    ): { headers: PivotHeader[]; groups: Record<string, any[]> } {

        if (dimensions.length === 0) {
            return {
                headers: [],
                groups: { 'root': data }
            };
        }

        // 递归构建多级分组
        const buildLevel = (
            levelData: any[],
            dimIndex: number,
            parentPath: string[] = [],
            parentId?: string
        ): PivotHeader[] => {

            if (dimIndex >= dimensions.length) {
                return [];
            }

            const dimension = dimensions[dimIndex];
            const groups = this.groupByDimension(levelData, dimension);
            const headers: PivotHeader[] = [];

            Object.entries(groups).forEach(([groupKey, groupData], index) => {
                const headerId = `${type}_${dimIndex}_${index}`;
                const currentPath = [...parentPath, groupKey];

                const header: PivotHeader = {
                    id: headerId,
                    label: this.formatDimensionValue(groupKey, dimension),
                    level: dimIndex,
                    path: currentPath,
                    parentId,
                    expanded: dimension.display?.defaultExpanded ?? true,
                    visible: dimension.display?.visible ?? true
                };

                // 递归处理下级维度
                if (dimIndex < dimensions.length - 1) {
                    header.children = buildLevel(groupData, dimIndex + 1, currentPath, headerId);
                }

                // 计算聚合信息
                if (groupData.length > 0) {
                    header.aggregation = {
                        type: 'count',
                        value: groupData.length,
                        count: groupData.length
                    };
                }

                headers.push(header);
            });

            return headers;
        };

        const headers = buildLevel(data, 0);
        const groups = this.buildGroupMap(data, dimensions);

        return { headers, groups };
    }

    /**
     * 按维度分组数据
     * Group data by dimension
     */
    private static groupByDimension(data: any[], dimension: PivotDimension): Record<string, any[]> {
        const groups: Record<string, any[]> = {};

        data.forEach(row => {
            let groupKey = this.getDimensionGroupKey(row[dimension.field], dimension);

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(row);
        });

        // 应用排序
        if (dimension.sorting?.enabled) {
            const sortedKeys = Object.keys(groups).sort((a, b) => {
                if (dimension.sorting?.customSort) {
                    const indexA = dimension.sorting.customSort.indexOf(a);
                    const indexB = dimension.sorting.customSort.indexOf(b);
                    return indexA - indexB;
                }

                const direction = dimension.sorting?.direction === 'desc' ? -1 : 1;
                return a.localeCompare(b) * direction;
            });

            const sortedGroups: Record<string, any[]> = {};
            sortedKeys.forEach(key => {
                sortedGroups[key] = groups[key];
            });

            return sortedGroups;
        }

        return groups;
    }

    /**
     * 获取维度分组键
     * Get dimension group key
     */
    private static getDimensionGroupKey(value: any, dimension: PivotDimension): string {
        if (value == null) {
            return '(空)';
        }

        const grouping = dimension.grouping;
        if (!grouping) {
            return String(value);
        }

        switch (grouping.type) {
            case 'value':
                return String(value);

            case 'range':
                if (grouping.rangeGrouping && typeof value === 'number') {
                    const range = grouping.rangeGrouping.ranges.find(r =>
                        (r.min === undefined || value >= r.min) &&
                        (r.max === undefined || value <= r.max)
                    );
                    return range?.label || '其他';
                }
                return String(value);

            case 'date':
                if (grouping.dateGrouping) {
                    const date = new Date(value);
                    switch (grouping.dateGrouping.unit) {
                        case 'year':
                            return date.getFullYear().toString();
                        case 'quarter':
                            return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
                        case 'month':
                            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        case 'week': {
                            // 简化的周计算
                            const week = Math.ceil(date.getDate() / 7);
                            return `${date.getFullYear()}-W${week}`;
                        }
                        case 'day':
                            return date.toISOString().split('T')[0];
                    }
                }
                return String(value);

            case 'custom':
                if (grouping.customGrouping) {
                    const group = grouping.customGrouping.groups.find(g =>
                        g.values.includes(value)
                    );
                    return group?.label || '其他';
                }
                return String(value);

            default:
                return String(value);
        }
    }

    /**
     * 格式化维度值显示
     * Format dimension value display
     */
    private static formatDimensionValue(value: string, _dimension: PivotDimension): string {
        // 可以根据维度配置进行格式化
        return value;
    }

    /**
     * 构建分组映射
     * Build group mapping
     */
    private static buildGroupMap(data: any[], dimensions: PivotDimension[]): Record<string, any[]> {
        const groups: Record<string, any[]> = {};

        data.forEach(row => {
            const keys = dimensions.map(dim =>
                this.getDimensionGroupKey(row[dim.field], dim)
            );
            const groupKey = keys.join('|');

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(row);
        });

        return groups;
    }

    /**
     * 生成数据矩阵
     * Generate data matrix
     */
    private static generateDataMatrix(
        data: any[],
        rowHierarchy: any,
        columnHierarchy: any,
        measures: PivotMeasure[]
    ): { cells: PivotCell[][]; rowGroups: Record<string, any[]>; columnGroups: Record<string, any[]> } {

        // 获取所有行组合和列组合
        const rowCombinations = this.getAllCombinations(rowHierarchy.headers);
        const columnCombinations = this.getAllCombinations(columnHierarchy.headers);

        const cells: PivotCell[][] = [];
        const rowGroups: Record<string, any[]> = {};
        const columnGroups: Record<string, any[]> = {};

        // 为每个行列组合生成单元格
        rowCombinations.forEach((rowCombo, rowIndex) => {
            const rowCells: PivotCell[] = [];

            columnCombinations.forEach((colCombo, colIndex) => {
                // 找到该行列组合对应的数据
                const cellData = this.getCellData(data, rowCombo, colCombo);

                // 为每个度量值创建单元格
                measures.forEach((measure, measureIndex) => {
                    const cellId = `cell_${rowIndex}_${colIndex}_${measureIndex}`;
                    const aggregatedValue = this.calculateAggregation(cellData, measure);

                    const cell: PivotCell = {
                        id: cellId,
                        value: aggregatedValue,
                        formattedValue: this.formatValue(aggregatedValue, measure.format),
                        row: rowIndex,
                        column: colIndex * measures.length + measureIndex,
                        measureId: measure.id,
                        aggregation: {
                            type: measure.aggregation.type,
                            sourceValues: cellData.map(d => d[measure.field]),
                            count: cellData.length
                        }
                    };

                    rowCells.push(cell);
                });
            });

            cells.push(rowCells);
        });

        return { cells, rowGroups, columnGroups };
    }

    /**
     * 获取所有组合
     * Get all combinations
     */
    private static getAllCombinations(headers: PivotHeader[]): string[][] {
        const combinations: string[][] = [];

        const buildCombinations = (currentPath: string[], headerList: PivotHeader[]) => {
            if (headerList.length === 0) {
                if (currentPath.length > 0) {
                    combinations.push([...currentPath]);
                }
                return;
            }

            headerList.forEach(header => {
                const newPath = [...currentPath, header.label];
                if (header.children && header.children.length > 0) {
                    buildCombinations(newPath, header.children);
                } else {
                    combinations.push(newPath);
                }
            });
        };

        buildCombinations([], headers);
        return combinations;
    }

    /**
     * 获取单元格数据
     * Get cell data
     */
    private static getCellData(data: any[], _rowCombo: string[], _colCombo: string[]): any[] {
        // 这里需要根据行列组合筛选数据
        // 简化实现：返回所有数据
        return data;
    }

    /**
     * 计算聚合值
     * Calculate aggregation value
     */
    private static calculateAggregation(data: any[], measure: PivotMeasure): number {
        if (data.length === 0) return 0;

        const values = data
            .map(d => d[measure.field])
            .filter(v => v != null && !isNaN(Number(v)))
            .map(Number);

        switch (measure.aggregation.type) {
            case 'sum':
                return values.reduce((a, b) => a + b, 0);
            case 'count':
                return data.length;
            case 'avg':
                return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            case 'min':
                return values.length > 0 ? Math.min(...values) : 0;
            case 'max':
                return values.length > 0 ? Math.max(...values) : 0;
            case 'count_distinct':
                return new Set(values).size;
            default:
                return 0;
        }
    }

    /**
     * 格式化数值
     * Format value
     */
    private static formatValue(value: number, format: any): string {
        switch (format.type) {
            case 'currency':
                return new Intl.NumberFormat('zh-CN', {
                    style: 'currency',
                    currency: format.currency || 'CNY',
                    minimumFractionDigits: format.precision || 2
                }).format(value);

            case 'percentage':
                return new Intl.NumberFormat('zh-CN', {
                    style: 'percent',
                    minimumFractionDigits: format.precision || 2
                }).format(value / 100);

            case 'number':
                return new Intl.NumberFormat('zh-CN', {
                    minimumFractionDigits: format.precision || 0,
                    useGrouping: format.thousandSeparator !== false
                }).format(value);

            default:
                return String(value);
        }
    }

    /**
     * 计算小计和总计
     * Calculate subtotals and grand totals
     */
    private static calculateTotals(_dataMatrix: any, _config: PivotTableConfig): any {
        // 简化实现
        return {
            rowTotals: {},
            columnTotals: {},
            grandTotal: {
                id: 'grand_total',
                value: 0,
                formattedValue: '0',
                row: -1,
                column: -1
            }
        };
    }

    /**
     * 应用排序
     * Apply sorting
     */
    private static applySorting(dataMatrix: any, _sorting: any[]): any {
        // 简化实现：返回原数据
        return dataMatrix;
    }

    /**
     * 应用条件格式
     * Apply conditional formatting
     */
    private static applyConditionalFormatting(dataMatrix: any, _config: PivotTableConfig): any {
        // 简化实现：返回原数据
        return dataMatrix;
    }

    /**
     * 提取活动筛选器
     * Extract active filters
     */
    private static extractActiveFilters(filters: any[]): Record<string, any> {
        const activeFilters: Record<string, any> = {};

        filters.forEach(filter => {
            if (filter.selectedValues && filter.selectedValues.length > 0) {
                activeFilters[filter.field] = filter.selectedValues;
            }
        });

        return activeFilters;
    }
}

// 使用示例
export const processPivotTableExample = () => {
    const sampleData = [
        { region: '华北', category: '电子', department: '销售', month: '2024-01', amount: 10000, qty: 100 },
        { region: '华北', category: '服装', department: '销售', month: '2024-01', amount: 8000, qty: 80 },
        { region: '华南', category: '电子', department: '技术', month: '2024-02', amount: 15000, qty: 150 },
        { region: '华南', category: '电子', department: '销售', month: '2024-02', amount: 12000, qty: 120 }
    ];

    const config: PivotTableConfig = {
        id: 'example_pivot',
        title: '示例透视表',

        dataSource: {
            type: 'static',
            data: sampleData
        },

        pivot: {
            rows: [
                {
                    id: 'region_dim',
                    field: 'region',
                    label: '地区',
                    dataType: 'string'
                }
            ],
            columns: [
                {
                    id: 'month_dim',
                    field: 'month',
                    label: '月份',
                    dataType: 'string'
                }
            ],
            measures: [
                {
                    id: 'amount_sum',
                    field: 'amount',
                    label: '销售金额',
                    aggregation: { type: 'sum' },
                    format: { type: 'currency', currency: 'CNY' }
                }
            ]
        },

        display: {
            table: {
                showRowHeaders: true,
                showColumnHeaders: true,
                showGrandTotals: true
            },
            cells: {},
            interaction: {
                expandable: true
            }
        }
    };

    const result = PivotTableProcessor.processPivotData(config, sampleData);

    console.log('透视表处理结果：', {
        rowCount: result.data.metadata.rowCount,
        columnCount: result.data.metadata.columnCount,
        totalRecords: result.data.metadata.totalRecords,
        processingTime: result.data.metadata.processingTime
    });

    return result;
};

export default {
    PivotTableProcessor,
    processPivotTableExample
};
