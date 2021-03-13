const express = require('express');
const { dataBaseManager } = require("./dbconnection");
const app = express();

dataBaseManager.connectionToTheDatabase();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

app.get('/', async(req, res) => {
    const betterGames = await dataBaseManager.searchTheBetterGames();
    const lastGames = await dataBaseManager.searchTheLastGames();
    res.render("index", { betterGames, lastGames })
})

app.post('/dashboard', async(req, res) => {
    const name = req.body.name;
    const score = req.body.score;
    const date = req.body.date;

    await dataBaseManager.addToTheDashboard(name, score, date);
    console.log(req.body)

})

app.listen(process.env.PORT || 8080)