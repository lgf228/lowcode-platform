// ===========================
// Optimization Module - 优化模块统一导出
// ===========================

// 状态管理优化
export {
    ComponentLazyStateManager,
    ComponentStateObjectPool,
    OptimizedStateManager,
    optimizedStateManager,
    useOptimizedState,
    updateOptimizedState
} from './StateManager'

export type {
    LazyStateManager,
    StateObjectPool,
    StateMemoryStats,
    PoolStats
} from './StateManager'

// 性能监控
export {
    ComponentPerformanceMonitor,
    IntelligentUpdateStrategy,
    performanceMonitor,
    updateStrategy,
    withPerformanceMonitoring,
    generatePerformanceReport
} from './PerformanceMonitor'

export type {
    PerformanceMonitor,
    UpdateStrategy,
    PerformanceMetrics,
    PerformanceReport
} from './PerformanceMonitor'

// 组件优化集成
export {
    ComponentOptimizationFactory,
    ComponentOptimizationManager,
    optimizationManager,
    optimizeComponent,
    optimizeComponentTree,
    getOptimizationStats,
    analyzeOptimization
} from './ComponentOptimizer'

export type {
    OptimizedComponentFactory,
    ComponentConfig,
    OptimizedComponent,
    OptimizationAnalysis
} from './ComponentOptimizer'

// 优化工具函数
export * from './utils'
