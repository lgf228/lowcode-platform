// ===========================
// DataGrid 工具栏功能演示
// ===========================

import { DataGridToolbarConfig } from '../../../src/core/types/Component'

/**
 * 工具栏功能演示类
 * 展示 DataGrid 工具栏的各种配置和功能
 */
export class DataGridToolbarDemo {

  /**
   * 演示基础工具栏配置
   * 包含最常用的功能：添加、刷新、导出、搜索、筛选
   */
  static getBasicToolbarDemo(): DataGridToolbarConfig {
    return {
      visible: true,
      position: 'top',
      align: 'space-between',
      size: 'medium',

      // 基础按钮
      add: {
        text: '新增',
        icon: 'plus',
        type: 'primary',
        tooltip: '添加新记录'
      },

      refresh: {
        text: '刷新',
        icon: 'reload',
        type: 'default',
        tooltip: '刷新数据'
      },

      export: {
        text: '导出',
        icon: 'download',
        type: 'default',
        formats: ['excel', 'csv'],
        includeHeaders: true
      },

      // 搜索和筛选
      search: {
        visible: true,
        placeholder: '请输入搜索关键词',
        clearable: true,
        debounce: 300
      },

      filter: {
        visible: true,
        showReset: true,
        autoApply: true
      },

      // 信息展示
      info: {
        visible: true,
        position: 'right',
        showTotal: true,
        totalText: '共 {total} 条记录'
      }
    }
  }

