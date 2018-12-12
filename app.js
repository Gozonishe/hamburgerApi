const express = require ('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');

const productRoutes = require ('./api/routes/products');
const orderRoutes = require ('./api/routes/orders');
const telegaRoutes = require ('./api/routes/telegramBot.js');

//Mongoose DB
mongoose.connect('mongodb://gozon:' + process.env.MONGO_ATLAS_PW + '@mydb-shard-00-00-fk8lc.mongodb.net:27017,mydb-shard-00-01-fk8lc.mongodb.net:27017,mydb-shard-00-02-fk8lc.mongodb.net:27017/test?ssl=true&replicaSet=myDB-shard-0&authSource=admin&retryWrites=true', 
{
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS ERRORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
);
    if (req.method ==='OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/telegram', telegaRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

module.exports = app;