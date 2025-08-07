import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Strategy } from "passport-local";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Groverno%1",
  port: 5432,
});

const PgSession = connectPgSimple(session)

app.use(
  session({
    store : new PgSession({
      pool : db,
      tableName : 'user_sessions'
    }),
    name : 'secrets.sid',
    secret : 'MY_SECRET_KEY',
    resave : false,
    saveUninitialized : false,
    cookie : {
      maxAge : 1000 * 60 * 10   //10 minutes
    }
  })
);

app.use(passport.initialize())
app.use(passport.session())

passport.use(new Strategy(async function verify(username,password,cb){
  console.log(username)
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          //error while checking passwords 
          console.error("Error comparing passwords:", err);
          return cb(err)
        } else {  //if no error while checking
          if (result) {   //if password is matched (bcrypt.compare() returns true in result when password matches)
            cb(null,user)
          } else {    //passoword didn't match
            cb(null,false)
          }
        }
      });
    } else {
      // res.send("User not found");
      return cb(`User with email/username ${username} not found!`)
    }
  } catch (err) {
    console.log(err);
    return cb(err)
  }
}))

passport.serializeUser((user,cb)=>{
  cb(null, user.id) //store only user.id to keep cookie size small and this technique can be applied anywhere
})

passport.deserializeUser(async(id,cb)=>{
  try{
    const result = await db.query("SELECT * FROM users WHERE id = $1",[id])
    cb(null, result.rows[0])
  } catch (err) {
    cb(err)
  }
})

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req,res)=>{
  console.log(req.user)
  if(req.isAuthenticated()){
    res.render("secrets.ejs")
  } else {
    res.redirect("/login")
  }
})

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);

          var result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          var user = result.rows[0]

          req.login(user, (err)=>{
            if(err){
              console.log("Error logging in after registration",err)
              res.redirect("/login")
            } else {
              return res.redirect("/secrets")
            }
          })
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", passport.authenticate("local",{
  successRedirect : "/secrets",
  failureRedirect : "/login"
}));

app.get("/logout", (req,res)=>{
  req.logout((err)=>{
    if(err){
      console.log("Logout error: ",err)
      return res.redirect("/secrets") //fallback
    }

    //destroy session on server (remove it from the user_sessions table)
    req.session.destroy((err)=>{
      if(err) {
        console.error("Session destroy Error",err)
        return res.redirect("secrets")
      }

      //clear cookie on client side 
      res.clearCookie("secrets.sid")
      res.redirect("/")
    })
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
