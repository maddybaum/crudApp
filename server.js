const bodyParser = require('body-parser');
const express = require('express');
const res = require('express/lib/response');
const app = express();
const MongoClient = require("mongodb").MongoClient
const connectionString = "mongodb+srv://mbaum:KKK7RuOy8da7puqT@cluster0.dgoescu.mongodb.net/?retryWrites=true&w=majority"



MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db("quote-generator");
    const quotesCollection = db.collection("quotes");
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({extended: true})); 
    app.use(express.static('public'));
    app.use(bodyParser.json())

    app.get('/', (req, res) => { 
        quotesCollection.find().toArray()
            .then(results => {
                console.log(results);
                res.render('index.ejs', { quotes: results})
            })
            .catch(error => console.error(error))
    })
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))
    })
    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            {name: 'Yoda'},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )
        .then(result => {
            console.log(result)
            res.json('Success')
        })
        .catch(error => console.error(error))
    })
    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
        { name: req.body.name }
        )
    .then (result => {
        if (result.deletedCount === 0){
            return res.json("no quote to delete")
        }
        res.json("Deleted Darth Vader's quote")
    })
    .catch(error => console.error(error))
})
    app.listen(4000, function(){
        console.log('listening on 4000')
    })
  })
  /*.catch(error => 
      console.error(error))
  })*/

