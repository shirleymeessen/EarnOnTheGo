var express = require("express"); // call the express module which is default provided by 
var app = express(); // declare our app which is the envoked express application
var mysql = require('mysql'); // to give access to sql
const path = require('path');
const VIEWS = path.join(__dirname,'views');
var fs = require('fs'); // needed for JSON = filesystem
var flash    = require('connect-flash');
// Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser()); // read cookies (needed for auth)


// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.set('view engine', 'jade'); //this so you dont have to add jade to every file when rendering. 



app.use(express.static("views"));
app.use(express.static("scripts")); //to use the script folder contents
app.use(express.static("images")); //to use the images folder contents
app.use(express.static("models")); // to use the JSON file 


var reviews = require("./models/reviews.json") // to access JSON data in models folder 


// connecting to the mysql database through gearhost 
const db = mysql.createConnection({ 
 host: 'den1.mysql2.gear.host',
 user: 'earnonthego',
 password: 'Et16Z~u8Jj6-',
 database: 'earnonthego',
 multipleStatements: true // multiple queries at the same time
});

// check to see if connected to the database 
db.connect((err) =>{
 if(err){
   console.log("Not connected to db");
 }
   else{
     console.log("Connected to db!");
   }
});


// creating database table
app.get('/createtable', function(req,res){
 let sql = 'CREATE TABLE jobs (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Title varchar(255), Description varchar(7000), Qualifications varchar(255), Deadline date, Amount int);'
 let query = db.query(sql,(err,res)=>{
   if (err) throw err;
   console.log(res);
});
res.send("Table created")
});



app.get('/createusers', function(req,res){
let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Username varchar(255), Password varchar(255), Company varchar(255));'
let query = db.query(sql,(err,res)=>{
 if (err) throw err;
 console.log(err);
});
res.send("Table created")
 
});

// end creating table 


//app.get('/createprofile', function(req,res){
//let sql = 'CREATE TABLE profile (profileId int NOT NULL AUTO_INCREMENT PRIMARY KEY, Id int, Name varchar(255), Emailaddress varchar(255), Skills varchar(255), Education varchar(255), Qualifications varchar(255), FOREIGN KEY (Id) REFERENCES users (Id));'
//let query = db.query(sql,(err,res)=>{
// if (err) throw err;
// console.log(err);
//});
//res.send("Table created")
 
//});



app.get('/alter', function(req, res){ 
let sql = 'ALTER TABLE profile ADD PRIMARY KEY (profileId);'
let query = db.query(sql, (err, res) => {  
    if(err) throw err;
  console.log(res);         
}); 
res.send("altered"); 
});

app.get('/drop', function(req, res){ 
let sql = 'DROP TABLE profile;'
let query = db.query(sql, (err, res) => {  
    if(err) throw err;
  console.log(res);         
}); 
res.send("dropped"); 
});




// add data to the database commented out to make sure not adding more data
app.get('/insert', function(req,res){
 let sql = 'INSERT INTO jobs (Title, Description, Qualifications, Deadline, Amount) VALUES (");'
let query = db.query(sql,(err,res)=>{
   if (err) throw err;
   console.log(res);
});
res.send("Item added")
});

 //end add to database table jobs 
 
 
 

 
 
 
 // query database to show if data has been inputted successfully
 app.get('/query', function(req,res){
 let sql = 'SELECT * from profile' 
 let query = db.query(sql,(err,res)=>{
   if (err) throw err;
   console.log(res);
});
res.send("look at console")
});
 
// end query 
 
 
 

app.get('/', function(req, res) {
res.render('index', {root: VIEWS});
console.log("Homepage"); // used to output activity in the console
});

// ==================NOT WORKING BUTTON NOT SUBMITTING INFO?!?!SEARCH functionality
app.post('/search', function(req, res){
let sql = 'SELECT * FROM jobs WHERE (title LIKE "%'+req.body.search+'%" OR description LIKE "%'+req.body.search+'%" OR qualifications LIKE "%'+req.body.search+'%");'// query multiple fields 
 let query = db.query(sql, (err, res2) =>{
  if(err)
  throw(err);
 
  res.render('jobs',{root: VIEWS, res2}); // use the render command so that the response object renders a HHTML page
  console.log("Searching");
 });
 
 console.log("Now you are on the jobs page!");
});
//===========================================================================================

//============================================POSTJOBSECTION======================================

//to render the page to create a job. 
app.get('/postjob', function(req, res){
res.render('postjob', {root: VIEWS});
console.log("Post a job page"); // used to output activity in the console
});



//to submit information from the post a job page to database table jobs
app.post('/postjob', function(req, res){
let sql = 'INSERT INTO jobs (Title, Company, Description, Qualifications, Deadline, Amount) VALUES ("'+req.body.title+'", "'+req.body.company+'", "'+req.body.description+'", "'+req.body.qualifications+'", "'+req.body.deadline+'", '+req.body.amount+');' 
let query = db.query(sql,(err,res)=>{
if (err) throw err;
console.log(res);
console.log("job added");
});
  
res.render('index', {root: VIEWS});
});

