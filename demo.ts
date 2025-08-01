/**
 * 优化系统演示示例
 * 简单展示如何使用优化功能
 */

import { optimizeComponent } from './src/core/optimization'
import { ComponentType } from './src/core/types/Component'
import type { InputComponent } from './src/core/types/Component'

// 创建一个简单的测试组件
function createSampleComponent(): InputComponent {
    return {
        id: 'demo-input-001',
        name: 'demo-username-input',
        version: '1.0.0',
        type: ComponentType.INPUT,
        colSpan: 12,
        rowSpan: 1,
        order: 1,
        fieldName: 'username',
        label: '用户名',
        placeholder: '请输入用户名',
        required: true
    }
}

// 演示优化功能
export function demonstrateOptimization() {
    console.log('🚀 开始优化系统演示\n')

    // 1. 创建组件
    const originalComponent = createSampleComponent()
    console.log('📦 原始组件:', originalComponent.name)

    // 2. 优化组件
    const optimizedComponent = optimizeComponent(originalComponent)
    console.log('✨ 组件已优化')

    // 3. 测试状态管理
    console.log('\n💾 测试状态管理...')
    optimizedComponent.updateOptimizedState('_internalState', {
        hover: false,
        focus: false,
        touched: false
    })

    const state = optimizedComponent.getOptimizedState('_internalState')
    console.log('状态:', state)

    // 4. 测试性能指标
    console.log('\n📊 性能指标...')
    const metrics = optimizedComponent.getPerformanceMetrics()
    console.log('指标:', metrics)

    // 5. 测试智能更新（检查方法是否存在）
    console.log('\n🧠 智能更新测试...')
    if ('shouldComponentUpdate' in optimizedComponent && typeof optimizedComponent.shouldComponentUpdate === 'function') {
        const shouldUpdate1 = optimizedComponent.shouldComponentUpdate(
            { value: 'test' },
            { value: 'test' } // 相同值
        )
        console.log('相同值时是否需要更新:', shouldUpdate1)

        const shouldUpdate2 = optimizedComponent.shouldComponentUpdate(
            { value: 'old' },
            { value: 'new' } // 不同值
        )
        console.log('不同值时是否需要更新:', shouldUpdate2)
    } else {
        console.log('智能更新功能未完全实现')
    } console.log('\n✅ 演示完成！')

    return optimizedComponent
}

// 如果直接运行此文件
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

if (process.argv[1] === __filename) {
    try {
        demonstrateOptimization()
    } catch (error) {
        console.error('演示失败:', error)
    }
} export default demonstrateOptimization
