const express = require("express");
const app = express();
const routes = require('./routes')

const cors = require("cors");
// const pool = require("./db");
const path = require("path");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

// Middleware 
// const errorMiddleware = require('./error-middleware')
// const ClientError = require('./client-error');
// const authorizationMiddleware = require('./authorization-middleware')
// const uploadsMiddleware = require('./upload-middleware')

app.use(cors()); 
app.use(express.json()) 
app.use('/api', routes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

// AUTHORIZATON MIDDLEWARE 
// app.use(authorizationMiddleware);
// AUTHORIZATON MIDDLEWARE 

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build/index.html"));
// });

// app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('server has started on port', PORT)
})