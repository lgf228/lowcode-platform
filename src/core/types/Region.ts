// ===========================
// Region Types
// ===========================

export interface Region {
  id: string
  name: string
  type: RegionType
  layout: RegionLayout
  components: string[]
  style?: RegionStyle
}

export type RegionType = 'container' | 'grid' | 'flex' | 'absolute'

export interface RegionLayout {
  width?: string | number
  height?: string | number
  padding?: string | number
  margin?: string | number
  direction?: 'row' | 'column'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export interface RegionStyle {
  backgroundColor?: string
  border?: string
  borderRadius?: string
  boxShadow?: string
}
