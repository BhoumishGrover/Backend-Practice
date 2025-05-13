import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.listen(port,()=>{
    console.log(`Active on Port ${port}`);
});

app.get("/",(req,res)=>{
    const d = new Date("May 12, 2025")
    const GeneratedDay = d.getDay();

    console.log(GeneratedDay);

    res.render(__dirname + "/views/index.ejs",
        {day: GeneratedDay}
    );
});