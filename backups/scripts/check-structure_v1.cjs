#!/usr/bin/env node

/**
 * 项目结构检查工具
 * 检查项目结构是否符合规范，并生成结构报告
 */

const fs = require('fs')
const path = require('path')

// 预期的项目结构
const expectedStructure = {
  'docs/': {
    'api/': {},
    'guides/': {
      'datagrid-toolbar-guide.md': 'file',
      'optimization-guide.md': 'file',
      'optimization-roadmap.md': 'file'
    },
    'architecture/': {
      'architecture-analysis.md': 'file',
      'architecture-private-properties.md': 'file'
    },
    'analysis/': {
      'component-privatization-analysis.md': 'file',
      'DATAGRID_TOOLBAR_COMPLETE.md': 'file',
      'dependency-analysis.md': 'file',
      'detailed-technical-analysis.md': 'file',
      'OPTIMIZATION_COMPLETE.md': 'file',
      'SMART_UPDATE_COMPLETE.md': 'file'
    },
    'assets/': {},
    'README.md': 'file',
    'API.md': 'file',
    'ARCHITECTURE.md': 'file',
    'COMPONENTS.md': 'file',
    'EXAMPLES.md': 'file'
  },
  'src/': {
    'components/': {
      'ui/': {
        'Button.tsx': 'file',
        'Input.tsx': 'file',
        'Select.tsx': 'file',
        'index.ts': 'file'
      },
      'layout/': {
        'Container.tsx': 'file',
        'Page.tsx': 'file',
        'Region.tsx': 'file',
        'index.ts': 'file',
        'layout.scss': 'file'
      },
      'dynamic/': {
        'DynamicForm.tsx': 'file',
        'DynamicTable.tsx': 'file',
        'index.ts': 'file'
      }
    },
    'core/': {
      'types/': {
        'Base.ts': 'file',
        'Component.ts': 'file',
        'Component_old.ts': 'file',
        'DataModel.ts': 'file',
        'Dataset.ts': 'file',
        'Project.ts': 'file',
        'index.ts': 'file'
      },
      'managers/': {
        'DynamicDataManager.ts': 'file',
        'index.ts': 'file'
      },
      'utils/': {
        'DataModelUtils.ts': 'file'
      },
      'optimization/': {
        'ComponentOptimizer.ts': 'file',
        'PerformanceMonitor.ts': 'file',
        'StateManager.ts': 'file',
        'utils.ts': 'file',
        'integration-test.ts': 'file',
        'index.ts': 'file'
      }
    },
    'config/': {
      'index.ts': 'file',
      'routing.ts': 'file',
      'theme.ts': 'file'
    },
    'styles/': {
      'components.scss': 'file',
      'layout.scss': 'file',
      'main.scss': 'file',
      'regions.scss': 'file',
      'variables.scss': 'file'
    },
    'App.tsx': 'file',
    'main.tsx': 'file'
  },
  'tools/': {
    'scripts/': {
      'check-structure.js': 'file',
      'check-structure.cjs': 'file',
      'cleanup.ts': 'file'
    },
    'testing/': {
      'demos/': {
        'datagrid-toolbar-demo.ts': 'file',
        'demo.ts': 'file',
        'smart-update-test.ts': 'file',
        'toolbar-demo-test.ts': 'file'
      }
    },
    'dev/': {}
  },
  'tests/': {
    'components/': {},
    'managers/': {},
    'utils/': {},
    'setup.ts': 'file'
  },
  'examples/': {
    'basic-crud/': {
      'datasets.json': 'file',
      'pages.json': 'file',
      'project.json': 'file'
    },
    'erp-system/': {
      'datasets.json': 'file',
      'pages.json': 'file',
      'project.json': 'file'
    },
    'DataGridToolbarExamples.ts': 'file',
    'SimpleUserDataModel.ts': 'file',
    'UserManagementDataModel.ts': 'file'
  },
  'public/': {
    'config/': {
      'components.json': 'file',
      'datasets.json': 'file',
      'project.json': 'file'
    },
    'index.html': 'file'
  },
  'package.json': 'file',
  'package-lock.json': 'file',
  'README.md': 'file',
  'tsconfig.json': 'file',
  'tsconfig.node.json': 'file',
  'vite.config.ts': 'file',
  'eslint.config.js': 'file',
  'jest.config.json': 'file',
  'index.html': 'file',
  'demo.ts': 'file',
  'smart-update-test.ts': 'file',
  'dist/': {},
  'OPTIMIZATION_COMPLETE.md': 'file',
  'PROJECT_COMPLETION_REPORT.md': 'file',
  'PROJECT_STRUCTURE_ANALYSIS.md': 'file',
  'SMART_UPDATE_COMPLETE.md': 'file',
  'STRUCTURE_REORGANIZATION_COMPLETE.md': 'file'
}

