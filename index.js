const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.WAREHOUSE_USER}:${process.env.WAREHOUSE_PASSWORD}@cluster0.uwlfrmd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT(req, res, next) {
    const authHeaders = req.he
}


async function run() {

    try {
        const itemsCollection = client.db("WarehouseManagement").collection("Items");


        app.post('/jwt', (req, res) => {
            const user = req.body;
            console.log(user);

            const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1d' });
            res.send({ token })
        });

        /* 
            ================================================================================
            +++++++++++++++++++++++++++++++   Items Section  +++++++++++++++++++++++++++++++
            ================================================================================
        */

        app.get('/items', async (req, res) => {
            const provider_email = req.query.provider_email;
            const company_name = req.query.company_name;

            let query = {};

            if (provider_email) {
                query = {
                    provider_email: provider_email
                }
            };

            if (company_name) {
                query = {
                    company_name
                }
            };

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


        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const item = req.body;
            const { company_name, car_model, car_color, model_year, car_vin, car_price, photo_url, quantity, description } = item;

            const option = { upsert: true };

            const updatedItem = {
                $set: {
                    company_name,
                    car_model,
                    car_color,
                    model_year,
                    car_vin,
                    car_price,
                    photo_url,
                    quantity,
                    description
                }
            };

            const result = await itemsCollection.updateOne(filter, updatedItem, option);
            res.send(result);
        });


        app.patch('/delivered/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const delivered = req.body;

            const updateDelivered = {
                $set: {
                    quantity: delivered.quantity
                }
            }

            const result = await itemsCollection.updateOne(query, updateDelivered);
            res.send(result);

        });


        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        });


    } finally {
        // await client.close();
    }
};

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(
        `Hello from warehouse management server </br>
        </br>
        Routes are: </br>
        1- /items ,  </br>
        2- /item/:id, </br>
        `
    )
});

app.listen(port, () => {
    console.log("server is running from", port);
});