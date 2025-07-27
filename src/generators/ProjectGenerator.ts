import { BaseGenerator } from './BaseGenerator'
import { ProjectNode, ModuleNode, PageNode } from '../types'

/**
 * 项目生成器
 * 生成整个项目的代码结构
 */
export class ProjectGenerator extends BaseGenerator {
  /**
   * 生成项目代码
   */
  generate(project: ProjectNode): string {
    const imports = this.generateProjectImports(project)
    const constants = this.generateProjectConstants(project)
    const component = this.generateProjectComponent(project)

    return [
      this.generateFileHeader(`项目组件: ${project.name}`),
      '',
      imports,
      '',
      constants,
      '',
      component,
    ].join('\n')
  }

  /**
   * 生成项目导入语句
   */
  private generateProjectImports(project: ProjectNode): string {
    const imports: { [module: string]: string[] } = {
      react: ['React', 'useState', 'useEffect'],
      'react-router-dom': ['BrowserRouter', 'HashRouter', 'Routes', 'Route'],
      '../types': ['ProjectNode', 'ModuleNode', 'PageNode'],
      '../core/DataManager': ['StaticDataManager', 'DynamicDataManager'],
      '../core/UnifiedRenderer': ['UnifiedRenderer'],
    }

    // 添加模块组件导入
    const modules = this.findNodesByType<ModuleNode>(project, 'module')
    modules.forEach(module => {
      const componentName = this.toPascalCase(module.name)
      imports[`./modules/${componentName}`] = [componentName]
    })

    return this.generateImports(imports)
  }

  /**
   * 生成项目常量
   */
  private generateProjectConstants(project: ProjectNode): string {
    return [
      `// 项目配置`,
      `const PROJECT_CONFIG = ${this.generatePropsString({
        name: project.name,
        version: project.version,
        description: project.description,
        theme: project.theme,
        routing: project.routing,
      })};`,
      '',
      `// 全局数据集ID`,
      `const GLOBAL_DATASET_IDS = ${JSON.stringify(project.globalDatasetIds)};`,
    ].join('\n')
  }

  /**
   * 生成项目组件
   */
  private generateProjectComponent(project: ProjectNode): string {
    const componentName = this.toPascalCase(project.name)
    const routerComponent =
      project.routing.mode === 'hash' ? 'HashRouter' : 'BrowserRouter'

    // const moduleComponents = this.findNodesByType<ModuleNode>(project, 'module') // 暂时注释掉未使用的变量
    const routes = this.generateRoutes(project)

    return [
      `/**`,
      ` * ${project.name} 项目组件`,
      ` * ${project.description}`,
      ` */`,
      `export const ${componentName}: React.FC = () => {`,
      `${this.getIndent(1)}const [staticDataManager] = useState(() => new StaticDataManager());`,
      `${this.getIndent(1)}const [dynamicDataManager] = useState(() => new DynamicDataManager());`,
      `${this.getIndent(1)}const [renderer] = useState(() => new UnifiedRenderer());`,
      ``,
      `${this.getIndent(1)}// 初始化全局数据集`,
      `${this.getIndent(1)}useEffect(() => {`,
      `${this.getIndent(2)}GLOBAL_DATASET_IDS.forEach(datasetId => {`,
      `${this.getIndent(3)}dynamicDataManager.loadDataset(datasetId);`,
      `${this.getIndent(2)}});`,
      `${this.getIndent(1)}}, []);`,
      ``,
      `${this.getIndent(1)}return (`,
      `${this.getIndent(2)}<${routerComponent}>`,
      `${this.getIndent(3)}<div className="${this.toKebabCase(project.name)}-project">`,
      `${this.getIndent(4)}<Routes>`,
      routes,
      `${this.getIndent(4)}</Routes>`,
      `${this.getIndent(3)}</div>`,
      `${this.getIndent(2)}</${routerComponent}>`,
      `${this.getIndent(1)});`,
      `};`,
      ``,
      `export default ${componentName};`,
    ].join('\n')
  }

  /**
   * 生成路由配置
   */
  private generateRoutes(project: ProjectNode): string {
    const routes: string[] = []
    const pages = this.findNodesByType<PageNode>(project, 'page')

    pages.forEach(page => {
      const componentName = this.toPascalCase(page.name)
      routes.push(
        `${this.getIndent(5)}<Route path="${page.route}" element={<${componentName} />} />`
      )
    })

    // 默认路由
    if (pages.length > 0) {
      const firstPage = pages[0]
      routes.push(
        `${this.getIndent(5)}<Route path="/" element={<${this.toPascalCase(firstPage.name)} />} />`
      )
    }

    return routes.join('\n')
  }

  /**
   * 生成项目结构信息
   */
  generateProjectStructure(project: ProjectNode): ProjectStructureInfo {
    const modules = this.findNodesByType<ModuleNode>(project, 'module')
    const pages = this.findNodesByType<PageNode>(project, 'page')

    return {
      projectName: project.name,
      totalModules: modules.length,
      totalPages: pages.length,
      depth: this.getNodeDepth(project),
      structure: this.generateTreeStructure(project, 0),
    }
  }

  /**
   * 生成树形结构描述
   */
  private generateTreeStructure(
    node: ProjectNode | ModuleNode | PageNode,
    level: number
  ): string {
    const indent = '  '.repeat(level)
    const lines = [`${indent}${node.type}: ${node.name}`]

    if (node.children) {
      node.children.forEach(child => {
        lines.push(this.generateTreeStructure(child as any, level + 1))
      })
    }

    return lines.join('\n')
  }
}

/**
 * 项目结构信息接口
 */
export interface ProjectStructureInfo {
  projectName: string
  totalModules: number
  totalPages: number
  depth: number
  structure: string
}

export default ProjectGenerator
