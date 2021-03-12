const { MongoClient } = require("mongodb");
const { uri } = require("./uri");

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        await client.db("bowling").command({ ping: 1 });
        console.log("Connected successfully to server");
    } catch (error) {
        console.log("Erreur !");
    }
}
exports.run = run;