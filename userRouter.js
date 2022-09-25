import express from "express";

export const loginPath = new express.Router();
export const userPath = new express.Router();

loginPath.get("/", (req, res) => {
    const { username } = req.signedCookies;
    const user = USERS.find(u => u.username === username);
    res.json(user);
});

loginPath.post("/", (req, res) => {
    const { password, username } = req.body;
    const user = USERS.find(u => u.username === username);
    if(!user || user.password !== password){
        return res.sendStatus(401);
    } else {
        res
            .cookie("username", user.username, {signed: true})
            .redirect("/");
    }
});

userPath.get("/", (req, res) => {
    if(!req.user){
        return res.sendStatus(401);
    }
    res.json(USERS);
});

userPath.post("/", (req, res) => {
    const { username, fullName, password } = req.body;
    if(!username || !fullName || !password){
        return res.sendStatus(400);
    }
    USERS.push({username, fullName, password});
    res.redirect("/");
});

export const USERS = [
    {
        username: "administrator", password: "mostly secret", fullName: "Testsson"
    },
    {
        username: "dummyuser", password: "dummy", fullName: "Randy the Random"
    }
];

export function userMiddleware(req, res, next) {
    req.user = USERS.find(u => u.username === req.signedCookies.username);
    next();
}