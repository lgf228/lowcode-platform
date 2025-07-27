// ===========================
// Component Types
// ===========================

export interface BaseComponentProps {
  id?: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export interface ComponentPageProps extends BaseComponentProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export interface ContainerProps extends BaseComponentProps {
  children: React.ReactNode
  maxWidth?: 'narrow' | 'normal' | 'wide' | 'fluid'
}

export interface RegionProps extends BaseComponentProps {
  type?: 'content' | 'sidebar' | 'header' | 'footer' | 'hero' | 'card'
  layout?: 'vertical' | 'horizontal' | 'grid'
  spacing?: 'compact' | 'normal' | 'spacious'
  children: React.ReactNode
}

// Form related types
export interface FormField {
  field: string
  label: string
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'date'
    | 'select'
    | 'textarea'
    | 'checkbox'
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface DynamicFormProps extends BaseComponentProps {
  datasetId: string
  fields: FormField[]
  onSubmit?: (data: any) => void
  onCancel?: () => void
  submitText?: string
  cancelText?: string
}

// Table related types
export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  render?: (value: any, record: any) => React.ReactNode
}

export interface DynamicTableProps extends BaseComponentProps {
  datasetId: string
  columns: TableColumn[]
  data?: any[]
  loading?: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  onRowClick?: (record: any) => void
  onRowSelect?: (selectedRows: any[]) => void
}

// Chart related types
export interface ChartProps extends BaseComponentProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter'
  datasetId: string
  data?: any[]
  config?: {
    xField?: string
    yField?: string
    colorField?: string
    title?: string
    subtitle?: string
  }
}

// Button types
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

// Input types
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  size?: 'small' | 'medium' | 'large'
}

// Select types
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends BaseComponentProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  multiple?: boolean
}

// Layout component types
export interface LayoutComponentProps {
  type: 'container' | 'page' | 'region' | 'grid' | 'flex'
  props: Record<string, any>
  children?: LayoutComponentProps[]
}

// Dynamic component types
export interface DynamicComponentProps {
  componentType: string
  props: Record<string, any>
  children?: DynamicComponentProps[]
}
