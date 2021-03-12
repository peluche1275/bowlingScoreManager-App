const express = require('express');
const { dataBaseManager } = require("./dbconnection");
const app = express();

async function test() {
    await dataBaseManager.connectionToTheDatabase();
    await dataBaseManager.searchTheDashboard();
}

test()

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render("index")
})

app.listen(process.env.PORT || 8080)