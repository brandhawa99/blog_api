# Blog API
[Live App](https://agile-mesa-41864.herokuapp.com/)
![image](https://user-images.githubusercontent.com/35308786/188825223-84b0cf7e-737a-4198-8f14-17c45bbc4826.png)

### Description
In this project I created a Restful blog API with expressjs. There are 2 major routes, a route for a client, and a route for a content management system. The client route lets you see all of the public posts. and then leave comments on them. The content management route lets you create an account, create, update, delete posts, also you get to manage the comments under your post. The posts, users, and comments are saved in a mongodb database. Authorization is handled by passportjs (JWT Strategy). 

##### Technologies 
This api is built in nodejs with the expressjs framework becuase of its popularity. I used MongoDB for the database, and mongoose to interact with it. Authetication is taken care of with Passportjs(JWT Strategy). I used supertest and jest for api testing. 

#### Challenges
Learning how to test the api routes and setting up test database was difficult, and I didn't do the best job. I definatley tested unnecessary routes, I shoud assume they work because they are functions from other packages and have their own test. Shouuld have focused more on testing things that I created. 

### Goals
- [x] Learn how to build a Restful api 
- [x] Learn how to test an api 
- [x] Learn how to host an api on heroku 
- [x] Implement async/await functions
- [x] Learn how to validate incoming request 

### Working Links

- [Link to API](https://agile-mesa-41864.herokuapp.com/)
- [Link to Client](https://blog-client-brandhawa.netlify.app/)
- [Link to CMS](https://blog-cms-brandhawa.netlify.app/)

### Repository Links 
- [API](https://github.com/brandhawa99/blog_api)
- [Client](https://github.com/brandhawa99/blog_client)
- [CMS](https://github.com/brandhawa99/blog_cms) 



## Running loaclly 
### API Repo 
1. clone then install all npm packages with ```npm install```
2. type  ``` npm run serverStart ``` into the command line of the api folder
### CMS AND CLIENT Repos
1. clone then install all npm packages with ```npm install```
2. change all of the protocals and domains wherever there are fetch requests
    - ```await fetch('https://agile-mesa.herokuapp.com/``` Should be changed to ```await fetch(http://localhost:3000/)```
3. ``` npm run start``` you should be able to run and make changes to the database locally
