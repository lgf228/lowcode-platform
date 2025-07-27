import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DynamicTable from '../../src/components/dynamic/DynamicTable'
import { Dataset } from '../../src/core/types/Dataset'

describe('DynamicTable Component', () => {
  const dataset: Dataset = {
    id: 'testDataset',
    name: 'Test Dataset',
    fields: [
      { name: 'id', type: 'string', required: true },
      { name: 'name', type: 'string', required: true },
      { name: 'email', type: 'string', required: true },
    ],
    source: {
      type: 'static',
      data: [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
    },
    state: {
      data: [],
      loading: false,
      error: null,
    },
  }

  beforeEach(() => {
    render(<DynamicTable datasetId={dataset.id} columns={dataset.fields} />)
  })

  test('renders table with correct headers', () => {
    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(dataset.fields.length)
    expect(headers[0]).toHaveTextContent('id')
    expect(headers[1]).toHaveTextContent('name')
    expect(headers[2]).toHaveTextContent('email')
  })

  test('renders table with correct data', () => {
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(dataset.source.data.length + 1) // +1 for header row
    expect(rows[1]).toHaveTextContent('John Doe')
    expect(rows[2]).toHaveTextContent('Jane Smith')
  })

  test('handles row click event', () => {
    const row = screen.getByText('John Doe')
    fireEvent.click(row)
    // Add your assertion for row click handling here
  })
})
