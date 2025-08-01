// ===========================
// State Management Optimization - 状态管理优化
// ===========================

import { Component } from '../types/Component'

/**
 * 懒初始化状态管理器接口
 * 用于优化组件私有状态的内存使用
 */
export interface LazyStateManager {
    /**
     * 初始化指定类型的状态
     * @param component 组件实例
     * @param stateKey 状态键名
     * @returns 初始化的状态对象
     */
    initializeState<T>(component: Component, stateKey: string): T

    /**
     * 获取状态对象
     * @param component 组件实例
     * @param stateKey 状态键名
     * @returns 状态对象或undefined
     */
    getState<T>(component: Component, stateKey: string): T | undefined

    /**
     * 更新状态对象
     * @param component 组件实例
     * @param stateKey 状态键名
     * @param updates 状态更新
     */
    setState<T>(component: Component, stateKey: string, updates: Partial<T>): void

    /**
     * 销毁组件的所有状态
     * @param component 组件实例
     */
    destroyStates(component: Component): void

    /**
     * 获取内存使用统计
     */
    getMemoryStats(): StateMemoryStats
}

/**
 * 状态内存统计信息
 */
export interface StateMemoryStats {
    totalComponents: number
    totalStates: number
    estimatedMemoryUsage: number
    stateDistribution: Record<string, number>
}

/**
 * 状态模板定义
 */
type StateTemplate = () => any

/**
 * 懒初始化状态管理器实现
 */
export class ComponentLazyStateManager implements LazyStateManager {
    private stateMap = new WeakMap<Component, Map<string, any>>()
    private stateTemplates: Record<string, StateTemplate>
    private memoryStats: StateMemoryStats

    constructor() {
        this.stateTemplates = this.createStateTemplates()
        this.memoryStats = {
            totalComponents: 0,
            totalStates: 0,
            estimatedMemoryUsage: 0,
            stateDistribution: {}
        }
    }

    initializeState<T>(component: Component, stateKey: string): T {
        // 获取或创建组件的状态映射
        if (!this.stateMap.has(component)) {
            this.stateMap.set(component, new Map())
            this.memoryStats.totalComponents++
        }

        const componentStates = this.stateMap.get(component)!

        // 如果状态已经初始化，直接返回
        if (componentStates.has(stateKey)) {
            return componentStates.get(stateKey)
        }

        // 创建新的状态对象
        const initialState = this.createInitialState<T>(stateKey)
        componentStates.set(stateKey, initialState)

        // 更新统计信息
        this.memoryStats.totalStates++
        this.memoryStats.stateDistribution[stateKey] =
            (this.memoryStats.stateDistribution[stateKey] || 0) + 1
        this.memoryStats.estimatedMemoryUsage += this.estimateStateSize(initialState)

        return initialState
    }

    getState<T>(component: Component, stateKey: string): T | undefined {
        const componentStates = this.stateMap.get(component)
        return componentStates?.get(stateKey)
    }

    setState<T>(component: Component, stateKey: string, updates: Partial<T>): void {
        const currentState = this.getState<T>(component, stateKey)

        if (!currentState) {
            // 如果状态不存在，先初始化
            const newState = this.initializeState<T>(component, stateKey)
            Object.assign(newState as object, updates)
        } else {
            // 更新现有状态
            Object.assign(currentState as object, updates)
        }
    }

    destroyStates(component: Component): void {
        const componentStates = this.stateMap.get(component)

        if (componentStates) {
            // 更新统计信息
            this.memoryStats.totalComponents--

            for (const [stateKey, state] of componentStates.entries()) {
                this.memoryStats.totalStates--
                this.memoryStats.stateDistribution[stateKey]--
                this.memoryStats.estimatedMemoryUsage -= this.estimateStateSize(state)
            }

            // 清理状态映射
            this.stateMap.delete(component)
        }
    }

    getMemoryStats(): StateMemoryStats {
        return { ...this.memoryStats }
    }

