const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000

// middleware
app.use(cors())
app.use(express.json());

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
        // await client.connect();

        const carCollection = client.db("RoyalRent").collection("car-collection");
        const usersCollection = client.db("RoyalRent").collection("users");
        // Regular user route
        app.get("/users", async (req, res) => {
            try {
                const result = await usersCollection.find().toArray();
                res.status(200).send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Internal Server Error" });
            }
        });

        app.post("/users", async (req, res) => {
            try {
                const user = req.body;
                console.log(user)
                // Check if the email property exists in the user object
                if (!user || !user.email) {
                    return res.status(400).send({ message: "Invalid user object. Email is required." });
                }

                const query = { email: user.email };
                const existingUser = await usersCollection.findOne(query);

                if (existingUser) {
                    return res.status(400).send({ message: "User already exists" });
                }

                user.role = "user"; // Default role is user

                const result = await usersCollection.insertOne(user);
                res.status(201).send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Internal Server Error" });
            }
        });

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
    res.send('Welcome to Royal Rent')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})