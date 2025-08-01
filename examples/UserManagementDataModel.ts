// ===========================
// Data Model Example - 数据模型使用示例
// ===========================
// 演示如何构建用户管理页面的数据模型

import {
    DataTable,
    DataColumn,
    DataRelation,
    PageDataSet,
    DataAdapter,
    createDataColumn,
    createDataTable,
    createDataRelation,
    createPageDataSet
} from '../src/core/types/DataModel'

/**
 * 用户管理页面数据模型示例
 * 包含：用户表、角色表、用户角色关联表
 */

// ===========================
// 1. 定义数据列
// ===========================

// 用户表列定义
const userColumns: DataColumn[] = [
    createDataColumn('Id', 'guid', 'Users', {
        allowDBNull: false,
        unique: true,
        ordinal: 0
    }),
    createDataColumn('UserName', 'string', 'Users', {
        allowDBNull: false,
        maxLength: 50,
        unique: true,
        ordinal: 1
    }),
    createDataColumn('Email', 'string', 'Users', {
        allowDBNull: false,
        maxLength: 100,
        unique: true,
        ordinal: 2
    }),
    createDataColumn('PasswordHash', 'string', 'Users', {
        allowDBNull: false,
        maxLength: 255,
        ordinal: 3
    }),
    createDataColumn('FirstName', 'string', 'Users', {
        allowDBNull: true,
        maxLength: 50,
        ordinal: 4
    }),
    createDataColumn('LastName', 'string', 'Users', {
        allowDBNull: true,
        maxLength: 50,
        ordinal: 5
    }),
    createDataColumn('IsActive', 'boolean', 'Users', {
        allowDBNull: false,
        defaultValue: true,
        ordinal: 6
    }),
    createDataColumn('CreatedAt', 'datetime', 'Users', {
        allowDBNull: false,
        defaultValue: 'GETDATE()',
        ordinal: 7
    }),
    createDataColumn('UpdatedAt', 'datetime', 'Users', {
        allowDBNull: true,
        ordinal: 8
    }),
    createDataColumn('LastLoginAt', 'datetime', 'Users', {
        allowDBNull: true,
        ordinal: 9
    })
]

// 角色表列定义
const roleColumns: DataColumn[] = [
    createDataColumn('Id', 'guid', 'Roles', {
        allowDBNull: false,
        unique: true,
        ordinal: 0
    }),
    createDataColumn('RoleName', 'string', 'Roles', {
        allowDBNull: false,
        maxLength: 50,
        unique: true,
        ordinal: 1
    }),
    createDataColumn('DisplayName', 'string', 'Roles', {
        allowDBNull: true,
        maxLength: 100,
        ordinal: 2
    }),
    createDataColumn('Description', 'string', 'Roles', {
        allowDBNull: true,
        maxLength: 500,
        ordinal: 3
    }),
    createDataColumn('IsSystem', 'boolean', 'Roles', {
        allowDBNull: false,
        defaultValue: false,
        ordinal: 4
    }),
    createDataColumn('CreatedAt', 'datetime', 'Roles', {
        allowDBNull: false,
        defaultValue: 'GETDATE()',
        ordinal: 5
    })
]

// 用户角色关联表列定义
const userRoleColumns: DataColumn[] = [
    createDataColumn('Id', 'guid', 'UserRoles', {
        allowDBNull: false,
        unique: true,
        ordinal: 0
    }),
    createDataColumn('UserId', 'guid', 'UserRoles', {
        allowDBNull: false,
        ordinal: 1
    }),
    createDataColumn('RoleId', 'guid', 'UserRoles', {
        allowDBNull: false,
        ordinal: 2
    }),
    createDataColumn('AssignedAt', 'datetime', 'UserRoles', {
        allowDBNull: false,
        defaultValue: 'GETDATE()',
        ordinal: 3
    }),
    createDataColumn('AssignedBy', 'guid', 'UserRoles', {
        allowDBNull: true,
        ordinal: 4
    })
]

// ===========================
// 2. 定义数据表
// ===========================

