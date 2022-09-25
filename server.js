import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const users = [
    {
        username: "admin", password: "mostly secret"
    }
]



app.get("/login", (req, res) => {
    // GET returns some data ( server -> client)
    res.json({
        username: "admin"
    });
});

app.post("/login", (req, res) => {
    // POST sends data (client -> server)
    // Since POST sends data from client, we can use it to check that password is correct

    const body = req.body;
    const username = body.username;
    const password = body.password;

    if(users.find(u => u.username === username).password === password) {
        res.sendStatus(200);
    }
    else {
        res.send(401);
    }

});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at http://localhost:${server.address().port}`);
});
