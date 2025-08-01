// ===========================
// Optimization Utils - 优化工具函数
// ===========================

import { Component } from '../types/Component'
import { optimizedStateManager, performanceMonitor } from './index'

/**
 * 批量优化工具
 */
export class BatchOptimizationUtils {
    /**
     * 批量初始化组件状态
     */
    static batchInitializeStates<T extends Component>(
        components: T[],
        stateKeys: string[]
    ): void {
        for (const component of components) {
            for (const stateKey of stateKeys) {
                optimizedStateManager.getOrInitializeState(component, stateKey)
            }
        }
    }

    /**
     * 批量清理组件状态
     */
    static batchCleanupStates<T extends Component>(components: T[]): void {
        for (const component of components) {
            optimizedStateManager.destroyComponentStates(component)
        }
    }

    /**
     * 批量收集性能数据
     */
    static batchCollectMetrics<T extends Component>(components: T[]) {
        return components.map(component => ({
            componentId: component.id,
            metrics: performanceMonitor.getMetrics(component.id)
        })).filter(item => item.metrics !== undefined)
    }
}

/**
 * 性能分析工具
 */
export class PerformanceAnalysisUtils {
    /**
     * 分析渲染性能
     */
    static analyzeRenderPerformance(componentIds: string[]) {
        const metrics = componentIds
            .map(id => performanceMonitor.getMetrics(id))
            .filter(m => m !== undefined)

        if (metrics.length === 0) {
            return {
                averageRenderTime: 0,
                slowestComponent: null,
                fastestComponent: null,
                recommendations: ['没有足够的性能数据进行分析']
            }
        }

        const renderTimes = metrics.map(m => m.averageRenderTime)
        const averageRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length

        const slowest = metrics.reduce((prev, current) =>
            prev.averageRenderTime > current.averageRenderTime ? prev : current
        )

        const fastest = metrics.reduce((prev, current) =>
            prev.averageRenderTime < current.averageRenderTime ? prev : current
        )

        const recommendations = this.generateRenderRecommendations(metrics)

        return {
            averageRenderTime,
            slowestComponent: slowest,
            fastestComponent: fastest,
            recommendations
        }
    }

    /**
     * 分析内存使用
     */
    static analyzeMemoryUsage(componentIds: string[]) {
        const memoryStats = optimizedStateManager.getPerformanceStats()
        const componentMetrics = componentIds
            .map(id => performanceMonitor.getMetrics(id))
            .filter(m => m !== undefined)

        const totalMemory = memoryStats.memory.estimatedMemoryUsage
        const avgMemoryPerComponent = componentIds.length > 0 ?
            totalMemory / componentIds.length : 0

        const memoryHotspots = componentMetrics
            .filter(m => {
                const avgMemory = m.memoryUsage.reduce((sum, mem) => sum + mem, 0) /
                    (m.memoryUsage.length || 1)
                return avgMemory > avgMemoryPerComponent * 2 // 超过平均值2倍
            })
            .map(m => m.componentId)

        return {
            totalMemory,
            avgMemoryPerComponent,
            memoryHotspots,
            poolStats: memoryStats.pool,
            recommendations: this.generateMemoryRecommendations(memoryHotspots.length, totalMemory)
        }
    }

    private static generateRenderRecommendations(metrics: any[]): string[] {
        const recommendations: string[] = []
        const slowComponents = metrics.filter(m => m.averageRenderTime > 16)

        if (slowComponents.length > 0) {
            recommendations.push(`有 ${slowComponents.length} 个组件渲染时间超过 16ms，建议优化`)
        }

        const highUpdateComponents = metrics.filter(m => m.stateUpdateCount > 100)
        if (highUpdateComponents.length > 0) {
            recommendations.push(`有 ${highUpdateComponents.length} 个组件状态更新频繁，考虑批量更新`)
        }

        return recommendations
    }

    private static generateMemoryRecommendations(hotspotCount: number, totalMemory: number): string[] {
        const recommendations: string[] = []

        if (hotspotCount > 0) {
            recommendations.push(`发现 ${hotspotCount} 个内存热点组件，建议检查数据结构优化`)
        }

        if (totalMemory > 50 * 1024 * 1024) { // 50MB
            recommendations.push('总内存使用量较高，建议启用更激进的缓存策略')
        }

        return recommendations
    }
}

/**
 * 调试工具
 */
export class DebugUtils {
    /**
     * 打印组件状态
     */
    static printComponentState<T extends Component>(component: T): void {
        console.group(`Component State: ${component.id}`)

        // 打印基本信息
        console.log('Basic Info:', {
            id: component.id,
            type: component.type,
            name: component.name
        })

        // 打印性能指标
        const metrics = performanceMonitor.getMetrics(component.id)
        if (metrics) {
            console.log('Performance Metrics:', metrics)
        }

        // 打印内存统计
        const memoryStats = optimizedStateManager.getPerformanceStats()
        console.log('Memory Stats:', memoryStats)

        console.groupEnd()
    }

