// ComponentGenerator.ts

export default class ComponentGenerator {
  static generateComponent(type: string, config: any) {
    return {
      id: `component_${Date.now()}`,
      type,
      config,
    }
  }
}
