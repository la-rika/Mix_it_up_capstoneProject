import express from 'express';
import ejs from 'ejs';
import { getDirName } from './utils.js'

const dirName = getDirName(import.meta.url)

const app = express();
const port = 3000;
app.use(express.static(dirName + '/public'));

app.get('/',(req,res)=>{
    res.render('homepage.ejs')
})

app.listen(port, ()=>{
    console.log(`server up and running on port ${port}`)
})