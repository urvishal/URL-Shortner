const express = require("express");
const { connectMongoDb } = require("./connect");
const app = express();
const urlRoute = require("./routes/url");
const PORT = 8001;

connectMongoDb("mongodb://localhost:27017/short-url")
.then(() => console.log("Mongodb connected"));

app.use(express.json());

app.use("/url", urlRoute);

app.listen(PORT, () => console.log(`Server has started at PORT:${PORT}`));