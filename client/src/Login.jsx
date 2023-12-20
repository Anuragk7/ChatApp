import { useState } from "react";

export default function Login () {
    const [user, setuser] = useState('username');
    const [password, setpassword] = useState('password');
    return (<div className="bg-blue-50 h-screen flex items-center">

        <form className="w-64 mx-auto mb-10 ">

            <input type = "text" placeholder= {user} 
            className="block w-full rounded-sm border p-2 mb-2" 
            onChange={e => setuser(e.target.value)}/>


            <input type = "password" placeholder={password} 
            className="block w-full rounded-sm border p-2 mb-2"
             onChange={e => setpassword(e.target.value)}/>
            <button className="rounded-sm bg-blue-500 text-white w-full p-2">Signup</button>
            
        </form>
    </div>);
}