const { MongoClient } = require("mongodb");
const { uri } = require("./uri");

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectionToTheDatabase() {
    try {
        await client.connect();
        console.log("Connexion à la base de donnée avec succès !");
    } catch (error) {
        console.log("Erreur !");
    }
}

async function searchTheBetterGames() {
    let array = []
    const database = client.db("bowling");
    const dashboard = database.collection("dashboard");
    await dashboard.find().sort({ score: -1 }).limit(10).forEach(function(doc) {
        array.push({ name: doc.name, score: doc.score, date: doc.date })
    });
    return array
}

async function searchTheLastGames() {
    let array = []
    const database = client.db("bowling");
    const dashboard = database.collection("dashboard");
    await dashboard.find().limit(10).forEach(function(doc) {
        array.push({ name: doc.name, score: doc.score, date: doc.date })
    });
    return array
}

async function addToTheDashboard(name, score, date) {
    const database = client.db("bowling");
    const dashboard = database.collection("dashboard");
    const doc = { name: name, score: score, date: date };
    await dashboard.insertOne(doc)
}

exports.dataBaseManager = { connectionToTheDatabase, searchTheBetterGames, searchTheLastGames, addToTheDashboard };