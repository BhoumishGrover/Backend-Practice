import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname+"/public/index.html");
  console.log(req.body);
});

app.post("/submit",(req,res) => {
  app.use(bodyParser.urlencoded({extended:true}));
  res.send("<h1>Data has been recieved</h1>");
  res.send(req.body);
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
