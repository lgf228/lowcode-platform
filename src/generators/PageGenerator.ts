// PageGenerator.ts
import { Dataset } from '../core/types/Dataset'

interface Page {
  id: string
  name: string
  dataset: Dataset
  components: Component[]
  handlers?: any[]
  styles?: any[]
}

interface Component {
  id: string
  type: string
  datasetId: string
  config: any
  handlers?: any[]
}

export default class PageGenerator {
  // 自动生成列表页
  static generateListPage(dataset: Dataset): Page {
    return {
      id: `${dataset.id}_list`,
      name: `${dataset.name}列表`,
      dataset,
      components: [
        {
          id: 'filter',
          type: 'Filter',
          datasetId: dataset.id,
          config: {
            filterFields: dataset.fields
              .filter(f => f.type === 'string')
              .map(f => f.name),
          },
        },
        {
          id: 'table',
          type: 'Table',
          datasetId: dataset.id,
          config: {
            columns: dataset.fields.map(field => ({
              field: field.name,
              title: field.name,
              sortable: true,
            })),
          },
        },
      ],
      handlers: [
        {
          id: 'load_handler',
          event: 'load',
          componentId: 'table',
          action: { type: 'refresh' },
        },
        {
          id: 'row_click_handler',
          event: 'rowClick',
          componentId: 'table',
          action: {
            type: 'navigate',
            target: `#/${dataset.id}/detail`,
          },
        },
      ],
      styles: [
        {
          selector: '.filter',
          rules: [
            { property: 'margin-bottom', value: '16px' },
            { property: 'padding', value: '16px' },
            { property: 'background', value: '#f5f5f5' },
          ],
        },
        {
          selector: '.table',
          rules: [{ property: 'min-height', value: '400px' }],
        },
      ],
    }
  }

  // 自动生成表单页
  static generateFormPage(dataset: Dataset): Page {
    return {
      id: `${dataset.id}_form`,
      name: `${dataset.name}表单`,
      dataset,
      components: [
        {
          id: 'form',
          type: 'Form',
          datasetId: dataset.id,
          config: {
            fields: dataset.fields.map(field => ({
              field: field.name,
              label: field.name,
              type: this.getFormFieldType(field.type),
              required: field.required,
            })),
          },
        },
      ],
      handlers: [
        {
          id: 'submit_handler',
          event: 'submit',
          componentId: 'form',
          action: {
            type: 'custom',
            code: `
                            fetch('${dataset.source.url}', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data)
                            }).then(() => {
                                alert('保存成功');
                                history.back();
                            });
                        `,
          },
        },
      ],
      styles: [
        {
          selector: '.form',
          rules: [
            { property: 'max-width', value: '600px' },
            { property: 'margin', value: '0 auto' },
            { property: 'padding', value: '24px' },
          ],
        },
      ],
    }
  }

  private static getFormFieldType(dataType: string): string {
    switch (dataType) {
      case 'date':
        return 'date'
      case 'boolean':
        return 'select'
      default:
        return 'input'
    }
  }
}
