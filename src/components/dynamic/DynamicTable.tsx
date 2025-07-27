import React, { useEffect, useState } from 'react'
import { DynamicTableProps } from '../../core/types/Component'

// 模拟数据
const mockData: Record<string, any[]> = {
  products: [
    { id: 1, name: '产品A', price: 100, stock: 50 },
    { id: 2, name: '产品B', price: 200, stock: 30 },
    { id: 3, name: '产品C', price: 150, stock: 25 },
  ],
  users: [
    { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
    { id: 2, name: '李四', email: 'lisi@example.com', age: 30 },
    { id: 3, name: '王五', email: 'wangwu@example.com', age: 28 },
  ],
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  datasetId,
  columns,
  data: propData,
  loading: propLoading = false,
  pagination,
  onRowClick,
  onRowSelect,
  className = '',
}) => {
  const [data, setData] = useState<any[]>(propData || [])
  const [loading, setLoading] = useState(propLoading)
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  useEffect(() => {
    if (propData) {
      setData(propData)
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        // 模拟 API 调用
        await new Promise(resolve => setTimeout(resolve, 500))
        const mockDataForDataset = mockData[datasetId] || []
        setData(mockDataForDataset)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [datasetId, propData])

  const handleRowClick = (row: any) => {
    onRowClick?.(row)
  }

  const handleRowSelect = (row: any, selected: boolean) => {
    let newSelectedRows
    if (selected) {
      newSelectedRows = [...selectedRows, row]
    } else {
      newSelectedRows = selectedRows.filter(r => r.id !== row.id)
    }
    setSelectedRows(newSelectedRows)
    onRowSelect?.(newSelectedRows)
  }

  const handleSelectAll = (selected: boolean) => {
    const newSelectedRows = selected ? [...data] : []
    setSelectedRows(newSelectedRows)
    onRowSelect?.(newSelectedRows)
  }

  if (loading) {
    return (
      <div className="dynamic-table loading">
        <div className="spinner"></div>
        <span>加载中...</span>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="dynamic-table empty">
        <div className="empty-icon">📄</div>
        <div className="empty-title">暂无数据</div>
        <div className="empty-description">当前数据集中没有数据</div>
      </div>
    )
  }

  return (
    <div className={`dynamic-table ${className}`}>
      <div className="table-header">
        <div className="table-row">
          {onRowSelect && (
            <div className="table-cell">
              <input
                type="checkbox"
                checked={selectedRows.length === data.length}
                onChange={e => handleSelectAll(e.target.checked)}
                aria-label="全选"
              />
            </div>
          )}
          {columns.map(column => (
            <div
              key={column.key}
              className="table-cell"
              style={{ width: column.width }}
            >
              {column.title}
            </div>
          ))}
        </div>
      </div>
      <div className="table-body">
        {data.map((row, index) => (
          <div
            key={row.id || index}
            className="table-row"
            onClick={() => handleRowClick(row)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {onRowSelect && (
              <div className="table-cell">
                <input
                  type="checkbox"
                  checked={selectedRows.some(r => r.id === row.id)}
                  onChange={e => handleRowSelect(row, e.target.checked)}
                  onClick={e => e.stopPropagation()}
                  aria-label={`选择第${index + 1}行`}
                />
              </div>
            )}
            {columns.map(column => (
              <div
                key={column.key}
                className="table-cell"
                style={{ width: column.width }}
              >
                {column.render
                  ? column.render(row[column.key], row)
                  : row[column.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
      {pagination && (
        <div className="table-pagination">
          <div className="pagination-info">
            显示 {(pagination.page - 1) * pagination.pageSize + 1} 到{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{' '}
            条， 共 {pagination.total} 条记录
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn--outline"
              disabled={pagination.page === 1}
              onClick={() =>
                pagination.onChange(pagination.page - 1, pagination.pageSize)
              }
            >
              上一页
            </button>
            <span className="pagination-current">第 {pagination.page} 页</span>
            <button
              className="btn btn--outline"
              disabled={
                pagination.page * pagination.pageSize >= pagination.total
              }
              onClick={() =>
                pagination.onChange(pagination.page + 1, pagination.pageSize)
              }
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DynamicTable
