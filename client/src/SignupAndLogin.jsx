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
         setid(user)
       
          setolduser(true)


      }
    return (<div className="bg-gradient-to-r from-blue-200 to-cyan-200 h-screen flex items-center ">
      
        <form className="w-64 mx-auto mb-10 " onSubmit={handlesubmit}  >
            <h1 className= " text-white m-5 text-center font-bold text-xl"> Welcome To MERN Chat </h1>
            <input type = "text" placeholder= {user} 
            className="block w-full  border p-2 mb-2 rounded-xl font-small" 
            onChange={e => setuser(e.target.value)}/>


            <input type = "password" placeholder={password} 
            className=" block w-full border p-2 mb-2 rounded-xl"
             onChange={e => setpassword(e.target.value)}/>
            <button type =  'submit' className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-white w-full p-2 rounded-lg" >{olduser? "Login": "Signup"}</button>
            <div className="text-center mt-2">
            
            <button type = 'button'  className = 'text-black' onClick={()=> {setolduser( (prev) => {return !prev })}}> {olduser?"Don't have an account? Signup":"Already a member? Login Here"}</button>
            </div>
        
           
        </form>
       
    </div>);
}