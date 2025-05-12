//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
});

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

app.use(bodyParser.urlencoded({extended:true}));

var flag = false;

function passwordChecker(req,res,next){
    if(req.body.password == "123456"){
        flag = true;
    }
    next();
}

app.post("/check",passwordChecker,(req,res)=>{
    if(flag == true){
        res.sendFile(__dirname + "/public/secret.html");
        flag = false;
    } else{
        res.send(`<script> 
                alert('invalid password'); 
                window.location.href = '/';
                </script> `);
    }
});