const express = require ('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const user = require('./api_models/User');
const cookieparser = require('cookie-parser')
const bcrypt = require('bcryptjs')


dotenv.config() 
mongoose.connect(process.env.MONGO_URL)
const app = express();
app.use(express.json());
app.use(cookieparser());
const bcryptSalt = bcrypt.genSaltSync(10)
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))


const jwtkey = process.env.JWT_KEY;
console.log(jwtkey)
app.options('/signup', cors());

app.get('/test', (req,res)=> {
    res.send('test ok');
});
app.get('./login', async (res,req) => {
  const {username, password} =  req.body;
  const founduser = await user.findOne({username})
  if (founduser){
    const validated = bcrypt.compareSync(password, founduser.password)
    if (validated){
      jwt.sign({userId:founduser, id, username}, jwtkey,{}, (err,token) => {
        res.cookie('token', token).json({
          id: founduser._id
        })
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
    const {username,password} = req.body;
    try {
    const encryptedpass = bcrypt.hashSync(password)
    const newuser = await user.create({username:username,password:encryptedpass})
    console.log(newuser._id)
    console.log(jwtkey)
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


app.listen(4040, ()=> {
console.log('server started at port 4040')
console.log(process.env.CLIENT_URL)});
