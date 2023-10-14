const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000

app.use(express.json());

// middleware
app.use(cors())
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
        const commentCollection = client.db("RoyalRent").collection("comment-collection")


        app.get("/cars", async (req, res) => {
            const result = await carCollection.find().toArray();
            res.send(result)
        })

        app.get("/car/:id", async (req, res) => {
            const id =  req.params.id;
            const filter = {_id: new ObjectId(id)}
            const result = await carCollection.findOne(filter);
            res.send(result)
        })

        app.post("/comment", async (req, res) => {
            const comment = req.body;
            console.log(comment)
            const result = await commentCollection.insertOne(comment);
            res.send(result);
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