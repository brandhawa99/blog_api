# blog_api

This is part of my MERN(mongodb, expressjs, reactjs, node) app

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
  - - ```await fetch('https://agile-mesa.herokuapp.com/``` Will become ```await fetch(http://localhost:3000/)```
3. ``` npm run start``` you should be able to run and make changes to the database locally
