import { DynamicDataManager } from '../../src/core/managers/DynamicDataManager'
import { Dataset } from '../../src/core/types/Dataset'

describe('DynamicDataManager', () => {
  let dynamicDataManager: DynamicDataManager

  beforeEach(() => {
    dynamicDataManager = new DynamicDataManager()
  })

  it('should register a dataset', () => {
    const dataset: Dataset = {
      id: 'testDataset',
      name: 'Test Dataset',
      fields: [{ name: 'field1', type: 'string' }],
      source: { type: 'static', data: [] },
      state: { data: [], loading: false, error: null },
    }

    dynamicDataManager.register(dataset)
    expect(dynamicDataManager['datasets'].has('testDataset')).toBe(true)
  })

  it('should get data from a registered dataset', async () => {
    const dataset: Dataset = {
      id: 'testDataset',
      name: 'Test Dataset',
      fields: [{ name: 'field1', type: 'string' }],
      source: { type: 'static', data: [{ field1: 'value1' }] },
      state: { data: [], loading: false, error: null },
    }

    dynamicDataManager.register(dataset)
    const data = await dynamicDataManager.getData('testDataset')
    expect(data).toEqual([{ field1: 'value1' }])
  })

  it('should handle loading state correctly', async () => {
    const dataset: Dataset = {
      id: 'testDataset',
      name: 'Test Dataset',
      fields: [{ name: 'field1', type: 'string' }],
      source: { type: 'static', data: [] },
      state: { data: [], loading: false, error: null },
    }

    dynamicDataManager.register(dataset)
    const dataPromise = dynamicDataManager.getData('testDataset')
    expect(
      dynamicDataManager['datasets'].get('testDataset')?.state.loading
    ).toBe(true)
    await dataPromise
    expect(
      dynamicDataManager['datasets'].get('testDataset')?.state.loading
    ).toBe(false)
  })

  it('should notify subscribers on data change', async () => {
    const dataset: Dataset = {
      id: 'testDataset',
      name: 'Test Dataset',
      fields: [{ name: 'field1', type: 'string' }],
      source: { type: 'static', data: [] },
      state: { data: [], loading: false, error: null },
    }

    dynamicDataManager.register(dataset)
    const callback = jest.fn()
    dynamicDataManager.subscribe('testDataset', callback)

    await dynamicDataManager.getData('testDataset')
    expect(callback).toHaveBeenCalled()
  })
})
