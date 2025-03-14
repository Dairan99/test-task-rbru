import { useSelector } from "react-redux"
import Calculation from "./components/Calculation"
import Entrance from "./components/Entrance"

interface RootState {
  start:{
    openCalculation:boolean
  }
}
// Мне нравится делать через Redux, хоть это и немного дольше, но в будущем больше времени сэкономит. 
function App() {
  const open = useSelector((state:RootState) => state.start.openCalculation)

  return (
    <>
      {open ? <Calculation/> : <Entrance/>}
    </>
  )
}

export default App
