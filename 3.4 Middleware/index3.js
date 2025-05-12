import express from "express";

const app = express();
const port = 3000;

function logger(req,res,next){
  //const req_method = req.body.method;
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  next();
}
app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
