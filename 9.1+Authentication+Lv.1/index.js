import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

const db = new pg.Pool({
  user : "postgres",
  password : "Groverno%1",
  database : "secrets",
  host : "localhost",
  port : 5432
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  var email = req.body.username //takes email actually, name='username'
  var password = req.body.password

  //resgiter a new user
  try{
    var check = await db.query('SELECT * FROM users WHERE email = $1',[email])

    if(check.rows.length > 0){
      res.send("This email already exists, try logging in")
    } else {
      //password hashing 
      bcrypt.hash(password,saltRounds, async(err,hash)=>{
        if(err) {
          console.log("Error hashing password: ",err.message)
        } else {
          await db.query('INSERT INTO users(email,password) VALUES($1,$2)',[email,hash])
          res.render("secrets.ejs")
        }
      })  
    }
  } catch(err) {
    console.log(err)
    res.status(404).send(err.message)
  }
});

app.post("/login", async (req, res) => {
  var email = req.body.username
  var loginPassword = req.body.password

  //check user credentials to login
  try{
    var check = await db.query('SELECT * FROM users WHERE email = $1',[email])

    if(check.rowCount > 0){
      var storedHashedPassword = check.rows[0].password
      bcrypt.compare(loginPassword,storedHashedPassword, async(err,result)=>{
        if(err){
          console.log("Error while comparing passwords")
        } else {
          if(result){   //bcrypt.compare() returns true in the result if the passwords are the same
            res.render("secrets.ejs")
          } else {
            res.send("Invalid password")
          }
        }
      })
    } else {
      res.send("User not found, pls try to register first!")
    }
  } catch(err){
    console.log(err)
    console.log(err.message)
    res.send("Invalid email")
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
