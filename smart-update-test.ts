/**
 * 智能更新策略详细测试
 * 展示不同场景下的智能更新决策
 */

import { optimizeComponent } from './src/core/optimization'
import { ComponentType } from './src/core/types/Component'
import type { InputComponent, Container } from './src/core/types/Component'

// 创建测试组件
function createTestComponents() {
  const inputComponent: InputComponent = {
    id: 'test-input-smart-update',
    name: 'smart-update-input',
    version: '1.0.0',
    type: ComponentType.INPUT,
    colSpan: 12,
    rowSpan: 1,
    order: 1,
    fieldName: 'username',
    label: '用户名',
    placeholder: '请输入用户名',
    value: 'initial-value'
  }

  const containerComponent: Container = {
    id: 'test-container-smart-update',
    name: 'smart-update-container',
    version: '1.0.0',
    type: ComponentType.CONTAINER,
    colSpan: 24,
    rowSpan: 12,
    order: 1,
    layout: { direction: 'vertical' },
    children: []
  }

  return { inputComponent, containerComponent }
}

// 智能更新测试场景
export function testIntelligentUpdateStrategies() {
  console.log('🧠 智能更新策略详细测试\n')

  const { inputComponent, containerComponent } = createTestComponents()

  // 测试输入组件
  testValueComponentUpdates(inputComponent)
  
  // 测试容器组件
  testContainerComponentUpdates(containerComponent)

  console.log('\n✅ 智能更新策略测试完成！')
}

