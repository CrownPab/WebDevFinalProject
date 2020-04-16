var express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let uuid = require('uuid/v1');
let sqlite3 = require('sqlite3').verbose();
let bcrypt = require('bcrypt-nodejs');

//node js middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// session tracking
app.use(session({
    genid: (request) => { return uuid(); },
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true},
    secret: 'apollo slackware prepositional expectations',
}));

//sets up database for green
let db = new sqlite3.Database('./data/green.db', (error) => {
    if (error) {
        console.log("Error connecting to database");
        return;
    }

    console.log('Connected to the SQLite database');
});

//create user table inside green.db
db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS users(
        username TEXT PRIMARY KEY,
        firstname TEXT,
        lastname TEXT,
        email TEXT,
        dateOfBirth DATE,
        password VARCHAR(255),
        phoneNumber TEXT,
        country TEXT,
        address TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS budgets(
        username TEXT PRIMARY KEY,
        entertainment REAL DEFAULT 0,
        education REAL DEFAULT 0,
        health REAL DEFAULT 0,
        groceries REAL DEFAULT 0,
        restaurants REAL DEFAULT 0,
        utilities REAL DEFAULT 0,
        auto REAL DEFAULT 0,
        gifts REAL DEFAULT 0,
        investments REAL DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS expenses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        date DATE,
        amount REAL,
        category TEXT,
        description TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS goalProgress(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        amount REAL,
        category TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS goals(
        username TEXT PRIMARY KEY,
        travel REAL DEFAULT 0,
        car REAL DEFAULT 0,
        education REAL DEFAULT 0,
        home REAL DEFAULT 0,
        homeImprovement REAL DEFAULT 0,
        retirement REAL DEFAULT 0,
        creditcard REAL DEFAULT 0,
        loans REAL DEFAULT 0,
        emergency REAL DEFAULT 0
    )`);
});

//when no endpoint is entered the screen will default to the login page
app.get('/' , (request,response) => {
	response.render('login');
});

//when login is endpoint
app.get('/login' , (request,response) => {
    if(isActiveSession(request)){
        response.redirect('home');
        return;
    }

    response.render('login');
});

app.post('/login', (request, response) => {
    let username = request.body.username;
    let password = request.body.password;

    db.get(`SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`, (err, row) => {
        if (err) {
            return;
        }
        if(row != null){
			/*response.render('login', {
				result: 'init'
			});*/
            request.session.user = username;
            console.log(`Successful login: ${username}`);
            response.redirect('home');
        } else {
            // login failed
			
            console.log(`Login failed: ${username}`);
            //response.redirect('login');
			response.render('login', {
				result: 'error',
				
			});
        }
    });
});

app.post('/processSignup', (request, response) => {

    var username = request.body.username;

    db.get(`SELECT * FROM users WHERE username = "${username}"`, (err, row) => {
        if (err) {
            return;
        }
        if(row != null){
            response.redirect('signup');
            console.log(`${username} already exists`);
            return;
        } else {

            if(request.body.pass != request.body.cpass){
                response.redirect('signup');
                console.log(`Passwords do not match`);
                return;
            }

//            var username = request.body.username;
            var firstname = request.body.firstName;
            var lastname = request.body.lastName;
            var email = request.body.email;
            var dob = request.body.dateOfBirth;
            var pass = request.body.pass;
            var phoneNumber = request.body.phoneNumber;
            var country = request.body.country;
            var address = request.body.address;

            db.run('INSERT OR IGNORE INTO users (username, firstname, lastname, email, dateOfBirth, password, phoneNumber, country, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [username, firstname, lastname, email, dob, pass, phoneNumber, country, address], function(error) {

                if (error) {
                    console.error(error.message);
                    return;
                }
            });

            var entertainment = isNaN(request.body.entertainment) ? 0 : request.body.entertainment;
            var education = isNaN(request.body.education) ? 0 : request.body.education;
            var health = isNaN(request.body.health) ? 0 : request.body.health;
            var groceries = isNaN(request.body.groceries) ? 0 : request.body.groceries;
            var restaurants = isNaN(request.body.restaurants) ? 0 : request.body.restaurants;
            var utilities = isNaN(request.body.utilities) ? 0 : request.body.utilities;
            var auto = isNaN(request.body.auto) ? 0 : request.body.auto;
            var gifts = isNaN(request.body.gifts) ? 0 : request.body.gifts;
            var investments = isNaN(request.body.investments) ? 0 : request.body.investments;

            db.run('INSERT OR IGNORE INTO budgets (username, entertainment, education, health, groceries, restaurants, utilities, auto, gifts, investments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [username, entertainment, education, health, groceries, restaurants, utilities, auto, gifts, investments], function(error) {

                if (error) {
                    console.error(error.message);
                    return;
                }
            });

            db.run('INSERT OR IGNORE INTO goals (username) VALUES (?)',
                [username], function(error) {

                if (error) {
                    console.error(error.message);
                    return;
                }

             });

            response.redirect('login');
            console.log(`${username} successfully registered`);
        }
    });
});

app.get('/signup' , (request,response) => {
    //response.sendFile(__dirname + '/public/login.html')
	response.render('signup');
});

app.get('/transactions' , (request,response) => {
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

	response.sendFile(__dirname + '/public/transactions.html')
});

app.get('/goals' , (request,response) => {
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

	response.render('goals');
});

app.get('/news' , (request,response) => {
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

    response.sendFile(__dirname + '/public/news.html')

});

app.get('/aboutUs' , (request,response) => {

    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

	response.sendFile(__dirname + '/public/aboutUs.html')
});

app.get('/home' , (request,response) => {
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

    response.sendFile(__dirname + '/public/homepage.html')

});

app.get('/logout' , (request,response) => {
    request.session.user = '';
    response.redirect("login");
});

app.post('/api/getUserExpenses', (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT username, date, amount, category, description FROM expenses WHERE username = "${data.username}" AND date >= "${data.from}" AND date <= "${data.to}" ORDER BY date DESC`, (err, rows) => {
        if (err) {
            throw err;
        }

        console.log(rows);
        res.send(rows);
    });
});


