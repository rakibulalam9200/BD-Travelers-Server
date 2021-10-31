const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8tdq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//console.log(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("bd-travelers");
    const offersCollection = database.collection("offers");
    //GET ALL DATA
    app.get("/offers", async (req, res) => {
      //const query = {};
      const cursor = offersCollection.find({});
      const offers = await cursor.toArray();
      console.log(offers);
      res.send(offers);
    });

    //GET SINGLE DATA
    app.get("/offers/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific Offer", id);
      const query = { _id: ObjectId(id) };
      const offers = await offersCollection.findOne(query);
      console.log(offers);
      res.json(offers);
    });

    //POST API
    app.post("/offers", async (req, res) => {
      const offer = req.body;
      console.log("Hit the post API", offer);
      const result = await offersCollection.insertOne(offer);
      console.log(result);
      res.json(result);
    });
    console.log("DB connected successfully");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("BD Travelers server is running...");
});

app.listen(port, () => {
  console.log("Server running at port:", port);
});
