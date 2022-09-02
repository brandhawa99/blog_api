const request = require("supertest");
const db = require("./db");
const app = require("../app");
const mongoTest = require("../mongoConfigTesting");
const closeConnection = require("../mongoConfigTesting");
const faker = require("@faker-js/faker").faker;
mongoTest.initialize();

beforeAll(async () => {
  await db.setupData();
});

afterAll(async () => {
  await mongoTest.dropCollections;
  await mongoTest.dropDatabase;
  await mongoTest.close();
});

describe("Sign up user", () => {
  let res;
  let user;

  test("POST /auth/signup create a user", async () => {
    let username = faker.internet.userName();
    res = await request(app)
      .post("/auth/signup")
      .send({
        first_name: "testFirst",
        last_name: "testLast",
        username: username,
        password: "password",
        password2: "password",
      })
      .expect(200);
    expect(res.body.success).toBe(true);
  });
  test("POST /auth/signup  sign up with same username", async () => {
    let newUser = await request(app)
      .post("/auth/signup")
      .send({
        first_name: "testFirst",
        last_name: "testLast",
        username: "testUser321",
        password: "password",
        password2: "password",
      })
      .expect(404);
    expect(newUser.body.error[0].msg).toBe("username already exists");
  });
});

describe("Basic author request", () => {
  let token;
  let post;
  test("POST /auth/login with a username and password", async () => {
    user = await request(app)
      .post("/auth/login")
      .send({
        username: "user1",
        password: "password",
      })
      .expect(200);
    expect(user.body).toHaveProperty("token");
    token = user.body.token;
  });

  test("GET /author/posts including private posts", async () => {
    posts = await request(app)
      .get("/author/posts")
      .set({ Authorization: token })
      .expect(200);
    let first_post = posts.body.posts[0];
    expect(first_post.public).toBeFalsy;
  });

  test("GET /author/posts/:id, get error for random id", async () => {
    post = await request(app)
      .get("/author/posts/" + "asdfa-09182094812312341234132f")
      .set({ Authorization: token })
      .expect(400);
    expect(post.body.errors[0].msg).toBe("id error");
  });

  test("POST /author/posts/create, createing a blog post", async () => {
    post = await request(app)
      .post("/author/posts/create")
      .set({ Authorization: token })
      .send({
        title: "This is a blog from test",
        blog: "this is the blog post for it",
        public: true,
      })
      .expect(200);
  });

  test("GET /author/posts/:id, get single post", async () => {
    post = await request(app)
      .get("/author/posts/" + post.body.post._id)
      .set({ Authorization: token })
      .expect(200);
    expect(post.body.post).toHaveProperty("title");
    expect(post.body.post).toHaveProperty("blog");
    expect(post.body.post).toHaveProperty("date");
    expect(post.body.post).toHaveProperty("timestamp");
    expect(post.body.post).toHaveProperty("id");
    expect(post.body.post).toHaveProperty("public");
  });

  let updatedPost;
  test("POST /author/posts/update", async () => {
    updatedPost = await request(app)
      .post("/author/posts/update/")
      .set({ Authorization: token })
      .send({
        title: "this is the new title",
        blog: "this is the new blog post",
        timestamp: post.body.post.timestamp,
        public: false,
        id: post.body.post._id,
      })
      .expect(200);
  });

  test("POST /author/posts/:id/delete, where id's do not match", async () => {
    let deleted = await request(app)
      .post("/author/posts/" + updatedPost.body._id + "/delete")
      .set({ Authorization: token })
      .send({ authorID: updatedPost.body.author + 1234123 })
      .expect(400);
    expect(deleted.body).toHaveProperty("msg");
  });

  test("POST /author/posts/:id/delete", async () => {
    let deleted = await request(app)
      .post("/author/posts/" + updatedPost.body._id + "/delete")
      .set({ Authorization: token })
      .send({ authorID: updatedPost.body.author })
      .expect(200);
    expect(deleted.body.msg).toBe("post deleted");
  });

  test("DELET A COMMENT", async () => {
    let token;
    let deleted;
    let user = await request(app)
      .post("/auth/login")
      .send({ username: "user1", password: "password" })
      .expect(200);
    token = user.body.token;
    let post = await request(app)
      .get("/author/posts/")
      .set({ Authorization: token })
      .expect(200);
    post = post.body.posts[0];

    await request(app)
      .post("/posts/" + post._id)
      .send({
        name: "this is a commenter",
        comment: "This is a comment from a commenter",
      });

    let comment = await request(app)
      .get("/author/posts/" + post._id)
      .set({ Authorization: token })
      .expect(200);
    comment = comment.body.comment;

    deleted = await request(app)
      .post(`/author/comment/${comment[0]._id}/delete`)
      .set({ Authorization: token })
      .expect(200);
    expect(deleted.body.msg).toBe("comment deleted");
  });
});
