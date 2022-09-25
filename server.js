import express from "express";

const app = express();

app.get("/login", (req, res) => {
    // GET returns some data ( server -> client)
    res.json({
        username: "admin"
    });
});

app.post("/login", (req, res) => {
    // POST sends data (client -> server)
    console.log("Test");
    res.end();
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`server started at http://localhost:${server.address().port}`);
});
