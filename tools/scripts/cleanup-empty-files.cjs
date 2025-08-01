#!/usr/bin/env node

/**
 * 项目空文件清理工具
 * 自动检测并删除项目中的空文件（排除关键目录）
 */

const fs = require('fs')
const path = require('path')

// 需要排除的目录模式
const excludePatterns = [
    /node_modules/,
    /\.git/,
    /\.vscode/,
    /\.idea/,
    /dist/,
    /build/,
    /coverage/,
    /\.cache/
]

// 需要排除的文件模式
const excludeFilePatterns = [
    /^\./,  // 隐藏文件
    /\.log$/,
    /\.tmp$/,
    /\.temp$/
]

function shouldExclude(filePath) {
    return excludePatterns.some(pattern => pattern.test(filePath)) ||
        excludeFilePatterns.some(pattern => pattern.test(path.basename(filePath)))
}

function findEmptyFiles(dir, baseDir = dir) {
    const emptyFiles = []

    try {
        const items = fs.readdirSync(dir)

        for (const item of items) {
            const fullPath = path.join(dir, item)
            const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')

            if (shouldExclude(relativePath)) {
                continue
            }

            try {
                const stat = fs.statSync(fullPath)

                if (stat.isDirectory()) {
                    emptyFiles.push(...findEmptyFiles(fullPath, baseDir))
                } else if (stat.isFile() && stat.size === 0) {
                    emptyFiles.push(relativePath)
                }
            } catch (error) {
                console.warn(`⚠️ 无法访问文件: ${relativePath}`)
            }
        }
    } catch (error) {
        console.warn(`⚠️ 无法访问目录: ${dir}`)
    }

    return emptyFiles
}

function cleanupEmptyFiles(projectRoot, dryRun = false) {
    console.log('🧹 项目空文件清理工具')
    console.log('='.repeat(50))

    const emptyFiles = findEmptyFiles(projectRoot)

    if (emptyFiles.length === 0) {
        console.log('✅ 没有发现空文件，项目已经很干净了！')
        return { removed: [], errors: [] }
    }

    console.log(`\n📋 发现 ${emptyFiles.length} 个空文件:`)
    emptyFiles.forEach(file => console.log(`  📄 ${file}`))

    if (dryRun) {
        console.log('\n🔍 这是预览模式，没有实际删除文件')
        console.log('💡 要实际删除文件，请运行: npm run cleanup')
        return { removed: [], errors: [] }
    }

    console.log('\n🗑️ 开始删除空文件...')

    const results = { removed: [], errors: [] }

    for (const file of emptyFiles) {
        try {
            const fullPath = path.join(projectRoot, file)
            fs.unlinkSync(fullPath)
            results.removed.push(file)
            console.log(`  ✅ 已删除: ${file}`)
        } catch (error) {
            results.errors.push({ file, error: error.message })
            console.log(`  ❌ 删除失败: ${file} - ${error.message}`)
        }
    }

    console.log('\n📊 清理结果:')
    console.log(`  ✅ 成功删除: ${results.removed.length} 个文件`)
    if (results.errors.length > 0) {
        console.log(`  ❌ 删除失败: ${results.errors.length} 个文件`)
    }

    if (results.removed.length > 0) {
        console.log('\n🎉 清理完成！项目变得更加整洁了')
    }

    return results
}

// 主函数
function main() {
    const projectRoot = process.cwd()
    const args = process.argv.slice(2)
    const dryRun = args.includes('--dry-run') || args.includes('-d')

    console.log(`🔍 检查项目: ${projectRoot}`)

    try {
        const results = cleanupEmptyFiles(projectRoot, dryRun)

        // 返回适当的退出码
        if (results.errors.length > 0) {
            process.exit(1)
        } else {
            process.exit(0)
        }
    } catch (error) {
        console.error('❌ 清理过程中出现错误:', error.message)
        process.exit(1)
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main()
}

module.exports = { findEmptyFiles, cleanupEmptyFiles }
