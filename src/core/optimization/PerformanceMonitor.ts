// ===========================
// Performance Monitoring - 性能监控工具
// ===========================

import { Component } from '../types/Component'

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
    componentId: string
    componentType: string
    renderTimes: number[]
    averageRenderTime: number
    maxRenderTime: number
    minRenderTime: number
    memoryUsage: number[]
    stateUpdateCount: number
    cacheHitRate: number
    lifecycleMetrics: {
        mountTime?: number
        unmountTime?: number
        updateCount: number
        lastUpdateTime?: number
    }
}

/**
 * 性能监控器接口
 */
export interface PerformanceMonitor {
    /**
     * 开始监控组件
     */
    startMonitoring(component: Component): void

    /**
     * 停止监控组件
     */
    stopMonitoring(component: Component): void

    /**
     * 记录渲染时间
     */
    recordRenderTime(componentId: string, renderTime: number): void

    /**
     * 记录状态更新
     */
    recordStateUpdate(componentId: string, stateKey: string): void

    /**
     * 记录内存使用
     */
    recordMemoryUsage(componentId: string, memoryUsage: number): void

    /**
     * 获取组件性能指标
     */
    getMetrics(componentId: string): PerformanceMetrics | undefined

    /**
     * 获取所有组件的性能报告
     */
    generatePerformanceReport(): PerformanceReport

    /**
     * 清理监控数据
     */
    cleanup(): void
}

/**
 * 性能报告接口
 */
export interface PerformanceReport {
    summary: {
        totalComponents: number
        averageRenderTime: number
        slowComponents: string[]
        memoryHotspots: string[]
        highUpdateComponents: string[]
    }
    details: PerformanceMetrics[]
    recommendations: string[]
}

/**
 * 渲染性能监控器实现
 */
export class ComponentPerformanceMonitor implements PerformanceMonitor {
    private metrics = new Map<string, PerformanceMetrics>()
    private activeMonitoring = new Set<string>()
    private renderStartTimes = new Map<string, number>()

    // 性能阈值配置
    private readonly SLOW_RENDER_THRESHOLD = 16 // 16ms (一帧时间)
    private readonly HIGH_UPDATE_THRESHOLD = 100 // 高频更新阈值
    private readonly MEMORY_WARNING_THRESHOLD = 1024 * 1024 // 1MB

    startMonitoring(component: Component): void {
        if (this.activeMonitoring.has(component.id)) {
            return
        }

        this.activeMonitoring.add(component.id)
        this.initializeMetrics(component)

        // 在开发模式下才启用详细监控
        if (process.env.NODE_ENV === 'development') {
            this.setupDetailedMonitoring(component)
        }
    }

    stopMonitoring(component: Component): void {
        this.activeMonitoring.delete(component.id)

        // 记录卸载时间
        const metrics = this.metrics.get(component.id)
        if (metrics) {
            metrics.lifecycleMetrics.unmountTime = Date.now()
        }
    }

    recordRenderTime(componentId: string, renderTime: number): void {
        const metrics = this.metrics.get(componentId)
        if (!metrics) return

        metrics.renderTimes.push(renderTime)

        // 保持最近100次渲染记录
        if (metrics.renderTimes.length > 100) {
            metrics.renderTimes.shift()
        }

        // 更新统计信息
        this.updateRenderStats(metrics)
    }

    recordStateUpdate(componentId: string, stateKey: string): void {
        const metrics = this.metrics.get(componentId)
        if (!metrics) return

        metrics.stateUpdateCount++
        metrics.lifecycleMetrics.updateCount++
        metrics.lifecycleMetrics.lastUpdateTime = Date.now()

        // 记录具体的状态更新
        if (process.env.NODE_ENV === 'development') {
            console.debug(`State update in ${componentId}: ${stateKey}`)
        }
    }

    recordMemoryUsage(componentId: string, memoryUsage: number): void {
        const metrics = this.metrics.get(componentId)
        if (!metrics) return

        metrics.memoryUsage.push(memoryUsage)

        // 保持最近50次内存记录
        if (metrics.memoryUsage.length > 50) {
            metrics.memoryUsage.shift()
        }

        // 内存警告
        if (memoryUsage > this.MEMORY_WARNING_THRESHOLD) {
            console.warn(`High memory usage detected in component ${componentId}: ${memoryUsage} bytes`)
        }
    }

    getMetrics(componentId: string): PerformanceMetrics | undefined {
        return this.metrics.get(componentId)
    }

    generatePerformanceReport(): PerformanceReport {
        const allMetrics = Array.from(this.metrics.values())

        const summary = this.generateSummary(allMetrics)
        const recommendations = this.generateRecommendations(allMetrics)

        return {
            summary,
            details: allMetrics,
            recommendations
        }
    }

    cleanup(): void {
        this.metrics.clear()
        this.activeMonitoring.clear()
        this.renderStartTimes.clear()
    }

