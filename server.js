var express = require("express");
var path = require("path");
var app = express();
var fs = require("fs")
var db = require("./db/db.json")
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    res.json(db)
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "./public/index.html"))
})

app.post("/api/notes", (req, res) => {
    console.log(req.body)

    if (!db[db.length - 1]) {
        req.body.id = 1
    } else { req.body.id = db[db.length - 1].id + 1 }

    db.push(req.body)

    fs.writeFile("./db/db.json", JSON.stringify(db), err => {
        if (err) {
            console.log("err")
            res.sendStatus(404)
        } else { res.sendStatus(200) }
    })
})

app.delete("/api/notes/:id", (req, res) => {
    let key = req.params.id

    for (let i = 0; i < db.length; i++) {
        if (db[i].id == key) {
            db.splice(i, 1);
            break;
        }
    }

    console.log(key)

    fs.writeFile("./db/db.json", JSON.stringify(db), err => {
        if (err) {
            console.log("err")
            res.sendStatus(404)
        } else { res.sendStatus(200) }
    })
})

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});