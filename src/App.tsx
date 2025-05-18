import { useState } from 'react'
import './App.css'
import { Input, Button, Form, Modal } from './components'
import { ToastContainer } from './components/Toast'
import type { ToastItem } from './components/Toast'

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
          label="Your Name"
          placeholder="Enter your name"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
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

      <ToastContainer position="top-right" theme="dark" toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  )
}

export default App
