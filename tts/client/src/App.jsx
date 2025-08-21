import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}

export default App