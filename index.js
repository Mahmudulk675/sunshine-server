const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT ||5050;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6br73.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const itemsCollection = client.db("sunshine").collection("items");
  const ordersCollection = client.db("sunshine").collection("orders");
 

  // Get for Home
  
  app.get('/items',(req, res)=>{
    itemsCollection.find()
    .toArray((err, documents)=>{
      // console.log('from db',documents);
      res.send(documents)
    })
  })


  // Get for Orders


  app.get('/orders',(req, res)=>{
    console.log(req.query.email);
    ordersCollection.find({customerEmail :req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })



  // Get for checkOut


  app.get('/checkOut/:id',(req, res)=>{
    // console.log(req.params.id,'id');
    const id = ObjectId(req.params.id);
    itemsCollection.find({_id: id})
    .toArray((err, documents)=>{
      res.send(documents[0])
      // console.log(documents[0]);
    })
  })

  // Post

 app.post('/admin/addItems',(req,res) => {
  const newItem = req.body;
  // console.log(newItem,'added');
  itemsCollection.insertOne(newItem)
  .then(result =>{
    console.log('count',result );
    res.send(result.insertedCount > 0)
  })
})

// Post Order Details 

app.post('/checkOut/:id',(req, res) =>{
  const newOrder = req.body;
  ordersCollection.insertOne(newOrder)
  .then(result =>{
    res.send(result.insertedCount > 0);
  })
})

// Delete

app.delete('/admin/deleteItem/:id', (req, res) =>{
  const id = ObjectId(req.params.id);
  console.log('id', id);
  itemsCollection.removeOne({_id: id})
  .then(documents => res.send(!documents.value))
})

  // client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)