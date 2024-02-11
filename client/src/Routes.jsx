import { useContext } from "react";
import SignupAndLogin from "./SignupAndLogin";
import { UserContext } from "./assets/Usercontext";
import Chatpage from "./Chatpage";

export default function Routes () {
    
    const {curruser, id} = useContext(UserContext)
     if (id){
        return (<Chatpage/>)
     }
    
    return (
        <SignupAndLogin/>
    )
}