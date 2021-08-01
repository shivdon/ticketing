import request from "supertest";
import { app } from "../../app";

it("it runs a test on signup route", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});
