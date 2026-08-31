import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BookForm } from './BookForm'

// ?????? window.matchMedia ??? ?????????? ?????? Ant Design ? ????? ???????????? jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('BookForm Component', () => {
  it('renders all form input fields correctly', () => {
    render(<BookForm />)

    expect(screen.getByLabelText(/Book Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Author/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Pages/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Language/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /To Add/i })).toBeInTheDocument()
  })

  it('pre-fills form inputs with sample data when clicking Fill Sample button', async () => {
    render(<BookForm />)

    const fillSampleBtn = screen.getByRole('button', { name: /Fill Sample/i })
    fireEvent.click(fillSampleBtn)

    await waitFor(() => {
      expect(screen.getByDisplayValue('War and Peace')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Leo Tolstoy')).toBeInTheDocument()
    })
  })

  it('calls onSave callback when editing an existing book', async () => {
    const mockSave = vi.fn()
    const sampleBook = {
      id: '123',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      page: 310,
      language: 'en',
    }

    render(<BookForm editForm={sampleBook} onEdit={mockSave} />)

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledTimes(1)
      expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        page: 310,
        language: 'en',
        id: '123',
      }))
    })
  })
})
