const { app } = require("../index")
const supertest = require("supertest")
const api = supertest(app)

const initialTweets = [
  {
    content: "Hola midudev",
    date: new Date(),
  },
  {
    content: "Hola otra vez :D",
    date: new Date(),
  },
  {
    content: "Hola de nuevo :D!!",
    date: new Date(),
  },
]

const getAllContentFromTweets = async () => {
  const response = await api.get("/api/tweets")
  return {
    contents: response.body.map((tweet) => tweet.content),
    response,
  }
}

module.exports = {
  getAllContentFromTweets,
  initialTweets,
  api,
}
