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

let cocktailName = '';
let searchedCockail = '';
let ingredients = [];
let measures = [];
let notFound = '';
let drinkType = false;
let listCocktails = [];
let checked;

app.get('/', (req, res) => {
    console.log(ingredients, measures)
    res.render('homepage.ejs', { name: '', ingredients: [], measures: [], cocktailNotFound: '', showModal: false });
})

app.get('/categories', (req, res) => {
    res.render('categories.ejs', { cocktailList: [], checked: false, name: '', ingredients: [], measures:[], showModal: false})
})

app.post('/', (req, res) => {
    searchedCockail = req.body.cocktailName;
    try {
        axios.get(`http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchedCockail}`).then((response) => {
            console.log(response.data.drinks)
            if (ingredients.length === 0 && measures.length === 0 && searchedCockail && response.data.drinks.find(item => item.strDrink.toLowerCase() === searchedCockail.toLowerCase())) {
                console.log('found')
                const foundCocktail = response.data.drinks.find(item => item.strDrink.toLowerCase() === searchedCockail.toLowerCase())
                cocktailName = foundCocktail.strDrink;
                console.log(foundCocktail)
                const keys = Object.keys(foundCocktail);
                const ingredientsKeys = [];
                const measuresKeys = [];
                keys.forEach(el => {
                    if (el.includes('strIngredient') && foundCocktail[el] !== null) {
                        ingredientsKeys.push(el)
                    } else if (el.includes('strMeasure') && foundCocktail[el] !== null) {
                        measuresKeys.push(el)
                    }
                })

                ingredientsKeys.forEach((key, index) => {
                    ingredients = [...ingredients, { ingredient: foundCocktail[key] }]
                    // console.log(`${key}: ${foundCocktail[key]}`);
                });
                measuresKeys.forEach((key, index) => {
                    measures = [...measures, { measure: foundCocktail[key] }]
                    // console.log(`${key}: ${foundCocktail[key]}`);
                });
                console.log(ingredients, measures)
                // ingredients = [{...ingredients, ingredient: foundCocktail.strIngredient1, measure:foundCocktail.strMeasure1}];
                res.render('homepage.ejs', { name: cocktailName, ingredients: ingredients, measures: measures, cocktailNotFound: '', showModal: true });
                ingredients = [];
                measures = [];
            }
            else {
                notFound = 'No data available for the searched cocktail :(';
                console.log('not found')
                res.render('homepage.ejs', { name: cocktailName, ingredients: ingredients, measures: measures, cocktailNotFound: notFound, showModal: true });
            }
        })
    } catch (err) {
        console.log(err);
    }
})

app.post('/categories', (req, res) => {
    drinkType = req.body.drinkType;
    cocktailName = req.body.cocktailName;

    var alcohol;
    if (cocktailName !== '') {
        console.log(cocktailName)
        try {
            axios.get(`http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`).then((response) => {
                console.log(response.data.drinks)
                if (ingredients.length === 0 && measures.length === 0 && cocktailName && response.data.drinks.find(item => item.strDrink.toLowerCase() === cocktailName.toLowerCase())) {
                    console.log('found')
                    const foundCocktail = response.data.drinks.find(item => item.strDrink.toLowerCase() === cocktailName.toLowerCase())
                    cocktailName = foundCocktail.strDrink;
                    console.log(foundCocktail)
                    const keys = Object.keys(foundCocktail);
                    const ingredientsKeys = [];
                    const measuresKeys = [];
                    keys.forEach(el => {
                        if (el.includes('strIngredient') && foundCocktail[el] !== null) {
                            ingredientsKeys.push(el)
                        } else if (el.includes('strMeasure') && foundCocktail[el] !== null) {
                            measuresKeys.push(el)
                        }
                    })
    
                    ingredientsKeys.forEach((key, index) => {
                        ingredients = [...ingredients, { ingredient: foundCocktail[key] }]
                        // console.log(`${key}: ${foundCocktail[key]}`);
                    });
                    measuresKeys.forEach((key, index) => {
                        measures = [...measures, { measure: foundCocktail[key] }]
                        // console.log(`${key}: ${foundCocktail[key]}`);
                    });
                    console.log(ingredients, measures)
                    // ingredients = [{...ingredients, ingredient: foundCocktail.strIngredient1, measure:foundCocktail.strMeasure1}];
                    res.render('categories.ejs', { name: cocktailName, ingredients: ingredients, measures: measures, cocktailNotFound: '', showModal: true, checked:checked, cocktailList:listCocktails });
                    ingredients = [];
                    measures = [];
                }
                else {
                    notFound = 'No data available for the searched cocktail :(';
                    console.log('not found')
                    res.render('categories.ejs', { name: cocktailName, ingredients: ingredients, measures: measures, cocktailNotFound: notFound, showModal: true, checked:checked, cocktailList:listCocktails});
                }
            })
        } catch (err) {
            console.log(err);
        }
    } else {
        if (drinkType === 'on') {
            alcohol = 'Alcoholic';
            checked = true
        } else {
            alcohol = 'Non_Alcoholic';
            checked = false
        }
        try {
            axios.get(`http://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${alcohol}`)
                .then((response) => {
                    // console.log(response.data)
                    listCocktails = response.data.drinks
                    // console.log(listCocktails)
                    res.render('categories.ejs', { cocktailList: listCocktails, checked: checked, name: cocktailName, ingredients: ingredients, measures: measures, cocktailNotFound: notFound, showModal: false})
                })
        } catch (err) {
            console.log(err)
        }
    }
})



app.listen(port, () => {
    console.log(`server up and running on port ${port}`)
})