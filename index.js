const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Answer = require("./models/answer");
const Admin = require("./models/admin");
const auth = require('./middleware/auth');
const refresh = require('./middleware/refresh');
const cookie = require('cookie');
const { authConstants } = require('./constants');
var cookieParser = require('cookie-parser');

const db =
  "mongodb+srv://ipz193zms:ipz193zms@cluster0.5jzbvv8.mongodb.net/?retryWrites=true&w=majority";
mongoose.set("strictQuery", true);
mongoose
  .connect(db)
  .then((res) => console.log("connected to db"))
  .catch((error) => console.log(error));

var whitelist = ['http://localhost:3000', 'https://projectbriefipz193zms.azurewebsites.net']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

const port = process.env.PORT || 2999;

app.listen(port, () => {
  console.log("app started");
});

app.post("/form", async (req, res) => {
  const answer = new Answer({ ...req.body, isFavourite: false });
  await answer.save()
    .then(() => res.status(200).send())
    .catch((error) => console.log(error));
});

app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const admin = await Admin.findOneByCredentials(login, password);
    const { token, refreshToken } = await admin.generateTokens();

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: authConstants.refreshTokenAge,
      })
    )

    res.send({ admin, token });
  } catch {
    res.status(401).send();
  }
});

/*app.get("/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", "", {
      httpOnly: true,
      maxAge: 0,
    })
  );
  res.sendStatus(200);
});*/

app.get("/refresh", refresh, async (req, res) => {
  const { token, refreshToken } = await req.admin.generateTokens();

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: authConstants.refreshTokenAge,
    })
  );
  res.send({ token });
});

app.get("/results", auth, async (req, res) => {
  await Answer.find()
    .then((data) => res.status(200).send(data))
    .catch((error) => console.log(error));
});

app.post("/addToFavourite", auth, async (req, res) => {
  const { id } = req.body;
  const answer = await Answer.findOne({ _id: id });
  answer.isFavourite = !answer.isFavourite;
  await answer.save()
    .then(() => res.status(200).send())
    .catch((err) => console.log(err));
});

app.post("/delete", auth, async (req, res) => {
  const { id } = req.body;
  const answer = await Answer.findOne({ _id: id });
  await answer.delete()
    .then(() => res.status(200).send())
    .catch((err) => console.log(err));
});
