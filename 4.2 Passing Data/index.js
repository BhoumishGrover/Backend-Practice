import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
  res.render(__dirname + "/views/index.ejs", res.locals={
    data: "<h1>Enter you full name below 👇🏻",
  });
});

app.post("/submit",(req,res)=>{
  // Safely extract data from req.body
  const fname = req.body["fName"];
  const lname = req.body["lName"];

  // Calculate letters properly
  const letters = fname.length + lname.length;
  res.render(__dirname + "/views/index.ejs",
    { data: `<h1>Your name has ${letters} Letters 🥰`,})
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
