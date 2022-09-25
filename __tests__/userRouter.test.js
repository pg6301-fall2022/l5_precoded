import request from "supertest";
import express from "express";
import {userPath, loginPath, userMiddleware} from "../userRouter.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser("dummy secret"));
app.use(userMiddleware);
app.use("/login", loginPath);
app.use("/users", userPath);

describe ("user router", () => {

    beforeAll(async () => {
        // Make sure there is SOME test data in USERS
        await request(app)
            .post("/users")
            .send({username: "somebody", password: "secret", fullName: "Mr Testsson"})
            .expect(302);
    });

    it("fails to login with unknown user", async () => {
       await request(app)
           .post("/login")
           .send({username: "blorp", password: "blorp"})
           .expect(401);
    });

    it("requires all user properties", async () => {
       await request(app)
           .post("/users")
           .send({username: "username", password: "password"})
           .expect(400);
        await request(app)
            .post("/users")
            .send({username: "username", fullName: "full name"})
            .expect(400);
        await request(app)
            .post("/users")
            .send({fullName: "full name", password: "password"})
            .expect(400);
    });

    it("requires login to view users", async () => {
       await request(app)
           .get("/users")
           .expect(403);
    });

    it("shows users if logged in", async () => {
       const agent = request.agent(app);
       await agent
           .post("/login")
           .send({username: "somebody", password: "secret"})
           .expect(302);
       await agent
           .get("/users")
           .expect(200);
    });

    it("logs in for existing user", async () => {
        const agent = request.agent(app);

        await agent
            .post("/login")
            .send({username: "somebody", password: "secret"})
            .expect(302);

        const profileResponse = await agent.get("/login");
        expect(profileResponse.status).toBe(200);
        expect(profileResponse.body).toMatchObject({fullName: "Mr Testsson"});
    });

});