const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.hatjk.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const tasksCollection = client.db("tasksForVolunteer").collection("tasks");
  const registeredEvents = client.db("tasksForVolunteer").collection("registered");

  app.post('/addTask', (req, res)=> {
    const tasks = req.body;
    tasksCollection.insertMany(tasks)
    .then(result => {
      res.send(result.insertedCount)
    })
  })

  app.get('/allEvent', (req, res) => {
    tasksCollection.find({})
    .toArray( (err, documents)=> {
      res.send(documents);
    })
  })

  app.get('/allRegisteredEvents', (req, res) => {
    registeredEvents.find({})
    .toArray( (err, documents)=> {
      res.send(documents);
    })
  })

  app.post('/submitForm',(req,res)=>{
    registeredEvents.insertOne(req.body)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })

  app.get('/getEvents',(req,res)=>{
    registeredEvents.find({email:req.headers.email})
    .toArray( (err,documents)=>{
      res.send(documents)
    })
  })

  app.delete('/removeEvent',(req,res)=>{
    registeredEvents.deleteOne({_id:ObjectID(req.headers.id)})
    .then(result=>{
      res.send(result.deletedCount>0)
    })
  })

  app.delete('/deleteEvent',(req,res)=>{
    registeredEvents.deleteOne({_id:ObjectID(req.headers.id)})
    .then(result=>{
      res.send(result.deletedCount>0)
    })
  })

});


app.listen(port)