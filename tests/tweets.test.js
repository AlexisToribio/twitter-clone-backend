const mongoose = require("mongoose")
const { server } = require("../index")

const Tweet = require("../models/Tweet")
const { api, initialTweets, getAllContentFromTweets } = require("./helpers")

beforeEach(async () => {
  await Tweet.deleteMany({})
  // const tweet1 = new Tweet(initialTweets[0])
  // await tweet1.save()
  // const tweet2 = new Tweet(initialTweets[1])
  // await tweet2.save()

  // parallel
  // const tweetObjects = initialTweets.map((tweet) => new Tweet(tweet))
  // const promises = tweetObjects.map((tweet) => tweet.save())
  // await Promise.all(promises)

  // sequential
  for (const tweet of initialTweets) {
    const tweetObject = new Tweet(tweet)
    await tweetObject.save()
  }
})

describe("GET all tweets", () => {
  test("tweets are returned as json", async () => {
    await api
      .get("/api/tweets")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("there are two tweets", async () => {
    const response = await api.get("/api/tweets")
    expect(response.body).toHaveLength(initialTweets.length)
  })

  test("the first tweet is about midudev", async () => {
    const { contents } = await getAllContentFromTweets()
    expect(contents).toContain("Hola midudev")
  })
})

describe("Create a tweet", () => {
  test("is possible with a valid tweet", async () => {
    const newTweet = {
      content: "Proximamente async/await",
    }

    await api
      .post("/api/tweets")
      .send(newTweet)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const { contents, response } = await getAllContentFromTweets()
    expect(response.body).toHaveLength(initialTweets.length + 1)
    expect(contents).toContain(newTweet.content)
  })

  test("is not possible with an invalid note", async () => {
    const newTweet = {}

    await api.post("/api/tweets").send(newTweet).expect(400)

    const response = await api.get("/api/tweets")
    expect(response.body).toHaveLength(initialTweets.length)
  })
})

test("a tweet can be deleted", async () => {
  const { response: firstResponse } = await getAllContentFromTweets()
  const { body: tweets } = firstResponse
  const tweetToDelete = tweets[0]

  await api.delete(`/api/tweets/${tweetToDelete.id}`).expect(204)

  const { contents, response: secondResponse } = await getAllContentFromTweets()
  expect(secondResponse.body).toHaveLength(initialTweets.length - 1)
  expect(contents).not.toContain(tweetToDelete.content)
})

test("a tweet that do not exist can not be deleted", async () => {
  await api.delete("/api/tweets/1234").expect(400)

  const { response } = await getAllContentFromTweets()
  expect(response.body).toHaveLength(initialTweets.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
