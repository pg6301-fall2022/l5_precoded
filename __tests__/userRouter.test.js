import request from "supertest";
import express from "express";
import { userPath, loginPath} from "../userRouter.js";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use("/login", loginPath);

describe ("user router", () => {

    it("fails to login with unknown user", async () => {
       const response = await request(app)
           .post("/login")
           .send({username: "blorp", password: "blorp"});
        expect(response.status).toEqual(401);
    });

});