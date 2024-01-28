import { createContext,  useEffect, useState} from "react";
import axios from "axios";
export const UserContext = createContext({});
export function UserContextProvider({children}) {
    const [curruser, setcurruser] = useState('')
    const [id, setid] = useState('')
    useEffect(()=> {
        axios.get('/profile').then( response => {
           console.log(response.data)
           setid(response.data.userId)
           setcurruser(response.data.user)
        })
    },[])
    return (
        <UserContext.Provider value = {{curruser, setcurruser, id, setid}}>
            {children}
        </UserContext.Provider>
    )
}