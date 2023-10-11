const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 4000;


// middleware 

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtmwivk.mongodb.net/?retryWrites=true&w=majority`;

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
     
    const menuCollection = client.db("EcommerceDb").collection("menu");
    const reviewCollection = client.db("EcommerceDb").collection("review");
    const cartCollection = client.db("EcommerceDb").collection("carts");


    // trying to get menu collection 
    app.get('/menu', async(req, res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);


    })
    
     // trying to get reviews collection 
    app.get('/review', async(req, res)=>{
        const result = await reviewCollection.find().toArray();
        res.send(result);


    })

    // cart collection related kaj

    app.post('/carts', async(req, res) =>{
      const item = req.body;
      console.log(item);
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })

    // get Cart api data 
    app.get('/carts', async(req, res)=>{
      const email = req.query.email;
      if(!email){
        return ([])
      }
      const query =  {email:email};
      const result = await cartCollection.find(query).toArray();
      res.send(result);

    })

    // delete an item from cart 

    app.delete('/carts:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server is Running')
})

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`)
})