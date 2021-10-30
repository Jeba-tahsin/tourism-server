const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.Db_USER}:${process.env.DB_PASS}@cluster0.ta49n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
       await client.connect();
       const database = client.db('tourism');
       const serviceCollection = database.collection('details');

       //get api
       app.get('/details', async(req, res)=>{
           const cursor = serviceCollection.find({})
           const details = await cursor.toArray();
           res.send(details);
       })

       //single service
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
        res.send(result)
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