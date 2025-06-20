import { useState } from 'react'
import './App.css'
import { ToastContainer } from './components/Toast'
import type { ToastItem } from './components/Toast'
import SearchBox from './components/SearchBox/SearchBox'
import Button from './components/Button/Button'
import Input from './components/Input/Input'
import Form from './components/Form/Form'
import Modal from './components/Modal/Modal'

// Add this at the top of the file to extend the Window interface
declare global {
  interface Window {
    addToast: (toast: { message: string; type?: string; duration?: number; theme?: 'dark' | 'primary' | 'secondary' }) => void;
  }
}

function App() {
  const [inputValue, setInputValue] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formError, setFormError] = useState('')
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = (toast: Omit<ToastItem, 'id'>) => {
    setToasts((prev) => [
      ...prev,
      { ...toast, id: Math.random().toString(36).substr(2, 9) }
    ])
  }

  const handleRemoveToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue) {
      setFormError('Input is required!')
      showToast({ message: 'Input is required!', type: 'error' })
    } else {
      setFormError('')
      showToast({ message: 'Form submitted successfully!', type: 'success' })
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Component Library Demo</h2>
      <Form onSubmit={handleFormSubmit} error={formError}>
        <Input
          type="text"
          placeholder="Enter your name"
          value={inputValue}
          onChange={(value: string) => setInputValue(value)}
          isValid={!formError}
          errorMessage={formError}
          pattern=""
          disabled={false}
          readOnly={false}
          maxLength={50}
          allowNegative={false}
          allowDecimal={false}
          numberOfDecimals={4}
          allowZero={true}
          showFloatingLabel={true}
        />
        <SearchBox
          onSearch={(value: string) => showToast({ message: value, type: 'success' })}
          placeholder="Search..."
          expandedWrapperStyle={{ width: '100%' }}
        />
        <Button type="submit" variant="primary">Submit</Button>
        <Button type="button" variant="secondary" onClick={() => setShowModal(true)}>
          Open Modal
        </Button>
        <Button type="button" variant="danger" onClick={() => showToast({ message: 'This is an error toast!', type: 'error' })}>
          Show Error Toast
        </Button>
      </Form>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Example Modal">
        <p>This is a classy modal. Click outside or the × to close.</p>
        <Button onClick={() => setShowModal(false)}>Close</Button>
      </Modal>

      <ToastContainer position="top-right" toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  )
}

export default App