    /**
     * 开始渲染计时
     */
    startRenderTiming(componentId: string): void {
        this.renderStartTimes.set(componentId, performance.now())
    }

    /**
     * 结束渲染计时
     */
    endRenderTiming(componentId: string): void {
        const startTime = this.renderStartTimes.get(componentId)
        if (startTime) {
            const renderTime = performance.now() - startTime
            this.recordRenderTime(componentId, renderTime)
            this.renderStartTimes.delete(componentId)
        }
    }

    private initializeMetrics(component: Component): void {
        const metrics: PerformanceMetrics = {
            componentId: component.id,
            componentType: component.type as string,
            renderTimes: [],
            averageRenderTime: 0,
            maxRenderTime: 0,
            minRenderTime: 0,
            memoryUsage: [],
            stateUpdateCount: 0,
            cacheHitRate: 0,
            lifecycleMetrics: {
                mountTime: Date.now(),
                updateCount: 0
            }
        }

        this.metrics.set(component.id, metrics)
    }

    private setupDetailedMonitoring(component: Component): void {
        // 在实际应用中，这里会设置React DevTools钩子或其他监控机制
        // 目前只是示例结构
        console.debug(`Detailed monitoring started for component: ${component.id}`)
    }

    private updateRenderStats(metrics: PerformanceMetrics): void {
        const { renderTimes } = metrics

        if (renderTimes.length === 0) return

        metrics.averageRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
        metrics.maxRenderTime = Math.max(...renderTimes)
        metrics.minRenderTime = Math.min(...renderTimes)
    }

    private generateSummary(allMetrics: PerformanceMetrics[]) {
        const totalComponents = allMetrics.length
        const averageRenderTime = this.calculateOverallAverageRenderTime(allMetrics)

        const slowComponents = allMetrics
            .filter(m => m.averageRenderTime > this.SLOW_RENDER_THRESHOLD)
            .map(m => m.componentId)

        const memoryHotspots = allMetrics
            .filter(m => {
                const avgMemory = m.memoryUsage.reduce((sum, mem) => sum + mem, 0) / (m.memoryUsage.length || 1)
                return avgMemory > this.MEMORY_WARNING_THRESHOLD
            })
            .map(m => m.componentId)

        const highUpdateComponents = allMetrics
            .filter(m => m.stateUpdateCount > this.HIGH_UPDATE_THRESHOLD)
            .map(m => m.componentId)

        return {
            totalComponents,
            averageRenderTime,
            slowComponents,
            memoryHotspots,
            highUpdateComponents
        }
    }

    private generateRecommendations(allMetrics: PerformanceMetrics[]): string[] {
        const recommendations: string[] = []

        // 慢渲染组件建议
        const slowComponents = allMetrics.filter(m => m.averageRenderTime > this.SLOW_RENDER_THRESHOLD)
        if (slowComponents.length > 0) {
            recommendations.push(
                `发现 ${slowComponents.length} 个慢渲染组件，建议：1) 使用 React.memo 优化；2) 检查不必要的重新渲染；3) 优化渲染逻辑复杂度`
            )
        }

        // 高频更新组件建议
        const highUpdateComponents = allMetrics.filter(m => m.stateUpdateCount > this.HIGH_UPDATE_THRESHOLD)
        if (highUpdateComponents.length > 0) {
            recommendations.push(
                `发现 ${highUpdateComponents.length} 个高频状态更新组件，建议：1) 合并状态更新；2) 使用防抖或节流；3) 检查是否有不必要的状态变更`
            )
        }

        // 内存使用建议
        const memoryHotspots = allMetrics.filter(m => {
            const avgMemory = m.memoryUsage.reduce((sum, mem) => sum + mem, 0) / (m.memoryUsage.length || 1)
            return avgMemory > this.MEMORY_WARNING_THRESHOLD
        })
        if (memoryHotspots.length > 0) {
            recommendations.push(
                `发现 ${memoryHotspots.length} 个内存热点组件，建议：1) 检查内存泄漏；2) 优化数据结构；3) 使用虚拟化处理大数据`
            )
        }

        // 通用建议
        if (allMetrics.length > 50) {
            recommendations.push('组件数量较多，建议：1) 考虑组件懒加载；2) 使用代码分割；3) 优化组件树结构')
        }

        return recommendations
    }

    private calculateOverallAverageRenderTime(allMetrics: PerformanceMetrics[]): number {
        const totalRenderTime = allMetrics.reduce((sum, m) =>
            sum + m.renderTimes.reduce((s, t) => s + t, 0), 0
        )
        const totalRenders = allMetrics.reduce((sum, m) => sum + m.renderTimes.length, 0)
        return totalRenders > 0 ? totalRenderTime / totalRenders : 0
    }
}

/**
 * 智能更新策略接口
 */