function testValueComponentUpdates(component: InputComponent) {
  console.log('🔤 测试值组件智能更新策略')
  
  const optimized = optimizeComponent(component)

  // 测试场景1: 值未变化
  const scenario1 = optimized.shouldComponentUpdate(
    { value: 'test', disabled: false },
    { value: 'test', disabled: false }
  )
  console.log(`  场景1 - 值未变化: ${scenario1 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)

  // 测试场景2: 值发生变化
  const scenario2 = optimized.shouldComponentUpdate(
    { value: 'old-value', disabled: false },
    { value: 'new-value', disabled: false }
  )
  console.log(`  场景2 - 值变化: ${scenario2 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)

  // 测试场景3: 禁用状态变化
  const scenario3 = optimized.shouldComponentUpdate(
    { value: 'test', disabled: false },
    { value: 'test', disabled: true }
  )
  console.log(`  场景3 - 禁用状态变化: ${scenario3 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)

  // 测试场景4: 样式变化
  const scenario4 = optimized.shouldComponentUpdate(
    { value: 'test', style: { color: 'red' } },
    { value: 'test', style: { color: 'blue' } }
  )
  console.log(`  场景4 - 样式变化: ${scenario4 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)

  // 测试场景5: 验证规则变化
  const scenario5 = optimized.shouldComponentUpdate(
    { value: 'test', rules: [{ type: 'required' }] },
    { value: 'test', rules: [{ type: 'required' }, { type: 'minLength', value: 3 }] }
  )
  console.log(`  场景5 - 验证规则变化: ${scenario5 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)

  // 测试场景6: 无关属性变化
  const scenario6 = optimized.shouldComponentUpdate(
    { value: 'test', someOtherProp: 'old' },
    { value: 'test', someOtherProp: 'new' }
  )
  console.log(`  场景6 - 无关属性变化: ${scenario6 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)
}

function testContainerComponentUpdates(component: Container) {
  console.log('\n📦 测试容器组件智能更新策略')
  
  const optimized = optimizeComponent(component)

  const child1 = { id: 'child1', type: 'input' }
  const child2 = { id: 'child2', type: 'button' }

  // 测试场景1: 子组件未变化
  const scenario1 = optimized.shouldComponentUpdate(
    { children: [child1], visible: true },
    { children: [child1], visible: true }
  )
  console.log(`  场景1 - 子组件未变化: ${scenario1 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)

  // 测试场景2: 子组件列表变化
  const scenario2 = optimized.shouldComponentUpdate(
    { children: [child1], visible: true },
    { children: [child1, child2], visible: true }
  )
  console.log(`  场景2 - 子组件增加: ${scenario2 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)

  // 测试场景3: 布局配置变化
  const scenario3 = optimized.shouldComponentUpdate(
    { children: [child1], layout: { direction: 'vertical' } },
    { children: [child1], layout: { direction: 'horizontal' } }
  )
  console.log(`  场景3 - 布局变化: ${scenario3 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)

  // 测试场景4: 可见性变化
  const scenario4 = optimized.shouldComponentUpdate(
    { children: [child1], visible: true },
    { children: [child1], visible: false }
  )
  console.log(`  场景4 - 可见性变化: ${scenario4 ? '🔄 需要更新' : '⏭️ 跳过更新'}`)
}

// 性能基准测试
export function benchmarkIntelligentUpdates() {
  console.log('\n⚡ 智能更新性能基准测试')

  const { inputComponent } = createTestComponents()
  const optimized = optimizeComponent(inputComponent)

  const iterations = 10000
  const startTime = performance.now()

  for (let i = 0; i < iterations; i++) {
    // 模拟不同的更新场景
    optimized.shouldComponentUpdate(
      { value: `value-${i % 100}`, disabled: i % 2 === 0 },
      { value: `value-${(i + 1) % 100}`, disabled: (i + 1) % 2 === 0 }
    )
  }

  const endTime = performance.now()
  const avgTime = (endTime - startTime) / iterations

  console.log(`📊 基准测试结果:`)
  console.log(`  总迭代次数: ${iterations.toLocaleString()}`)
  console.log(`  总耗时: ${(endTime - startTime).toFixed(2)}ms`)
  console.log(`  平均单次耗时: ${avgTime.toFixed(4)}ms`)
  console.log(`  每秒可处理: ${(1000 / avgTime).toFixed(0)} 次更新判断`)
}

// 智能更新统计分析
export function analyzeUpdatePatterns() {
  console.log('\n📈 智能更新模式分析')

  const { inputComponent } = createTestComponents()
  const optimized = optimizeComponent(inputComponent)

  const scenarios = [
    // 值变化场景
    [
      { value: 'a', disabled: false },
      { value: 'b', disabled: false }
    ],
    // 状态变化场景
    [
      { value: 'test', disabled: false },
      { value: 'test', disabled: true }
    ],
    // 样式变化场景
    [
      { value: 'test', style: { color: 'red' } },
      { value: 'test', style: { color: 'blue' } }
    ],
    // 无变化场景
    [
      { value: 'test', disabled: false },
      { value: 'test', disabled: false }
    ],
    // 无关属性变化场景
    [
      { value: 'test', randomProp: 'old' },
      { value: 'test', randomProp: 'new' }
    ]
  ]

  const scenarioNames = [
    '值变化',
    '状态变化', 
    '样式变化',
    '无变化',
    '无关属性变化'
  ]

  let totalUpdates = 0
  let necessaryUpdates = 0

  scenarios.forEach((scenario, index) => {
    const shouldUpdate = optimized.shouldComponentUpdate(scenario[0], scenario[1])
    totalUpdates++
    
    if (shouldUpdate) {
      necessaryUpdates++
    }

    console.log(`  ${scenarioNames[index]}: ${shouldUpdate ? '🔄 更新' : '⏭️ 跳过'}`)
  })

  const optimizationRate = ((totalUpdates - necessaryUpdates) / totalUpdates * 100).toFixed(1)
  console.log(`\n📊 优化统计:`)
  console.log(`  总场景数: ${totalUpdates}`)
  console.log(`  需要更新: ${necessaryUpdates}`)
  console.log(`  跳过更新: ${totalUpdates - necessaryUpdates}`)
  console.log(`  优化率: ${optimizationRate}%`)
}

// 如果直接运行此文件
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

if (process.argv[1] === __filename) {
  try {
    testIntelligentUpdateStrategies()
    benchmarkIntelligentUpdates()
    analyzeUpdatePatterns()
  } catch (error) {
    console.error('智能更新测试失败:', error)
  }
}

export default testIntelligentUpdateStrategies
