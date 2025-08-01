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
        'guides/': {},
        'architecture/': {},
        'analysis/': {},
        'assets/': {},
        'README.md': 'file'
    },
    'src/': {
        'components/': {
            'ui/': {},
            'layout/': {},
            'dynamic/': {}
        },
        'core/': {
            'types/': {},
            'managers/': {},
            'utils/': {},
            'optimization/': {}
        },
        'config/': {},
        'styles/': {}
    },
    'tools/': {
        'scripts/': {},
        'testing/': {
            'demos/': {}
        },
        'dev/': {}
    },
    'tests/': {},
    'examples/': {},
    'public/': {},
    'package.json': 'file',
    'README.md': 'file',
    'tsconfig.json': 'file',
    'vite.config.ts': 'file'
}

// 检查目录结构
function checkStructure(basePath, expected, currentPath = '') {
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
            } else if (typeof type === 'object' && stat.isDirectory()) {
                results.correct.push(`✅ ${relativePath}`)
                // 递归检查子目录
                const subResults = checkStructure(basePath, type, relativePath)
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
            if (!expected.hasOwnProperty(item) && !item.startsWith('.') && item !== 'node_modules') {
                const relativePath = path.join(currentPath, item)
                results.unexpected.push(`⚠️ ${relativePath} (未预期)`)
            }
        }
    } catch (error) {
        // 目录不存在，已经在上面处理了
    }

    return results
}

// 生成结构报告
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
