// ===========================
// Data Model Utils - 数据模型工具类
// ===========================

import {
    PageDataSet,
    DataTable,
    DataRow,
    DataColumn,
    DataRelation,
    DataConstraint,
    DataType
} from '../types/DataModel'

/**
 * 数据模型管理工具类
 */
export class DataModelUtils {
    /**
     * 验证页面数据集的完整性
     */
    static validatePageDataSet(dataSet: PageDataSet): ValidationResult {
        const errors: string[] = []
        const warnings: string[] = []

        // 验证表结构
        for (const table of dataSet.tables) {
            const tableValidation = this.validateTable(table, dataSet)
            errors.push(...tableValidation.errors)
            warnings.push(...tableValidation.warnings)
        }

        // 验证关系
        for (const relation of dataSet.relations) {
            const relationValidation = this.validateRelation(relation, dataSet)
            errors.push(...relationValidation.errors)
            warnings.push(...relationValidation.warnings)
        }

        // 验证数据完整性
        if (dataSet.enforceConstraints) {
            const integrityValidation = this.validateDataIntegrity(dataSet)
            errors.push(...integrityValidation.errors)
            warnings.push(...integrityValidation.warnings)
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        }
    }

    /**
     * 验证数据表
     */
    static validateTable(table: DataTable, dataSet: PageDataSet): ValidationResult {
        const errors: string[] = []
        const warnings: string[] = []

        // 检查表名唯一性
        const duplicateTables = dataSet.tables.filter(t => t.tableName === table.tableName)
        if (duplicateTables.length > 1) {
            errors.push(`表名 "${table.tableName}" 重复`)
        }

        // 检查列定义
        for (const column of table.columns) {
            const columnValidation = this.validateColumn(column, table)
            errors.push(...columnValidation.errors)
            warnings.push(...columnValidation.warnings)
        }

        // 检查主键
        const primaryKeyConstraints = table.constraints.filter(c => c.constraintType === 'PrimaryKey')
        if (primaryKeyConstraints.length === 0) {
            warnings.push(`表 "${table.tableName}" 没有定义主键`)
        } else if (primaryKeyConstraints.length > 1) {
            errors.push(`表 "${table.tableName}" 定义了多个主键`)
        }

        // 检查约束
        for (const constraint of table.constraints) {
            const constraintValidation = this.validateConstraint(constraint, table)
            errors.push(...constraintValidation.errors)
            warnings.push(...constraintValidation.warnings)
        }

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * 验证数据列
     */
    static validateColumn(column: DataColumn, table: DataTable): ValidationResult {
        const errors: string[] = []
        const warnings: string[] = []

        // 检查列名唯一性
        const duplicateColumns = table.columns.filter(c => c.columnName === column.columnName)
        if (duplicateColumns.length > 1) {
            errors.push(`表 "${table.tableName}" 中列名 "${column.columnName}" 重复`)
        }

        // 检查数据类型相关配置
        if (column.dataType === 'string' && !column.maxLength) {
            warnings.push(`字符串列 "${column.columnName}" 未指定最大长度`)
        }

        if (column.autoIncrement && !['int', 'long'].includes(column.dataType)) {
            errors.push(`列 "${column.columnName}" 只有数值类型才能设置自增`)
        }

        if (column.unique && column.allowDBNull) {
            warnings.push(`唯一列 "${column.columnName}" 允许空值可能导致问题`)
        }

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * 验证约束
     */
    static validateConstraint(constraint: DataConstraint, table: DataTable): ValidationResult {
        const errors: string[] = []
        const warnings: string[] = []

        // 检查约束列是否存在
        for (const columnName of constraint.columnNames) {
            if (!table.columns.find(c => c.columnName === columnName)) {
                errors.push(`约束 "${constraint.constraintName}" 引用的列 "${columnName}" 不存在`)
            }
        }

        // 检查外键约束
        if (constraint.constraintType === 'ForeignKey') {
            if (!constraint.referencedTableName || !constraint.referencedColumnNames) {
                errors.push(`外键约束 "${constraint.constraintName}" 缺少引用表或引用列`)
            }
        }

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * 验证数据关系
     */
    static validateRelation(relation: DataRelation, dataSet: PageDataSet): ValidationResult {
        const errors: string[] = []
        const warnings: string[] = []

        // 检查父表和子表是否存在
        const parentTable = dataSet.tables.find(t => t.tableName === relation.parentTableName)
        const childTable = dataSet.tables.find(t => t.tableName === relation.childTableName)

        if (!parentTable) {
            errors.push(`关系 "${relation.relationName}" 的父表 "${relation.parentTableName}" 不存在`)
        }

        if (!childTable) {
            errors.push(`关系 "${relation.relationName}" 的子表 "${relation.childTableName}" 不存在`)
        }

        if (parentTable && childTable) {
            // 检查关系列是否存在
            for (const columnName of relation.parentColumnNames) {
                if (!parentTable.columns.find(c => c.columnName === columnName)) {
                    errors.push(`父表 "${relation.parentTableName}" 中列 "${columnName}" 不存在`)
                }
            }

            for (const columnName of relation.childColumnNames) {
                if (!childTable.columns.find(c => c.columnName === columnName)) {
                    errors.push(`子表 "${relation.childTableName}" 中列 "${columnName}" 不存在`)
                }
            }

            // 检查列数量是否匹配
            if (relation.parentColumnNames.length !== relation.childColumnNames.length) {
                errors.push(`关系 "${relation.relationName}" 的父表列数和子表列数不匹配`)
            }
        }

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * 验证数据完整性
     */
    static validateDataIntegrity(dataSet: PageDataSet): ValidationResult {
        const errors: string[] = []
        const warnings: string[] = []

        // 验证外键完整性
        for (const relation of dataSet.relations) {
            const parentTable = dataSet.tables.find(t => t.tableName === relation.parentTableName)
            const childTable = dataSet.tables.find(t => t.tableName === relation.childTableName)

            if (!parentTable || !childTable || !childTable.rows || !parentTable.rows) {
                continue
            }

            for (const childRow of childTable.rows) {
                const childValues = relation.childColumnNames.map(col => childRow.values[col])

                // 跳过空值（如果允许）
                if (childValues.some(val => val == null)) {
                    continue
                }

                const parentExists = parentTable.rows.some(parentRow => {
                    const parentValues = relation.parentColumnNames.map(col => parentRow.values[col])
                    return parentValues.every((val, idx) => val === childValues[idx])
                })

                if (!parentExists) {
                    errors.push(
                        `表 "${relation.childTableName}" 中存在无效的外键引用: ${childValues.join(', ')}`
                    )
                }
            }
        }

        // 验证唯一约束
        for (const table of dataSet.tables) {
            const uniqueConstraints = table.constraints.filter(c => c.constraintType === 'Unique')

            for (const constraint of uniqueConstraints) {
                if (!table.rows) continue

                const valueMap = new Map<string, number>()

                for (const row of table.rows) {
                    const values = constraint.columnNames.map(col => row.values[col])
                    const key = values.join('|')

                    valueMap.set(key, (valueMap.get(key) || 0) + 1)
                }

                for (const [key, count] of valueMap) {
                    if (count > 1) {
                        errors.push(
                            `表 "${table.tableName}" 中唯一约束 "${constraint.constraintName}" 被违反: ${key}`
                        )
                    }
                }
            }
        }

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * 创建数据行
     */
    static createDataRow(
        table: DataTable,
        values: Record<string, any>,
        rowState: DataRow['rowState'] = 'Added'
    ): DataRow {
        const row: DataRow = {
            id: this.generateRowId(),
            values: {},
            rowState,
            hasErrors: false
        }

        // 设置列值
        for (const column of table.columns) {
            const value = values[column.columnName]

            if (value !== undefined) {
                row.values[column.columnName] = this.convertValue(value, column.dataType)
            } else if (column.defaultValue !== undefined) {
                row.values[column.columnName] = column.defaultValue
            } else if (!column.allowDBNull) {
                row.values[column.columnName] = this.getDefaultValueForType(column.dataType)
            }
        }

        return row
    }

    /**
     * 类型转换
     */
    static convertValue(value: any, targetType: DataType): any {
        if (value == null) return null

        switch (targetType) {
            case 'string':
                return String(value)
            case 'int':
                return parseInt(value)
            case 'long':
                return parseInt(value)
            case 'decimal':
            case 'double':
                return parseFloat(value)
            case 'boolean':
                return Boolean(value)
            case 'datetime':
                return new Date(value)
            case 'guid':
                return String(value)
            default:
                return value
        }
    }

    /**
     * 获取数据类型的默认值
     */
    static getDefaultValueForType(dataType: DataType): any {
        switch (dataType) {
            case 'string':
                return ''
            case 'int':
            case 'long':
            case 'decimal':
            case 'double':
                return 0
            case 'boolean':
                return false
            case 'datetime':
                return new Date()
            case 'guid':
                return this.generateGuid()
            case 'byte[]':
                return new Uint8Array()
            default:
                return null
        }
    }

    /**
     * 生成 GUID
     */
    static generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0
            const v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    /**
     * 生成行ID
     */
    static generateRowId(): string {
        return `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    /**
     * 克隆数据集
     */
    static cloneDataSet(dataSet: PageDataSet): PageDataSet {
        return JSON.parse(JSON.stringify(dataSet))
    }

    /**
     * 获取表的主键列
     */
    static getPrimaryKeyColumns(table: DataTable): DataColumn[] {
        const primaryKeyConstraint = table.constraints.find(c => c.constraintType === 'PrimaryKey')

        if (!primaryKeyConstraint) {
            return []
        }

        return table.columns.filter(c =>
            primaryKeyConstraint.columnNames.includes(c.columnName)
        )
    }

    /**
     * 查找相关行
     */
    static findRelatedRows(
        dataSet: PageDataSet,
        tableName: string,
        parentValues: Record<string, any>
    ): DataRow[] {
        const relation = dataSet.relations.find(r =>
            r.parentTableName === tableName || r.childTableName === tableName
        )

        if (!relation) {
            return []
        }

        const targetTable = dataSet.tables.find(t =>
            t.tableName === (relation.parentTableName === tableName ? relation.childTableName : relation.parentTableName)
        )

        if (!targetTable || !targetTable.rows) {
            return []
        }

        const isParent = relation.parentTableName === tableName
        const sourceColumns = isParent ? relation.parentColumnNames : relation.childColumnNames
        const targetColumns = isParent ? relation.childColumnNames : relation.parentColumnNames

        return targetTable.rows.filter(row => {
            return targetColumns.every((col, idx) => {
                const sourceCol = sourceColumns[idx]
                return row.values[col] === parentValues[sourceCol]
            })
        })
    }
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
    isValid: boolean
    errors: string[]
    warnings: string[]
}
