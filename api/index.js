const express = require ('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const user = require('./api_models/User');
const cookieparser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const ws = require('ws')


dotenv.config() 
mongoose.connect(process.env.MONGO_URL)
const app = express();
app.use(express.json());
app.use(cookieparser());
const bcryptSalt = bcrypt.genSaltSync(10)
app.use(cors({
    credentials: true,
    origin:  process.env.CLIENT_URL
}))  


const jwtkey = process.env.JWT_KEY;
console.log(jwtkey)
app.options('/signup', cors());

app.get('/test', (req,res)=> {
    res.send('test ok');
});
app.post('/login', async (req,res) => {
  console.log('login called')
  const {username, password} =  req.body;
  const founduser = await user.findOne({username})
  if (founduser){
    console.log('userfoudn')
    const validated = bcrypt.compareSync(password, founduser.password)
    if (validated){
      jwt.sign( {userId: founduser._id, user:username},jwtkey ,{},
        (error,token)=> { 
          if (error){
            throw error;
          }
          res.cookie('token', token,{sameSite:'none', secure:true},).status(201).json({
            id: founduser._id,
            user: username
          });
        })
    }
  }
})
app.get('/profile', (req,res) => {
  const token = req.cookies?.token;
  if (token) {
    console.log('token')
    jwt.verify(token,jwtkey, {}, (err,data)=> {
      if (err) throw err;
      res.json(data);
    })
  }
  else {
    console.log('no token')
    res.status(401).json('unauthorized') 
  }
  

})
app.post('/signup', async(req,res) => {
    console.log('signupcalled')
    const {username,password} = req.body;
    try {
    const encryptedpass = bcrypt.hashSync(password)
    const newuser = await user.create({username:username,password:encryptedpass})

    jwt.sign( {userId: newuser._id, user:username},jwtkey ,{},
      (error,token)=> { 
        if (error){
          throw error;
        }
        res.cookie('token', token,{sameSite:'none', secure:true},).status(201).json({
          id: newuser._id,
        });
      }) ; }
      catch(err) {
        if (err) throw err;
        res.status(500).json('eror');
      }
    
  });


const server = app.listen(4040, ()=> {
console.log('server started at port 4040')
console.log(process.env.CLIENT_URL)});

const  wss = new  ws.WebSocketServer({server})

wss.on('connection', (connection, req) => {
 const cookies = req.headers.cookie;
 if (cookies) {
  
   const tokencookie = cookies.split(';').find((str)=> str.startsWith('token='))
   if (tokencookie) {
    
     const token = tokencookie.split('=')[1];
     if (token) {
       jwt.verify(token, jwtkey, {}, (err, data) => {
         if (err) {
           console.log('no') 
           throw err
         }
         const {userId, user} = data;
         connection.userId =  userId;
         connection.user = user;
        
       })
     }
   }
  
  
 }
 
  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId:c.userId,user:c.user})),
      }));
    });
  }
  notifyAboutOnlinePeople();

  connection.on('message', (message) => {
    console.log("received")
    const received = JSON.parse(message.toString())
    const {recipient, text} = received.message;
    if (recipient && text) {
      [...wss.clients]
        .filter( c => c.userId === recipient)
        .forEach (c => c.send(JSON.stringify(
          {message:{author: connection.user, text:text}}
        )))
    }
  })
  

 
  
})


