const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4000;

const { MongoClient } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tchpt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("rotors_cars");
    const carsCollection = database.collection("carDatabase");
    const orderCollection = database.collection("carOrder");
    console.log("Rotors Database Connection Successful");

    // Get All PACKAGES Data
    app.get("/carDatabase", async (req, res) => {
      const cursor = carsCollection.find({});
      const count = await cursor.count();
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let carDatabase;
      if (page) {
        carDatabase = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        carDatabase = await cursor.toArray();
      }
      res.send({
        count,
        carDatabase,
      });
    });

    app.get("/carDatabase/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      // const result = await carsCollection.findOne(query);
      // res.json(result);
    });

    // app.get("/carDatabase/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   console.log(query);
    //   // const cars = await carsCollection.findOne(query);
    //   // res.json(cars);
    // });

    app.get("/carOrder", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        const query = { email: email };
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray();
        res.json(orders);
      } else {
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.json(orders);
      }
    });

    // Add Order API
    app.post("/carOrder", async (req, res) => {
      const booking = req.body;
      const result = await orderCollection.insertOne(booking);
      res.json(result);
    });

    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await orderCollection.find(filter).toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Rotors Database!");
});

app.listen(port, () => {
  console.log(`Running Server on ${port}`);
});
