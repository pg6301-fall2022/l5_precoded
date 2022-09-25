import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    const { username } = req.signedCookies;
    req.user = users.find(u => u.username === username);
    console.log("before login");
    next();
    console.log("after login");
});


const users = [
    {
        username: "administrator", password: "mostly secret", fullName: "Testsson"
    },
    {
        username: "dummyuser", password: "dummy", fullName: "Randy the Random"
    }
]



app.get("/login", (req, res) => {
    // GET returns some data ( server -> client)
    console.log("In the get function");

    if(!req.user) {
        return res.sendStatus(401);
    }

    const user = users.find(u => u.username === req.user.username);
    const { fullName, username } = user;
    res.json({ username, fullName });
});

app.get("/users", (req, res) => {
   if(!req.user){
       // Information is not accessible if not logged in
       return res.sendStatus(401);
   }
   else {
       res.json(users.map( ({ fullName, username}) => ({username, fullName}) ));
   }
});

app.post("/users", (req, res) => {
    const { username, fullName, password } = req.body;
    if(!username || !fullName || !password){
        return res.sendStatus(400);
    }
    users.push({username: username, fullName: fullName, password: password});
    res.redirect("/");
});

app.post("/login", (req, res) => {
    // POST sends data (client -> server)
    // Since POST sends data from client, we can use it to check that password is correct

    const { password, username } = req.body;

    const user = users.find(u => u.username === username);

    if(user && user.password === password) {
        res
            .cookie("username", username, {signed: true})
            .redirect("/");
    }
    else {
        res.sendStatus(401);
    }

});

app.use(express.static("public"));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at http://localhost:${server.address().port}`);
});
