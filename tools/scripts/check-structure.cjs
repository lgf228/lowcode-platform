#!/usr/bin/env node

/**
 * 优化的项目结构检查工具
 * 检查项目结构是否符合规范，并生成结构报告
 */

const fs = require('fs')
const path = require('path')

// 预期的项目结构（完整定义）
const expectedFiles = new Set([
  // 根目录文件
  'package.json',
  'package-lock.json',
  'README.md',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'eslint.config.js',
  'jest.config.json',
  'index.html',
  'demo.ts',
  'smart-update-test.ts',
  'OPTIMIZATION_COMPLETE.md',
  'PROJECT_COMPLETION_REPORT.md',
  'PROJECT_STRUCTURE_ANALYSIS.md',
  'SMART_UPDATE_COMPLETE.md',
  'STRUCTURE_REORGANIZATION_COMPLETE.md',
  'PROJECT_STRUCTURE_OPTIMIZATION_COMPLETE.md',
  
  // docs 目录
  'docs/README.md',
  'docs/API.md',
  'docs/ARCHITECTURE.md',
  'docs/COMPONENTS.md',
  'docs/EXAMPLES.md',
  'docs/guides/datagrid-toolbar-guide.md',
  'docs/guides/optimization-guide.md',
  'docs/guides/optimization-roadmap.md',
  'docs/architecture/architecture-analysis.md',
  'docs/architecture/architecture-private-properties.md',
  'docs/analysis/component-privatization-analysis.md',
  'docs/analysis/DATAGRID_TOOLBAR_COMPLETE.md',
  'docs/analysis/dependency-analysis.md',
  'docs/analysis/detailed-technical-analysis.md',
  'docs/analysis/OPTIMIZATION_COMPLETE.md',
  'docs/analysis/SMART_UPDATE_COMPLETE.md',

  // src 目录
  'src/App.tsx',
  'src/main.tsx',
  'src/components/ui/Button.tsx',
  'src/components/ui/Input.tsx',
  'src/components/ui/Select.tsx',
  'src/components/ui/index.ts',
  'src/components/layout/Container.tsx',
  'src/components/layout/Page.tsx',
  'src/components/layout/Region.tsx',
  'src/components/layout/index.ts',
  'src/components/layout/layout.scss',
  'src/components/dynamic/DynamicForm.tsx',
  'src/components/dynamic/DynamicTable.tsx',
  'src/components/dynamic/index.ts',
  'src/core/types/Base.ts',
  'src/core/types/Component.ts',
  'src/core/types/Component_old.ts',
  'src/core/types/DataModel.ts',
  'src/core/types/Dataset.ts',
  'src/core/types/Project.ts',
  'src/core/types/index.ts',
  'src/core/managers/DynamicDataManager.ts',
  'src/core/managers/index.ts',
  'src/core/utils/DataModelUtils.ts',
  'src/core/optimization/ComponentOptimizer.ts',
  'src/core/optimization/PerformanceMonitor.ts',
  'src/core/optimization/StateManager.ts',
  'src/core/optimization/utils.ts',
  'src/core/optimization/integration-test.ts',
  'src/core/optimization/index.ts',
  'src/config/index.ts',
  'src/config/routing.ts',
  'src/config/theme.ts',
  'src/styles/components.scss',
  'src/styles/layout.scss',
  'src/styles/main.scss',
  'src/styles/regions.scss',
  'src/styles/variables.scss',

  // tools 目录
  'tools/scripts/check-structure.js',
  'tools/scripts/check-structure.cjs',
  'tools/scripts/check-structure-old.cjs',
  'tools/scripts/cleanup.ts',
  'tools/testing/demos/datagrid-toolbar-demo.ts',
  'tools/testing/demos/demo.ts',
  'tools/testing/demos/smart-update-test.ts',
  'tools/testing/demos/toolbar-demo-test.ts',

  // tests 目录
  'tests/setup.ts',

  // examples 目录
  'examples/basic-crud/datasets.json',
  'examples/basic-crud/pages.json',
  'examples/basic-crud/project.json',
  'examples/erp-system/datasets.json',
  'examples/erp-system/pages.json',
  'examples/erp-system/project.json',
  'examples/DataGridToolbarExamples.ts',
  'examples/SimpleUserDataModel.ts',
  'examples/UserManagementDataModel.ts',

  // public 目录
  'public/index.html',
  'public/config/components.json',
  'public/config/datasets.json',
  'public/config/project.json'
])

