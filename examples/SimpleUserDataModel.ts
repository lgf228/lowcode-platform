/**
 * 简化的用户管理数据模型示例
 * 展示如何使用简化后的数据模型类型
 */

import {
    DataColumn,
    DataConstraint,
    createDataColumn,
    createDataTable,
    createPageDataSet
} from '../src/core/types/DataModel'

// 创建用户表列
const userColumns: DataColumn[] = [
    createDataColumn('Id', 'guid', 'Users', {
        allowDBNull: false,
        ordinal: 0,
        caption: '用户ID'
    }),
    createDataColumn('UserName', 'string', 'Users', {
        allowDBNull: false,
        maxLength: 50,
        unique: true,
        ordinal: 1,
        caption: '用户名'
    }),
    createDataColumn('Email', 'string', 'Users', {
        allowDBNull: false,
        maxLength: 255,
        unique: true,
        ordinal: 2,
        caption: '邮箱'
    }),
    createDataColumn('FirstName', 'string', 'Users', {
        allowDBNull: true,
        maxLength: 50,
        ordinal: 3,
        caption: '名'
    }),
    createDataColumn('LastName', 'string', 'Users', {
        allowDBNull: true,
        maxLength: 50,
        ordinal: 4,
        caption: '姓'
    }),
    createDataColumn('IsActive', 'boolean', 'Users', {
        allowDBNull: false,
        defaultValue: true,
        ordinal: 5,
        caption: '是否激活'
    }),
    createDataColumn('CreatedAt', 'datetime', 'Users', {
        allowDBNull: false,
        ordinal: 6,
        caption: '创建时间'
    })
]

// 创建用户表约束
const userConstraints: DataConstraint[] = [
    {
        constraintName: 'PK_Users',
        tableName: 'Users',
        constraintType: 'PrimaryKey',
        columnNames: ['Id']
    },
    {
        constraintName: 'UK_Users_UserName',
        tableName: 'Users',
        constraintType: 'Unique',
        columnNames: ['UserName']
    },
    {
        constraintName: 'UK_Users_Email',
        tableName: 'Users',
        constraintType: 'Unique',
        columnNames: ['Email']
    }
]

// 创建角色表列
const roleColumns: DataColumn[] = [
    createDataColumn('Id', 'guid', 'Roles', {
        allowDBNull: false,
        ordinal: 0,
        caption: '角色ID'
    }),
    createDataColumn('RoleName', 'string', 'Roles', {
        allowDBNull: false,
        maxLength: 50,
        unique: true,
        ordinal: 1,
        caption: '角色名'
    }),
    createDataColumn('Description', 'string', 'Roles', {
        allowDBNull: true,
        maxLength: 255,
        ordinal: 2,
        caption: '描述'
    })
]

// 创建角色表约束
const roleConstraints: DataConstraint[] = [
    {
        constraintName: 'PK_Roles',
        tableName: 'Roles',
        constraintType: 'PrimaryKey',
        columnNames: ['Id']
    },
    {
        constraintName: 'UK_Roles_RoleName',
        tableName: 'Roles',
        constraintType: 'Unique',
        columnNames: ['RoleName']
    }
]

// 创建数据表
const usersTable = createDataTable('Users', userColumns, {
    displayName: '用户表',
    namespace: 'UserManagement',
    constraints: userConstraints
})

const rolesTable = createDataTable('Roles', roleColumns, {
    displayName: '角色表',
    namespace: 'UserManagement',
    constraints: roleConstraints
})

// 创建页面数据集
export const userManagementDataSet = createPageDataSet(
    'user-management',
    'UserManagementDataSet',
    [usersTable, rolesTable]
)

// 导出表结构供其他地方使用
export { usersTable, rolesTable }

// 示例：如何添加示例数据
export const sampleUsers = [
    {
        id: 'sample-1',
        values: {
            Id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            UserName: 'admin',
            Email: 'admin@example.com',
            FirstName: '管理',
            LastName: '员',
            IsActive: true,
            CreatedAt: new Date().toISOString()
        },
        rowState: 'Unchanged' as const,
        hasErrors: false
    },
    {
        id: 'sample-2',
        values: {
            Id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
            UserName: 'user1',
            Email: 'user1@example.com',
            FirstName: '用户',
            LastName: '一',
            IsActive: true,
            CreatedAt: new Date().toISOString()
        },
        rowState: 'Unchanged' as const,
        hasErrors: false
    }
]