    /**
     * 创建状态模板映射
     */
    private createStateTemplates(): Record<string, StateTemplate> {
        return {
            '_internalState': () => ({
                hover: false,
                focus: false,
                active: false,
                error: false,
                initialized: false,
                mounted: false
            }),

            '_validationState': () => ({
                isValid: true,
                errors: [],
                warnings: [],
                touched: false,
                dirty: false,
                validating: false,
                lastValidation: null
            }),

            '_performanceState': () => ({
                renderCount: 0,
                lastRenderTime: null,
                cacheHits: 0,
                cacheMisses: 0,
                isLazyLoaded: false,
                virtualizedRange: null
            }),

            '_valueState': () => ({
                previousValue: undefined,
                originalValue: undefined,
                formattedValue: '',
                isValueChanged: false,
                lastChangeTime: null,
                changeCount: 0
            }),

            '_containerState': () => ({
                empty: true,
                childrenCount: 0,
                renderOrder: [],
                scrollPosition: { x: 0, y: 0 },
                isOverflowing: false
            }),

            '_dataState': () => ({
                loading: false,
                error: undefined,
                empty: true,
                total: 0,
                current: undefined,
                lastUpdated: null,
                version: 1,
                isDirty: false
            }),

            '_formState': () => ({
                isSubmitting: false,
                isDirty: false,
                isValid: true,
                fieldErrors: {},
                touchedFields: [],
                changedFields: [],
                lastSubmitTime: null,
                submitCount: 0
            }),

            '_gridState': () => ({
                currentSort: null,
                currentFilters: {},
                searchKeyword: '',
                expandedRows: [],
                hoveredRow: null,
                editingCell: null
            }),

            '_optionState': () => ({
                options: [],
                filteredOptions: [],
                selectedValues: [],
                searchKeyword: '',
                loadedTime: null
            })
        }
    }

    /**
     * 创建指定类型的初始状态
     */
    private createInitialState<T>(stateKey: string): T {
        const template = this.stateTemplates[stateKey]

        if (template) {
            return template() as T
        }

        // 如果没有预定义模板，返回空对象
        console.warn(`No template found for state key: ${stateKey}`)
        return {} as T
    }

    /**
     * 估算状态对象的内存使用量
     */
    private estimateStateSize(state: any): number {
        if (state === null || state === undefined) return 0
        if (typeof state === 'string') return state.length * 2
        if (typeof state === 'number') return 8
        if (typeof state === 'boolean') return 4
        if (state instanceof Date) return 24

        if (Array.isArray(state)) {
            return state.reduce((sum, item) => sum + this.estimateStateSize(item), 16)
        }

        if (typeof state === 'object') {
            return Object.entries(state).reduce((sum, [key, value]) =>
                sum + key.length * 2 + this.estimateStateSize(value), 32
            )
        }

        return 8
    }
}

/**
 * 对象池接口
 * 用于复用状态对象，减少GC压力
 */
export interface StateObjectPool {
    /**
     * 从池中获取状态对象
     * @param stateType 状态类型
     * @returns 状态对象
     */
    acquire<T>(stateType: string): T

    /**
     * 将状态对象归还到池中
     * @param stateType 状态类型
     * @param state 状态对象
     */
    release(stateType: string, state: object): void

    /**
     * 清理对象池
     */
    clear(): void

    /**
     * 获取池的统计信息
     */
    getPoolStats(): PoolStats
}

/**
 * 对象池统计信息
 */
export interface PoolStats {
    pools: Record<string, {
        size: number
        maxSize: number
        acquireCount: number
        releaseCount: number
        hitRate: number
    }>
    totalObjects: number
    memoryUsage: number
}

/**
 * 状态对象池实现
 */
export class ComponentStateObjectPool implements StateObjectPool {
    private pools = new Map<string, object[]>()
    private maxPoolSize = 50 // 每个池的最大对象数
    private stats = new Map<string, {
        acquireCount: number
        releaseCount: number
        hitCount: number
    }>()

    acquire<T>(stateType: string): T {
        const pool = this.pools.get(stateType) || []
        const stats = this.getOrCreateStats(stateType)

        stats.acquireCount++

        // 从池中获取对象
        const state = pool.pop()
        if (state) {
            stats.hitCount++
            return this.resetState(state) as T
        }

        // 池中没有对象，创建新的
        return this.createNewState<T>(stateType)
    }

    release(stateType: string, state: object): void {
        const pool = this.pools.get(stateType) || []
        const stats = this.getOrCreateStats(stateType)

        stats.releaseCount++

        // 检查池的大小限制
        if (pool.length < this.maxPoolSize) {
            pool.push(state)
            this.pools.set(stateType, pool)
        }
    }

