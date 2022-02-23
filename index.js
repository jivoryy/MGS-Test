const express = require("express");
const axios = require("axios");
const https = require("https");
const { response } = require("express");
const session = require("express-session");
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
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  axios
    .post("https://yantek.padipresence.id/api/authentication/login", req.body, {
      httpsAgent: agent,
    })
    .then((response) => {
      req.session.token = response.data.data.token;
      res.redirect("tiket");
    })
    .catch((error) => {
      res.send(error.response.data.message);
    });
});

app.get("/tiket", (req, res) => {
  axios
    .get("https://yantek.padipresence.id/api/ticket/support", {
      headers: { Authorization: req.session.token },
      params: { offset: 0, limit: 10 },
      httpsAgent: agent,
    })
    .then((response) => {
      res.render("tiket", { data: response.data.data });
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.get("/tambahtiket", (req, res) => {
  axios
    .get("https://yantek.padipresence.id/api/mastersupport/getdata", {
      httpsAgent: agent,
    })
    .then((response) => {
      res.render("tambahtiket", { data: response.data.data });
    })
    .catch((error) => {
      res.redirect("/tiket");
    });
});

app.post("/tambahtiket", (req, res) => {
  axios
    .post("https://yantek.padipresence.id/api/ticket/createsupport", req.body, {
      headers: { Authorization: req.session.token },
      params: {
        type_ticket_id: req.body.type_ticket_id,
        sub_type_ticket_id: req.body.sub_type_ticket_id,
        permasalahan: req.body.permasalahan,
      },
      httpsAgent: agent,
    })
    .then((response) => {
      res.redirect("/tiket");
    })
    .catch((error) => {
      res.send("ERROR");
    });
});

app.listen(port, () => {
  console.log(`this route execute on http://localhost:${port}`);
});
