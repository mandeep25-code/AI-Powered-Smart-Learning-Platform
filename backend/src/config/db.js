const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName });
  console.log(`[db] connected to MongoDB (${dbName})`);
  return mongoose.connection;
}

module.exports = { connectDB };
