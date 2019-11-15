let cookieParser = require('cookie-parser');
let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let multer = require ('multer');
let uuid = require('uuid/v4');
let fs = require('fs');
let { UserList } = require('./model');
let { SolutionList } = require('./model');
let passport = require('passport');
let session = require('express-session');
let bcrypt = require('bcryptjs');
const User = require('./UserModel');
const { DATABASE_URL, PORT } = require('./config');


let app = express();
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

require('./passportconfig')(passport);

app.use( express.static( "public" ) );

app.use( morgan( "dev" ) );
app.use(
	session({
			secret: 'secret',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: false
        },
        resave: true,
        saveUninitialized: false,
        genid: function (req) { return uuid(); }
 

	})

);
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
var sess;
let usersaux= [];

app.get( "/api/userslist", ( req, res, next ) => {
	UserList.get()
		.then( users => {
			var i;
			for(i in users)
			{
				usersaux.push(users[i]);
			}
			return res.status( 200 ).json( users );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
});
app.get('/api/checksession', function (req, res, next) {
    //if (req.session.views) {
      //  req.session.views++
    //res.setHeader('Content-Type', 'text/html');
    //res.write('<p>views: ' + req.session.username + '</p>');
    //res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
    //res.end();
    if (req.session.username)
        return res.status(200).json(req.session.username);
    else
        return res.status(200).json('none');
    //} else {
     //   req.session.views = 1
       // res.end('welcome to the session demo. refresh!')
   // }
});


app.post( "/api/postuser", jsonParser, ( req, res, next ) => {
	let username = req.body.username;
    //let contra = req.body.password;
    let password = req.body.password;
	let country = req.body.country;
	let business = req.body.business;
	let lldate = req.body.lldate;
    var level = 0;
    let Solution = req.body.Solution;
   
	//var Solution = {};
    let newUser = {
        username,
        password: password,
        level,
        lldate,
        country,
        business,
        Solution
    };
	var i;
			for(i in usersaux)
			{
                if (newUser.username === usersaux[i].username)
                    return res.status(400).json({
                        status: 400,
                        message: "User name already exists"
                    });
				
    }
    let hashpass = bcrypt.hash(password, 10, (err, hash) => {

        if (err) return err;
        User.create({
            username,
            password: hash,
            level,
            lldate,
            country,
            business,
            Solution


        })
            .then(user => {
                return res.status(200).json(user);
            })
            .catch(error => {
                throw Error(error);
            });


    });//encrypt
   
	/*UserList.post(newUser)
		.then( user => {
			
			return res.status( 201 ).json({
				message : "User added to the list",
				status : 201,
				user : user
			});
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
	*/

});




//login
app.post('/api/login', jsonParser, (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    passport.authenticate('local', function (err, username, info) {
        //onsole.log('here xx');

        //var token;
        if (err) {
            console.log(err);
            return res.status(401).json(err);
        }
        // If a user is found
        if (username) {
            console.log('here');
            sess = req.session;
            sess.username = username.username;
          //  res.setHeader('Content-Type', 'text/html');
           // res.write('<p>username: ' + sess.username+'</p>');
            //res.end('done');
          //  token = user.generateJwt();
           return res.status(200).json(
                username
            //    "token": token
            );
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res, next);
	
	
});

//logout
app.get('/api/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        
        return res.status(200).json(sess.username); 
    });

});
app.put( "/api/updateUser/:username",jsonParser, ( req, res, next ) =>{
	let username = req.params.username;
	let usernamebdy = req.body.username;
    let password = req.body.password;
	let country = req.body.country;
	let business = req.body.business;
    var element = { username: usernamebdy, password: password, country: country, business: business};
	
	UserList.put(username, element )
		.then( user => {
			return res.status( 200 ).json( user );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
});


app.post("/api/createSolution",jsonParser, (req,res,next) => {
	let title = req.body.title;
	let author = req.body.author;
	let description = req.body.description;
	let grade = req.body.grade;
	let gradenum = req.body.gradenum;
	let counteraccess = req.body.counteraccess;
	let lastuseraccess = req.body.lastuseraccess;
	var imgpath = req.body.imgpath;
	let id = uuid();
	let Images = {};
	
	
	
	
	Images.data = fs.readFileSync(imgpath);
	Images.contentType = 'image/png';
    var imgcontType;
	
    let newSolution = {
        title,
        author,
        description,
        grade,
        gradenum,
        counteraccess,
        lastuseraccess,
        id,
        Images

    };
	SolutionList.post(newSolution)
		.then( solution => {
			
			return res.status( 201 ).json({
				message : "User added to the list",
				status : 201,
				solution : solution
			});
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
	
	
	
});
app.get( "/api/solutionslist", ( req, res, next ) => {
	SolutionList.get()
		.then( solution => {
			return res.status( 200 ).json( solution );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
});

app.get( "/api/getSolution", jsonParser,( req, res, next ) =>{
	let title = req.body.title;
	let author  = req.body.author;
	let id = req.body.id;

	SolutionList.getsolution(title, author, id)
		.then( solution => {
			return res.status( 200 ).json( solution );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
});

app.put( "/api/updateSolution/:id",jsonParser, ( req, res, next ) =>{
	let id = req.params.id;
	let title = req.body.title;
	let author = req.body.author;
	let description  = req.body.description;
	let grade = req.body.grade;
	let gradenum = req.body.gradenum;
	let counteraccess = req.body.counteraccess;
	let lastuseraccess = req.body.lastuseraccess;
	var element = {title: title, author: author, description: description, grade: grade, gradenum: gradenum, counteraccess: counteraccess, lastuseraccess: lastuseraccess};
	
	SolutionList.put(id, element )
		.then( user => {
			return res.status( 200 ).json( user );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
});


app.get( "/api/getSolutionAuthor", ( req, res, next ) =>{
	let author  = req.query.author;


	SolutionList.getsolutionbyauthor(author)
		.then( solution => {
			return res.status( 200 ).json( solution );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
});

app.delete( "/api/deleteSolution",( req, res, next ) =>{
		let id = req.query.id;
	
	SolutionList.DELETE(id)
		.then( solution => {
			return res.status( 200 ).json( solution );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
		});
});

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				});
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer(PORT, DATABASE_URL)
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };















