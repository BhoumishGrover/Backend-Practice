import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "electroknight";
const yourPassword = "123456789";
const yourBearerToken = "30d56574-a580-4026-aa04-33efe24c69d2";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async(req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  try{
    var response = await axios.get("https://secrets-api.appbrewery.com/random");
    var result = response.data; // response = JSON.stringify(response.data);
    console.log(result);
    result = JSON.stringify(result);
    res.render("index.ejs", { content: result});
  } catch (error){
    console.error(error.message + " " + error.status);
  }
});

app.get("/basicAuth", async(req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */

  try{
    var response = await axios.get('https://secrets-api.appbrewery.com/all?page=1',{
      auth: {
        username : yourUsername,
        password : yourPassword
      }
    });
    response = response.data;
    console.log(response);
    response = JSON.stringify(response);
    res.render("index.ejs", { content : response});
  } catch(error) {
    console.log(error.message + " " + error.status);
  }
});

app.get("/apiKey", async(req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  
  try{
  var yourAPIKey = await axios.get('https://secrets-api.appbrewery.com/generate-api-key');
    yourAPIKey = yourAPIKey.data.apiKey;    //gets the apikey in the js object passed 
    console.log(`Your API key: ${yourAPIKey}`);

    var response = await axios.get(`https://secrets-api.appbrewery.com/filter?score=5&apiKey=${yourAPIKey}`);
    
    response = response.data;
    console.log(response);
    response = JSON.stringify(response);
    res.render("index.ejs", { content: response});
  } catch(error){
    console.error(error.message + " " + error.status);
  }
});

app.get("/bearerToken", async(req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
  
  try{
    var yourToken = await axios.post('https://secrets-api.appbrewery.com/get-auth-token',{
      username: yourUsername,
      password : yourPassword
    });

    yourToken = yourToken.data.token;   //to get the token from the API 
    console.log(`Your token is ${yourToken}`);

    var response = await axios.get('https://secrets-api.appbrewery.com/secrets/42', {
      headers: {
        Authorization : `Bearer ${yourToken}`
      }
    });

    response = response.data;
    console.log(response);
    response = JSON.stringify(response);
    res.render("index.ejs",{ content : response});
  } catch(error){
    console.log(error.message + " " + error.status);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
