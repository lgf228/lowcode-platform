import {
  TreeNode,
  // ComponentNode,  // 暂时注释掉未使用的导入
  // PageNode,
  // ModuleNode,
  // ProjectNode,
  // RegionNode,
  // Dataset,  // 暂时注释掉未使用的导入
  NodeType,
} from '../types'

/**
 * 生成器基类
 * 提供通用的代码生成能力
 */
export abstract class BaseGenerator {
  protected indent: string = '  '
  protected level: number = 0

  /**
   * 生成缩进
   */
  protected getIndent(level?: number): string {
    const currentLevel = level !== undefined ? level : this.level
    return this.indent.repeat(currentLevel)
  }

  /**
   * 增加缩进级别
   */
  protected increaseIndent(): void {
    this.level++
  }

  /**
   * 减少缩进级别
   */
  protected decreaseIndent(): void {
    this.level = Math.max(0, this.level - 1)
  }

  /**
   * 生成安全的标识符名称
   */
  protected generateSafeName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/^(\d)/, '_$1')
      .replace(/__+/g, '_')
      .replace(/^_+|_+$/g, '')
  }

  /**
   * 生成Pascal命名
   */
  protected toPascalCase(str: string): string {
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }

  /**
   * 生成Camel命名
   */
  protected toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str)
    return pascal.charAt(0).toLowerCase() + pascal.slice(1)
  }

  /**
   * 生成kebab命名
   */
  protected toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  /**
   * 转义字符串
   */
  protected escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
  }

  /**
   * 生成属性对象字符串
   */
  protected generatePropsString(
    props: Record<string, any>,
    level: number = 0
  ): string {
    const keys = Object.keys(props)
    if (keys.length === 0) return '{}'

    const indent = this.getIndent(level)
    const nextIndent = this.getIndent(level + 1)

    const lines = keys.map(key => {
      const value = props[key]
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`
      let valueStr: string

      if (typeof value === 'string') {
        valueStr = `"${this.escapeString(value)}"`
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        valueStr = String(value)
      } else if (value === null || value === undefined) {
        valueStr = 'null'
      } else if (Array.isArray(value)) {
        valueStr = `[${value
          .map(v =>
            typeof v === 'string' ? `"${this.escapeString(v)}"` : String(v)
          )
          .join(', ')}]`
      } else if (typeof value === 'object') {
        valueStr = this.generatePropsString(value, level + 1)
      } else {
        valueStr = String(value)
      }

      return `${nextIndent}${safeKey}: ${valueStr}`
    })

    return `{\n${lines.join(',\n')}\n${indent}}`
  }

  /**
   * 生成JSX属性字符串
   */
  protected generateJSXProps(props: Record<string, any>): string {
    const keys = Object.keys(props)
    const validEntries = keys.filter(key => props[key] !== undefined)
    if (validEntries.length === 0) return ''

    return (
      ' ' +
      validEntries
        .map(key => {
          const value = props[key]
          if (typeof value === 'boolean') {
            return value ? key : ''
          } else if (typeof value === 'string') {
            return `${key}="${this.escapeString(value)}"`
          } else {
            return `${key}={${JSON.stringify(value)}}`
          }
        })
        .filter(Boolean)
        .join(' ')
    )
  }

  /**
   * 获取节点深度
   */
  protected getNodeDepth(node: TreeNode): number {
    if (!node.children || node.children.length === 0) {
      return 1
    }
    return 1 + Math.max(...node.children.map(child => this.getNodeDepth(child)))
  }

  /**
   * 获取所有叶子节点
   */
  protected getLeafNodes(node: TreeNode): TreeNode[] {
    if (!node.children || node.children.length === 0) {
      return [node]
    }
    const result: TreeNode[] = []
    for (const child of node.children) {
      result.push(...this.getLeafNodes(child))
    }
    return result
  }

  /**
   * 查找特定类型的节点
   */
  protected findNodesByType<T extends TreeNode>(
    node: TreeNode,
    type: NodeType
  ): T[] {
    const result: T[] = []

    if (node.type === type) {
      result.push(node as T)
    }

    if (node.children) {
      for (const child of node.children) {
        result.push(...this.findNodesByType<T>(child, type))
      }
    }

    return result
  }

  /**
   * 生成导入语句
   */
  protected generateImports(imports: { [module: string]: string[] }): string {
    const lines: string[] = []
    const modules = Object.keys(imports)

    for (const module of modules) {
      const items = imports[module]
      if (items.length === 0) continue

      if (items.length === 1 && items[0] === 'default') {
        lines.push(`import ${module.split('/').pop()} from '${module}';`)
      } else {
        const namedImports = items.filter(item => item !== 'default')
        const defaultImport = items.includes('default')
          ? module.split('/').pop()
          : null

        if (defaultImport && namedImports.length > 0) {
          lines.push(
            `import ${defaultImport}, { ${namedImports.join(', ')} } from '${module}';`
          )
        } else if (defaultImport) {
          lines.push(`import ${defaultImport} from '${module}';`)
        } else {
          lines.push(`import { ${namedImports.join(', ')} } from '${module}';`)
        }
      }
    }

    return lines.join('\n')
  }

  /**
   * 生成文件头注释
   */
  protected generateFileHeader(description: string, author?: string): string {
    const lines = ['/**', ` * ${description}`]

    if (author) {
      lines.push(` * @author ${author}`)
    }

    lines.push(` * @generated 自动生成于 ${new Date().toISOString()}`, ' */')

    return lines.join('\n')
  }

  /**
   * 抽象方法：生成代码
   */
  abstract generate(input: any): string
}

/**
 * 生成器工厂类
 */
export class GeneratorFactory {
  private static generators: Map<string, new () => BaseGenerator> = new Map()

  /**
   * 注册生成器
   */
  static register(type: string, generator: new () => BaseGenerator): void {
    this.generators.set(type, generator)
  }

  /**
   * 创建生成器实例
   */
  static create(type: string): BaseGenerator {
    const GeneratorClass = this.generators.get(type)
    if (!GeneratorClass) {
      throw new Error(`未找到类型为 "${type}" 的生成器`)
    }
    return new GeneratorClass()
  }

  /**
   * 获取已注册的生成器类型
   */
  static getRegisteredTypes(): string[] {
    return Array.from(this.generators.keys())
  }
}

export default BaseGenerator
