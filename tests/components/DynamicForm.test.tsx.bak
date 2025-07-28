import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DynamicForm from '../../src/components/dynamic/DynamicForm'
import { Dataset } from '../../src/core/types/Dataset'

describe('DynamicForm Component', () => {
  const dataset: Dataset = {
    id: 'testDataset',
    name: 'Test Dataset',
    fields: [
      { name: 'username', type: 'string', required: true },
      { name: 'email', type: 'string', required: true },
      { name: 'age', type: 'number', required: false },
    ],
    source: {
      type: 'api',
      url: '/api/test',
      method: 'GET',
    },
    state: {
      data: [],
      loading: false,
      error: null,
      lastUpdated: new Date(),
    },
  }

  test('renders form fields correctly', () => {
    render(<DynamicForm datasetId={dataset.id} fields={dataset.fields} />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
  })

  test('submits form with correct data', () => {
    const handleSubmit = jest.fn()
    render(
      <DynamicForm
        datasetId={dataset.id}
        fields={dataset.fields}
        onSubmit={handleSubmit}
      />
    )

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '30' } })

    fireEvent.submit(screen.getByRole('form'))

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      age: '30',
    })
  })

  test('shows required validation error', () => {
    render(<DynamicForm datasetId={dataset.id} fields={dataset.fields} />)

    fireEvent.submit(screen.getByRole('form'))

    expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})
