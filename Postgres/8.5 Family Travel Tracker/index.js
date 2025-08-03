import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "World(webdev)",
  password: "Groverno%1",
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var currentUser = 0;

async function getUser() {
  var user = await db.query("SELECT * from users");
  return user.rows;
}

async function checkVisisted(user) {
  const result = await db.query("SELECT country_code FROM visited_countries JOIN users ON visited_countries.user_id = users.id WHERE users.id = $1",[user]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  console.log(`The current user is: ${currentUser}`);
  var users = await getUser(currentUser);
  console.log(users)
  console.log(users[currentUser].id);
  const countries = await checkVisisted(users[currentUser].id);
  console.log(countries);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: users[currentUser].color,
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    console.log(countryCode)
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
        [countryCode,currentUser+1]
      );
      console.log("Added Country")
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.send("Error adding Country")
    }
  } catch (err) {
    console.log(err);
    res.send("Error adding country")
  }
});

app.post("/user", async (req, res) => {
  if(req.body.add === 'new'){
    res.render("new.ejs");
  } else {
    currentUser = req.body.user;
  currentUser -= 1
  res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  var name = req.body.name
  var color = req.body.color
  try{
    await db.query("INSERT INTO users(name,color) VALUES ($1,$2)",[name,color])
    console.log("User added Successfully")
    currentUser +=1;
    res.redirect("/")
  } catch(err) {
    console.log(err)
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
