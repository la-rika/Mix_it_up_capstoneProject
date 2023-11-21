import express from 'express';
import ejs from 'ejs';

const app = express();
const port = 3000;

app.get('/',(req,res)=>{
    res.render('homepage.ejs')
})

app.listen(port, ()=>{
    console.log(`server up and running on port ${port}`)
})