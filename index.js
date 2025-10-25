const express = require("express");
const path = require("path");
const URL = require("./models/url");
const cookieParser = require("cookie-parser");
const { chekForAuthentication, restrictTo } = require("./middleware/auth");

//Ports and App
const app = express();
const PORT = 8001;

//Routes
const staticRoute = require("./routes/staticRouter");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

//MongoDB Urls and Connections
const { connectMongoDb } = require("./connect");
connectMongoDb("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(chekForAuthentication);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//Uses of Routes
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

app.get("/url/:shortId", async (req, res) => {
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
