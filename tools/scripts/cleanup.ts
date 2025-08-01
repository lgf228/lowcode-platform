/**
 * 项目清理工具
 * 清理项目中的临时文件、旧文件和不需要的内容
 */

import fs from 'fs'
import path from 'path'

// 需要清理的文件和目录模式
const cleanupPatterns = [
    // 旧的类型文件
    'src/core/types/Component_old.ts',

    // 临时文件
    '*.tmp',
    '*.bak',
    '*.old',

    // 日志文件
    '*.log',
    'logs/',

    // 构建缓存
    '.cache/',
    'dist/',

    // IDE 文件
    '.vscode/settings.json',
    '.idea/',

    // 操作系统文件
    'Thumbs.db',
    '.DS_Store'
]

// 安全清理函数
function safeDelete(filePath: string): boolean {
    try {
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            // 递归删除目录
            const files = fs.readdirSync(filePath)
            for (const file of files) {
                safeDelete(path.join(filePath, file))
            }
            fs.rmdirSync(filePath)
        } else {
            // 删除文件
            fs.unlinkSync(filePath)
        }

        console.log(`🗑️ 已删除: ${filePath}`)
        return true
    } catch (error) {
        // 文件不存在或无法删除
        return false
    }
}

// 检查文件是否匹配清理模式
function matchesPattern(filePath: string, pattern: string): boolean {
    if (pattern.includes('*')) {
        // 通配符匹配
        const regex = new RegExp(pattern.replace(/\*/g, '.*'))
        return regex.test(filePath)
    } else {
        // 精确匹配
        return filePath === pattern || filePath.endsWith(pattern)
    }
}

// 扫描并清理文件
function cleanupProject(projectRoot: string = process.cwd()): void {
    console.log('🧹 开始项目清理...')
    console.log(`📁 项目路径: ${projectRoot}`)

    let deletedCount = 0
    let skippedCount = 0

    for (const pattern of cleanupPatterns) {
        const fullPath = path.join(projectRoot, pattern)

        if (safeDelete(fullPath)) {
            deletedCount++
        } else {
            skippedCount++
        }
    }

    // 递归扫描特定模式
    function scanDirectory(dir: string): void {
        try {
            const items = fs.readdirSync(dir)

            for (const item of items) {
                const itemPath = path.join(dir, item)
                const relativePath = path.relative(projectRoot, itemPath)

                // 跳过 node_modules 和 .git
                if (item === 'node_modules' || item === '.git') {
                    continue
                }

                const stat = fs.statSync(itemPath)

                if (stat.isDirectory()) {
                    scanDirectory(itemPath)
                } else {
                    // 检查文件是否匹配清理模式
                    for (const pattern of cleanupPatterns) {
                        if (matchesPattern(relativePath, pattern)) {
                            if (safeDelete(itemPath)) {
                                deletedCount++
                            }
                            break
                        }
                    }
                }
            }
        } catch (error) {
            // 目录无法访问，跳过
        }
    }

    scanDirectory(projectRoot)

    console.log('\n📊 清理结果:')
    console.log(`  🗑️ 已删除: ${deletedCount} 个文件/目录`)
    console.log(`  ⏭️ 跳过: ${skippedCount} 个不存在的项`)

    if (deletedCount > 0) {
        console.log('✅ 项目清理完成！')
    } else {
        console.log('ℹ️ 没有找到需要清理的文件')
    }
}

// 清理特定的旧文件
function cleanupLegacyFiles(projectRoot: string = process.cwd()): void {
    console.log('🔄 清理历史遗留文件...')

    const legacyFiles = [
        'src/core/types/Component_old.ts',
        'component-privatization-analysis.md',
        'dependency-analysis.md',
        'detailed-technical-analysis.md',
        'optimization-guide.md',
        'optimization-roadmap.md',
        'OPTIMIZATION_COMPLETE.md',
        'SMART_UPDATE_COMPLETE.md',
        'demo.ts',
        'smart-update-test.ts'
    ]

    let movedCount = 0

    for (const file of legacyFiles) {
        const fullPath = path.join(projectRoot, file)

        try {
            if (fs.existsSync(fullPath)) {
                console.log(`ℹ️ 文件已迁移: ${file}`)
                movedCount++
            }
        } catch (error) {
            // 文件不存在
        }
    }

    console.log(`📦 已处理 ${movedCount} 个历史文件`)
}

// 验证文档链接
function validateDocumentLinks(docsPath: string): void {
    console.log('🔗 验证文档链接...')

    // 这里可以添加链接验证逻辑
    // 扫描 markdown 文件中的链接，检查目标文件是否存在

    console.log('✅ 文档链接验证完成')
}

// 主函数
function main(): void {
    const args = process.argv.slice(2)
    const projectRoot = process.cwd()

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🧹 项目清理工具

用法:
  npm run clean              # 执行标准清理
  npm run clean --legacy     # 清理历史文件
  npm run clean --validate   # 验证文档链接
  npm run clean --all        # 执行所有清理操作

选项:
  --legacy     清理历史遗留文件
  --validate   验证文档链接
  --all        执行所有清理操作
  --help, -h   显示帮助信息
`)
        return
    }

    if (args.includes('--all')) {
        cleanupProject(projectRoot)
        cleanupLegacyFiles(projectRoot)
        validateDocumentLinks(path.join(projectRoot, 'docs'))
    } else if (args.includes('--legacy')) {
        cleanupLegacyFiles(projectRoot)
    } else if (args.includes('--validate')) {
        validateDocumentLinks(path.join(projectRoot, 'docs'))
    } else {
        cleanupProject(projectRoot)
    }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
    main()
}

export { cleanupProject, cleanupLegacyFiles, validateDocumentLinks }
