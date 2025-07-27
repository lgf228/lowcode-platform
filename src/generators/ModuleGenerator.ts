import { BaseGenerator } from './BaseGenerator'
import { ModuleNode, PageNode, ComponentNode } from '../types'

/**
 * 模块生成器
 * 生成模块组件代码
 */
export class ModuleGenerator extends BaseGenerator {
  /**
   * 生成模块代码
   */
  generate(module: ModuleNode): string {
    const imports = this.generateModuleImports(module)
    const constants = this.generateModuleConstants(module)
    const component = this.generateModuleComponent(module)

    return [
      this.generateFileHeader(`模块组件: ${module.name}`),
      '',
      imports,
      '',
      constants,
      '',
      component,
    ].join('\n')
  }

  /**
   * 生成模块导入语句
   */
  private generateModuleImports(module: ModuleNode): string {
    const imports: { [module: string]: string[] } = {
      react: ['React', 'useState', 'useEffect'],
      '../types': ['ModuleNode', 'PageNode'],
      '../core/UnifiedRenderer': ['UnifiedRenderer'],
    }

    // 添加页面组件导入
    const pages = this.findNodesByType<PageNode>(module, 'page')
    pages.forEach(page => {
      const componentName = this.toPascalCase(page.name)
      imports[`../pages/${componentName}`] = [componentName]
    })

    // 添加子模块组件导入
    const subModules = this.findNodesByType<ModuleNode>(module, 'module')
    subModules.forEach(subModule => {
      const componentName = this.toPascalCase(subModule.name)
      imports[`./${componentName}`] = [componentName]
    })

    return this.generateImports(imports)
  }

  /**
   * 生成模块常量
   */
  private generateModuleConstants(module: ModuleNode): string {
    return [
      `// 模块配置`,
      `const MODULE_CONFIG = ${this.generatePropsString({
        name: module.name,
        description: module.description,
        icon: module.icon,
        order: module.order,
        level: module.level,
        permissions: module.permissions,
      })};`,
    ].join('\n')
  }

  /**
   * 生成模块组件
   */
  private generateModuleComponent(module: ModuleNode): string {
    const componentName = this.toPascalCase(module.name)
    const navigation = this.generateNavigation(module)
    const content = this.generateModuleContent(module)

    return [
      `/**`,
      ` * ${module.name} 模块组件`,
      ` * ${module.description}`,
      ` */`,
      `export const ${componentName}: React.FC = () => {`,
      `${this.getIndent(1)}const [isExpanded, setIsExpanded] = useState(${module.isExpanded || false});`,
      `${this.getIndent(1)}const [renderer] = useState(() => new UnifiedRenderer());`,
      ``,
      `${this.getIndent(1)}const toggleExpanded = () => {`,
      `${this.getIndent(2)}setIsExpanded(!isExpanded);`,
      `${this.getIndent(1)}};`,
      ``,
      `${this.getIndent(1)}return (`,
      `${this.getIndent(2)}<div className="${this.toKebabCase(module.name)}-module">`,
      `${this.getIndent(3)}<div className="module-header">`,
      `${this.getIndent(4)}<div className="module-title">`,
      module.icon
        ? `${this.getIndent(5)}<span className="module-icon">${module.icon}</span>`
        : '',
      `${this.getIndent(5)}<h2>{MODULE_CONFIG.name}</h2>`,
      `${this.getIndent(4)}</div>`,
      `${this.getIndent(4)}<button onClick={toggleExpanded} className="expand-toggle">`,
      `${this.getIndent(5)}{isExpanded ? '收起' : '展开'}`,
      `${this.getIndent(4)}</button>`,
      `${this.getIndent(3)}</div>`,
      ``,
      `${this.getIndent(3)}{isExpanded && (`,
      `${this.getIndent(4)}<div className="module-content">`,
      navigation,
      content,
      `${this.getIndent(4)}</div>`,
      `${this.getIndent(3)})}`,
      `${this.getIndent(2)}</div>`,
      `${this.getIndent(1)});`,
      `};`,
      ``,
      `export default ${componentName};`,
    ].join('\n')
  }

