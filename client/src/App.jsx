
import axios from "axios"
import { UserContextProvider } from "./assets/Usercontext";
import Routes from "./Routes";

function App() {
  axios.defaults.baseURL = 'https://chat-app-beta-five-23.vercel.app/';
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
       <Routes/>
    </UserContextProvider>
     
      
  )
}

export default App
