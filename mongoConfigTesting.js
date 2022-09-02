const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

exports.initialize = async function initializeMongoServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.createConnection(mongoUri);

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.createConnection(mongoUri);
    }
    console.log(e);
  });

  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
};

exports.close = async function closeConnection() {
  await mongoose.connection.close();
};

module.exports.dropDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};

module.exports.dropCollections = async () => {
  const { collections } = mongoose.connection;

  Object.keys(collections).forEach(async (key) => {
    await collections[key].deleteMany();
  });
};
