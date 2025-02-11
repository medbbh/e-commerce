import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_test_51Qp735RbimPKQarVU6rxF9vlfEQMjYrh6VH6lz2lSINwGLj3YmXTZOwayTJ02khFJBnS8S7OggPXVrWjEwfjhF5d00Tnebb75a')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </StrictMode>,
)
