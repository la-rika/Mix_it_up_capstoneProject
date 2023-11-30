import express from 'express';
import ejs from 'ejs';
import { getDirName } from './utils.js'
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios'

const dirName = getDirName(import.meta.url)

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json()); //analizza i payload in json
app.use(bodyParser.json());//analizza i dati json ottenuti dal body della request
//trasforma i dati ottenuti dal body della request in variabili accessibili a javascript
//extended precisa che verranno accettati dati di qualsiasi tipo (non solo string)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(dirName + '/public'));

let cocktailName ='';
let cocktailIngredients=[];

app.get('/', (req, res) => {
    res.render('homepage.ejs',{name: cocktailName, ingredients:cocktailIngredients});
})

app.post('/', (req, res) => {
    const searchedCockail = req.body.cocktailName;
    try {
        axios.get(`http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchedCockail}`).then((response) => {
            console.log(response.data.drinks.find(item=>item.strDrink.toLowerCase() === searchedCockail.toLowerCase()))
            const foundCocktail = response.data.drinks.find(item=>item.strDrink.toLowerCase() === searchedCockail.toLowerCase())
            cocktailName =  foundCocktail.strDrink;
            res.redirect('/')
        })
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`server up and running on port ${port}`)
})