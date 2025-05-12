import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get("/",(req,res)=>{
  res.sendFile(__dirname + "/public/index.html");
  console.log(__dirname + "/public/index.html");
});

function BandNameGenerator(req,res,next){
  req.bandname = `${req.body.user_street_name}${req.body.user_pet_name}`;
  next();
}

app.post("/submit", BandNameGenerator,(req,res)=>{
  console.log(req.body);
  //res.sendFile(__dirname + "/public/bandName.html");
  // res.send(`<!DOCTYPE html>
  //           <html lang="en">
  //           <head>
  //               <meta charset="UTF-8">
  //               <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //               <title>Band Name Generator</title>
  //           </head>
  //           <body>
  //               <h1>Your Very cooool Band Name is 🎸🎶🥁</h1> <br/>
  //               <h2> ${req.body.user_street_name}${req.body.user_pet_name} 😎</h2>
  //           </body>
  //           </html>
  //         `);
          //can do this or process the bandname in a custom middleware.
  res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Band Name Generator</title>
            </head>
            <body>
                <h1>Your Very cooool Band Name is 🎸🎶🥁</h1>
                <h2> ${req.bandname} 😎 </h2>
            </body>
            </html>`);
});

