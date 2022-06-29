const mongoose = require('mongoose')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const API_PORT = process.env.PORT || 2046
const app = express()
const {ApolloServer} = require('apollo-server-express')

const config = require('./config/keys')

// connects our back end code with the database
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
require('./models/User');

let db = mongoose.connection;

db.once('open', () => console.log('MongoDB connected'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const schema = require('./graphql/schema/');

const apolloServer = new ApolloServer(schema);

//Controllers
const AuthController = require('./controllers/AuthController')

var http = require('http').createServer(app);
var io = require('socket.io')(http);

// const corsOptions = {
//   credentials: true,
//   origin: "http://localhost:300"
// }

app.use(cors());


// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// append /api for our http requests
// app.use('/auth', AuthController);

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({app, cors: {
    origin: ["http://localhost:3000"]
  }, path: "/graphql"});
})

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));