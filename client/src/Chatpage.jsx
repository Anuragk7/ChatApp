import { useContext, useEffect, useRef, useState } from "react"
import Pfp from "./Pfp"
import { UserContext } from "./assets/Usercontext";
import {uniqBy} from "lodash"
import axios from "axios"
export default function Chatpage () {
    const [onUser, setonUser] = useState({})
    const [receiver, setReceiver] = useState()
    const { id,setid} = useContext(UserContext)
    const [Text, seText] = useState("")
    const [websocket, setwebsocket] = useState(null)
    const [chat, setChat] = useState([])
    const msgref = useRef()
    const [offUser, setoffUser] = useState({})

    function sendfile( e) {
       
       sendMessage(e);

    }
    
    function showOnlineUser(users) {
        const onlineUser = {}
        users.forEach((user => {
            if (user.userId!== id){
                onlineUser[user.userId] = user.user
            }
           
        })
        )
        delete onlineUser[id]
        setonUser(onlineUser)
        
    }
    function handlemessage (e) {
       const messagedata = JSON.parse(e.data);
      
       if ('online' in messagedata ){
        showOnlineUser(messagedata.online);
       
       }
       else if ('message' in messagedata) {
       
            const message = messagedata.message;
            
            setChat( (prev) => {
             
               return( [...prev, {sender:message.sender, receiver:message.receiver, text: message.text, _id: message._id, }])
              
            })
          
       }
    }
    function logout(e) {
        e.preventDefault()
        axios.post('/logout').then( ()=> {
            setid(null)
            
        })
       
    }
    useEffect( ()=> {
        if (chat){
            const lastmsg = msgref.current
            if (lastmsg)
            lastmsg.scrollIntoView({behavior:'smooth'})
        }

    }, [chat])

    useEffect(()=> {
        console.log('refresh')
        axios.get('/people').then( res => {
            console.log('hello')
            const ppl = res.data
                .filter(p => p._id!==id && onUser[p._id] === undefined )
                
                if (ppl) {
                setoffUser( () => {
                    const abc = {}
                    ppl.forEach((user => {
                        abc[user._id] = user.username
                    }))
                    delete abc[id]
                    return abc
                })
                }
        })
    }, [onUser])
    function sendMessage (e) {
        const file = ev.target?.files?.[0]
        if (!file){
            e.preventDefault();
            websocket.send(JSON.stringify({
                message : {
                    recipient: receiver,
                    text: Text
                }
            }))
           
           
            console.log(chat);
            seText("");
           
        }
        else {
            websocket.send(JSON.stringify({
                file: {

                }
            }))
        }
       
       
    }
    const connecToWs = () => {
        const ws = new WebSocket('ws://https://chat-app-beta-five-23.vercel.app:4040')
        setwebsocket(ws)
        ws.addEventListener('message', handlemessage);
        ws.addEventListener('close', connecToWs)
    }
    useEffect(connecToWs, [])
    useEffect(()=> {
        if (receiver) {
             axios.get('/messages/'+receiver).then((res)=>{
                const {data} = res
                if (data) {
                   setChat(data);
                }
                
               
                console.log("messages",data)
            });
           
        }
       
    }, [receiver])
    const uniqueMessages = uniqBy(chat, '_id');
    return (
    <div className="flex h-screen  ">
        <div  className="bg-white w-1/3 h-screen no-scrollbar flex flex-col   ">
            
           <div  className="bg-white flex flex-col h-full ">
             <div className=" text-blue-700 flex gap-2 p-2 justify-center  ">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
            </svg>

                <b>ChatApp </b>
                
             </div>
            <div className= " overflow-y-scroll  max-h-[83vh] no-scrollbar mt-auto mb-auto" >

              
                 {Object.keys(onUser).map((userId) => {
                    return <div  
                         onClick = {
                        ()=> { 
                            setReceiver(userId)
                            console.log(userId)
                         }
                        }
                        key = {userId} className= {` p-1 flex items-center gap-2  ${receiver == userId? 'bg-blue-200 ': 'bg-white'} `} >
                        {userId ==  receiver && (<div  className="bg-purple-900 h-10 w-1 rounded-lg"></div>)}
                        <Pfp name = {onUser[userId]} 
                             online = 'true'
                        />
                        <span>{onUser[userId]}</span> 
                       
                        </div>
                 })}
                 {Object.keys(offUser).map((userId) => {
                    if (offUser[userId])
                    return <div  
                         onClick = {
                        ()=> { 
                            setReceiver(userId)
                            console.log(userId)
                         }
                        }
                        key = {userId} className= {` p-1 flex items-center gap-2  ${receiver == userId? 'bg-blue-200': 'bg-white'} `} >
                        {userId ==  receiver && (<div  className="bg-purple-900 h-10 w-1 rounded-lg"></div>)}
                        <Pfp name = {offUser[userId] } 
                               
                        />
                        <span>{offUser[userId]}</span> 
                       
                        </div>
                 })}
                </div>
           </div>
           <div className= " pt-2 flex items-center justify-center">
             <button onClick={logout}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="w-6 h-6 m-0  p-0 inline">
             <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
             
            </svg>
            <div className="inline p-1"> Signout </div>
            </button>
           </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-200 to-cyan-200 w-2/3 p-2 flex flex-col ">
           {!!receiver &&  <div className="flex-grow no-scrollbar overflow-y-scroll">
               { uniqueMessages.map( (c) => {
                    console.log(id, c.sender)
                    return (<div key={c._id} className=  {"rounded-lg p-1 m-2 w-fit pr-3 pl-3 " +  ` ${c.sender === id ? 'bg-gradient-to-r from-indigo-400 to-cyan-400 mr-auto ml-0': 'bg-gradient-to-r from-fuchsia-600 to-pink-600 ml-auto'} ` } > { `${c.sender === id ?  'Me':onUser[c.sender] }: ${c.text}`} </div>)
                })
                }
                <div ref = {msgref}> </div>
              
            
            </div>
            }
            
            {!! receiver &&
            
            <form onSubmit={sendMessage} className="flex gap-2  ">
            
                <input type = "text"
                    onChange={(e) => {
                        e.preventDefault()
                        seText(e.target.value)
                    }}
                    placeholder="Type your message here"
                    value={Text}
                    className= "p-2 border bg-white rounded-lg flex-grow  "
                />
                 <label type = "button"  className="flex items-center cursor-pointer" onChange={sendfile} >
                    <input type="file" className="hidden">
                    </input>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>
                </label>
                <button type = "submit"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    
                </button>
               
               
                
            
            </form>

            ||
            <div className=" text-center text-gray-500 mt-auto mb-auto"> Select a User to Start Chatting </div>
            
            }
            
       

        </div>
                
        
        
    </div>)
}
