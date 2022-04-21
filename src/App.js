import "./App.css"
import { useEffect, useState } from "react"

const initialFormState = {
  name: '',
  message: ''
}

function App() {
  const [error, setError] = useState("")
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState(initialFormState)

  const onFormSubmit = (e) => {
    e.preventDefault()
    setError("")

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: form.name,
        message: form.message
      })
    }

    fetch(process.env.REACT_APP_API_URL + "/guestbook", options)
      .then((res) => {
        setIsLoading(false)
        if (!res.ok) {
          setError("Error adding entry")
        } else {
          setForm(initialFormState)
          res.json().then((json) => {
            setEntries([json.entry, ...entries])
          })
        }
      })
      .catch(() => {
        setIsLoading(false)
        setError("Error adding entry")
      })
  }

  useEffect(() => {
    setIsLoading(true)
    fetch(process.env.REACT_APP_API_URL + "/guestbook")
      .then((res) => {
        setIsLoading(false)
        if (!res.ok) {
          setError("Error loading entries")
        } else {
          res.json().then((json) => {
            setEntries(json.entries)
          })
        }
      })
      .catch(() => {
        setIsLoading(false)
        setError("Error loading entries")
      })
  }, [])

  return (
    <div className="Guestbook">
      <header className="header">
        <h1>Guestbook</h1>
        <p>Welcome to the Guestbook, write a message below!</p>
      </header>
      <main>
        {error && <span className="error">{error}</span>}
        <form onSubmit={onFormSubmit}>
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required="required"/>
          </label>
          <label>
            Message
            <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}  required="required" />
          </label>
          <input type="submit" value="Add Entry" />
        </form>
        {isLoading ? (
          <p>Loading entries...</p>
        ) : (
          <ul>
            {entries.map((entry, index) => (
              <li key={index}>
                {entry.message} -<strong>{entry.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default App