  /**
   * 演示高级工具栏配置
   * 包含批量操作、表格设置、自定义组件等高级功能
   */
  static getAdvancedToolbarDemo(): DataGridToolbarConfig {
    return {
      visible: true,
      position: 'top',
      align: 'space-between',
      size: 'medium',

      // 增强的基础按钮
      add: {
        text: '新增用户',
        icon: 'user-add',
        type: 'primary',
        tooltip: '添加新用户',
        modal: true,
        permission: 'user:create'
      },

      refresh: {
        text: '刷新',
        icon: 'reload',
        type: 'default',
        tooltip: '刷新用户列表',
        auto: true,
        interval: 60 // 60秒自动刷新
      },

      export: {
        text: '导出',
        icon: 'download',
        type: 'default',
        tooltip: '导出用户数据',
        formats: ['excel', 'csv', 'pdf'],
        fileName: '用户列表_{date}',
        includeHeaders: true,
        selectedOnly: false
      },

      // 增强搜索
      search: {
        visible: true,
        placeholder: '搜索用户名、邮箱、部门...',
        position: 'toolbar',
        size: 'medium',
        clearable: true,
        debounce: 500,
        enterSearch: true,
        searchFields: ['name', 'email', 'department'],
        fuzzySearch: true
      },

      // 增强筛选
      filter: {
        visible: true,
        position: 'toolbar',
        showReset: true,
        autoApply: true,
        filterMode: 'advanced',
        saveFilters: true,
        quickFilters: [
          { key: 'status', label: '活跃用户', value: 'active', icon: 'check-circle' },
          { key: 'status', label: '禁用用户', value: 'disabled', icon: 'stop' },
          { key: 'role', label: '管理员', value: 'admin', icon: 'crown' }
        ]
      },

      // 批量操作
      batchActions: {
        visible: true,
        position: 'toolbar',
        showCount: true,
        countText: '已选择 {count} 个用户',
        actions: [
          {
            key: 'enable',
            text: '批量启用',
            icon: 'check',
            type: 'primary',
            tooltip: '启用选中的用户',
            action: 'handleBatchEnable'
          },
          {
            key: 'disable',
            text: '批量禁用',
            icon: 'stop',
            type: 'warning',
            tooltip: '禁用选中的用户',
            confirm: {
              title: '确认禁用',
              content: '确定要禁用选中的用户吗？'
            },
            action: 'handleBatchDisable'
          },
          {
            key: 'delete',
            text: '批量删除',
            icon: 'delete',
            type: 'danger',
            tooltip: '删除选中的用户',
            confirm: {
              title: '确认删除',
              content: '删除后无法恢复，确定要删除选中的用户吗？'
            },
            action: 'handleBatchDelete'
          }
        ]
      },

      // 表格设置
      settings: {
        visible: true,
        icon: 'setting',
        tooltip: '表格设置',
        position: 'dropdown',
        features: {
          columnVisibility: true,
          columnOrder: true,
          columnWidth: true,
          pageSize: true,
          density: true,
          export: true,
          fullscreen: true
        }
      },

      // 信息展示
      info: {
        visible: true,
        position: 'left',
        showTotal: true,
        showSelected: true,
        showFiltered: true,
        totalText: '总计 {total} 个用户',
        selectedText: '已选择 {selected} 个',
        filteredText: '筛选后 {filtered} 个'
      },

      // 自定义工具栏项目
      custom: [
        {
          key: 'department-select',
          type: 'select',
          position: 'left',
          order: 1,
          selectProps: {
            placeholder: '选择部门',
            clearable: true,
            options: [
              { label: '技术部', value: 'tech' },
              { label: '销售部', value: 'sales' },
              { label: '市场部', value: 'marketing' },
              { label: '人事部', value: 'hr' }
            ],
            width: 120
          },
          onChange: 'handleDepartmentFilter'
        },
        {
          key: 'status-dropdown',
          type: 'dropdown',
          position: 'left',
          order: 2,
          text: '状态',
          icon: 'filter',
          buttonType: 'ghost',
          dropdownItems: [
            { key: 'all', text: '全部状态', action: 'handleStatusFilter' },
            { key: 'active', text: '活跃', action: 'handleStatusFilter' },
            { key: 'inactive', text: '非活跃', action: 'handleStatusFilter' },
            { key: 'disabled', text: '已禁用', action: 'handleStatusFilter' }
          ]
        },
        {
          key: 'advanced-ops',
          type: 'button',
          position: 'right',
          order: 3,
          text: '高级操作',
          icon: 'more',
          buttonType: 'ghost',
          tooltip: '更多操作选项',
          action: 'handleAdvancedOperations'
        }
      ],

      // 样式配置
      style: {
        backgroundColor: '#fafafa',
        borderColor: '#d9d9d9',
        padding: '12px 16px',
        borderRadius: '6px 6px 0 0'
      },

      // 响应式配置
      responsive: {
        breakpoints: {
          xs: { visible: true, collapsed: true },
          sm: { visible: true, collapsed: false },
          md: { visible: true, collapsed: false },
          lg: { visible: true, collapsed: false },
          xl: { visible: true, collapsed: false }
        },
        collapseThreshold: 768,
        collapsedItems: ['export', 'settings', 'custom']
      }
    }
  }

  /**
   * 演示移动端优化的工具栏配置
   * 适用于小屏幕设备，功能精简、界面紧凑
   */
  static getMobileToolbarDemo(): DataGridToolbarConfig {
    return {
      visible: true,
      position: 'top',
      align: 'center',
      size: 'small',

      // 精简的按钮配置
      add: {
        icon: 'plus',
        type: 'primary',
        size: 'small',
        tooltip: '新增'
      },

      refresh: {
        icon: 'reload',
        type: 'default',
        size: 'small',
        tooltip: '刷新'
      },

      export: {
        icon: 'download',
        type: 'default',
        size: 'small',
        tooltip: '导出',
        formats: ['excel', 'csv']
      },

      // 简化搜索
      search: {
        visible: true,
        placeholder: '搜索...',
        position: 'toolbar',
        size: 'small',
        clearable: true
      },

      // 精简设置
      settings: {
        visible: true,
        icon: 'setting',
        tooltip: '设置',
        features: {
          columnVisibility: true,
          density: true
        }
      },

      // 基础信息
      info: {
        visible: true,
        position: 'center',
        showTotal: true,
        totalText: '{total} 条'
      },

      // 响应式优化
      responsive: {
        breakpoints: {
          xs: { visible: true, collapsed: true },
          sm: { visible: true, collapsed: false }
        },
        collapseThreshold: 480,
        collapsedItems: ['export', 'settings']
      }
    }
  }

