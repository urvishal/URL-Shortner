const express = require("express");
const path = require("path");
const { connectMongoDb } = require("./connect");
const app = express();
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const shortid = require("shortid");
const PORT = 8001;

connectMongoDb("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());

app.get('./test', async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home");
});

app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server has started at PORT:${PORT}`));
