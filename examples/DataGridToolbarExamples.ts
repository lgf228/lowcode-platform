// ===========================
// DataGrid 工具栏配置示例
// ===========================

import { DataGridComponent, DataGridToolbarConfig, ComponentType, ColumnComponent } from '../src/core/types/Component'

/**
 * 基础工具栏配置示例
 */
export const basicToolbarConfig: DataGridToolbarConfig = {
  visible: true,
  position: 'top',
  align: 'space-between',
  size: 'medium',

  // 基础功能按钮
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
    tooltip: '导出数据',
    formats: ['excel', 'csv'],
    includeHeaders: true
  },

  // 搜索功能
  search: {
    visible: true,
    placeholder: '请输入搜索关键词',
    position: 'toolbar',
    clearable: true,
    debounce: 300
  },

  // 筛选功能
  filter: {
    visible: true,
    position: 'toolbar',
    showReset: true,
    autoApply: true
  },

  // 表格设置
  settings: {
    visible: true,
    icon: 'setting',
    tooltip: '表格设置',
    features: {
      columnVisibility: true,
      columnOrder: true,
      density: true,
      pageSize: true
    }
  },

  // 信息展示
  info: {
    visible: true,
    position: 'right',
    showTotal: true,
    showSelected: true,
    totalText: '共 {total} 条',
    selectedText: '已选 {selected} 条'
  }
}

/**
 * 高级工具栏配置示例 - 包含批量操作和自定义按钮
 */