    clear(): void {
        this.pools.clear()
        this.stats.clear()
    }

    getPoolStats(): PoolStats {
        const poolStats: PoolStats['pools'] = {}
        let totalObjects = 0
        let memoryUsage = 0

        for (const [stateType, pool] of this.pools.entries()) {
            const stats = this.stats.get(stateType) || { acquireCount: 0, releaseCount: 0, hitCount: 0 }
            const hitRate = stats.acquireCount > 0 ? stats.hitCount / stats.acquireCount : 0

            poolStats[stateType] = {
                size: pool.length,
                maxSize: this.maxPoolSize,
                acquireCount: stats.acquireCount,
                releaseCount: stats.releaseCount,
                hitRate
            }

            totalObjects += pool.length
            memoryUsage += pool.length * 64 // 估算每个对象64字节
        }

        return {
            pools: poolStats,
            totalObjects,
            memoryUsage
        }
    }

    private getOrCreateStats(stateType: string) {
        if (!this.stats.has(stateType)) {
            this.stats.set(stateType, {
                acquireCount: 0,
                releaseCount: 0,
                hitCount: 0
            })
        }
        return this.stats.get(stateType)!
    }

    private createNewState<T>(stateType: string): T {
        // 这里应该与 LazyStateManager 的模板保持一致
        const templates = {
            '_internalState': () => ({}),
            '_validationState': () => ({}),
            '_performanceState': () => ({}),
            '_valueState': () => ({}),
            '_containerState': () => ({}),
            '_dataState': () => ({}),
            '_formState': () => ({}),
            '_gridState': () => ({}),
            '_optionState': () => ({})
        }

        const template = templates[stateType as keyof typeof templates]
        return template ? template() as T : {} as T
    }

    private resetState(state: any): any {
        // 重置状态对象到初始状态
        if (typeof state === 'object' && state !== null) {
            Object.keys(state).forEach(key => {
                if (Array.isArray(state[key])) {
                    state[key].length = 0
                } else if (typeof state[key] === 'object' && state[key] !== null) {
                    Object.keys(state[key]).forEach(subKey => {
                        delete state[key][subKey]
                    })
                } else {
                    state[key] = undefined
                }
            })
        }

        return state
    }
}

/**
 * 集成的状态管理器
 * 结合懒初始化和对象池技术
 */
export class OptimizedStateManager {
    private lazyManager = new ComponentLazyStateManager()
    private objectPool = new ComponentStateObjectPool()

    /**
     * 获取状态，如果不存在则懒初始化
     */
    getOrInitializeState<T>(component: Component, stateKey: string): T {
        let state = this.lazyManager.getState<T>(component, stateKey)

        if (!state) {
            // 从对象池获取或创建新状态
            state = this.objectPool.acquire<T>(stateKey)
            this.lazyManager.setState(component, stateKey, state as Partial<T>)
        }

        return state
    }

    /**
     * 更新状态
     */
    updateState<T>(component: Component, stateKey: string, updates: Partial<T>): void {
        this.lazyManager.setState(component, stateKey, updates)
    }

    /**
     * 销毁组件状态并回收到对象池
     */
    destroyComponentStates(component: Component): void {
        // 将状态对象归还到池中
        const componentStates = (this.lazyManager as any).stateMap.get(component)
        if (componentStates) {
            for (const [stateKey, state] of componentStates.entries()) {
                this.objectPool.release(stateKey, state)
            }
        }

        // 销毁状态
        this.lazyManager.destroyStates(component)
    }

    /**
     * 获取整体性能统计
     */
    getPerformanceStats() {
        return {
            memory: this.lazyManager.getMemoryStats(),
            pool: this.objectPool.getPoolStats()
        }
    }

    /**
     * 清理所有缓存
     */
    cleanup(): void {
        this.objectPool.clear()
    }
}

// 导出单例实例
export const optimizedStateManager = new OptimizedStateManager()

// 导出工具函数
export function useOptimizedState<T>(component: Component, stateKey: string): T {
    return optimizedStateManager.getOrInitializeState<T>(component, stateKey)
}

export function updateOptimizedState<T>(
    component: Component,
    stateKey: string,
    updates: Partial<T>
): void {
    optimizedStateManager.updateState(component, stateKey, updates)
}
