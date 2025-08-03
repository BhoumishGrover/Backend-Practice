import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Pool({
  user : 'postgres',
  password : 'Groverno%1',
  database : 'Check-List',
  host : 'localhost',
  port : 5432
})

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

async function getList(){
  var items = await db.query('SELECT * FROM items')
  return items = items.rows;
}

app.get("/", async(req, res) => {
  try{  
    var items = await getList()
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('Index.ejs',{
      listTitle : 'Error',
      listItems : {title : 'Could not connect to database'}
    })
  }
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query('INSERT INTO items(title) VALUES($1)',[item])
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  var itemID = req.body.updatedItemId
  var itemTitle = req.body.updatedItemTitle
  try{
    await db.query('UPDATE items SET title = $1 WHERE id = $2',[itemTitle,itemID])
    res.redirect('/')
  } catch(err){
    res.render('Index.ejs',{
      listTitle : 'Error',
      listItems : {id: 999, title : 'An error Occured'}
    }).status(404)
  }
});

app.post("/delete", async(req, res) => {
  var itemID = req.body.deleteItemId
  await db.query('DELETE FROM items WHERE id = $1',[itemID])
  res.redirect('/')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
