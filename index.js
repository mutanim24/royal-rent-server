const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000

// middleware
app.use(cors())
app.use(express.json())

// user: 
// pass: TqIvVssdXgDthMF9




const uri = "mongodb+srv://royalrent:TqIvVssdXgDthMF9@cluster0.z12trsh.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const carCollection = client.db("RoyalRent").collection("car-collection");
        const bookingCollection = client.db("RoyalRent").collection("booking-collection");


        app.get("/cars", async (req, res) => {
            const result = await carCollection.find().toArray();
            res.send(result)
        })

        app.get("/car/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(filter);
            res.send(result)
        })

        
        app.post("/booking", async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })


         app.get("/booking", async (req, res) => {
            const cursor = bookingCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})