  /**
   * 演示只读模式的工具栏配置
   * 适用于数据展示场景，不包含编辑功能
   */
  static getReadonlyToolbarDemo(): DataGridToolbarConfig {
    return {
      visible: true,
      position: 'top',
      align: 'space-between',
      size: 'medium',

      // 只保留查看相关功能
      refresh: {
        text: '刷新',
        icon: 'reload',
        type: 'default',
        tooltip: '刷新数据'
      },

      export: {
        text: '导出',
        icon: 'download',
        type: 'default',
        tooltip: '导出数据',
        formats: ['excel', 'csv', 'pdf'],
        includeHeaders: true
      },

      search: {
        visible: true,
        placeholder: '搜索数据...',
        clearable: true,
        debounce: 300
      },

      filter: {
        visible: true,
        showReset: true,
        autoApply: true
      },

      settings: {
        visible: true,
        icon: 'setting',
        tooltip: '显示设置',
        features: {
          columnVisibility: true,
          columnOrder: true,
          density: true,
          export: true,
          fullscreen: true
        }
      },

      info: {
        visible: true,
        position: 'right',
        showTotal: true,
        showFiltered: true,
        totalText: '共 {total} 条数据',
        filteredText: '筛选后 {filtered} 条'
      }
    }
  }

  /**
   * 演示简约风格的工具栏配置
   * 最精简的功能配置，适用于空间受限的场景
   */
  static getMinimalToolbarDemo(): DataGridToolbarConfig {
    return {
      visible: true,
      position: 'top',
      align: 'left',
      size: 'small',

      // 最基础的功能
      add: true,
      refresh: true,
      search: true,

      info: {
        visible: true,
        position: 'right',
        showTotal: true,
        totalText: '{total} 条'
      }
    }
  }

  /**
   * 演示企业级工具栏配置
   * 包含完整的权限控制、审计日志等企业功能
   */
  static getEnterpriseToolbarDemo(): DataGridToolbarConfig {
    return {
      visible: true,
      position: 'top',
      align: 'space-between',
      size: 'medium',

      add: {
        text: '新增',
        icon: 'plus',
        type: 'primary',
        tooltip: '新增记录',
        permission: 'data:create',
        modal: true
      },

      refresh: {
        text: '刷新',
        icon: 'reload',
        type: 'default',
        tooltip: '刷新数据',
        auto: true,
        interval: 120
      },

      export: {
        text: '导出',
        icon: 'download',
        type: 'default',
        tooltip: '导出数据',
        permission: 'data:export',
        formats: ['excel', 'csv'],
        includeHeaders: true
      },

      search: {
        visible: true,
        placeholder: '输入关键词搜索...',
        clearable: true,
        debounce: 500,
        fuzzySearch: true
      },

      filter: {
        visible: true,
        showReset: true,
        autoApply: true,
        filterMode: 'advanced',
        saveFilters: true
      },

      batchActions: {
        visible: true,
        showCount: true,
        countText: '已选择 {count} 项',
        actions: [
          {
            key: 'audit',
            text: '审计日志',
            icon: 'file-text',
            type: 'default',
            permission: 'audit:view',
            action: 'viewAuditLog'
          },
          {
            key: 'archive',
            text: '批量归档',
            icon: 'archive',
            type: 'warning',
            permission: 'data:archive',
            confirm: {
              title: '确认归档',
              content: '归档后数据将移至历史库，确认操作？'
            },
            action: 'batchArchive'
          }
        ]
      },

      settings: {
        visible: true,
        icon: 'setting',
        tooltip: '系统设置',
        features: {
          columnVisibility: true,
          columnOrder: true,
          columnWidth: true,
          pageSize: true,
          density: true,
          export: true,
          print: true,
          fullscreen: true
        }
      },

      custom: [
        {
          key: 'audit-trail',
          type: 'button',
          position: 'right',
          text: '审计追踪',
          icon: 'eye',
          buttonType: 'ghost',
          permission: 'audit:view',
          action: 'openAuditTrail'
        },
        {
          key: 'data-quality',
          type: 'button',
          position: 'right',
          text: '数据质量',
          icon: 'check-circle',
          buttonType: 'ghost',
          permission: 'data:quality',
          action: 'checkDataQuality'
        }
      ],

      info: {
        visible: true,
        position: 'left',
        showTotal: true,
        showSelected: true,
        showFiltered: true,
        totalText: '总计: {total}',
        selectedText: '选中: {selected}',
        filteredText: '筛选: {filtered}'
      }
    }
  }
}

