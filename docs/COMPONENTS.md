# 低代码平台组件文档

## 组件概述

本文件提供了低代码平台中各个组件的详细信息，包括其功能、使用方法和示例。

## 组件分类

### 动态组件

- **DynamicTable**
  - 描述：用于展示数据的表格组件。
  - 属性：
    - `datasetId`: 数据集的唯一标识符。
    - `columns`: 表格列的配置。
  - 示例：
    ```tsx
    <DynamicTable
      datasetId="users"
      columns={[
        { field: 'name', title: '姓名' },
        { field: 'email', title: '邮箱' },
      ]}
    />
    ```

- **DynamicForm**
  - 描述：用于数据输入的表单组件。
  - 属性：
    - `datasetId`: 数据集的唯一标识符。
    - `fields`: 表单字段的配置。
  - 示例：
    ```tsx
    <DynamicForm
      datasetId="users"
      fields={[
        { field: 'name', label: '姓名', type: 'input' },
        { field: 'email', label: '邮箱', type: 'input' },
      ]}
    />
    ```

- **DynamicChart**
  - 描述：用于展示数据的图表组件。
  - 属性：
    - `datasetId`: 数据集的唯一标识符。
    - `type`: 图表类型（如：'line', 'bar'）。
  - 示例：
    ```tsx
    <DynamicChart datasetId="sales" type="line" />
    ```

### 布局组件

- **Container**
  - 描述：用于布局的容器组件。
  - 属性：
    - `children`: 容器内的子组件。
  - 示例：
    ```tsx
    <Container>
      <DynamicTable datasetId="users" />
    </Container>
    ```

- **Page**
  - 描述：页面组件，包含页面的整体结构。
  - 属性：
    - `title`: 页面标题。
    - `children`: 页面内的子组件。
  - 示例：
    ```tsx
    <Page title="用户管理">
      <DynamicTable datasetId="users" />
    </Page>
    ```

- **Region**
  - 描述：区域组件，用于定义页面的不同区域。
  - 属性：
    - `regionId`: 区域的唯一标识符。
    - `children`: 区域内的子组件。
  - 示例：
    ```tsx
    <Region regionId="header">
      <h1>欢迎使用低代码平台</h1>
    </Region>
    ```

### UI 组件

- **Button**
  - 描述：按钮组件。
  - 属性：
    - `label`: 按钮文本。
    - `onClick`: 点击事件处理函数。
  - 示例：
    ```tsx
    <Button label="提交" onClick={handleSubmit} />
    ```

- **Input**
  - 描述：输入框组件。
  - 属性：
    - `value`: 输入框的值。
    - `onChange`: 值变化事件处理函数。
  - 示例：
    ```tsx
    <Input value={inputValue} onChange={handleInputChange} />
    ```

- **Select**
  - 描述：下拉选择组件。
  - 属性：
    - `options`: 下拉选项数组。
    - `onChange`: 选择变化事件处理函数。
  - 示例：
    ```tsx
    <Select
      options={[
        { value: 'user', label: '用户' },
        { value: 'admin', label: '管理员' },
      ]}
      onChange={handleSelectChange}
    />
    ```

## 组件使用示例

以下是如何在低代码平台中使用这些组件的示例：

```tsx
const App = () => {
  return (
    <Page title="用户管理">
      <Container>
        <DynamicTable
          datasetId="users"
          columns={[
            { field: 'name', title: '姓名' },
            { field: 'email', title: '邮箱' },
          ]}
        />
        <DynamicForm
          datasetId="users"
          fields={[
            { field: 'name', label: '姓名', type: 'input' },
            { field: 'email', label: '邮箱', type: 'input' },
          ]}
        />
        <Button label="提交" onClick={handleSubmit} />
      </Container>
    </Page>
  )
}
```

## 结论

本文件提供了低代码平台中各个组件的基本信息和使用示例。通过这些组件，用户可以快速构建和管理应用程序的界面和功能。
