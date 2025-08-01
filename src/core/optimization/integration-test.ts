/**
 * 优化系统集成测试
 * 验证所有优化功能的集成工作情况
 */

import {
    optimizeComponent,
    optimizeComponentTree,
    getOptimizationStats,
    analyzeOptimization,
    performanceMonitor
} from './index'

import {
    BatchOptimizationUtils,
    PerformanceAnalysisUtils,
    DebugUtils,
    BenchmarkUtils
} from './utils'

import { ComponentType } from '../types/Component'
import type {
    InputComponent,
    FormComponent,
    Container as ContainerComponent,
    Component
} from '../types/Component'

/**
 * 创建测试组件
 */
function createTestComponents() {
    const inputComponent: InputComponent = {
        id: 'test-input-001',
        name: 'test-username-input',
        version: '1.0.0',
        type: ComponentType.INPUT,
        colSpan: 12,
        rowSpan: 1,
        order: 1,
        fieldName: 'username',
        label: '用户名',
        placeholder: '请输入用户名',
        required: true,
        validation: {
            minLength: 3,
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_]+$'
        }
    }

    const emailComponent: InputComponent = {
        id: 'test-input-002',
        name: 'test-email-input',
        version: '1.0.0',
        type: ComponentType.INPUT,
        colSpan: 12,
        rowSpan: 1,
        order: 2,
        fieldName: 'email',
        label: '邮箱',
        placeholder: '请输入邮箱',
        required: true,
        validation: {
            pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
        }
    }

    const passwordComponent: InputComponent = {
        id: 'test-input-003',
        name: 'test-password-input',
        version: '1.0.0',
        type: ComponentType.INPUT,
        colSpan: 12,
        rowSpan: 1,
        order: 3,
        fieldName: 'password',
        label: '密码',
        inputType: 'password',
        required: true,
        validation: {
            minLength: 8,
            maxLength: 20
        }
    }

    const containerComponent: ContainerComponent = {
        id: 'test-container-001',
        name: 'test-user-fields-container',
        version: '1.0.0',
        type: ComponentType.CONTAINER,
        colSpan: 24,
        rowSpan: 6,
        order: 1,
        layout: { direction: 'vertical' },
        children: [inputComponent, emailComponent, passwordComponent]
    }

    const formComponent: FormComponent = {
        id: 'test-form-001',
        name: 'test-registration-form',
        version: '1.0.0',
        type: ComponentType.FORM,
        colSpan: 24,
        rowSpan: 12,
        order: 1,
        dataLevel: 'row',
        children: [containerComponent]
    }

    return {
        inputComponent,
        emailComponent,
        passwordComponent,
        containerComponent,
        formComponent
    }
}

/**
 * 测试单个组件优化
 */
async function testSingleComponentOptimization() {
    console.log('\n🧪 测试单个组件优化...')

    const { inputComponent } = createTestComponents()

    // 1. 优化组件
    const optimizedInput = optimizeComponent(inputComponent)

    // 2. 测试状态管理
    optimizedInput.updateOptimizedState('_internalState', {
        hover: false,
        focus: false,
        touched: false
    })

    const internalState = optimizedInput.getOptimizedState('_internalState')
    console.log('✅ 内部状态管理:', internalState)

    // 3. 测试性能监控
    performanceMonitor.startMonitoring(optimizedInput)
    performanceMonitor.recordRenderTime(optimizedInput.id, 12.5)
    performanceMonitor.recordStateUpdate(optimizedInput.id, '_internalState')

    const metrics = optimizedInput.getPerformanceMetrics()
    console.log('✅ 性能指标:', metrics)

    // 4. 测试智能更新
    const shouldUpdate = optimizedInput.shouldComponentUpdate(
        { value: 'old' },
        { value: 'new' }
    )
    console.log('✅ 智能更新决策:', shouldUpdate)

    performanceMonitor.stopMonitoring(optimizedInput)

    return optimizedInput
}

/**
 * 测试组件树优化
 */
