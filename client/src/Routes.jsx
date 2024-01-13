import { useContext } from "react";
import SignupAndLogin from "./SignupAndLogin";
import { UserContext } from "./assets/Usercontext";

export default function Routes () {
    
    const {curruser, id} = useContext(UserContext)
     if (curruser){
        return (`Hello ${curruser}`)
     }
    
    return (
        <SignupAndLogin/>
    )
}