const express = require('express')
const { dataBaseManager } = require("./dbconnection")
const xml = require('xml')
const app = express()

dataBaseManager.connectionToTheDatabase();

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json())

app.get('/', async(req, res) => {
    const betterGames = await dataBaseManager.searchTheBetterGames()
    const lastGames = await dataBaseManager.searchTheLastGames()
    res.render("index", { betterGames, lastGames })
})

app.get('/score', async(req, res) => {
    const object = await dataBaseManager.searchAGame(parseInt(req.query.id))
    res.render("shareScore", object)
})

app.post('/saveScore', async(req, res) => {
    const response = await dataBaseManager.addToTheScore(req.body.name, req.body.totalScore, req.body.throwHistory, req.body.frameHistory)
    res.set('Content-Type', 'text/xml');
    res.send(xml(response));
})

app.post('/dashboard', async(req, res) => {
    const name = req.body.name
    const score = req.body.score
    const date = req.body.date

    await dataBaseManager.addToTheDashboard(name, score, date)
})

app.listen(process.env.PORT || 8080)