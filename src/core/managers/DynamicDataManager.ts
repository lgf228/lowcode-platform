// DynamicDataManager.ts - 动态数据管理器，负责管理数据集的注册、获取、缓存和状态更新
import { Dataset, DataState } from '../types/Dataset'

// 动态数据管理器类，用于统一管理应用中的所有数据集
class DynamicDataManager {
  // 存储所有已注册的数据集，键为数据集ID，值为数据集对象
  private datasets = new Map<string, Dataset>()
  // 存储订阅者回调函数，键为数据集ID，值为回调函数集合
  private subscribers = new Map<string, Set<Function>>()
  // 数据缓存，存储已获取的数据以提高性能
  private cache = new Map<string, any>()

  // 注册新的数据集到管理器中
  register(dataset: Dataset): void {
    // 将数据集存储到datasets映射中
    this.datasets.set(dataset.id, dataset)
    // 初始化数据集的默认状态
    this.initializeDataset(dataset)
  }

  // 异步获取指定数据集的数据
  async getData(datasetId: string, forceRefresh = false): Promise<any[]> {
    // 根据ID获取数据集对象
    const dataset = this.datasets.get(datasetId)
    // 如果数据集不存在，返回空数组
    if (!dataset) return []

    // 如果不强制刷新且缓存有效，直接返回缓存数据
    if (!forceRefresh && this.isCacheValid(datasetId)) {
      return this.cache.get(datasetId)
    }

    // 更新数据集状态为加载中，清除之前的错误信息
    this.updateState(datasetId, { loading: true, error: undefined })

    try {
      // 声明数据变量
      let data: any[]

      // 根据数据源类型选择不同的数据获取方式
      switch (dataset.source.type) {
        case 'api':
          // API类型：从远程API获取数据
          data = await this.fetchApiData(dataset)
          break
        case 'static':
          // 静态类型：使用预定义的静态数据
          data = dataset.source.data || []
          break
        case 'computed':
          // 计算类型：基于其他数据集计算得出数据
          data = await this.computeData(dataset)
          break
        default:
          // 默认情况：返回空数组
          data = []
      }

      // 将获取到的数据存入缓存
      this.updateCache(datasetId, data)
      // 更新数据集状态：设置数据和结束加载状态
      this.updateState(datasetId, {
        data,
        loading: false,
      })

      // 返回获取到的数据
      return data
    } catch (error) {
      // 捕获异常，更新错误状态
      this.updateState(datasetId, {
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      // 发生错误时返回空数组
      return []
    }
  }

  // 私有方法：从API获取数据
  private async fetchApiData(dataset: Dataset): Promise<any[]> {
    // 从数据集配置中解构获取API相关参数
    const { url, method = 'GET', headers = {}, params = {} } = dataset.source

    // 构建fetch请求的配置对象
    const requestInit: RequestInit = {
      method, // HTTP方法
      headers: {
        'Content-Type': 'application/json', // 设置默认内容类型
        ...headers, // 合并用户自定义headers
      },
    }

    // 初始化请求URL
    let fetchUrl = url!
    // 如果是GET请求且有参数，将参数添加到URL查询字符串中
    if (method === 'GET' && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params)
      fetchUrl += `?${searchParams.toString()}`
    } else if (method !== 'GET') {
      // 非GET请求，将参数作为请求体发送
      requestInit.body = JSON.stringify(params)
    }

    // 发送HTTP请求
    const response = await fetch(fetchUrl, requestInit)
    // 检查响应状态，如果不成功则抛出错误
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // 解析并返回JSON响应数据
    return await response.json()
  }

  // 私有方法：计算数据（基于依赖的其他数据集）
  private async computeData(dataset: Dataset): Promise<any[]> {
    // 从数据源配置中获取依赖项和计算函数
    const { dependencies = [], computation } = dataset.source
    // 如果没有计算函数，返回空数组
    if (!computation) return []

    // 并行获取所有依赖数据集的数据
    const depData = await Promise.all(
      dependencies.map((depId: string) => this.getData(depId))
    )

    // 执行计算函数
    if (typeof computation === 'function') {
      // 如果计算函数是函数类型，直接调用
      return computation(depData)
    } else {
      // 如果是字符串形式的函数，需要转换为函数执行
      return Function('"use strict"; return (' + computation + ')')()(depData)
    }
  }

  // 更新指定数据集的状态
  updateState(datasetId: string, state: Partial<DataState>): void {
    // 获取数据集对象
    const dataset = this.datasets.get(datasetId)
    if (dataset) {
      if (dataset.state) {
        // 如果已有状态对象，合并新状态
        Object.assign(dataset.state, state)
      } else {
        // 如果没有状态对象，创建新的状态对象
        dataset.state = { ...state } as DataState
      }
      // 通知所有订阅者状态已更新
      this.notify(datasetId)
    }
  }

  // 订阅数据集状态变化
  subscribe(datasetId: string, callback: Function): () => void {
    // 如果该数据集还没有订阅者集合，创建一个新的Set
    if (!this.subscribers.has(datasetId)) {
      this.subscribers.set(datasetId, new Set())
    }
    // 将回调函数添加到订阅者集合中
    this.subscribers.get(datasetId)!.add(callback)

    // 返回取消订阅的函数
    return () => {
      this.subscribers.get(datasetId)?.delete(callback)
    }
  }

  // 私有方法：通知所有订阅者数据集状态已更新
  private notify(datasetId: string): void {
    // 获取该数据集的所有订阅回调函数
    const callbacks = this.subscribers.get(datasetId)
    if (callbacks) {
      // 逐个调用每个回调函数
      callbacks.forEach(callback => callback())
    }
  }

  // 私有方法：更新数据缓存
  private updateCache(datasetId: string, data: any[]): void {
    // 获取数据集对象
    const dataset = this.datasets.get(datasetId)
    // 只有在缓存启用时才存储数据
    if (dataset?.cache?.enabled) {
      this.cache.set(datasetId, {
        data, // 缓存的数据
        timestamp: Date.now(), // 缓存时间戳
        duration: dataset.cache.duration, // 缓存持续时间
      })
    }
  }

  // 私有方法：检查缓存是否有效
  private isCacheValid(datasetId: string): boolean {
    // 获取缓存数据
    const cached = this.cache.get(datasetId)
    // 如果没有缓存数据，返回false
    if (!cached) return false

    // 获取数据集对象
    const dataset = this.datasets.get(datasetId)
    // 如果缓存未启用，返回false
    if (!dataset?.cache?.enabled) return false

    // 检查缓存是否过期
    const isExpired = Date.now() - cached.timestamp > cached.duration
    // 返回缓存是否仍然有效（未过期）
    return !isExpired
  }

  // 私有方法：初始化数据集的默认状态
  private initializeDataset(dataset: Dataset): void {
    // 定义默认状态对象
    const defaultState = {
      data: [], // 数据数组
      loading: false, // 加载状态
      error: undefined, // 错误信息
      dirty: false, // 数据是否已修改
      selectedRows: {}, // 选中的行
      currentPage: {}, // 当前页码
      pageSize: {}, // 每页大小
      filters: {}, // 过滤条件
      sorts: {}, // 排序条件
    }
    // 合并默认状态和用户提供的状态
    dataset.state = {
      ...defaultState,
      ...dataset.state,
    }
  }
}

// 导出动态数据管理器类
export default DynamicDataManager
