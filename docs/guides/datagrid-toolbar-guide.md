# DataGrid 工具栏功能详解

## 概述

DataGrid 组件的工具栏功能提供了丰富的用户交互能力，包括数据操作、搜索筛选、批量处理、设置管理等功能。工具栏支持高度自定义和响应式设计。

## 🔧 核心功能

### 1. 基础工具按钮

#### 添加按钮 (add)

- **功能**: 创建新记录
- **配置选项**: 文本、图标、按钮类型、权限控制、模态框支持
- **示例**:

```typescript
add: {
  text: '新增用户',
  icon: 'user-add',
  type: 'primary',
  tooltip: '添加新用户',
  modal: true,
  permission: 'user:create'
}
```

#### 刷新按钮 (refresh)

- **功能**: 重新加载数据
- **配置选项**: 自动刷新、刷新间隔、加载状态
- **示例**:

```typescript
refresh: {
  text: '刷新',
  icon: 'reload',
  auto: true,
  interval: 30, // 30秒自动刷新
  tooltip: '刷新数据'
}
```

#### 导出按钮 (export)

- **功能**: 导出表格数据
- **支持格式**: Excel、CSV、PDF、JSON
- **配置选项**: 文件名、包含表头、仅导出选中行
- **示例**:

```typescript
export: {
  text: '导出',
  formats: ['excel', 'csv', 'pdf'],
  fileName: '用户数据',
  includeHeaders: true,
  selectedOnly: false
}
```

### 2. 搜索功能 (search)

#### 基础搜索

```typescript
search: {
  visible: true,
  placeholder: '请输入搜索关键词',
  clearable: true,
  debounce: 300
}
```

#### 高级搜索

```typescript
search: {
  visible: true,
  placeholder: '搜索用户名、邮箱、部门...',
  position: 'toolbar',
  searchFields: ['name', 'email', 'department'],
  fuzzySearch: true,
  caseSensitive: false
}
```

### 3. 筛选功能 (filter)

#### 基础筛选

```typescript
filter: {
  visible: true,
  position: 'toolbar',
  showReset: true,
  autoApply: true
}
```

#### 快速筛选

```typescript
filter: {
  visible: true,
  quickFilters: [
    { key: 'status', label: '活跃用户', value: 'active', icon: 'check-circle' },
    { key: 'status', label: '禁用用户', value: 'disabled', icon: 'stop' },
    { key: 'role', label: '管理员', value: 'admin', icon: 'crown' }
  ]
}
```

### 4. 批量操作 (batchActions)

```typescript
batchActions: {
  visible: true,
  showCount: true,
  countText: '已选择 {count} 个用户',
  actions: [
    {
      key: 'enable',
      text: '批量启用',
      icon: 'check',
      type: 'primary',
      action: 'handleBatchEnable'
    },
    {
      key: 'delete',
      text: '批量删除',
      icon: 'delete',
      type: 'danger',
      confirm: {
        title: '确认删除',
        content: '删除后无法恢复，确定要删除选中的用户吗？'
      },
      action: 'handleBatchDelete'
    }
  ]
}
```

### 5. 表格设置 (settings)

```typescript
settings: {
  visible: true,
  icon: 'setting',
  tooltip: '表格设置',
  features: {
    columnVisibility: true,  // 列显示/隐藏
    columnOrder: true,       // 列排序
    columnWidth: true,       // 列宽调整
    pageSize: true,          // 页面大小设置
    density: true,           // 表格密度
    export: true,            // 导出设置
    print: true,             // 打印设置
    fullscreen: true         // 全屏模式
  }
}
```

### 6. 信息展示 (info)

```typescript
info: {
  visible: true,
  position: 'right',
  showTotal: true,
  showSelected: true,
  showFiltered: true,
  totalText: '总计 {total} 个用户',
  selectedText: '已选择 {selected} 个',
  filteredText: '筛选后 {filtered} 个'
}
```

### 7. 自定义工具栏项目 (custom)

#### 按钮类型

```typescript
{
  key: 'custom-action',
  type: 'button',
  text: '自定义操作',
  icon: 'setting',
  buttonType: 'primary',
  action: 'handleCustomAction'
}
```

#### 下拉菜单类型

```typescript
{
  key: 'status-menu',
  type: 'dropdown',
  text: '状态操作',
  dropdownItems: [
    { key: 'all', text: '显示全部', action: 'showAll' },
    { key: 'active', text: '仅显示活跃', action: 'showActive' },
    { key: 'inactive', text: '仅显示非活跃', action: 'showInactive' }
  ]
}
```

#### 输入框类型

```typescript
{
  key: 'quick-search',
  type: 'input',
  inputProps: {
    placeholder: '快速搜索',
    clearable: true,
    width: 200
  },
  onChange: 'handleQuickSearch'
}
```

#### 选择器类型