app.get('/api/getExpenses', (req,res) => {

    db.all(`SELECT username, date, amount, category, description FROM expenses`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});

app.get('/api/getUsers', (req,res) => {

    db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});


app.post('/api/addExpense', (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));
    console.log(data);

    let user = data.username;
    let category = data.category;
    let amount = data.amount;
    let description = data.description;
    let date = data.date;

    // Do something, like query a database or save data

    db.run('INSERT INTO expenses (username, date, amount, category, description) VALUES (?, ?, ?, ?, ?)',
                    [user, date, amount, category, description], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});

app.get('/api/getSessionUser', function(req, res) {
    if (req.session && req.session.user) { // Check if session exists
        let user = req.session.user;
        res.send(user);
    } else {
        res.send("Invalid-User");
    }
  });

app.post('/api/getUserBudgets', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT * FROM budgets WHERE username = "${data.username}"`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});

app.post('/api/setUserBudget', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    let user = data.username;
    let category = data.category;
    let amount = data.amount;

    db.run(`UPDATE budgets SET ${category}=? WHERE username=?`,[amount, user], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});

app.post('/api/setGoal', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    let user = data.username;
    let category = data.category;
    let amount = data.amount;

    db.run(`UPDATE goals SET ${category}=? WHERE username=?`,[amount, user], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});

app.post('/api/addGoalProgress', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    let user = data.username;
    let category = data.category;
    let amount = data.amount;

    db.run('INSERT INTO goalProgress (username, amount, category) VALUES (?, ?, ?)',
                    [user, amount, category], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});


app.get('/api/getUserGoals', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT * FROM goals WHERE username = "${data.username}"`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});

app.post('/api/getGoalProgress', (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT * FROM goalProgress WHERE username = "${data.username}"`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});

app.get('/test', (request,response) => {
    response.sendFile(__dirname + '/public/test.html');
});


app.set('port', 3000);

var server = app.listen(app.get('port'), () => {
    console.log('Node.js/Express is listening on port ' + app.get('port'));
})

let registerHistory = [];

let soio = require('socket.io')(server);							//Creates a socket that connects to our server

soio.on('connection', function(socket) {							//When a user connects to the socket
	console.log('User has connected.');
	if(registerHistory.length > 0){									//If a user connects and missed another user register, display the missed registrations
		for (var i=0; i<registerHistory.length; i++){
			socket.emit('old register logs', registerHistory[i]);
		}
	}
	
	
	socket.on('Leave', function(){									//When the user disconnects
		console.log('User has left.');
	});

	socket.on('Send', function(data){								//If a user registers
		console.log(data.date + data.username + ": " + data.message);
		registerHistory.push(data);									//Store the registration information in registerHistory
		soio.emit('admin notification', data);						//If a connected user is online (an admin), send them the registration details
	});
})

function isActiveSession(request) {
    if (!(request.session && request.session.user && request.session.user != '')) { // Check if session exists
        return false;
    }

    return true;
}
