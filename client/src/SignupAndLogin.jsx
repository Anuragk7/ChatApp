import { useContext, useState } from "react";
import axios from "axios"
import { UserContext } from "./assets/Usercontext";
export default function SignupAndLogin () {
    const [user, setuser] = useState('username');
    const [password, setpassword] = useState('password');
    const {setcurruser, setid} = useContext(UserContext) 
    const [olduser, setolduser] = useState(false)
    async function handlesubmit (ev) {
         ev.preventDefault();
         let url = '/signup';
         if (olduser) {
            url = '/login'
         }
         console.log(url)
         const {data} = await axios.post(url, {username:user, password:password})
         console.log('hello')
         setcurruser(user)
        
       
          setolduser(true)


      }
    return (<div className="bg-cyan-50 h-screen flex items-center">

        <form className="w-64 mx-auto mb-10  " onSubmit={handlesubmit}  >

            <input type = "text" placeholder= {user} 
            className="block w-full rounded-sm border p-2 mb-2" 
            onChange={e => setuser(e.target.value)}/>


            <input type = "password" placeholder={password} 
            className="block w-full rounded-sm border p-2 mb-2"
             onChange={e => setpassword(e.target.value)}/>
            <button className="rounded-sm bg-cyan-500 text-white w-full p-2" >{olduser? "Login": "Signup"}</button>
            <div className="text-center mt-2">
            
            <button onClick={()=> {setolduser( (prev) => {return !prev })}}> {olduser?"Don't have an account? Signup":"Already a member? Login Here"}</button>
            </div>
        </form>
        
    </div>);
}