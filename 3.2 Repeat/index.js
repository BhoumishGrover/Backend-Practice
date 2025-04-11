import express from "express";
const app = express();
const port = 3000;

app.get("/",(req,res) => {
    console.log(req.rawHeaders);
    res.send("Hello World!");
});

app.get("/about",(req,res)=>{
    res.send("<h1>This is the About me HTML</h1>");
});

app.get("/contact",(req,res)=>{
    res.send("<h1>This is the Contact Us page</h1>");
});

app.listen(port,()=> {
    console.log(`Server Started on Port number: ${port}`);
});

