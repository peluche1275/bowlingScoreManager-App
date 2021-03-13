const express = require('express');
const { dataBaseManager } = require("./dbconnection");
const app = express();

async function waitForTheConnection() {
    await dataBaseManager.connectionToTheDatabase();
}
waitForTheConnection();

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
    console.log(req.body)
})

app.listen(process.env.PORT || 8080)