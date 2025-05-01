const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, 'books.db');
let db = null;

const initDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        })
        app.listen(4000, () => {
            console.log('server is running at http:localhost:4000/')
        })
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1)

    }
}
initDBAndServer();

app.get('/books/', async (request, res) => {
    const getBooksQuery = `SELECT * FROM books ORDER BY id`
    const bookArray = await db.all(getBooksQuery);
    res.send(bookArray)
})

app.post('/books/', async (request, res) => {
    const { id,
        title,
        author,
        published_year } = request.body;
        const postQuery = `INSERT INTO books (id,title,author,published_year)VALUES (${id},'${title}','${author}',${published_year});`
        const dbResponse = await db.run(postQuery);
        const bookId = dbResponse.lastID;
        res.send(`Book Successfully Added with ID: ${bookId}`)
})