const usersTable: DataTable = createDataTable(
    'Users',
    userColumns,
    {
        displayName: '用户表',
        namespace: 'UserManagement',
        constraints: [
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
    }
)

const rolesTable: DataTable = createDataTable(
    'Roles',
    roleColumns,
    {
        displayName: '角色表',
        namespace: 'UserManagement',
        constraints: [
            {
                id: 'PK_Roles',
                name: 'PK_Roles',
                version: '1.0.0',
                type: 'dataConstraint',
                tableName: 'Roles',
                constraintType: 'PrimaryKey',
                columnNames: ['Id']
            },
            {
                id: 'UK_Roles_RoleName',
                name: 'UK_Roles_RoleName',
                version: '1.0.0',
                type: 'dataConstraint',
                tableName: 'Roles',
                constraintType: 'Unique',
                columnNames: ['RoleName']
            }
        ]
    }
)

const userRolesTable: DataTable = createDataTable(
    'UserRoles',
    userRoleColumns,
    {
        displayName: '用户角色关联表',
        namespace: 'UserManagement',
        constraints: [
            {
                id: 'PK_UserRoles',
                name: 'PK_UserRoles',
                version: '1.0.0',
                type: 'dataConstraint',
                tableName: 'UserRoles',
                constraintType: 'PrimaryKey',
                columnNames: ['Id']
            },
            {
                id: 'FK_UserRoles_Users',
                name: 'FK_UserRoles_Users',
                version: '1.0.0',
                type: 'dataConstraint',
                tableName: 'UserRoles',
                constraintType: 'ForeignKey',
                columnNames: ['UserId'],
                referencedTableName: 'Users',
                referencedColumnNames: ['Id'],
                deleteRule: 'Cascade',
                updateRule: 'Cascade'
            },
            {
                id: 'FK_UserRoles_Roles',
                name: 'FK_UserRoles_Roles',
                version: '1.0.0',
                type: 'dataConstraint',
                tableName: 'UserRoles',
                constraintType: 'ForeignKey',
                columnNames: ['RoleId'],
                referencedTableName: 'Roles',
                referencedColumnNames: ['Id'],
                deleteRule: 'Cascade',
                updateRule: 'Cascade'
            },
            {
                id: 'UK_UserRoles_UserRole',
                name: 'UK_UserRoles_UserRole',
                version: '1.0.0',
                type: 'dataConstraint',
                tableName: 'UserRoles',
                constraintType: 'Unique',
                columnNames: ['UserId', 'RoleId']
            }
        ]
    }
)

// ===========================
// 3. 定义数据关系
// ===========================

const userRoleRelations: DataRelation[] = [
    // 用户 -> 用户角色 (一对多)
    createDataRelation(
        'FK_UserRoles_Users',
        'Users',
        ['Id'],
        'UserRoles',
        ['UserId'],
        'OneToMany'
    ),

    // 角色 -> 用户角色 (一对多)
    createDataRelation(
        'FK_UserRoles_Roles',
        'Roles',
        ['Id'],
        'UserRoles',
        ['RoleId'],
        'OneToMany'
    )
]

// ===========================
// 4. 定义数据适配器
// ===========================

// 用户表数据适配器
const usersAdapter: DataAdapter = {
    id: 'UsersAdapter',
    name: '用户数据适配器',
    version: '1.0.0',
    type: 'dataAdapter',
    tableName: 'Users',

    // 查询命令
    selectCommand: {
        id: 'SelectUsers',
        name: '查询用户',
        version: '1.0.0',
        type: 'dataCommand',
        commandText: `
      SELECT Id, UserName, Email, FirstName, LastName, 
             IsActive, CreatedAt, UpdatedAt, LastLoginAt
      FROM Users 
      WHERE (@SearchText IS NULL OR 
             UserName LIKE '%' + @SearchText + '%' OR 
             Email LIKE '%' + @SearchText + '%' OR 
             FirstName LIKE '%' + @SearchText + '%' OR 
             LastName LIKE '%' + @SearchText + '%')
      ORDER BY CreatedAt DESC
    `,
        commandType: 'Text',
        parameters: [
            {
                id: 'SearchTextParam',
                name: 'SearchText参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@SearchText',
                dbType: 'string',
                direction: 'Input',
                size: 100
            }
        ]
    },

    // 插入命令
    insertCommand: {
        id: 'InsertUser',
        name: '插入用户',
        version: '1.0.0',
        type: 'dataCommand',
        commandText: `
      INSERT INTO Users (Id, UserName, Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt)
      VALUES (@Id, @UserName, @Email, @PasswordHash, @FirstName, @LastName, @IsActive, @CreatedAt)
    `,
        commandType: 'Text',
        parameters: [
            {
                id: 'IdParam',
                name: 'Id参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@Id',
                dbType: 'guid',
                direction: 'Input',
                sourceColumn: 'Id'
            },
            {
                id: 'UserNameParam',
                name: 'UserName参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@UserName',
                dbType: 'string',
                direction: 'Input',
                sourceColumn: 'UserName',
                size: 50
            },
            {
                id: 'EmailParam',
                name: 'Email参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@Email',
                dbType: 'string',
                direction: 'Input',
                sourceColumn: 'Email',
                size: 100
            },
            {
                id: 'PasswordHashParam',
                name: 'PasswordHash参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@PasswordHash',
                dbType: 'string',
                direction: 'Input',
                sourceColumn: 'PasswordHash',
                size: 255
            },
            {
                id: 'FirstNameParam',
                name: 'FirstName参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@FirstName',
                dbType: 'string',
                direction: 'Input',
                sourceColumn: 'FirstName',
                size: 50
            },
            {
                id: 'LastNameParam',
                name: 'LastName参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@LastName',
                dbType: 'string',
                direction: 'Input',
                sourceColumn: 'LastName',
                size: 50
            },
            {
                id: 'IsActiveParam',
                name: 'IsActive参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@IsActive',
                dbType: 'boolean',
                direction: 'Input',
                sourceColumn: 'IsActive'
            },
            {
                id: 'CreatedAtParam',
                name: 'CreatedAt参数',
                version: '1.0.0',
                type: 'dataParameter',
                parameterName: '@CreatedAt',
                dbType: 'datetime',
                direction: 'Input',
                sourceColumn: 'CreatedAt'
            }
        ]
    },

    // 更新命令
    updateCommand: {
        id: 'UpdateUser',
        name: '更新用户',
        version: '1.0.0',
        type: 'dataCommand',
        commandText: `
      UPDATE Users 
      SET UserName = @UserName,
          Email = @Email,
          FirstName = @FirstName,
          LastName = @LastName,
          IsActive = @IsActive,
          UpdatedAt = @UpdatedAt
      WHERE Id = @Id
    `,
        commandType: 'Text'
    },

    // 删除命令
    deleteCommand: {
        id: 'DeleteUser',
        name: '删除用户',
        version: '1.0.0',
        type: 'dataCommand',
        commandText: `DELETE FROM Users WHERE Id = @Id`,
        commandType: 'Text'
    },

    acceptChangesDuringFill: true,
    acceptChangesDuringUpdate: true,
    continueUpdateOnError: false,
    fillLoadOption: 'OverwriteChanges',
    missingMappingAction: 'Passthrough',
    missingSchemaAction: 'AddWithKey'
}

// ===========================
// 5. 创建页面数据集
// ===========================

export const userManagementDataSet: PageDataSet = createPageDataSet(
    'user-management-page',
    'UserManagementDataSet',
    [usersTable, rolesTable, userRolesTable],
    userRoleRelations
)

// 添加扩展属性
userManagementDataSet.extendedProperties = {
    'PageTitle': '用户管理',
    'Module': 'UserManagement',
    'RequiredPermissions': ['User.Read', 'User.Write'],
    'CacheTimeout': 300, // 5分钟缓存
    'DataAdapters': {
        'Users': usersAdapter
    }
}

// ===========================
// 6. 示例：数据操作方法
// ===========================

/**
 * 数据集操作工具类
 */
export class DataSetOperations {
    /**
     * 根据条件查询用户
     */
    static queryUsers(dataSet: PageDataSet, searchText?: string) {
        const usersTable = dataSet.tables.find(t => t.tableName === 'Users')
        if (!usersTable) return []

        let filteredRows = usersTable.rows || []

        if (searchText) {
            filteredRows = filteredRows.filter(row => {
                const values = row.values
                return (
                    values.UserName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    values.Email?.toLowerCase().includes(searchText.toLowerCase()) ||
                    values.FirstName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    values.LastName?.toLowerCase().includes(searchText.toLowerCase())
                )
            })
        }

        return filteredRows
    }

    /**
     * 获取用户的角色
     */
    static getUserRoles(dataSet: PageDataSet, userId: string) {
        const userRolesTable = dataSet.tables.find(t => t.tableName === 'UserRoles')
        const rolesTable = dataSet.tables.find(t => t.tableName === 'Roles')

        if (!userRolesTable || !rolesTable) return []

        // 查找用户角色关联
        const userRoleRows = (userRolesTable.rows || []).filter(
            row => row.values.UserId === userId
        )

        // 查找角色详情
        const roleIds = userRoleRows.map(row => row.values.RoleId)
        const roles = (rolesTable.rows || []).filter(
            row => roleIds.includes(row.values.Id)
        )

        return roles
    }

    /**
     * 验证数据完整性
     */
    static validateDataIntegrity(dataSet: PageDataSet): string[] {
        const errors: string[] = []

        // 检查外键约束
        for (const relation of dataSet.relations) {
            const parentTable = dataSet.tables.find(t => t.tableName === relation.parentTableName)
            const childTable = dataSet.tables.find(t => t.tableName === relation.childTableName)

            if (!parentTable || !childTable) {
                errors.push(`关系 ${relation.relationName} 引用的表不存在`)
                continue
            }

            // 检查子表中的外键是否在父表中存在
            for (const childRow of childTable.rows || []) {
                const childValues = relation.childColumnNames.map(col => childRow.values[col])
                const parentExists = (parentTable.rows || []).some(parentRow => {
                    const parentValues = relation.parentColumnNames.map(col => parentRow.values[col])
                    return parentValues.every((val, idx) => val === childValues[idx])
                })

                if (!parentExists) {
                    errors.push(`${relation.childTableName} 中存在无效的外键引用: ${childValues.join(', ')}`)
                }
            }
        }

        return errors
    }
}
