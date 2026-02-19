import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ExpenseBudgetPage from './pages/ExpenseBudgetPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ExpenseBudgetPage />} />
        {/* Future pages go here, e.g.: */}
        {/* <Route path="/revenue" element={<RevenuePage />} /> */}
        {/* <Route path="/headcount" element={<HeadcountPage />} /> */}
      </Routes>
    </Layout>
  )
}
