const { Schema, model } = require("mongoose")

const tweetSchema = new Schema({
  content: String,
  date: Date,
})

tweetSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Tweet = model("Tweet", tweetSchema)

// Tweet.find({}).then((result) => {
//   console.log(result)
//   mongoose.connection.close()
// })

// const tweet = new Tweet({
//   content: "Hola :D",
//   date: new Date(),
// })

// tweet
//   .save()
//   .then((result) => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch((err) => {
//     console.error(err)
//   })

module.exports = Tweet