async function testComponentTreeOptimization() {
    console.log('\n🌲 测试组件树优化...')

    const { formComponent } = createTestComponents()

    // 1. 优化整个组件树
    const optimizedForm = optimizeComponentTree(formComponent)

    // 2. 验证所有子组件都被优化
    function verifyOptimization(component: Component, level = 0) {
        const indent = '  '.repeat(level)
        console.log(`${indent}📦 ${component.name} (${component.type})`)

        // 检查是否有优化功能
        if ('getOptimizedState' in component) {
            console.log(`${indent}  ✅ 已优化`)
        } else {
            console.log(`${indent}  ❌ 未优化`)
        }

        // 递归检查子组件
        if ('children' in component && component.children) {
            component.children.forEach((child: Component) => verifyOptimization(child, level + 1))
        }
    }

    verifyOptimization(optimizedForm)

    return optimizedForm
}

/**
 * 测试批量操作
 */
async function testBatchOperations() {
    console.log('\n📦 测试批量操作...')

    const { inputComponent, emailComponent, passwordComponent } = createTestComponents()
    const components = [
        optimizeComponent(inputComponent),
        optimizeComponent(emailComponent),
        optimizeComponent(passwordComponent)
    ]

    // 1. 批量初始化状态
    BatchOptimizationUtils.batchInitializeStates(components, [
        '_internalState',
        '_validationState',
        '_valueState'
    ])
    console.log('✅ 批量状态初始化完成')

    // 2. 批量收集性能数据
    components.forEach(comp => {
        performanceMonitor.recordRenderTime(comp.id, Math.random() * 20 + 5)
        performanceMonitor.recordMemoryUsage(comp.id, Math.random() * 1024 + 512)
    })

    const metricsData = BatchOptimizationUtils.batchCollectMetrics(components)
    console.log('✅ 批量性能数据收集:', metricsData)

    // 3. 批量清理
    BatchOptimizationUtils.batchCleanupStates(components)
    console.log('✅ 批量清理完成')

    return components
}

/**
 * 测试性能分析
 */
async function testPerformanceAnalysis() {
    console.log('\n📊 测试性能分析...')

    const { formComponent } = createTestComponents()
    const optimizedForm = optimizeComponentTree(formComponent)

    // 1. 收集性能数据
    function collectPerformanceData(component: Component) {
        if ('getPerformanceMetrics' in component) {
            performanceMonitor.recordRenderTime(component.id, Math.random() * 25 + 5)
            performanceMonitor.recordMemoryUsage(component.id, Math.random() * 2048 + 256)
            performanceMonitor.recordStateUpdate(component.id, '_testState')
        }

        if ('children' in component && component.children) {
            component.children.forEach(collectPerformanceData)
        }
    }

    collectPerformanceData(optimizedForm)

    // 2. 获取组件ID列表
    function getComponentIds(component: Component): string[] {
        const ids = [component.id]
        if ('children' in component && component.children) {
            component.children.forEach((child: Component) => {
                ids.push(...getComponentIds(child))
            })
        }
        return ids
    }

    const componentIds = getComponentIds(optimizedForm)

    // 3. 渲染性能分析
    const renderAnalysis = PerformanceAnalysisUtils.analyzeRenderPerformance(componentIds)
    console.log('📈 渲染性能分析:', renderAnalysis)

    // 4. 内存使用分析
    const memoryAnalysis = PerformanceAnalysisUtils.analyzeMemoryUsage(componentIds)
    console.log('🧠 内存使用分析:', memoryAnalysis)

    return {
        renderAnalysis,
        memoryAnalysis
    }
}

/**
 * 测试基准测试
 */
async function testBenchmarks() {
    console.log('\n⚡ 测试基准测试...')

    const { inputComponent } = createTestComponents()
    const optimizedInput = optimizeComponent(inputComponent)

    // 1. 渲染基准测试
    console.log('开始渲染基准测试...')
    const renderBenchmark = await BenchmarkUtils.benchmarkRender(optimizedInput, 50)
    console.log(`🏎️ 渲染基准测试 (50次):
- 平均时间: ${renderBenchmark.averageTime.toFixed(2)}ms
- 最短时间: ${renderBenchmark.minTime.toFixed(2)}ms
- 最长时间: ${renderBenchmark.maxTime.toFixed(2)}ms`)

    // 2. 状态操作基准测试
    console.log('开始状态操作基准测试...')
    const stateBenchmark = BenchmarkUtils.benchmarkStateOperations(optimizedInput, 500)
    console.log(`💾 状态操作基准测试 (500次):
- 初始化时间: ${stateBenchmark.initTime.toFixed(2)}ms
- 更新时间: ${stateBenchmark.updateTime.toFixed(2)}ms
- 读取时间: ${stateBenchmark.readTime.toFixed(2)}ms`)

    return {
        renderBenchmark,
        stateBenchmark
    }
}