// to show the jobs on the jobspage from the database
app.get('/jobs', function(req, res){
let sql = 'SELECT * from jobs;' 
  let query = db.query(sql, (err, res2) =>{
    if(err) 
    throw (err);

res.render('jobs', {root: VIEWS, res2});

});
console.log("jobspage"); // used to output activity in the console
});


//EDIT the project/task in the application after making a route.
 app.get('/edit/:id', function(req, res){
 let sql = 'SELECT * FROM jobs WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res2) =>{
 if(err)
 throw(err);

res.render('edit', {root: VIEWS, res2}); 

  });

 console.log("Edit project/task page!");

});

//Edit and update the database with the post request 

app.post('/edit/:id', function(req, res){

let sql = 'UPDATE jobs SET Title = "'+req.body.newtitle+'", Description = "'+req.body.newdescription+'", Qualifications = "'+req.body.newqualifications+'", Deadline = "'+req.body.newdeadline+'", Amount = '+req.body.newamount+' WHERE Id = "'+req.params.id+'";'

let query = db.query(sql, (err, res) =>{

if(err) throw err;

console.log(res);


})

res.redirect("/jobs/");

});

//delete a PROJECT/TASK
app.get('/delete/:id', function(req, res){
 let sql = 'DELETE FROM jobs WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res2) =>{
 if(err)
 throw(err);
res.redirect('/jobs'); 

 });

 console.log("deleted project/task!");

});

//======================= END JOB SECTION

//================================JOBSEEKERS PROFILE=======================================


// to show the jobs on the jobspage from the database
app.get('/profile/:profileid', function(req, res){
let sql = 'SELECT * from profile WHERE profileId = "'+req.params.profileid+'";'
  let query = db.query(sql, (err, res1) =>{
    if(err) 
    throw (err);

res.render('profile', {root: VIEWS, res1});

});
console.log("profile"); // used to output activity in the console
});


//to render the page to create a profile. 
app.get('/createprofile', function(req, res){
res.render('createprofile', {root: VIEWS});
console.log("Create Profile Jobseeker"); // used to output activity in the console
});



//to submit information to profile table
app.post('/createprofile', function(req, res){
let sql = 'INSERT INTO profile (Name, Emailaddress, Skills, Education, Qualifications) VALUES ("'+req.body.name+'", "'+req.body.emailaddress+'", "'+req.body.skills+'", "'+req.body.education+'", "'+req.body.qualifications+'");' 
let query = db.query(sql,(err,res)=>{
if (err) throw err;
console.log(res);
console.log("profile created");
});
  
res.render('jobseekers', {root: VIEWS});
});




//EDIT the profile in the application after making a route.
 app.get('/editprofile/:name', function(req, res){
 let sql = 'SELECT * FROM profile WHERE Name = "'+req.params.name+'";'
 let query = db.query(sql, (err, res1) =>{
 if(err)
 throw(err);

res.render('editprofile', {root: VIEWS, res1}); 

});

 console.log("Editing section!");

});

//Edit and update the database with the post request 

app.post('/editprofile/:name', function(req, res){
let sql = 'UPDATE profile SET Name = "'+req.body.newname+'", Emailaddress = "'+req.body.newemailaddress+'", Skills = "'+req.body.newskills+'", Education = "'+req.body.neweducation+'", Qualifications = "'+req.body.newqualifications+'" WHERE Name = "'+req.params.name+'";'
let query = db.query(sql, (err, res) =>{
if(err) throw err;
console.log(res);


})

res.redirect("/jobseekers");

});

//delete a profile
app.get('/deleteprofile/:name', function(req, res){
 let sql = 'DELETE FROM profile WHERE Name = "'+req.params.name+'";'
 let query = db.query(sql, (err, res1) =>{
 if(err)
 throw(err);
res.redirect('/jobseekers'); 

 });

 console.log("deleted !");

});
//=================================END JOBSEEKERS PROFILE

//===============================================





app.get('/notloggedin', function(req, res) {
res.render('notloggedin', {root: VIEWS}); //changed to render instead of send because changed to Jade to render as html
console.log("Need to login"); // used to output activity in the console
});

app.get('/notemployer', function(req, res) {
res.render('notemployer', {root: VIEWS}); //changed to render instead of send because changed to Jade to render as html
console.log("Not an employer"); // used to output activity in the console
});

app.get('/notjobseeker', function(req, res) {
res.render('notjobseeker', {root: VIEWS}); //changed to render instead of send because changed to Jade to render as html
console.log("Not a jobseeker"); // used to output activity in the console
});

app.get('/logout', function(req, res) {
res.render('logout', {root: VIEWS}); //changed to render instead of send because changed to Jade to render as html
console.log("logout"); // used to output activity in the console
});




//=========================================== Register/Login and Logout Section=======================================
	// show the login form
	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage') });
		console.log("Login");
	});
	


	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/confirmationlogin', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

//==Register==============================================================================================
	// show the signup form
	app.get('/register', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('register', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/confirmationlogin', // redirect to the secure profile section
		failureRedirect : '/register', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// PROFILE SECTION ========================================================================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/confirmationlogin', isLoggedIn, function(req, res) {
		res.render('confirmationlogin', {
			user : req.user // get the user out of session and pass to template
		});
	});

