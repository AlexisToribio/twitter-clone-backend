const express = require("express")
const cors = require("cors")
const app = express()
const logger = require("./loggerMiddleware")

app.use(cors())
app.use(express.json())

app.use(logger)

let tweets = [
  {
    id: 1,
    content: "hola 1 :D",
    date: "2019-05-30T17:30:31.098Z",
  },
  {
    id: 2,
    content: "hola 2 :D",
    date: "2019-05-30T17:30:31.098Z",
  },
  {
    id: 3,
    content: "hola 3 :D",
    date: "2019-05-30T17:30:31.098Z",
  },
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' });
//   response.end(JSON.stringify(tweets));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>")
})

app.get("/api/tweets", (request, response) => {
  response.json(tweets)
})

app.get("/api/tweets/:id", (request, response) => {
  const id = Number(request.params.id)
  const tweet = tweets.find((tweet) => tweet.id === id)

  if (tweet) {
    response.json(tweet)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/tweets/:id", (request, response) => {
  const id = Number(request.params.id)
  tweets = tweets.filter((tweet) => tweet.id !== id)
  response.status(204).end()
})

app.post("/api/tweets", (request, response) => {
  const tweet = request.body

  if (!tweet || !tweet.content) {
    return response.status(400).json({
      error: "note.content is missing",
    })
  }

  const ids = tweets.map((tweet) => tweet.id)
  const maxId = Math.max(...ids)

  const newTweet = {
    id: maxId + 1,
    content: tweet.content,
    date: new Date().toISOString(),
  }

  tweets = tweets.concat(newTweet)

  response.status(201).json(newTweet)
})

app.use((request, response) => {
  response.status(404).json({
    error: "Not found",
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
