import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";
const yourUsername = "electroknight65";
const yourPassword = "123456789";

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

//TODO 1: Add your own bearer token from the previous lesson.
var yourBearerToken = await axios.post(API_URL + "/get-auth-token",{
  username: yourUsername,
  password: yourPassword
});

yourBearerToken = yourBearerToken.data.token;
console.log(`Your token is: ${yourBearerToken}`);

//const yourBearerToken = "";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/post-secret", async (req, res) => {
  // TODO 2: Use axios to POST the data from req.body to the secrets api servers.
  var {secret, score} = req.body;
  console.log(`Secret : ${secret}`);
  console.log(`Score : ${score}`);

  try{
    var response = await axios.post(API_URL + "/secrets",{
         secret : secret,
        score : score
    },config);

    res.render("index.ejs",{content: JSON.stringify(response.data)});
  } catch (error){
    console.error(error.message);
    res.render("index.ejs",{content : JSON.stringify(error.response.data)});
  }
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  // TODO 3: Use axios to PUT the data from req.body to the secrets api servers.
  var id = req.body.id;
  var secret = req.body.secret;
  var score = req.body.score;

  console.log(`ID : ${id}`);
  console.log(`Secret : ${secret}`);
  console.log(`Score : ${score}`);

  try{
    var response = await axios.put(API_URL + `/secrets/${id}`,{
      secret : secret,
      score : score
    },config);

    res.render("index.ejs",{content: JSON.stringify(response.data)});
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", {content: JSON.stringify(error.response.data)});
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  // TODO 4: Use axios to PATCH the data from req.body to the secrets api servers.
  var id = req.body.id;
  var secret = req.body.secret;
  var score = req.body.score;

  console.log(`ID : ${id}`);
  console.log(`Secret : ${secret}`);
  console.log(`score : ${score}`);

  try{
    var response = await axios.patch(API_URL + `/secrets/${id}`,{
      secret : secret,
      score : score
    },config);

    response = response.data;
    console.log(response);
    response = JSON.stringify(response);

    res.render("index.ejs",{content : response});
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs",{content: error.response.data});
  }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  console.log(searchId);
  // TODO 5: Use axios to DELETE the item with searchId from the secrets api servers.
  try{
    var response = await axios.delete(API_URL + `/secrets/${searchId}`,config);

    res.render("index.ejs",{content : JSON.stringify(response.data)});
  } catch (error){
    console.log(error.message);
    res.render("index.ejs",{content : JSON.stringify(response.data)});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
