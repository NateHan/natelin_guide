import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './pages/Home'
import CityGuide from './pages/CityGuide'

// Wrapper forces a full remount when the city slug changes,
// which resets tab state cleanly without complex useEffect logic.
function CityGuideWrapper() {
  const { city } = useParams()
  return <CityGuide key={city} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:city" element={<CityGuideWrapper />} />
      </Routes>
    </BrowserRouter>
  )
}
