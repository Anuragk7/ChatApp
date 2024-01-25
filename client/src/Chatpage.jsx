import { useContext, useEffect, useState } from "react"
import Pfp from "./Pfp"
import { UserContext } from "./assets/Usercontext";
export default function Chatpage () {
    const [onUser, setonUser] = useState({})
    const [receiver, setReceiver] = useState()
    const { id} = useContext(UserContext)
    const [Text, seText] = useState("")
    const [websocket, setwebsocket] = useState(null)
    const [chat, setChat] = useState([])
    function showOnlineUser(users) {
        const onlineUser = {}
        users.forEach((user => {
            onlineUser[user.userId] = user.user
        })
        )
        delete onlineUser[id]
        setonUser(onlineUser)
        
    }
    function handlemessage (e) {
       const messagedata = JSON.parse(e.data);
       console.log(messagedata)
       if ('online' in messagedata ){
        showOnlineUser(messagedata.online);
       }
       else if ('message' in messagedata) {
        console.log(messagedata)
            setChat( (prev) => {
               return( [...prev, {author: messagedata.message.author, text: messagedata.message.text}])
            })
       }
    }
    function sendMessage (e) {
        e.preventDefault();
        websocket.send(JSON.stringify({
            message : {
                recipient: receiver,
                text: Text
            }
        }))
       
        setChat((prev) => {
            return ([...prev, { author: "Me",text:Text}])
        })
        console.log(chat);
        seText("");
       
    }
   
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4040')
        setwebsocket(ws)
        ws.addEventListener('message', handlemessage)
    }, [])
     

    return (
    <div className="flex h-screen w-screen">
        <div  className="bg-white w-1/3  ">
            
           <div  className="bg-white flex-grow ">
             <div className=" text-blue-700 flex gap-2 p-2 justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
            </svg>

                <b>ChatApp </b>
                
             </div>
                 {Object.keys(onUser).map((userId) => {
                    return <div  
                         onClick = {
                        ()=> { setReceiver(userId)} }
                        key = {userId} className= {` p-1 flex items-center gap-2 ${receiver == userId? 'bg-blue-200': 'bg-white'} `} >
                        {userId ==  receiver && (<div  className="bg-purple-900 h-10 w-1 rounded-lg"></div>)}
                        <Pfp name = {onUser[userId]} 
                       
                        />
                        <span>{onUser[userId]}</span> 
                       
                        </div>
                 })}
           </div>
        </div>
        
        <div className="bg-blue-300 w-2/3 p-2 flex flex-col">
           {!!receiver &&  <div className="flex-grow">
               { chat.map( (c) => {
                    return (<div> {`${c.author}: ${c.text}`}</div>)
                })
                 }
            
            </div>
            }
            
            {!! receiver &&
            
            <form onSubmit={sendMessage}>
            <div className="flex gap-2 ">
                <input type = "text"
                    onChange={(e) => {
                        e.preventDefault()
                        seText(e.target.value)
                    }}
                    placeholder="Type your message here"
                    value={Text}
                    className= "p-2 border bg-white rounded-lg flex-grow  "
                />
                <button type = "submit"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>
            </form>

            ||
            <div className="flex-grow text-center text-gray-500"> Select a User to Start Chatting </div>
            
            }
            
       

        </div>
                
        
        
    </div>)
}