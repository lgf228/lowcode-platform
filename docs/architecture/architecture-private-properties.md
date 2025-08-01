# 组件属性私有化架构改进

## 概述

本次改进将组件体系中的非描述类和配置的属性进行了私有化处理，提高了系统的封装性和安全性。

## 私有化原则

### 1. 什么应该私有化

- **运行时状态** - 组件在运行过程中产生的内部状态
- **计算属性** - 由其他属性计算得出的衍生状态
- **缓存数据** - 用于性能优化的内部缓存信息
- **内部计数器** - 如渲染次数、验证次数等统计信息
- **临时状态** - 如悬停状态、焦点状态等交互状态

### 2. 什么应该保持公开

- **配置属性** - 用户可以设置的配置选项
- **事件处理器** - 用户定义的事件回调
- **样式配置** - 用户可以自定义的样式属性
- **数据绑定配置** - 数据源和字段映射等配置

## 具体改进内容

### 1. StateMixin - 状态混入接口

**私有化属性：**

```typescript
readonly _internalState?: {
  readonly hover?: boolean          // 悬停状态
  readonly focus?: boolean          // 焦点状态
  readonly active?: boolean         // 激活状态
  readonly error?: boolean          // 错误状态
  readonly initialized?: boolean    // 初始化状态
  readonly mounted?: boolean        // 挂载状态
}
```

**保持公开：**

- `loading` - 加载状态配置
- `disabled` - 禁用状态配置
- `visible` - 可见性配置
- `readonly` - 只读配置

### 2. ValidationMixin - 验证混入接口

**私有化属性：**

```typescript
readonly _validationState?: {
  readonly isValid?: boolean           // 验证结果
  readonly errors?: readonly string[]   // 错误消息
  readonly warnings?: readonly string[] // 警告消息
  readonly touched?: boolean           // 触摸状态
  readonly dirty?: boolean             // 修改状态
  readonly validating?: boolean        // 验证中状态
  readonly lastValidation?: Date       // 最后验证时间
}
```

**保持公开：**

- `rules` - 验证规则配置
- `validateOnChange` - 验证触发配置
- `validateOnBlur` - 失焦验证配置
- `showValidationIcon` - 验证图标显示配置

### 3. PerformanceMixin - 性能优化混入接口

**私有化属性：**

```typescript
readonly _performanceState?: {
  readonly renderCount?: number        // 渲染次数
  readonly lastRenderTime?: Date       // 最后渲染时间
  readonly cacheHits?: number          // 缓存命中次数
  readonly cacheMisses?: number        // 缓存未命中次数
  readonly isLazyLoaded?: boolean      // 懒加载状态
  readonly virtualizedRange?: { start: number; end: number } // 虚拟化范围
}
```

**保持公开：**

- `memo` - React.memo 优化配置
- `lazy` - 懒加载配置
- `virtualization` - 虚拟化配置
- `cache` - 缓存策略配置

### 4. DataBinding - 数据绑定接口

**私有化属性：**

```typescript
readonly _dataState?: {
  readonly loading?: boolean       // 数据加载状态
  readonly error?: string          // 错误信息
  readonly empty?: boolean         // 空数据状态
  readonly total?: number          // 数据总数
  readonly current?: number        // 当前索引
  readonly lastUpdated?: Date      // 最后更新时间
  readonly version?: number        // 数据版本号
  readonly isDirty?: boolean       // 数据修改状态
}
```

**保持公开：**

- `datamember` - 数据成员配置
- `dataLevel` - 数据级别配置
- `onDataLoad` - 数据加载事件
- `onDataChange` - 数据变化事件

### 5. Container - 容器组件接口

**私有化属性：**

```typescript
readonly _containerState?: {
  readonly empty?: boolean                    // 空状态
  readonly childrenCount?: number             // 子组件数量
  readonly renderOrder?: readonly string[]    // 渲染顺序
  readonly scrollPosition?: { x: number; y: number } // 滚动位置
  readonly isOverflowing?: boolean            // 溢出状态
}
```

### 6. OptionDataSource - 选项数据源接口

**私有化属性：**

```typescript
readonly _optionState?: {
  readonly options?: readonly any[]           // 选项列表
  readonly filteredOptions?: readonly any[]   // 过滤后选项
  readonly selectedValues?: readonly any[]    // 选中值
  readonly searchKeyword?: string             // 搜索关键词
  readonly loadedTime?: Date                  // 加载时间
}
```

### 7. ValueComponent - 值组件接口

**私有化属性：**

