'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

var quotes = [
{id: 1,quote: "The best is yet to come", author: "Unknown", year: 2000},
{id: 2,quote: "Everything is practice.", author: "Pele", year: 1950},
{id: 3,quote: "You're what you practice most.", author: "Unknown", year: 1910}
];

var db = new sqlite3.Database('db/quotes.db');
const sql = `
CREATE TABLE IF NOT EXISTS quotes (
  quote TEXT,
  author TEXT)`;

db.run(sql, function(err){
    if(err){
        console.log(err.message);
        res.status(500).json({ message: 'No table in database'});
    } else {
        console.log('quotes TABLE created successfully!');
    }
});

app.listen(port, function(){
    console.log('Express listening on port: ' + port);
});

// Route /
app.get('/', function(req, res){
    res.send('Welcome to Quotes API!');
});

// Route GET /quotes
app.get('/quotes', function(req, res){
    if (req.query.year){
        // res.send('Return a list of quotes from year: ' + req.query.year);
        // db.all('SELECT * FROM quotes WHERE year = 1902', function(err, rows){
        db.all('SELECT * FROM quotes WHERE year = ?', [req.query.year], function(err, rows){    
            if(err){               
                res.send(err.message);
            } else {
                if (!row){
                    res.status(404).json({ message: 'No quote found'});
                } else {
                    console.log('Return a list of quotes from year:' + req.query.year);
                    res.json(rows);
                }
            }
        });
    } else {
        console.log('Get list of all quotes as json');
        db.all('SELECT rowid, * FROM quotes', function processRows(err, rows){
            if(err){
                res.send(err.message);
            } else {
                if (!rows){
                    res.statusCode(404).json({ message: 'No quote found'});
                } else {
                    console.log(rows);
                    res.json(rows);
                }
            }
        });
        // res.json(quotes);
    }
});

// Route GET /quotes:id
app.get('/quotes/:id', function(req, res){
	const reqId = req.params.id;
    console.log('Return quote with id: ' + reqId);
    // res.send('Return quote with id: ' + req.params.id);
    db.get('SELECT * FROM quotes WHERE rowid = ?', [reqId], function(err, row){
        if(err){
            res.send(err.message);
        }else if (!row){ 
            res.status(404).json({ message: 'Quote not found.'});
        }else{
			res.json(row);
		}
    });
});

// Route POST /quotes
app.post('/quotes', function(req, res){
    console.log('Insert a new quote: ' + req.body.quote);
    // res.json(req.body);
    db.run('INSERT INTO quotes VALUES (?, ?)', [req.body.quote, req.body.author], function(err){
        if(err){
            console.log(err.message);
        }else{
            res.send('Inserted quote with id: ' + this.lastID);
        }      
    });
});

// Route DELETE /quotes:id
app.delete('/quotes/:id', function(req, res){
	console.log('Delete quote with id: ' + req.params.id);
    db.run('DELETE FROM quotes WHERE rowid = ?', [req.params.id], function(err){
        if(err){
            console.log(err.message);
        } else {
            res.send('Delete quote with id' + req.params.id);
        }
    });
});


// Route PUT /quotes:id
app.put('/quotes/:id', [], function(req, res){
	const reqId = req.params.id;
	
	//get the first quote matching reqId
	// let quote = quotes.filter(function(quote){
	//		return quote.id == reqId;
	// })[0]; 
	
	db.get('SELECT * FROM quotes WHERE rowid = ?',[reqId],function(err, row){
		if (!row){
			res.status(404).json({ message: 'No quote found.' });
			console.log('No quote found with id: ' + reqId);	
		}else{
			// console.log('Before update: ' + row.author);
			const keys = Object.keys(req.body);
			keys.forEach(function(key){
				row[key] = req.body[key];
			});
			console.log('keys values: ' + keys);
			// console.log('After update: ' + row.author);

			db.run('UPDATE quotes SET quote = ?, author = ? WHERE rowid = ?', [row.quote, row.author, reqId], function(err){
				if(err){
					console.log('Update error: ' + err.message);
					res.status(500).json({ message: 'Update error' + err.message });
				} else {
					console.log('Update successfully: ' + row.quote);
					res.send('Update successfully: ' + row.quote);
				}
			});
		}
	});
});
