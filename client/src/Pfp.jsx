export default function Pfp (props) {
    if (props.name) {
        const  bgColors = ['bg-yellow-200' , 'bg-green-200' , 'bg-red-200' , 'bg-pink-200' , 'bg-violet-200']
        const ind  = props.name[0].charCodeAt(0)
        return (
            <div className= {`h-10 w-10 rounded-full flex justify-center items-center ${bgColors[ind%(bgColors.length - 1) ]  }` }>
               {props.name[0]}
            </div>
        )
        
    }
    return <div>nouser</div> 
   
}