export interface UpdateStrategy {
    /**
     * 判断组件是否应该更新
     */
    shouldComponentUpdate(
        component: Component,
        prevProps: any,
        nextProps: any
    ): boolean
}

/**
 * 智能更新策略实现
 */
export class IntelligentUpdateStrategy implements UpdateStrategy {
    private performanceMonitor: ComponentPerformanceMonitor

    constructor(performanceMonitor: ComponentPerformanceMonitor) {
        this.performanceMonitor = performanceMonitor
    }

    shouldComponentUpdate(component: Component, prevProps: any, nextProps: any): boolean {
        // 开始性能监控
        this.performanceMonitor.startRenderTiming(component.id)

        // 基于组件类型的差异化更新策略
        const shouldUpdate = this.determineShouldUpdate(component, prevProps, nextProps)

        // 如果不需要更新，结束计时
        if (!shouldUpdate) {
            this.performanceMonitor.endRenderTiming(component.id)
        }

        return shouldUpdate
    }

    private determineShouldUpdate(component: Component, prevProps: any, nextProps: any): boolean {
        const componentType = component.type

        // 基于组件类型的优化策略
        switch (componentType) {
            case 'input':
            case 'textarea':
                return this.shouldUpdateValueComponent(prevProps, nextProps)

            case 'datagrid':
                return this.shouldUpdateDataGrid(prevProps, nextProps)

            case 'form':
                return this.shouldUpdateForm(prevProps, nextProps)

            case 'container':
                return this.shouldUpdateContainer(prevProps, nextProps)

            default:
                return this.defaultShouldUpdate(prevProps, nextProps)
        }
    }

    private shouldUpdateValueComponent(prevProps: any, nextProps: any): boolean {
        // 值组件只在关键属性变化时更新
        return (
            prevProps.value !== nextProps.value ||
            prevProps.disabled !== nextProps.disabled ||
            prevProps.visible !== nextProps.visible ||
            this.hasValidationChanged(prevProps, nextProps) ||
            this.hasStyleChanged(prevProps, nextProps)
        )
    }

    private shouldUpdateDataGrid(prevProps: any, nextProps: any): boolean {
        // 数据网格在数据、列配置或分页变化时更新
        return (
            !this.shallowEqual(prevProps.data, nextProps.data) ||
            !this.shallowEqual(prevProps.columns, nextProps.columns) ||
            this.hasPaginationChanged(prevProps, nextProps) ||
            prevProps.loading !== nextProps.loading
        )
    }

    private shouldUpdateForm(prevProps: any, nextProps: any): boolean {
        // 表单组件在子组件或配置变化时更新
        return (
            !this.shallowEqual(prevProps.children, nextProps.children) ||
            prevProps.disabled !== nextProps.disabled ||
            prevProps.readonly !== nextProps.readonly ||
            this.hasStyleChanged(prevProps, nextProps)
        )
    }

    private shouldUpdateContainer(prevProps: any, nextProps: any): boolean {
        // 容器组件在子组件列表或布局变化时更新
        return (
            !this.shallowEqual(prevProps.children, nextProps.children) ||
            !this.shallowEqual(prevProps.layout, nextProps.layout) ||
            prevProps.visible !== nextProps.visible
        )
    }

    private hasValidationChanged(prevProps: any, nextProps: any): boolean {
        return !this.shallowEqual(prevProps.rules, nextProps.rules)
    }

    private hasStyleChanged(prevProps: any, nextProps: any): boolean {
        return !this.shallowEqual(prevProps.style, nextProps.style) ||
            prevProps.className !== nextProps.className
    }

    private hasPaginationChanged(prevProps: any, nextProps: any): boolean {
        const prevPagination = prevProps.pagination || {}
        const nextPagination = nextProps.pagination || {}

        return (
            prevPagination.page !== nextPagination.page ||
            prevPagination.pageSize !== nextPagination.pageSize ||
            prevPagination.total !== nextPagination.total
        )
    }

    private defaultShouldUpdate(prevProps: any, nextProps: any): boolean {
        return !this.shallowEqual(prevProps, nextProps)
    }

    private shallowEqual(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) return true

        if (obj1 == null || obj2 == null) return obj1 === obj2

        if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
            return obj1 === obj2
        }

        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)

        if (keys1.length !== keys2.length) return false

        for (const key of keys1) {
            if (!keys2.includes(key) || obj1[key] !== obj2[key]) {
                return false
            }
        }

        return true
    }
}

// 导出单例实例
export const performanceMonitor = new ComponentPerformanceMonitor()
export const updateStrategy = new IntelligentUpdateStrategy(performanceMonitor)

// 工具函数
export function withPerformanceMonitoring<T extends Component>(component: T): T {
    performanceMonitor.startMonitoring(component)
    return component
}

export function generatePerformanceReport(): PerformanceReport {
    return performanceMonitor.generatePerformanceReport()
}