// 预期的目录结构
const expectedDirs = new Set([
  'docs',
  'docs/api',
  'docs/guides',
  'docs/architecture',
  'docs/analysis',
  'docs/assets',
  'src',
  'src/components',
  'src/components/ui',
  'src/components/layout',
  'src/components/dynamic',
  'src/core',
  'src/core/types',
  'src/core/managers',
  'src/core/utils',
  'src/core/optimization',
  'src/config',
  'src/styles',
  'tools',
  'tools/scripts',
  'tools/testing',
  'tools/testing/demos',
  'tools/dev',
  'tests',
  'tests/components',
  'tests/managers',
  'tests/utils',
  'examples',
  'examples/basic-crud',
  'examples/erp-system',
  'public',
  'public/config'
])

// 忽略的文件和目录
const ignoredPatterns = [
  /^node_modules/,
  /^\.git/,
  /^\.vscode/,
  /^\.idea/,
  /^dist/,
  /^\./,
  /\.log$/,
  /\.tmp$/,
  /\.cache$/
]

function shouldIgnore(filePath) {
  return ignoredPatterns.some(pattern => pattern.test(filePath))
}

function getAllFiles(dir, baseDir = dir) {
  const files = []
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
    
    if (shouldIgnore(relativePath)) {
      continue
    }
    
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      files.push({ type: 'dir', path: relativePath })
      files.push(...getAllFiles(fullPath, baseDir))
    } else {
      files.push({ type: 'file', path: relativePath })
    }
  }
  
  return files
}

function checkStructure(projectRoot) {
  const actualFiles = getAllFiles(projectRoot)
  const actualFilePaths = new Set(actualFiles.filter(f => f.type === 'file').map(f => f.path))
  const actualDirPaths = new Set(actualFiles.filter(f => f.type === 'dir').map(f => f.path))
  
  const results = {
    missing: [],
    unexpected: [],
    correct: []
  }
  
  // 检查预期的文件
  for (const expectedFile of expectedFiles) {
    if (actualFilePaths.has(expectedFile)) {
      results.correct.push(`✅ ${expectedFile}`)
    } else {
      results.missing.push(`❌ ${expectedFile}`)
    }
  }
  
  // 检查预期的目录
  for (const expectedDir of expectedDirs) {
    if (actualDirPaths.has(expectedDir)) {
      results.correct.push(`✅ ${expectedDir}/`)
    } else {
      results.missing.push(`❌ ${expectedDir}/`)
    }
  }
  
  // 检查意外的文件
  for (const actualFile of actualFilePaths) {
    if (!expectedFiles.has(actualFile)) {
      results.unexpected.push(`⚠️ ${actualFile} (未预期的文件)`)
    }
  }
  
  // 检查意外的目录
  for (const actualDir of actualDirPaths) {
    if (!expectedDirs.has(actualDir)) {
      results.unexpected.push(`⚠️ ${actualDir}/ (未预期的目录)`)
    }
  }
  
  return results
}

function generateReport(results) {
  console.log('🏗️ 项目结构检查报告 (优化版)')
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

  if (results.correct.length > 0) {
    console.log(`\n✅ 正确的文件/目录 (前10项):`)
    results.correct.slice(0, 10).forEach(item => console.log(`  ${item}`))
    if (results.correct.length > 10) {
      console.log(`  ... 还有 ${results.correct.length - 10} 个正确项`)
    }
  }

  // 计算结构完整度
  const total = results.correct.length + results.missing.length
  const completeness = total > 0 ? (results.correct.length / total * 100).toFixed(1) : 0

  console.log(`\n📈 结构完整度: ${completeness}%`)

  if (completeness >= 95 && results.unexpected.length === 0) {
    console.log('🎉 项目结构完美！')
  } else if (completeness >= 90) {
    console.log('👍 项目结构优秀！')
  } else if (completeness >= 70) {
    console.log('✅ 项目结构良好，建议完善缺失部分')
  } else {
    console.log('⚠️ 项目结构需要改进')
  }
}

// 主函数
function main() {
  const projectRoot = process.cwd()
  console.log(`🔍 检查项目: ${projectRoot}`)

  try {
    const results = checkStructure(projectRoot)
    generateReport(results)

    // 返回退出码
    if (results.missing.length === 0 && results.unexpected.length === 0) {
      process.exit(0)
    } else {
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error.message)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = { checkStructure, generateReport }
