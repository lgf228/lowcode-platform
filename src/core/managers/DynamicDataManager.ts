// DynamicDataManager.ts
import { Dataset, DataState } from '../types/Dataset'

class DynamicDataManager {
  private datasets = new Map<string, Dataset>()
  private subscribers = new Map<string, Set<Function>>()
  private cache = new Map<string, any>()

  register(dataset: Dataset): void {
    this.datasets.set(dataset.id, dataset)
    this.initializeDataset(dataset)
  }

  async getData(datasetId: string, forceRefresh = false): Promise<any[]> {
    const dataset = this.datasets.get(datasetId)
    if (!dataset) return []

    if (!forceRefresh && this.isCacheValid(datasetId)) {
      return this.cache.get(datasetId)
    }

    this.updateState(datasetId, { loading: true, error: undefined })

    try {
      let data: any[]

      switch (dataset.source.type) {
        case 'api':
          data = await this.fetchApiData(dataset)
          break
        case 'static':
          data = dataset.source.data || []
          break
        case 'computed':
          data = await this.computeData(dataset)
          break
        default:
          data = []
      }

      this.updateCache(datasetId, data)
      this.updateState(datasetId, {
        data,
        loading: false,
        lastUpdated: new Date().toISOString(),
      })

      return data
    } catch (error) {
      this.updateState(datasetId, {
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return []
    }
  }

  private async fetchApiData(dataset: Dataset): Promise<any[]> {
    const { url, method = 'GET', headers = {}, params = {} } = dataset.source

    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    let fetchUrl = url!
    if (method === 'GET' && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params)
      fetchUrl += `?${searchParams.toString()}`
    } else if (method !== 'GET') {
      requestInit.body = JSON.stringify(params)
    }

    const response = await fetch(fetchUrl, requestInit)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  private async computeData(dataset: Dataset): Promise<any[]> {
    const { dependencies = [], computation } = dataset.source
    if (!computation) return []

    const depData = await Promise.all(
      dependencies.map(depId => this.getData(depId))
    )

    return eval(computation)(depData)
  }

  updateState(datasetId: string, state: Partial<DataState>): void {
    const dataset = this.datasets.get(datasetId)
    if (dataset) {
      if (dataset.state) {
        Object.assign(dataset.state, state)
      } else {
        dataset.state = { ...state } as DataState
      }
      this.notify(datasetId)
    }
  }

  subscribe(datasetId: string, callback: Function): () => void {
    if (!this.subscribers.has(datasetId)) {
      this.subscribers.set(datasetId, new Set())
    }
    this.subscribers.get(datasetId)!.add(callback)

    return () => {
      this.subscribers.get(datasetId)?.delete(callback)
    }
  }

  private notify(datasetId: string): void {
    const callbacks = this.subscribers.get(datasetId)
    if (callbacks) {
      callbacks.forEach(callback => callback())
    }
  }

  private updateCache(datasetId: string, data: any[]): void {
    const dataset = this.datasets.get(datasetId)
    if (dataset?.cache?.enabled) {
      this.cache.set(datasetId, {
        data,
        timestamp: Date.now(),
        duration: dataset.cache.duration,
      })
    }
  }

  private isCacheValid(datasetId: string): boolean {
    const cached = this.cache.get(datasetId)
    if (!cached) return false

    const dataset = this.datasets.get(datasetId)
    if (!dataset?.cache?.enabled) return false

    const isExpired = Date.now() - cached.timestamp > cached.duration
    return !isExpired
  }

  private initializeDataset(dataset: Dataset): void {
    dataset.state = {
      data: [],
      loading: false,
      error: undefined,
      lastUpdated: new Date().toISOString(),
      ...dataset.state,
    }
  }
}

export default DynamicDataManager
