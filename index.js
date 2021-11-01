const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
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
    const bookedCollection = database.collection("booked");
    const volunteersCollection = database.collection("volunteers");

    //GET ALL OFFER
    app.get("/offers", async (req, res) => {
      const cursor = offersCollection.find({});
      const offers = await cursor.toArray();
      res.send(offers);
    });

    //GET ALL VOLUNTEERS
    app.get("/volunteers", async (req, res) => {
      const cursor = volunteersCollection.find({});
      const volunteers = await cursor.toArray();
      console.log(volunteers);
      res.send(volunteers);
    });

    //GET ALL Booked by email
    app.get("/books/:email", async (req, res) => {
      const books = await bookedCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(books);
    });

    //GET SINGLE OFFER
    app.get("/offers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const offers = await offersCollection.findOne(query);
      res.json(offers);
    });

    //POST OFFER API
    app.post("/offers", async (req, res) => {
      const offer = req.body;
      const result = await offersCollection.insertOne(offer);
      res.json(result);
    });

    //DELETE OFFER API
    app.delete("/offers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await offersCollection.deleteOne(query);
      res.json(result);
    });

    //DELETE BOOKED API
    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookedCollection.deleteOne(query);
      res.json(result);
    });

    //UPDATE API
    app.put("/offers/:id", async (req, res) => {
      const id = req.params.id;
      const updatedOffer = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateOffer = {
        $set: {
          name: updatedOffer.name,
          description: updatedOffer.description,
          fee: updatedOffer.fee,
          tripDate: updatedOffer.tripDate,
          tripDuration: updatedOffer.tripDuration,
          img: updatedOffer.img,
        },
      };
      const result = await offersCollection.updateOne(
        filter,
        updateOffer,
        options
      );

      console.log("Updating offer", result);
      res.json(result);
    });

    //ADD BOOK
    app.post("/book", async (req, res) => {
      const offer = req.body;
      const result = await bookedCollection.insertOne(offer);
      res.json(result);
    });
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
