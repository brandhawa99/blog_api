const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Author = require('../models/Author');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const bcrypt = require('bcryptjs');

let mongo;

module.exports.setUp = async () =>{
  mongo = await MongoMemoryServer.create();
  const url = mongo.getUri();
  await mongoose.connect(url,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'mongo connection error'));
};


module.exports.setupData = async () => {
  try {


    const authorDetails1 =  new Author({
      username: "user1",
      first_name:"name",
      last_name:"name",
      password: await bcrypt.hash('password', 10),
    }) 
    const authorDetails2 =  new Author({
      username: "user2",
      first_name:"name",
      last_name:"name",
      password: await bcrypt.hash('password', 10),
    }) 


    const author1 = await authorDetails1.save();
    const author2 = await authorDetails2.save();


    const postDetails1 = new Post({
      author: author1._id,
      title:"blog 1",
      blog:"this is blog 1",
      public: true
    })  
    const postDetails3 = new Post({
      author: author1._id,
      title:"blog 1",
      blog:"this is blog 1",
      public: true
    })  
    const postDetails4 = new Post({
      author: author1._id,
      title:"blog 1",
      blog:"this is blog 1",
      public: true
    })  
    const postDetails5 = new Post({
      author: author1._id,
      title:"blog 1",
      blog:"this is blog 1",
      public: true
    })  
    const postDetails6 = new Post({
      author: author1._id,
      title:"blog 1",
      blog:"this is blog 1",
      public: true
    })  
    const postDetails7 = new Post({
      author: author1._id,
      title:"blog 1",
      blog:"this is blog 1",
      public: true
    })  
    const postDetails8 = new Post({
      author: author1._id,
      title:"blog 1",
      blog:"this is blog 1",
      public: true
    })  

    const postDetails2 = new Post({
      author: author1._id,
      title:"blog 2",
      blog:"this is blog 2 and should not be visible",
      public: false,
    })  



    const post1 = await postDetails1.save();
    const post3 = await postDetails3.save();
    const post4 = await postDetails4.save();
    const post5 = await postDetails5.save();
    const post6 = await postDetails6.save();
    const post7 = await postDetails7.save();
    const post8 = await postDetails8.save();
    const post2 = await postDetails2.save();

    return{
      author1,author2, post1, post2, post3, post4, post5, post6, post7,post8,
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports.dropDatabase = async() =>{
  if(mongo){
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

module.exports.dropCollections = async = () =>{
  if(mongo){
    const { collections } = mongoose.connection();
    Object.keys(collections).forEach(async(key) =>{
      await collections[key].deleteMany();
    });
  }
};