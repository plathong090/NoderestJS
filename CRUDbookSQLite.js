const express = require('express')
const sqlite3 = require('sqlite3')
const app = express()
const db = new sqlite3.Database('./Database/Book.sqlite')

app.use(express.json())

// Create book table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT
)`)

// Route to get all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.json(rows)
        }
    })
})

// Route to get a book by id
app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (!row) {
                res.status(404).send('Book not found!!!')
            } else {
                res.json(row)
            }
        }
    })
})

// Route to create a new book
app.post('/books', (req, res) => {
    const book = req.body
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', [book.title, book.author], function (err) {
        if (err) {
            res.status(500).send(err)
        } else {
            book.id = this.lastID
            res.send(book)
        }
    })
})

// Route to update a book
app.put('/books/:id', (req, res) => {
    const book = req.body
    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', [book.title, book.author, req.params.id], function (err) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(book)
        }
    })
})

// Route to delete a book
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send({})
        }
    })
})

// Set the port to a default value if process.env.PORT is not set
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port http://localhost:${port}`))
