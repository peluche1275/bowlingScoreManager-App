const express = require('express')
const { dataBaseManager } = require("./dbconnection")
const xml = require('xml')
const app = express()

dataBaseManager.connectionToTheDatabase()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.get('/', async(req, res) => {
    const betterGames = await dataBaseManager.searchTheBetterGamesInformations()
    const lastGames = await dataBaseManager.searchTheLastGamesInformations()
    res.render("index", { betterGames, lastGames })
})

app.get('/score', async(req, res) => {
    const gameInformation = await dataBaseManager.searchInformationOfASpecificGame(parseInt(req.query.id))
    res.render("shareScore", gameInformation)
})

app.post('/saveScore', async(req, res) => {
    const response = await dataBaseManager.addGameInformationToTheScoreCollection(req.body.name, req.body.totalScore, req.body.throwHistory, req.body.frameHistory)
    res.set('Content-Type', 'text/xml')
    res.send(xml(response))
})

app.post('/dashboard', async(req, res) => {
    const name = req.body.name
    const score = req.body.score
    const date = req.body.date
    await dataBaseManager.addGameInformationToTheDashboardCollection(name, score, date)
})

app.listen(process.env.PORT || 8080)