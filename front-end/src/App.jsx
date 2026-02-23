import React from 'react'
import './App.css'
import { useState } from 'react'
import { useEffect } from 'react'

function App() {

  const [testMessage, setTestMessage] = useState(null)

  useEffect(() => {
      fetch('http://localhost:8080/test/hello')
        .then(response => response.json())
        .then(data => setTestMessage(data.message))
    .catch(error => console.error('Error fetching test message:', error))

  }, [])
  
  return (
    <div className="app-root">
      <h1>Parking System</h1>
        <p>Test fetch result: {testMessage ?? 'Cargando...'}</p>
    </div>
  )
}

export default App
