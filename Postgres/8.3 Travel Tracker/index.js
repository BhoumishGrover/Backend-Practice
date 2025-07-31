import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const pool = new pg.Pool({
  user : "postgres",
  password : "Groverno%1",
  host: "localhost",
  database : "World(webdev)",
  port : 5432
});


app.get("/", async (req, res) => {
  //Write your code here.
  try{
    var result = await pool.query("SELECT country_code FROM visited_countries");
    var total = result.rowCount;
    var error = req.query.error || null ;
    var countries = [];
    result.rows.forEach((country)=>{
      countries.push(country.country_code);
    });
    console.log(countries);
    res.render("index.ejs",{
      countries : countries,
      total : total,
      error : error
    });
  } catch(err){
    console.log(err.message);
    res.status(500).send("Something went wrong, couldn't load your page! Possible couldn't connect to database.");
  }
});

app.post("/add",async(req,res)=>{
  var input_country = req.body.country;
  const capitalised = input_country
  .toLowerCase()
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
  input_country = capitalised

  try{
    var result = await pool.query("SELECT country_code FROM countries WHERE country_name LIKE $1",[`%${input_country}%`]);
    console.log(result.rows);
    if(result.rows.length > 0){
      console.log(result.rows[0].country_code);
      await pool.query("INSERT INTO visited_countries(country_code) VALUES($1)",[result.rows[0].country_code]);
      console.log("Added a new country you have visited");
      res.redirect("/");
    } else {
      console.log(`Couldn't find the country you entered! -> ${input_country}`);
      // res.status(404).send(`Couldn't find the country you entered! -> ${input_country}`);
      res.status(404);
      res.redirect(`/?error=Couldn't find the country you entered! -> ${input_country}`)
    }
  } catch(err){
    console.error(err.message);
    res.status(500);
    res.redirect(`/?error=Already marked ${input_country} in the map as visited!`);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