    /**
     * 生成组件状态报告
     */
    static generateStateReport<T extends Component>(component: T): string {
        const metrics = performanceMonitor.getMetrics(component.id)
        const memoryStats = optimizedStateManager.getPerformanceStats()

        return `
# Component State Report: ${component.id}

## Basic Information
- ID: ${component.id}
- Type: ${component.type}
- Name: ${component.name}

## Performance Metrics
${metrics ? `
- Render Count: ${metrics.renderTimes.length}
- Average Render Time: ${metrics.averageRenderTime.toFixed(2)}ms
- Max Render Time: ${metrics.maxRenderTime.toFixed(2)}ms
- State Updates: ${metrics.stateUpdateCount}
` : '- No performance data available'}

## Memory Usage
- Total Memory: ${memoryStats.memory.estimatedMemoryUsage} bytes
- Total States: ${memoryStats.memory.totalStates}
- Pool Hit Rate: ${Object.values(memoryStats.pool.pools)
                .reduce((sum, pool) => sum + pool.hitRate, 0) /
            Object.keys(memoryStats.pool.pools).length * 100}%

## Recommendations
${this.generateComponentRecommendations(component, metrics)}
    `.trim()
    }

    private static generateComponentRecommendations<T extends Component>(
        component: T,
        metrics: any
    ): string {
        const recommendations: string[] = []

        if (metrics && metrics.averageRenderTime > 16) {
            recommendations.push('- 考虑使用 React.memo 或其他渲染优化')
        }

        if (metrics && metrics.stateUpdateCount > 50) {
            recommendations.push('- 检查是否有不必要的状态更新')
        }

        // 基于组件类型的建议
        switch (component.type) {
            case 'datagrid':
                recommendations.push('- 大数据表格建议启用虚拟化')
                break
            case 'form':
                recommendations.push('- 表单组件建议使用防抖优化')
                break
        }

        return recommendations.length > 0 ?
            recommendations.join('\n') :
            '- 当前组件性能良好，无特别建议'
    }
}

/**
 * 配置工具
 */
export class OptimizationConfigUtils {
    /**
     * 创建默认优化配置
     */
    static createDefaultConfig() {
        return {
            enableLazyState: true,
            enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
            enableIntelligentUpdates: true,
            enableMemoryOptimization: true,
            thresholds: {
                slowRenderTime: 16, // ms
                highUpdateCount: 100,
                memoryWarningSize: 1024 * 1024 // 1MB
            }
        }
    }

    /**
     * 创建生产环境配置
     */
    static createProductionConfig() {
        return {
            enableLazyState: true,
            enablePerformanceMonitoring: false,
            enableIntelligentUpdates: true,
            enableMemoryOptimization: true,
            thresholds: {
                slowRenderTime: 32, // 生产环境更宽松
                highUpdateCount: 200,
                memoryWarningSize: 5 * 1024 * 1024 // 5MB
            }
        }
    }

    /**
     * 创建开发环境配置
     */
    static createDevelopmentConfig() {
        return {
            enableLazyState: true,
            enablePerformanceMonitoring: true,
            enableIntelligentUpdates: true,
            enableMemoryOptimization: true,
            thresholds: {
                slowRenderTime: 8, // 开发环境更严格
                highUpdateCount: 50,
                memoryWarningSize: 512 * 1024 // 512KB
            }
        }
    }
}

/**
 * 性能基准测试工具
 */
export class BenchmarkUtils {
    /**
     * 测试组件渲染性能
     */
    static async benchmarkRender<T extends Component>(
        component: T,
        iterations: number = 100
    ): Promise<{
        averageTime: number
        minTime: number
        maxTime: number
        times: number[]
    }> {
        const times: number[] = []

        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now()

            // 模拟渲染过程（在实际应用中会触发真实渲染）
            performanceMonitor.startRenderTiming(component.id)
            await new Promise(resolve => setTimeout(resolve, 1))
            performanceMonitor.endRenderTiming(component.id)

            const endTime = performance.now()
            times.push(endTime - startTime)
        }

        const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length
        const minTime = Math.min(...times)
        const maxTime = Math.max(...times)

        return {
            averageTime,
            minTime,
            maxTime,
            times
        }
    }

    /**
     * 测试状态管理性能
     */
    static benchmarkStateOperations<T extends Component>(
        component: T,
        operations: number = 1000
    ): {
        initTime: number
        updateTime: number
        readTime: number
    } {
        // 测试初始化时间
        const initStart = performance.now()
        for (let i = 0; i < operations; i++) {
            optimizedStateManager.getOrInitializeState(component, `_testState${i}`)
        }
        const initTime = performance.now() - initStart

        // 测试更新时间
        const updateStart = performance.now()
        for (let i = 0; i < operations; i++) {
            optimizedStateManager.updateState(component, `_testState${i}`, { value: i })
        }
        const updateTime = performance.now() - updateStart

        // 测试读取时间
        const readStart = performance.now()
        for (let i = 0; i < operations; i++) {
            optimizedStateManager.getOrInitializeState(component, `_testState${i}`)
        }
        const readTime = performance.now() - readStart

        // 清理测试状态
        optimizedStateManager.destroyComponentStates(component)

        return {
            initTime,
            updateTime,
            readTime
        }
    }
}
