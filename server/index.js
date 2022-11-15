const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();

var corsOptions = {
  origin: "http://localhost:3001"
};

// parse requests of content-type - application/json
app.use(cors(corsOptions));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
    res.json({ message: "Hello, je suis bien connecté à ton serveur Node.js!" }); 
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});