import React, { useState } from 'react'
import { FormField, DynamicFormProps } from '../../core/types/Component'

const DynamicForm: React.FC<DynamicFormProps> = ({
  datasetId: _datasetId,
  fields,
  onSubmit,
  onCancel,
  submitText = '提交',
  cancelText = '取消',
  className = '',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 简单验证
    const newErrors: Record<string, string> = {}
    fields.forEach(field => {
      if (field.required && !formData[field.field]) {
        newErrors[field.field] = `${field.label}是必填项`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit?.(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const renderField = (field: FormField) => {
    const error = errors[field.field]

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.field] || ''}
            onChange={e => handleChange(field.field, e.target.value)}
            className={error ? 'input-error' : ''}
            aria-label={field.label}
            title={field.label}
          />
        )
      case 'select':
        return (
          <select
            required={field.required}
            value={formData[field.field] || ''}
            onChange={e => handleChange(field.field, e.target.value)}
            className={error ? 'input-error' : ''}
            aria-label={field.label}
            title={field.label}
          >
            <option value="">{field.placeholder || '请选择'}</option>
            {/* 注意：选项数据应该从数据源获取，而不是静态配置 */}
          </select>
        )
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={formData[field.field] || false}
            onChange={e => handleChange(field.field, e.target.checked)}
            aria-label={field.label}
            title={field.label}
          />
        )
      default:
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.field] || ''}
            onChange={e => handleChange(field.field, e.target.value)}
            className={error ? 'input-error' : ''}
            aria-label={field.label}
            title={field.label}
          />
        )
    }
  }

  return (
    <form className={`dynamic-form ${className}`} onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={field.field} className="form-field">
          <label>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          {renderField(field)}
          {errors[field.field] && (
            <span className="error-message">{errors[field.field]}</span>
          )}
        </div>
      ))}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        )}
        <button type="submit" className="btn btn--primary">
          {submitText}
        </button>
      </div>
    </form>
  )
}

export default DynamicForm
