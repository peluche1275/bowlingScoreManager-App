const { MongoClient } = require("mongodb");
const { uri } = require("./uri");

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectionToTheDatabase() {
    try {
        await client.connect();
        console.log("Connected successfully to server");
    } catch (error) {
        console.log("Erreur !");
    }
}

async function searchTheDashboard() {
    let array = []
    const database = client.db("bowling");
    const dashboard = database.collection("dashboard");
    await dashboard.find().forEach(function(doc) {
        array.push({ name: doc.name, score: doc.score })
    });
    return array
}

exports.dataBaseManager = { connectionToTheDatabase, searchTheDashboard };