export const advancedToolbarConfig: DataGridToolbarConfig = {
  visible: true,
  position: 'top',
  align: 'space-between',
  size: 'medium',

  // 添加按钮配置
  add: {
    text: '新增用户',
    icon: 'user-add',
    type: 'primary',
    tooltip: '添加新用户',
    modal: true
  },

  // 刷新按钮配置
  refresh: {
    text: '刷新',
    icon: 'reload',
    type: 'default',
    tooltip: '刷新用户列表',
    auto: true,
    interval: 30
  },

  // 导出按钮配置
  export: {
    text: '导出',
    icon: 'download',
    type: 'default',
    tooltip: '导出用户数据',
    formats: ['excel', 'csv', 'pdf'],
    fileName: '用户列表',
    includeHeaders: true,
    selectedOnly: false
  },

  // 高级搜索配置
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

  // 高级筛选配置
  filter: {
    visible: true,
    position: 'toolbar',
    showReset: true,
    showApply: false,
    autoApply: true,
    filterMode: 'advanced',
    saveFilters: true,
    quickFilters: [
      { key: 'status', label: '活跃用户', value: 'active', icon: 'check-circle' },
      { key: 'status', label: '禁用用户', value: 'disabled', icon: 'stop' },
      { key: 'role', label: '管理员', value: 'admin', icon: 'crown' }
    ]
  },

  // 批量操作配置
  batchActions: {
    visible: true,
    position: 'toolbar',
    showCount: true,
    countText: '已选择 {count} 个用户',
    actions: [
      {
        key: 'enable',
        text: '启用',
        icon: 'check',
        type: 'primary',
        tooltip: '启用选中的用户',
        action: 'handleBatchEnable'
      },
      {
        key: 'disable',
        text: '禁用',
        icon: 'stop',
        type: 'warning',
        tooltip: '禁用选中的用户',
        confirm: {
          title: '确认禁用',
          content: '确定要禁用选中的用户吗？',
          okText: '确认',
          cancelText: '取消'
        },
        action: 'handleBatchDisable'
      },
      {
        key: 'delete',
        text: '删除',
        icon: 'delete',
        type: 'danger',
        tooltip: '删除选中的用户',
        confirm: {
          title: '确认删除',
          content: '删除后无法恢复，确定要删除选中的用户吗？',
          okText: '确认删除',
          cancelText: '取消'
        },
        action: 'handleBatchDelete'
      }
    ]
  },

  // 表格设置配置
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
      print: true,
      fullscreen: true
    }
  },

  // 信息展示配置
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
    // 部门选择器
    {
      key: 'department',
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

    // 状态快速切换
    {
      key: 'status-toggle',
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

    // 高级操作按钮
    {
      key: 'advanced',
      type: 'button',
      position: 'right',
      order: 3,
      text: '高级操作',
      icon: 'more',
      buttonType: 'ghost',
      tooltip: '更多操作选项',
      action: 'handleAdvancedActions'
    },

    // 自定义组件示例
    {
      key: 'custom-widget',
      type: 'component',
      position: 'right',
      order: 4,
      componentId: 'UserStatsWidget',
      componentProps: {
        showOnlineCount: true,
        refreshInterval: 10000
      }
    }
  ],

  // 工具栏样式配置
  style: {
    backgroundColor: '#fafafa',
    borderColor: '#d9d9d9',
    padding: '8px 16px',
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

/**
 * 简化工具栏配置示例 - 适用于移动端或简单场景
 */
export const simpleToolbarConfig: DataGridToolbarConfig = {
  visible: true,
  position: 'top',
  align: 'center',
  size: 'small',

  add: true,
  refresh: true,
  search: true,

  settings: {
    visible: true,
    features: {
      columnVisibility: true,
      density: true
    }
  },

  info: {
    visible: true,
    position: 'center',
    showTotal: true
  }
}

/**
 * 只读模式工具栏配置 - 适用于数据展示场景
 */
export const readonlyToolbarConfig: DataGridToolbarConfig = {
  visible: true,
  position: 'top',
  align: 'space-between',
  size: 'medium',

  // 只保留查看相关功能
  refresh: true,
  export: true,
  search: true,
  filter: true,

  settings: {
    visible: true,
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
    showFiltered: true
  }
}

/**
 * 完整的 DataGrid 组件配置示例
 */
export const sampleDataGridComponent: Partial<DataGridComponent> = {
  id: 'user-grid',
  type: ComponentType.DATA_GRID,

  // 基础配置
  dataLevel: 'table',
  datamember: 'users',

  // 列配置
  columns: [
    {
      id: 'name-col',
      name: 'name-col',
      version: '1.0.0',
      type: ComponentType.TEXT_COLUMN,
      dataKey: 'name',
      title: '姓名',
      width: 120,
      sortable: true,
      filterable: true
    } as any,
    {
      id: 'email-col',
      name: 'email-col',
      version: '1.0.0',
      type: ComponentType.TEXT_COLUMN,
      dataKey: 'email',
      title: '邮箱',
      width: 200,
      sortable: true,
      filterable: true
    } as any,
    {
      id: 'status-col',
      name: 'status-col',
      version: '1.0.0',
      type: ComponentType.VALUE_COLUMN,
      dataKey: 'status',
      title: '状态',
      width: 100,
      sortable: true,
      filterable: true
    } as any,
    {
      id: 'actions-col',
      name: 'actions-col',
      version: '1.0.0',
      type: ComponentType.ACTION_COLUMN,
      dataKey: 'actions',
      title: '操作',
      width: 150,
      actions: [
        {
          key: 'edit',
          text: '编辑',
          icon: 'edit',
          type: 'primary',
          onClick: 'handleEdit'
        },
        {
          key: 'delete',
          text: '删除',
          icon: 'delete',
          type: 'danger',
          onClick: 'handleDelete',
          confirm: {
            title: '确认删除',
            content: '确定要删除这个用户吗？'
          }
        }
      ]
    } as any
  ],

  // 工具栏配置
  toolbar: advancedToolbarConfig,

  // 分页配置
  pagination: true,
  pageSize: 20,
  showSizeChanger: true,

  // 行选择配置
  rowSelection: {
    type: 'multiple',
    showSelectAll: true
  },

  // 表格样式配置
  size: 'middle',
  bordered: true,
  sticky: true,

  // 事件处理
  onAdd: 'handleAdd',
  onEdit: 'handleEdit',
  onDelete: 'handleDelete',
  onRefresh: 'handleRefresh',
  onExport: 'handleExport',
  onSearch: 'handleSearch',
  onFilter: 'handleFilter',
  onBatchAction: 'handleBatchAction',
  onSettingsChange: 'handleSettingsChange'
}