// 检查目录结构
function checkStructure(basePath, expected, currentPath = '', processedPaths = new Set()) {
  const results = {
    missing: [],
    unexpected: [],
    correct: []
  }

  // 检查预期的文件和目录
  for (const [name, type] of Object.entries(expected)) {
    const fullPath = path.join(basePath, currentPath, name)
    const relativePath = path.join(currentPath, name)

    try {
      const stat = fs.statSync(fullPath)

      if (type === 'file' && stat.isFile()) {
        results.correct.push(`✅ ${relativePath}`)
        processedPaths.add(path.join(currentPath, name))
      } else if (typeof type === 'object' && stat.isDirectory()) {
        results.correct.push(`✅ ${relativePath}`)
        processedPaths.add(path.join(currentPath, name))
        // 递归检查子目录
        const subResults = checkStructure(basePath, type, relativePath, processedPaths)
        results.missing.push(...subResults.missing)
        results.unexpected.push(...subResults.unexpected)
        results.correct.push(...subResults.correct)
      } else {
        results.unexpected.push(`❓ ${relativePath} (类型不匹配)`)
      }
    } catch (error) {
      results.missing.push(`❌ ${relativePath}`)
    }
  }

  // 检查意外的文件和目录
  try {
    const actualItems = fs.readdirSync(path.join(basePath, currentPath))
    for (const item of actualItems) {
      const itemRelativePath = path.join(currentPath, item)
      
      if (!Object.prototype.hasOwnProperty.call(expected, item) && 
          !item.startsWith('.') && 
          item !== 'node_modules' && 
          !processedPaths.has(itemRelativePath)) {
        
        // 特殊处理：忽略 dist 目录及其内容
        if (item !== 'dist' && !itemRelativePath.startsWith('dist')) {
          results.unexpected.push(`⚠️ ${itemRelativePath} (未预期)`)
        }
      }
    }
  } catch (error) {
    // 目录不存在，已经在上面处理了
  }

  return results
}// 生成结构报告
function generateReport(results) {
  console.log('🏗️ 项目结构检查报告')
  console.log('='.repeat(50))
  
  console.log(`\n📊 总体统计:`)
  console.log(`  ✅ 正确: ${results.correct.length}`)
  console.log(`  ❌ 缺失: ${results.missing.length}`)
  console.log(`  ⚠️ 意外: ${results.unexpected.length}`)

  if (results.missing.length > 0) {
    console.log(`\n❌ 缺失的文件/目录:`)
    results.missing.forEach(item => console.log(`  ${item}`))
  }

  if (results.unexpected.length > 0) {
    console.log(`\n⚠️ 意外的文件/目录:`)
    results.unexpected.forEach(item => console.log(`  ${item}`))
  }

  console.log(`\n✅ 正确的文件/目录:`)
  results.correct.slice(0, 10).forEach(item => console.log(`  ${item}`))
  if (results.correct.length > 10) {
    console.log(`  ... 还有 ${results.correct.length - 10} 个正确项`)
  }

  // 计算结构完整度
  const total = results.correct.length + results.missing.length
  const completeness = total > 0 ? (results.correct.length / total * 100).toFixed(1) : 0
  
  console.log(`\n📈 结构完整度: ${completeness}%`)
  
  if (completeness >= 90) {
    console.log('🎉 项目结构非常完整！')
  } else if (completeness >= 70) {
    console.log('👍 项目结构基本完整，建议完善缺失部分')
  } else {
    console.log('⚠️ 项目结构需要重大改进')
  }
}

// 主函数
function main() {
  const projectRoot = process.cwd()
  console.log(`🔍 检查项目: ${projectRoot}`)
  
  const results = checkStructure(projectRoot, expectedStructure)
  generateReport(results)
  
  // 返回退出码
  if (results.missing.length === 0) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = { checkStructure, generateReport }
