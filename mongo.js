const mongoose = require("mongoose")

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connetionString = NODE_ENV === "test" ? MONGO_DB_URI_TEST : MONGO_DB_URI

// Conexión a mongodb

mongoose
  .connect(connetionString)
  .then(() => {
    console.log("Database connected")
  })
  .catch((err) => {
    console.error(err)
  })

process.on("uncaughtException", () => {
  mongoose.disconnect()
})