  /**
   * 生成导航部分
   */
  private generateNavigation(module: ModuleNode): string {
    const pages = this.findNodesByType<PageNode>(module, 'page')
    const subModules = this.findNodesByType<ModuleNode>(module, 'module')

    if (pages.length === 0 && subModules.length === 0) {
      return ''
    }

    const navItems: string[] = []

    // 页面导航项
    pages.forEach(page => {
      navItems.push(
        `${this.getIndent(6)}<li className="nav-item">`,
        `${this.getIndent(7)}<a href="${page.route}" className="nav-link">`,
        `${this.getIndent(8)}{renderer.renderPageTitle("${page.id}")}`,
        `${this.getIndent(7)}</a>`,
        `${this.getIndent(6)}</li>`
      )
    })

    // 子模块导航项
    subModules.forEach(subModule => {
      navItems.push(
        `${this.getIndent(6)}<li className="nav-item">`,
        `${this.getIndent(7)}<div className="nav-module">`,
        `${this.getIndent(8)}<${this.toPascalCase(subModule.name)} />`,
        `${this.getIndent(7)}</div>`,
        `${this.getIndent(6)}</li>`
      )
    })

    return [
      `${this.getIndent(5)}<nav className="module-navigation">`,
      `${this.getIndent(6)}<ul className="nav-list">`,
      ...navItems,
      `${this.getIndent(6)}</ul>`,
      `${this.getIndent(5)}</nav>`,
    ].join('\n')
  }

  /**
   * 生成模块内容部分
   */
  private generateModuleContent(module: ModuleNode): string {
    const components = this.findNodesByType<ComponentNode>(module, 'component')

    if (components.length === 0) {
      return ''
    }

    const componentItems = components.map(
      component =>
        `${this.getIndent(6)}<div className="module-component">` +
        `${this.getIndent(7)}{renderer.renderComponent("${component.id}")}` +
        `${this.getIndent(6)}</div>`
    )

    return [
      `${this.getIndent(5)}<div className="module-components">`,
      ...componentItems,
      `${this.getIndent(5)}</div>`,
    ].join('\n')
  }

  /**
   * 生成模块样式
   */
  generateModuleStyles(module: ModuleNode): string {
    const className = this.toKebabCase(module.name)

    return [
      `/* ${module.name} 模块样式 */`,
      `.${className}-module {`,
      `  border: 1px solid #e1e5e9;`,
      `  border-radius: 8px;`,
      `  margin-bottom: 16px;`,
      `  background: #fff;`,
      `}`,
      ``,
      `.${className}-module .module-header {`,
      `  display: flex;`,
      `  align-items: center;`,
      `  justify-content: space-between;`,
      `  padding: 16px;`,
      `  border-bottom: 1px solid #e1e5e9;`,
      `  background: #f8f9fa;`,
      `}`,
      ``,
      `.${className}-module .module-title {`,
      `  display: flex;`,
      `  align-items: center;`,
      `  gap: 8px;`,
      `}`,
      ``,
      `.${className}-module .module-icon {`,
      `  font-size: 20px;`,
      `}`,
      ``,
      `.${className}-module .expand-toggle {`,
      `  padding: 4px 12px;`,
      `  background: #007bff;`,
      `  color: white;`,
      `  border: none;`,
      `  border-radius: 4px;`,
      `  cursor: pointer;`,
      `}`,
      ``,
      `.${className}-module .module-content {`,
      `  padding: 16px;`,
      `}`,
      ``,
      `.${className}-module .module-navigation {`,
      `  margin-bottom: 16px;`,
      `}`,
      ``,
      `.${className}-module .nav-list {`,
      `  list-style: none;`,
      `  padding: 0;`,
      `  margin: 0;`,
      `}`,
      ``,
      `.${className}-module .nav-item {`,
      `  margin-bottom: 8px;`,
      `}`,
      ``,
      `.${className}-module .nav-link {`,
      `  display: block;`,
      `  padding: 8px 12px;`,
      `  color: #007bff;`,
      `  text-decoration: none;`,
      `  border-radius: 4px;`,
      `  transition: background-color 0.2s;`,
      `}`,
      ``,
      `.${className}-module .nav-link:hover {`,
      `  background-color: #f8f9fa;`,
      `}`,
      ``,
      `.${className}-module .module-components {`,
      `  display: grid;`,
      `  gap: 16px;`,
      `}`,
      ``,
      `.${className}-module .module-component {`,
      `  border: 1px solid #e1e5e9;`,
      `  border-radius: 4px;`,
      `  padding: 12px;`,
      `}`,
    ].join('\n')
  }
}

export default ModuleGenerator
