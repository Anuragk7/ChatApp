import { useEffect, useState } from "react"

export default function Chatpage () {
    const  [onUser, setonUser] = useState({})
    function showOnlineUser(users) {
        const onlineUser = {}
        users.forEach((user => {
            onlineUser[user.userId] = user.user
        })
        )
        setonUser(onlineUser)
        console.log("haha", onUser)
        
    }
    function handlemessage (e) {
       const messagedata = JSON.parse(e.data);
       console.log(messagedata)
       if ('online' in messagedata ){
        showOnlineUser(messagedata.online);
       }
    }
    const [websocket, setwebsocket] = useState(null)
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4040')
        setwebsocket(ws)
        ws.addEventListener('message', handlemessage)
    }, [])
     

    return (
    <div className="flex h-screen w-screen">
        <div  className="bg-blue-100 w-1/3 p-2 ">
           <div  className="bg-white flex-grow"> MERN CHATAPP
                 {Object.keys(onUser).map((userId) => {
                    return <div>
                        {onUser[userId]}
                        </div>
                 })}
           </div>
        </div>
        <div className="bg-blue-300 w-2/3 p-2 flex flex-col">
            <div className="flex-grow">
                Send a chat to 
            </div>
            <div className="flex gap-2 flex-wrap">
                <input type = "text"
                    placeholder="Hey what's going on?"
                    className= "p-2 border bg-white rounded-lg flex-grow "
                />
                <button ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 flex-shrink">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>
       

        </div>
    </div>)
}