```typescript
{
  key: 'department',
  type: 'select',
  selectProps: {
    placeholder: '选择部门',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '销售部', value: 'sales' }
    ],
    clearable: true
  },
  onChange: 'handleDepartmentFilter'
}
```

#### 自定义组件类型

```typescript
{
  key: 'stats-widget',
  type: 'component',
  componentId: 'UserStatsWidget',
  componentProps: {
    showOnlineCount: true,
    refreshInterval: 10000
  }
}
```

## 🎨 样式配置

### 工具栏整体样式

```typescript
style: {
  backgroundColor: '#fafafa',
  borderColor: '#d9d9d9',
  padding: '8px 16px',
  borderRadius: '6px 6px 0 0',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
}
```

### 位置和对齐

```typescript
{
  position: 'top',              // 'top' | 'bottom' | 'both'
  align: 'space-between',       // 'left' | 'center' | 'right' | 'space-between'
  size: 'medium'                // 'small' | 'medium' | 'large'
}
```

## 📱 响应式设计

```typescript
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
```

## 🔗 事件处理

### 工具栏相关事件

- `onToolbarAction`: 工具栏操作事件
- `onBatchAction`: 批量操作事件  
- `onSettingsChange`: 设置变化事件
- `onFilterReset`: 筛选重置事件
- `onSearchClear`: 搜索清空事件
- `onQuickFilter`: 快速筛选事件
- `onColumnVisibilityChange`: 列显示/隐藏变化事件
- `onColumnOrderChange`: 列顺序变化事件
- `onDensityChange`: 表格密度变化事件
- `onFullscreenToggle`: 全屏切换事件

### 事件参数说明

```typescript
// 工具栏操作事件
interface ToolbarActionEvent {
  action: string;           // 操作类型
  data?: any;              // 操作数据
  target: string;          // 目标元素
}

// 批量操作事件
interface BatchActionEvent {
  action: string;           // 批量操作类型
  selectedRows: any[];      // 选中的行数据
  selectedKeys: (string | number)[]; // 选中的行键
}

// 设置变化事件
interface SettingsChangeEvent {
  setting: string;          // 设置项名称
  value: any;              // 新值
  oldValue: any;           // 旧值
}
```

## 📦 使用示例

### 基础用法

```typescript
const basicToolbar: DataGridToolbarConfig = {
  visible: true,
  add: true,
  refresh: true,
  export: true,
  search: true,
  filter: true,
  settings: true
}
```

### 高级用法

```typescript
const advancedToolbar: DataGridToolbarConfig = {
  visible: true,
  position: 'top',
  align: 'space-between',
  
  add: {
    text: '新增用户',
    icon: 'user-add',
    type: 'primary',
    modal: true
  },
  
  search: {
    placeholder: '搜索用户名、邮箱...',
    searchFields: ['name', 'email'],
    fuzzySearch: true
  },
  
  batchActions: {
    visible: true,
    actions: [
      {
        key: 'export-selected',
        text: '导出选中',
        icon: 'download',
        action: 'exportSelected'
      }
    ]
  },
  
  custom: [
    {
      key: 'department-filter',
      type: 'select',
      selectProps: {
        placeholder: '选择部门',
        options: departmentOptions
      }
    }
  ]
}
```

## 🚀 最佳实践

### 1. 功能组织

- 将相关功能分组放置
- 常用功能放在显眼位置
- 保持工具栏简洁，避免功能过载

### 2. 响应式设计

- 在小屏幕上适当隐藏或折叠功能
- 使用图标节省空间
- 提供触摸友好的交互

### 3. 用户体验

- 提供清晰的图标和文本标签
- 使用提示文本帮助用户理解功能
- 对危险操作提供确认对话框

### 4. 性能优化

- 使用防抖处理搜索输入
- 延迟加载复杂的自定义组件
- 避免在工具栏中放置重型组件

### 5. 权限控制

- 根据用户权限显示/隐藏相应功能
- 提供细粒度的权限控制
- 优雅地处理权限不足的情况

## 🔧 扩展开发

### 自定义工具栏组件

```typescript
// 创建自定义统计组件
export const UserStatsWidget: React.FC<{
  showOnlineCount?: boolean;
  refreshInterval?: number;
}> = ({ showOnlineCount, refreshInterval }) => {
  // 组件实现
  return (
    <div className="user-stats-widget">
      {/* 统计信息显示 */}
    </div>
  );
};

// 在工具栏中使用
{
  key: 'user-stats',
  type: 'component',
  componentId: 'UserStatsWidget',
  componentProps: {
    showOnlineCount: true,
    refreshInterval: 5000
  }
}
```

### 自定义工具栏样式

```scss
.datagrid-toolbar {
  &.custom-theme {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .toolbar-button {
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
```

通过这些丰富的工具栏功能，DataGrid 组件可以满足各种复杂的业务场景需求，提供卓越的用户体验。
