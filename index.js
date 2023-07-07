require("dotenv").config()
require("./mongo.js")
const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")
const express = require("express")
const cors = require("cors")
const app = express()
const Tweet = require("./models/Tweet")
const notFound = require("./middleware/notFound.js")
const handleErrors = require("./middleware/handleErrors.js")

app.use(cors())
app.use(express.json())
app.use("/images", express.static("images"))

Sentry.init({
  dsn: "https://c0f4e767f8084ad399685421ddebe997@o1185990.ingest.sentry.io/6305967",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' });
//   response.end(JSON.stringify(tweets));
// });

app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>")
})

app.get("/api/tweets", async (request, response) => {
  // Tweet.find({}).then((tweets) => {
  //   response.json(tweets)
  // })

  const tweets = await Tweet.find({})
  response.json(tweets)
})

app.get("/api/tweets/:id", (request, response, next) => {
  const { id } = request.params

  Tweet.findById(id)
    .then((tweet) => {
      if (tweet) {
        response.json(tweet)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.put("/api/tweets/:id", (request, response, next) => {
  const { id } = request.params
  const tweet = request.body

  const newTweetInfo = {
    content: tweet.content,
  }

  Tweet.findByIdAndUpdate(id, newTweetInfo, { new: true })
    .then((result) => response.json(result))
    .catch(next)
})

app.delete("/api/tweets/:id", async (request, response, next) => {
  const { id } = request.params
  // Tweet.findByIdAndDelete(id)
  //   .then(() => response.status(204).end())
  //   .catch((error) => next(error))
  await Tweet.findByIdAndDelete(id)
  response.status(204).end()
})

app.post("/api/tweets", async (request, response, next) => {
  const tweet = request.body

  if (!tweet || !tweet.content) {
    return response.status(400).json({
      error: "note.content is missing",
    })
  }

  const newTweet = new Tweet({
    content: tweet.content,
    date: new Date().toISOString(),
  })

  // newTweet
  //   .save()
  //   .then((savedTweet) => response.status(201).json(savedTweet))
  //   .catch((error) => next(error))
  try {
    const savedTweet = await newTweet.save()
    response.status(201).json(savedTweet)
  } catch (error) {
    next(error)
  }
})

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
