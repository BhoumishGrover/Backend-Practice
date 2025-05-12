import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
  console.log(__dirname + "/public/index.html");
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit",(req,res)=>{
  console.log(req.body);

  const street = req.body.user_street_name;
  const pet = req.body.user_pet_name;

  res.send(`<h1>Data Recieved: </h1> <br/>
           <h3><strong>Street Name:</strong> ${street} <br/>
           <h3><strong>Pet Name:</strong> ${pet}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
