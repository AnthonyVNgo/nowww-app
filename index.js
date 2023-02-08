const express = require("express");
const app = express();
const routes = require('./server/routes/routes')

const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors()); 
app.use(express.json()) 

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

app.use('/api', routes)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log('server has started on port', PORT)
})
