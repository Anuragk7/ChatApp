export default function Pfp (props) {
    if (props.name) {
        const  bgColors = ['bg-gradient-to-r from-amber-200 to-yellow-400','bg-gradient-to-r from-lime-400 to-lime-500' , 'bg-gradient-to-r from-lime-400 to-lime-500' , 'bg-red-200' , 'bg-pink-200' , 'bg-violet-200', 'bg-gradient-to-r from-pink-500 to-rose-500', 'bg-gradient-to-r from-fuchsia-500 to-cyan-500']
        const ind  = props.name[0].charCodeAt(0)
        const status = props.online === 'true' ?'bg-green-400 ': 'bg-gray-400 '
        return (
            <div>
                <div className= {`h-10 w-10 rounded-full flex justify-center items-center ${bgColors[ind%(bgColors.length - 1) ]  }` }>
                     {props.name[0]}
                    
                 </div>
                 
                 <div className= {"relative h-2 w-2 rounded-full left-9 bottom-2 " + status}></div>
                
            </div>
            
        )
        
    }
    
   
}