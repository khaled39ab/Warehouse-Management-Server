const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://${process.env.WAREHOUSE_USER}:${process.env.WAREHOUSE_PASSWORD}@cluster0.qudsyns.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.WAREHOUSE_USER}:${process.env.WAREHOUSE_PASSWORD}@cluster0.uwlfrmd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    const itemsCollection = client.db("WarehouseManagement").collection("Items");

    try {
        /* 
          ================================================================================
          +++++++++++++++++++++++++++++++   Items Section  +++++++++++++++++++++++++++++++
          ================================================================================
      */

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        app.post('/items', async (req, res) => {
            const item = req.body;
            const result = await itemsCollection.insertOne(item);
            res.send(result);
        });


        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const cursor = await itemsCollection.findOne(query);
            res.send(cursor);
        });


        app.put('updateItem/:id', async(req, res) => {
            const id = req.params.id;
            const item = req.body;
            const option = { upsert: true }
            const filter = {_id: new ObjectId(id)}
            const updateDocs = {
                item
            }

            const result = await itemsCollection.updateOne(filter, updateDocs, option)
            res.send(result)
        });


    } finally {
        // await client.close();
    }
};

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hello from warehouse management server")
});

app.listen(port, () => {
    console.log("server is running from", port);
});