/**
 * 测试调试工具
 */
function testDebuggingTools() {
    console.log('\n🔍 测试调试工具...')

    const { inputComponent } = createTestComponents()
    const optimizedInput = optimizeComponent(inputComponent)

    // 1. 初始化一些状态用于调试
    optimizedInput.updateOptimizedState('_internalState', {
        hover: true,
        focus: false,
        touched: true
    })

    optimizedInput.updateOptimizedState('_validationState', {
        isValid: false,
        errors: ['用户名不能为空']
    })

    // 2. 测试状态打印（仅在开发环境）
    if (process.env.NODE_ENV !== 'test') {
        DebugUtils.printComponentState(optimizedInput)
    }

    // 3. 生成状态报告
    const stateReport = DebugUtils.generateStateReport(optimizedInput)
    console.log('📋 状态报告:', stateReport)

    return stateReport
}

/**
 * 测试系统级统计
 */
function testSystemStatistics() {
    console.log('\n📈 测试系统级统计...')

    // 1. 获取优化统计
    const stats = getOptimizationStats()
    console.log('🔢 优化统计:', stats)

    // 2. 运行完整分析
    const analysis = analyzeOptimization()
    console.log('🎯 优化分析:', analysis)

    return {
        stats,
        analysis
    }
}

/**
 * 主测试函数
 */
export async function runIntegrationTests() {
    console.log('🚀 开始运行优化系统集成测试\n')

    const results = {
        singleComponent: null as any,
        componentTree: null as any,
        batchOperations: null as any,
        performanceAnalysis: null as any,
        benchmarks: null as any,
        debugging: null as any,
        systemStats: null as any
    }

    try {
        // 1. 单个组件优化测试
        results.singleComponent = await testSingleComponentOptimization()

        // 2. 组件树优化测试
        results.componentTree = await testComponentTreeOptimization()

        // 3. 批量操作测试
        results.batchOperations = await testBatchOperations()

        // 4. 性能分析测试
        results.performanceAnalysis = await testPerformanceAnalysis()

        // 5. 基准测试
        results.benchmarks = await testBenchmarks()

        // 6. 调试工具测试
        results.debugging = testDebuggingTools()

        // 7. 系统统计测试
        results.systemStats = testSystemStatistics()

        console.log('\n✅ 所有集成测试完成！')
        console.log('\n📊 测试结果摘要:')
        console.log(`- 单个组件优化: ${results.singleComponent ? '✅' : '❌'}`)
        console.log(`- 组件树优化: ${results.componentTree ? '✅' : '❌'}`)
        console.log(`- 批量操作: ${results.batchOperations ? '✅' : '❌'}`)
        console.log(`- 性能分析: ${results.performanceAnalysis ? '✅' : '❌'}`)
        console.log(`- 基准测试: ${results.benchmarks ? '✅' : '❌'}`)
        console.log(`- 调试工具: ${results.debugging ? '✅' : '❌'}`)
        console.log(`- 系统统计: ${results.systemStats ? '✅' : '❌'}`)

        return results

    } catch (error) {
        console.error('❌ 集成测试失败:', error)
        throw error
    }
}

/**
 * 如果直接运行此文件，执行测试
 */
if (require.main === module) {
    runIntegrationTests()
        .then((_results) => {
            console.log('\n🎉 集成测试成功完成')
            process.exit(0)
        })
        .catch((error) => {
            console.error('\n💥 集成测试失败:', error)
            process.exit(1)
        })
}

export default runIntegrationTests
