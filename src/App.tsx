import { Routes, Route } from 'react-router'
import { ThemeProvider } from '@/themes/ThemeProvider'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </ThemeProvider>
  )
}
