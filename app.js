const express = require('express');
const { run } = require("./dbconnection");
const app = express();

run();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render("index")
})
app.listen(process.env.PORT || 8080)