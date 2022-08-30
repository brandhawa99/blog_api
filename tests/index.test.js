const request = require('supertest');
const db = require('./db');
const app = require('../app');

let author1, author2, post1,post2;

beforeAll(async() =>{
  await db.setUp();
  await db.setupData();
})

afterAll(async () =>{
  await db.dropDatabase();
});

describe("Get Posts for api client", () => {
  let res; 
  test("GET /", async () =>{
    res= await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);
      expect((res) =>{
        res.body.length === 5; 
        res.body[0].to.have.property('title');
      res.body[0].to.have.property('author');
      res.body[0].to.have.property('_id');
      res.body[0].to.have.property('date');
      res.body[0].to.have.property('url');
      res.body[0].to.have.property('id');
    })
  })

  test("GET /posts", async() => {
    res = await request(app)
    .get('/posts')
    .expect('Content-Type', /json/)
    .expect(200)
    expect((res)=>{
        res.body.length >= 5;
        res.body[0].to.have.property('blog');
      })
  })

  test("GET /post/:id", async () =>{
    let res; 
    res = await request(app)
      .get('/');
    let id = res.body[0]._id;

    res = await request(app)
      .get(`/posts/${id}`)
      .expect(200);
    expect((res) => {
      res.body.post.author.to.have.property('first_name');
      res.body.post.author.to.have.property('last_name');
      res.body.post.author.to.have.property('user');
    })
    console.log(res.body);
  })


})
