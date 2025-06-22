import { useState } from 'react'
import './App.css'
import { ToastContainer } from './components/Toast'
import type { ToastItem } from './components/Toast'
import SearchBox from './components/SearchBox/SearchBox'
import Button from './components/Button/Button'
import Input from './components/Input/Input'
import Form from './components/Form/Form'
import Modal from './components/Modal/Modal'
import { setAiConfig } from './aiComponents/config'
import Summarizer from './aiComponents/Summarizer/Summarizer'
import ToggleButton from './components/ToggleButton/ToggleButton'


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
  const [isChecked, setIsChecked] = useState(false)

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

  setAiConfig({
    llmProvider: 'gemini',
    apiKey: 'AIzaSyDiInfo9C5E_vW-MTB-Xkm0BhFzV87dFRs'
  })

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Component Library Demo</h2>
      <Form onSubmit={handleFormSubmit} error={formError}>
        <Input
          placeholder="Enter your name"
          value={inputValue}
          onChange={(value: string) => setInputValue(value)}
          disabled={false}
          readOnly={false}
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
      <ToggleButton checked={isChecked} onChange={() => setIsChecked(!isChecked)} variant="aica"/>
      <p>Diwali, also known as Deepavali, is a vibrant and widely celebrated Hindu festival signifying the triumph of light over darkness and good over evil. It is a time of immense joy, celebrated with the lighting of diyas (oil lamps), fireworks, and the exchange of sweets and gifts. The festival commemorates the return of Lord Rama to Ayodhya after a 14-year exile and his victory over the demon king Ravana, as well as the worship of Goddess Lakshmi, the deity of wealth and prosperity. 
Diwali is a five-day festival, with each day holding its own significance. People clean and decorate their homes, wear new clothes, and participate in elaborate Lakshmi Puja ceremonies. The lighting of diyas and the colorful rangoli designs create a magical ambiance, transforming homes and streets into a visual spectacle. Families and friends gather, sharing delicious food and strengthening their bonds through gift exchanges and joyous celebrations. 
Beyond its religious and cultural significance, Diwali also carries important social and moral lessons. It promotes the values of unity, compassion, and forgiveness as people come together to celebrate and share happiness. The festival encourages acts of kindness and generosity, reminding us of the importance of spreading positivity and light in our lives. Diwali, therefore, is not just a festival of lights, but also a celebration of good over evil, prosperity, and the enduring power of love and togetherness. 
Essay on Diwali in English for Student (150, 200, 300, 400 Words) - eSaral
Diwali is a time of great joy and celebration. It marks the day when the heroic King Rama defeated evil forces and returned home t...

eSaral
Essay on Diwali: The Festival of Lights - Vedantu
Diwali Essay in English (300 Words) for Class 7 and 8 Diwali, also known as Deepavali, is one of the most important festivals in I...

Vedantu

An Essay On Diwali - BYJU'S
“Diwali, also known as 'Deepavali' (a row of lamps), is one of the most fervently celebrated festivals of India. Diwali is often c...

BYJU'S
Show all
</p>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Example Modal">
        <p>This is a classy modal. Click outside or the × to close.</p>
        <Button onClick={() => setShowModal(false)}>Close</Button>
      </Modal>
      <Summarizer />

      <ToastContainer position="top-right" toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  )
}

export default App