```typescript
readonly _valueState?: {
  readonly previousValue?: any        // 上一个值
  readonly originalValue?: any        // 原始值
  readonly formattedValue?: string    // 格式化值
  readonly isValueChanged?: boolean   // 值变化状态
  readonly lastChangeTime?: Date      // 最后修改时间
  readonly changeCount?: number       // 修改次数
}
```

### 8. FormComponent - 表单组件实例

**私有化属性：**

```typescript
readonly _formState?: {
  readonly isSubmitting?: boolean              // 提交状态
  readonly isDirty?: boolean                   // 修改状态
  readonly isValid?: boolean                   // 有效状态
  readonly fieldErrors?: Record<string, readonly string[]> // 字段错误
  readonly touchedFields?: readonly string[]   // 触摸字段
  readonly changedFields?: readonly string[]   // 修改字段
  readonly lastSubmitTime?: Date               // 最后提交时间
  readonly submitCount?: number                // 提交次数
}
```

### 9. DataGridComponent - 数据网格组件实例

**私有化属性：**

```typescript
readonly _gridState?: {
  readonly currentSort?: { column: string; direction: 'asc' | 'desc' }[] // 排序状态
  readonly currentFilters?: Record<string, any>  // 筛选状态
  readonly searchKeyword?: string                // 搜索关键词
  readonly expandedRows?: readonly (string | number)[] // 展开行
  readonly hoveredRow?: string | number          // 悬停行
  readonly editingCell?: { row: string | number; column: string } // 编辑单元格
}
```

## 设计优势

### 1. 封装性 (Encapsulation)

- **内部状态保护** - 防止外部直接修改内部运行时状态
- **接口清晰** - 明确区分配置属性和运行时状态
- **减少耦合** - 内部实现变化不影响外部使用

### 2. 安全性 (Security)

- **只读保护** - 所有私有状态使用 `readonly` 修饰符
- **类型安全** - TypeScript 编译时检查防止误用
- **状态一致性** - 避免外部直接修改导致的状态不一致

### 3. 可维护性 (Maintainability)

- **清晰边界** - 公开配置与私有状态界限分明
- **易于理解** - 开发者可以清楚知道哪些属性可以配置
- **向后兼容** - 私有状态变化不影响公开接口

### 4. 性能优化 (Performance)

- **状态追踪** - 私有状态便于实现智能更新和缓存
- **调试支持** - 运行时状态有助于性能分析和问题诊断
- **优化策略** - 内部状态支持各种性能优化策略

## 使用示例

### 1. 配置组件（公开属性）

```typescript
const formConfig: FormComponent = {
  type: ComponentType.FORM,
  dataLevel: 'row',
  formLayout: 'vertical',
  validateOnChange: true,
  showSubmitButton: true,
  children: [/* 子组件 */]
  // _formState 无法直接设置，由系统内部管理
}
```

### 2. 访问运行时状态（只读）

```typescript
// 在组件内部或管理器中
if (component._formState?.isSubmitting) {
  // 处理提交中状态
}

if (component._validationState?.errors?.length > 0) {
  // 处理验证错误
}
```

### 3. 状态更新（通过专门的方法）

```typescript
// 通过组件管理器或专门的状态更新方法
formManager.updateFormState(formId, {
  isSubmitting: true,
  lastSubmitTime: new Date()
})
```

## 最佳实践

### 1. 命名约定

- 私有状态属性统一使用 `_` 前缀
- 内部状态对象使用描述性后缀（如 `State`、`Internal`）
- 保持命名的一致性和可读性

### 2. 访问控制

- 私有状态仅供框架内部和调试使用
- 应用代码应避免直接访问私有状态
- 提供专门的状态查询方法和更新方法

### 3. 文档说明

- 在接口注释中明确标注私有属性的用途
- 说明哪些属性是配置，哪些是运行时状态
- 提供状态转换和生命周期的说明

### 4. 类型安全

- 使用 `readonly` 确保状态不可变性
- 使用数组的 `readonly` 版本防止修改
- 利用 TypeScript 的类型系统进行约束

## 总结

通过这次私有化改进，我们实现了：

1. **更好的封装性** - 清楚区分了配置属性和运行时状态
2. **更高的安全性** - 防止了外部对内部状态的直接修改
3. **更强的类型安全** - 利用 TypeScript 的只读特性
4. **更清晰的接口** - 开发者可以明确知道哪些属性可以配置

这种设计模式符合面向对象的最佳实践，为低代码平台提供了更可靠、更易维护的组件体系架构。
