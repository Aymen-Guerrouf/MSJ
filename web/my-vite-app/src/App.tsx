import Admin from './pages/Admin'
import SuperAdmin from './pages/SuperAdmin'
import LogIn from './pages/LogIn'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'

function App() {

  return (
    <>
    
      <Router>
        <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/adminDashboard' element={<Admin />} />
          <Route path='/superDashboard' element={<SuperAdmin />} />
        </Routes>
      </Router>
    
    </>
  )
}

export default App;
