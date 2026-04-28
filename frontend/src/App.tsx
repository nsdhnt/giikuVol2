import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Description from './pages/Description'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Description" element={<Description />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App