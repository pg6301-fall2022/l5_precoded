import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const users = [
    {
        username: "administrator", password: "mostly secret", fullName: "Testsson"
    }
]



app.get("/login", (req, res) => {
    // GET returns some data ( server -> client)
    const user = users.find(u => u.username === req.cookies.username);
    const { fullName, username } = user;
    res.json({ username, fullName });
});

app.post("/login", (req, res) => {
    // POST sends data (client -> server)
    // Since POST sends data from client, we can use it to check that password is correct

    const { password, username } = req.body;

    if(users.find(u => u.username === username).password === password) {
        res.cookie("username", username);
        res.sendStatus(200);
    }
    else {
        res.send(401);
    }

});

app.use(express.static("public"));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at http://localhost:${server.address().port}`);
});
