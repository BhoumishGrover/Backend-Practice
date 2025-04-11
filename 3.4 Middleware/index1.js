import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  console.log(__dirname + "/public/index.html");
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit",(req,res)=>{
  app.use(bodyParser.urlencoded({extended:true}));
  console.log(req.body);
  res.send("<h1>Data was replaced</h1>");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
