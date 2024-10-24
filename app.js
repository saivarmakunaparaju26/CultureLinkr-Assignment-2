const {open} = require('sqlite')
const path = require('path')
const express = require('express')
const sqlite3 = require('sqlite3').verbose()

const app = express()

app.use(express.json())

const dbPath = path.join(__dirname, 'products.db')

let d = null

//initilizing the server
const initilizeserver = async () => {
  try {
    d = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running in localhost:3000')
    })
  } catch (err) {
    console.log(err.msg)
    process.exit(1)
  }
}

initilizeserver()

//inserting some dummy data into the .db file
app.post('/products/', async (request, response) => {
  const {id, name, price, quality} = request.body
  console.log(name)
  const query = `INSERT INTO products (id,name,price,quality) VALUES (${id},'${name}',${price},'${quality}');`
  await d.run(query)
  response.send('Data inserted successfully')
})

//To get totalvalue of all products
app.get('/products/', async (request, response) => {
  const data = `select * from products`
  const getData = await d.all(data)
  console.log(getData)
  let totalPrice = 0
  getData.map(each => {
    let v = each.price
    totalPrice += v
  })
  response.sendStatus(totalPrice)
  console.log(totalPrice)
})


//creating a .db file
/*
const db = new sqlite3.Database('products.db', err => {
  if (err) {
    console.error(err.msg)
  } else {
    console.log('connected to the database.')
  }
})

db.serialize(() => {
  db.run(
    `create table IF NOT EXISTS products(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INT,
        quality TEXT NOT NULL
    )`,
    err => {
      if (err) {
        console.log(err.message)
      } else {
        console.log('Table created successfully')
      }
    },
  )
})

db.close((err)=>{
  if(err){
    console.error(err.msg)
  }else{
    console.log('Database connection closed')
  }
})
*/
