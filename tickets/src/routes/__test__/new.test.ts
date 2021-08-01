import request from "supertest";
import { app } from "../../app";

it("can only be accessed if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .send({})

    .expect(401);
});

it("returns if user throws status other than 401", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  console.log(response.statusCode);
  expect(response.statusCode).not.toEqual(401);
});

it("returns an error if title is invalid", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});

it("returns an error if price is invalid", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "imagica",
      price: -10,
    })
    .expect(400);
});

it("successfuly created the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "imagica",
      price: 10,
    })
    .expect(201);
});
