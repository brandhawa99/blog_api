const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

exports.initialize = async function initializeMongoServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "mongo connection error"));
};

module.exports.dropDatabase = async () => {
  if (mongoServer) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }
};

module.exports.dropCollections = async () => {
  if (mongoServer) {
    const { collections } = mongoose.connection;

    Object.keys(collections).forEach(async (key) => {
      await collections[key].deleteMany();
    });
  }
};
