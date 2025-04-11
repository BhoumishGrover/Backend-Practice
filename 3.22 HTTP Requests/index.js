import express from "express";
const app = express();
const port = 3000;

app.listen(port,()=>{
    console.log(`Server running on port number: ${port}`)
});

app.get("/", (req,res)=>{
    res.send("<h1>Hello World!</h1>");
});

app.get("/contact",(req,res)=>{
    res.send("<h2>Reach me at: 8369919600</h2>");
});

app.get("/about", (req,res)=>{
    res.send("<h3>This is the about me page</h3>");
});