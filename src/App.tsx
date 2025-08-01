import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import DynamicForm from './components/dynamic/DynamicForm'
import DynamicTable from './components/dynamic/DynamicTable'
import { ComponentType, type FormField } from './core/types'

// 简单的页面组件
const HomePage = () => (
  <div>
    <h2>🏠 首页</h2>
    <p>欢迎来到低代码平台！</p>
    <div className="feature-list">
      <h3>✨ 平台特性：</h3>
      <ul>
        <li>🔧 动态表单生成</li>
        <li>📊 智能数据表格</li>
        <li>🎨 可视化布局设计</li>
        <li>⚡ 热重载开发体验</li>
      </ul>
    </div>
  </div>
)

// 表单演示页面
const FormPage = () => {
  const handleSubmit = (data: any) => {
    console.log('表单提交数据:', data)
    alert(`表单提交成功！数据: ${JSON.stringify(data, null, 2)}`)
  }

  const handleCancel = () => {
    console.log('表单取消')
  }

  const formFields: FormField[] = [
    {
      id: 'field-1',
      name: 'name-field',
      version: '1.0',
      col: 12,
      colSpan: 1,
      rowSpan: 1,
      order: 1,
      fieldName: 'name',
      label: '姓名',
      type: ComponentType.INPUT,
      placeholder: '请输入姓名',
    },
    {
      id: 'field-2',
      name: 'email-field',
      version: '1.0',
      col: 12,
      colSpan: 1,
      rowSpan: 1,
      order: 2,
      fieldName: 'email',
      label: '邮箱',
      type: ComponentType.INPUT,
      placeholder: '请输入邮箱地址',
    },
    {
      id: 'field-3',
      name: 'age-field',
      version: '1.0',
      col: 12,
      colSpan: 1,
      rowSpan: 1,
      order: 3,
      fieldName: 'age',
      label: '年龄',
      type: ComponentType.INPUT,
      placeholder: '请输入年龄',
    },
    {
      id: 'field-4',
      name: 'description-field',
      version: '1.0',
      col: 12,
      colSpan: 1,
      rowSpan: 1,
      order: 4,
      fieldName: 'description',
      label: '描述',
      type: ComponentType.TEXTAREA,
      placeholder: '请输入描述信息',
    },
  ]

  return (
    <div>
      <h2>📝 动态表单演示</h2>
      <p>这是一个动态生成的表单，支持多种字段类型和验证规则。</p>
      <DynamicForm
        datasetId="user-form"
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="提交表单"
        cancelText="重置"
      />
    </div>
  )
}

// 表格演示页面
const TablePage = () => {
  const handleRowClick = (row: any) => {
    console.log('行点击:', row)
    alert(`点击了行: ${JSON.stringify(row, null, 2)}`)
  }

  const handleRowSelect = (selectedRows: any[]) => {
    console.log('选中行:', selectedRows)
  }

  const tableColumns = [
    { key: 'id', title: 'ID', width: 80 },
    { key: 'name', title: '产品名称', width: 150 },
    { key: 'price', title: '价格', width: 100 },
    { key: 'stock', title: '库存', width: 100 },
  ]

  return (
    <div>
      <h2>📊 动态表格演示</h2>
      <p>这是一个功能完整的数据表格，支持分页、排序和行选择。</p>
      <DynamicTable
        datasetId="products"
        columns={tableColumns}
        pagination={{
          page: 1,
          pageSize: 10,
          total: 0,
          onChange: (page: number, pageSize: number) => {
            console.log('分页变化:', page, pageSize)
          },
        }}
        onRowClick={handleRowClick}
        onRowSelect={handleRowSelect}
      />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <div className="test-container">
      <header>
        <h1>🎉 低代码平台</h1>
        <p>当前时间：{new Date().toLocaleString()}</p>
      </header>

      <nav className="test-links">
        <Link to="/">🏠 首页</Link>
        <Link to="/form">📝 表单演示</Link>
        <Link to="/table">📊 表格演示</Link>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/table" element={<TablePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
