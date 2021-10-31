const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ta49n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
       await client.connect();
       const database = client.db('tourism');
       const serviceCollection = database.collection('details');
       const purchesCollection = database.collection('purches');

       //get api
       app.get('/details', async(req, res)=>{
           const cursor = serviceCollection.find({})
           const details = await cursor.toArray();
           res.send(details);
       })

       //single service api
       app.get('/details/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const details = await serviceCollection.findOne(query);
        res.json(details);
    })

       //post api
       app.post('/details', async(req, res)=> {
        const details = req.body;
        console.log('hit the post', details);

        const result = await serviceCollection.insertOne(details);
        console.log(result);
        res.send(result);
       });

      //purches post api
      app.post('/purches', async(req, res)=> {
        const purches = req.body;
        console.log('hit the post', purches);

        const result = await purchesCollection.insertOne(purches);
        console.log(result);
        res.json(result);
       });

      // purches get api
      app.get('/purches', async(req, res)=>{
        const cursor = purchesCollection.find({})
        const purches = await cursor.toArray();
        res.send(purches);
    })

    app.get("/orderEmail", (req, res) => {
        purchesCollection
            .find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });


    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running server');
});

app.listen(port, () => {
    console.log('server on port', port);
})