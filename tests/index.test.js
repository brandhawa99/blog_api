const request = require("supertest");
const db = require("./db");
const app = require("../app");
const mongoTest = require("./mongoConfigTesting");
beforeAll(async () => {
  await mongoTest.initialize();
  await db.setupData();
});

afterAll(async () => {
  await mongoTest.dropCollections;
  await mongoTest.dropDatabase;
  await mongoTest.close();
});

describe("Get Posts for api client", () => {
  let res;
  test("GET /", async () => {
    res = await request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res) => {
      res.body.length === 5;
    });
  });

  test("GET /posts", async () => {
    res = await request(app)
      .get("/posts")
      .expect("Content-Type", /json/)
      .expect(200);
    expect((res) => {
      res.body.length >= 5;
      res.body[0].to.have.property("blog");
    });
  });

  test("GET /post/:id", async () => {
    res = await request(app).get("/");
    let id = res.body[0]._id;

    res = await request(app).get(`/posts/${id}`).expect(200);
    expect(res.body.post.author).toHaveProperty("first_name");
  });

  test("GET /post/:id 'where id is random'", async () => {
    let res = await request(app).get("/posts/1230").expect(404);
  });
});

describe("POST a add comment", () => {
  let post;
  let res;
  test("POST/", async () => {
    post = await request(app).get("/");
    let id = post.body[0]._id;

    res = await request(app)
      .post(`/posts/${id}`)
      .set("Content-Type", "application/json")
      .send({ name: "test_name", comment: "this is a test comment" })
      .expect(200);
  });

  test("POST/ to a short id", async () => {
    let res = await request(app)
      .post("/posts/123123")
      .set("Content-Type", "application/json")
      .send({ name: "test", comment: "test comment" })
      .expect(400);
    expect(res.body.errors[0].msg).toBe("invalid");
  });
  test("POST/ to a random id", async () => {
    let res = await request(app)
      .post("/posts/123123qwerqwe1234123412341234")
      .set("Content-Type", "application/json")
      .send({ name: "test", comment: "test comment" })
      .expect(400);
    expect(res.body.errors[0].msg).toBe("there is no post here");
  });
});
