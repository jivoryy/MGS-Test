const express = require("express");
const axios = require("axios");
const https = require("https");
const { response } = require("express");
const { Tiket } = require("./models/tiket");
const { resolve } = require("path");
const app = express();
const port = 3000;
let token;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  axios
    .post("https://yantek.padipresence.id/api/authentication/login", req.body, {
      httpsAgent: agent,
    })
    .then(function (response) {
      token = response.data.data.token;
      res.redirect("tiket");
    })
    .catch(function (error) {
      console.log(response);
    });
});

app.get("/tiket", (req, res) => {
  console.log(token);
  axios
    .get("https://yantek.padipresence.id/api/ticket/support", {
      headers: { Authorization: token },
      params: { offset: 0, limit: 10 },
      httpsAgent: agent,
    })
    .then((response) => console.log(response.data.data))
    .catch(function (response) {
      console.log(response);
    });
  res.render("tiket");
});

app.listen(port, () => {
  console.log(`this route execute on http://localhost:${port}`);
});
