const { MongoClient } = require("mongodb")
const { uri } = require("./uri")
const client = new MongoClient(uri, { useUnifiedTopology: true })

async function connectionToTheDatabase() {
    try {
        await client.connect()
        console.log("Connexion à la base de donnée avec succès !")
    } catch (error) {
        console.log("Erreur !")
    }
}

async function searchTheBetterGamesInformations() {
    let BetterGamesInformations = []
    const dashboard = connectToCollection("dashboard")
    await dashboard.find().sort({ score: -1 }).limit(10).forEach(function(doc) {
        BetterGamesInformations.push({ name: doc.name, score: doc.score, date: doc.date })
    })
    return BetterGamesInformations
}

function connectToCollection(collection) {
    const database = client.db("bowling")
    const collectionToUse = database.collection(collection)
    return collectionToUse
}

async function searchTheLastGamesInformations() {
    let LastGamesInformations = []
    const dashboard = connectToCollection("dashboard")
    await dashboard.find().limit(10).forEach(function(doc) {
        LastGamesInformations.push({ name: doc.name, score: doc.score, date: doc.date })
    })
    return LastGamesInformations
}

async function searchInformationOfASpecificGame(id) {
    const score = connectToCollection("score")
    const idToFind = await score.findOne({ id: id })
    return idToFind
}

async function addGameInformationToTheDashboardCollection(name, score, date) {
    const dashboard = connectToCollection("dashboard")
    const doc = { name: name, score: score, date: date }
    await dashboard.insertOne(doc)
}

async function addGameInformationToTheScoreCollection(name, totalScore, throwHistory, frameHistory) {
    const score = connectToCollection("score")
    const count = await score.countDocuments()
    const doc = { id: count, name: name, totalScore: totalScore, throwHistory: throwHistory, frameHistory: frameHistory }
    await score.insertOne(doc)
    return count
}

exports.dataBaseManager = { connectionToTheDatabase, searchTheBetterGamesInformations, searchTheLastGamesInformations, addGameInformationToTheDashboardCollection, addGameInformationToTheScoreCollection, searchInformationOfASpecificGame }