// LOGOUT =====================================================================

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/logout');
	});


// ===========RESTRICTING ACCESS JOBSEEKER/ EMPLOYER AND LOGGEDIN
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/notloggedin');
}

    

app.get('/employers',isLoggedIn, function (req, res) {
    if (req.user && req.user.employer !== 1) {
       return res.redirect("/notemployer");
    }
    res.render('employers', { root: VIEWS}); //changed to render instead of send because changed to Jade to render as html
    console.log("Employers page"); // used to output activity in the console
});

app.get('/jobseekers',isLoggedIn, function (req, res) {
    if (req.user && req.user.jobseeker !== 1) {
      return res.redirect("/notjobseeker");
    }
    res.render('jobseekers', { root: VIEWS }); //changed to render instead of send because changed to Jade to render as html
    console.log("Jobseekers page"); // used to output activity in the console
});







//module.exports = function(passport) {

// passport session setup ==================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.Id); // Very important to ensure the case if the Id from your database table is the same as it is here
    });

    // used to deserialize the user
   passport.deserializeUser(function(Id, done) {
    db.query("SELECT * FROM users WHERE Id = ? ",[Id], function(err, rows){
     done(err, rows[0]);
     });
  });


// LOCAL SIGNUP ============================================================
 

    passport.use(
        'local-signup',
        new LocalStrategy({
        
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null), // use the generateHash function in our user model
                        company: req.body.company,
                    };
                    
                  

                    var insertQuery = "INSERT INTO users (username, password, company) Values (?,?,?)";

                    db.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.company],function(err, rows){
                        newUserMysql.Id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );
    


//================================================= LOCAL LOGIN =============================================================


    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].Password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
//};




//=================================================JSON code================================================================

app.get('/reviews', function(req, res){
 res.render("reviews", {reviews:reviews}
 );
 console.log("Review Page");
}
);


//===========================CREATE NEW REVIEW
app.get('/addreview', function(req, res) {
res.render('addreview', {root: VIEWS});
console.log("Review page"); // used to output activity in the console
});

//Javascript to add a review in the JSON file
app.post('/addreview', function(req, res){
	var count = Object.keys(reviews).length; 
	console.log(count);
	
	// to autoincrement ID's in the JSON file 

	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) 
		{
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
		}
		return max;
	}

var maxPpg = getMax(reviews, "id"); 
var	newId = maxPpg.id + 1;  
console.log(newId); 

//create a new review 
	var review = {
		name: req.body.name, 
		id: newId,
		date: req.body.date,
		content: req.body.content, 
	};

		console.log(review) 
	var json  = JSON.stringify(reviews); 

	fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data){
		if (err){
		throw(err);
	 }else {

		reviews.push(review);
		json = JSON.stringify(reviews, null , 4); 
		fs.writeFile('./models/reviews.json', json, 'utf8'); 


	}});

	res.redirect("/reviews")

});

//==========================================DELETE REVIEWS

app.get('/deletereviews/:name', function(req, res) {
var json = JSON.stringify(reviews);
fs.readFile('./models/reviews.json')
var keytoFind = req.params.name; // position represents the location in the json array remember 0 is the first
var index2 = reviews.map(function(d) { return d['name']; }).indexOf(keytoFind) // finds the position of the item in the json array and sets it as a variable called index2
console.log("Review " + index2 + "    " + keytoFind)
reviews.splice(index2, 1); // deletes one item from position represented by index 2 from above
json = JSON.stringify(reviews, null, 4); //convert it back to json
    fs.writeFile('./models/reviews.json', json, 'utf8'); // write it back 
console.log("Review Deleted");
res.redirect("/reviews");
});




//============================Edit review page showing the review that you want to edit
app.get('/editreview/:id', function(req, res) {
 function chooseProd(individual){
  return individual.id === parseInt(req.params.id)
 }
 console.log("Id of this review is " +req.params.id);
 var individual = reviews.filter(chooseProd);//individual is the variable to just call one review 
 res.render('editreview', {individual:individual});
 
 console.log("Edit Review page");

});



//To actually edit the review
app.post('/editreview/:id', function(req,res){
 var json = JSON.stringify(reviews); // reviews because that is wat we called the variable at the top. 
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = reviews; //reviews JSON file
 var index = data.map(function(review){review.id}).keyToFind 
 var x = req.body.date
 var y = req.body.content
 var z = parseInt(req.params.id)
 reviews.splice(index, 1, {name: req.body.name, date: x, content: y, id: z});// splice is the function to replace data with other data, manipulation through the URL with an ID
 json = JSON.stringify(reviews, null, 4);// null and 4 is there so the the json data file is easier to read. 
 fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
 res.redirect("/reviews");
});



// END JSON  code



//for when they go to a non existing URL
app.get('*', function (req, res) {
  res.status(404).send("Page does not exist.");
});

// this is needed for the application to run in NODE
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log("The app is running!");
  
});
