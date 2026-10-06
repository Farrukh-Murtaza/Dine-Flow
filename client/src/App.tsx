import { Routes, Route } from "react-router-dom"
import LoginScreen from "./components/LoginScreen"

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
      {/* <h2 className="bg-amber-500 text-2xl">Client Setup Successfully</h2> */}
    </>
  )
}

export default App