/**
 * 工具栏事件处理示例
 */
export class ToolbarEventHandlers {

  // 基础操作事件
  static handleAdd = (event: any) => {
    console.log('添加操作', event)
    // 实现添加逻辑
  }

  static handleRefresh = (event: any) => {
    console.log('刷新操作', event)
    // 实现刷新逻辑
  }

  static handleExport = (event: any) => {
    console.log('导出操作', event)
    // 实现导出逻辑
  }

  // 搜索和筛选事件
  static handleSearch = (keyword: string) => {
    console.log('搜索操作', keyword)
    // 实现搜索逻辑
  }

  static handleFilter = (filters: Record<string, any>) => {
    console.log('筛选操作', filters)
    // 实现筛选逻辑
  }

  static handleQuickFilter = (filterKey: string, filterValue: any) => {
    console.log('快速筛选', filterKey, filterValue)
    // 实现快速筛选逻辑
  }

  // 批量操作事件
  static handleBatchEnable = (selectedRows: any[]) => {
    console.log('批量启用', selectedRows)
    // 实现批量启用逻辑
  }

  static handleBatchDisable = (selectedRows: any[]) => {
    console.log('批量禁用', selectedRows)
    // 实现批量禁用逻辑
  }

  static handleBatchDelete = (selectedRows: any[]) => {
    console.log('批量删除', selectedRows)
    // 实现批量删除逻辑
  }

  // 设置变化事件
  static handleColumnVisibilityChange = (columnKey: string, visible: boolean) => {
    console.log('列可见性变化', columnKey, visible)
    // 实现列可见性变化逻辑
  }

  static handleDensityChange = (density: 'compact' | 'middle' | 'comfortable') => {
    console.log('表格密度变化', density)
    // 实现密度变化逻辑
  }

  static handleFullscreenToggle = (isFullscreen: boolean) => {
    console.log('全屏切换', isFullscreen)
    // 实现全屏切换逻辑
  }

  // 自定义事件
  static handleDepartmentFilter = (department: string) => {
    console.log('部门筛选', department)
    // 实现部门筛选逻辑
  }

  static handleStatusFilter = (status: string) => {
    console.log('状态筛选', status)
    // 实现状态筛选逻辑
  }

  static handleAdvancedOperations = () => {
    console.log('高级操作')
    // 实现高级操作逻辑
  }
}

// 导出演示配置
export const toolbarDemos = {
  basic: DataGridToolbarDemo.getBasicToolbarDemo(),
  advanced: DataGridToolbarDemo.getAdvancedToolbarDemo(),
  mobile: DataGridToolbarDemo.getMobileToolbarDemo(),
  readonly: DataGridToolbarDemo.getReadonlyToolbarDemo(),
  minimal: DataGridToolbarDemo.getMinimalToolbarDemo(),
  enterprise: DataGridToolbarDemo.getEnterpriseToolbarDemo()
}
