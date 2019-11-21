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
let { Solution } = require('./model');
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
    if (req.session.username){
		User.find({username: req.session.username})
		.then(user => {
        return res.status(200).json(user);
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).json({
                status: 500,
                message: "Something went wrong with the DB. Try again later."
            });
			
		});
		
	}
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
	let d = Date();
	let lldate = d.toString();
	//	console.log("fecha es " + lldate);
    passport.authenticate('local', function (err, username, info) {
        //onsole.log('here xx');
	
		
        //var token;
        if (err) {
            console.log(err);
            return res.status(401).json(err);
        }
        // If a user is found
        if (username) {
         //   console.log('here');
            sess = req.session;
            sess.username = username.username;
          //  res.setHeader('Content-Type', 'text/html');
           // res.write('<p>username: ' + sess.username+'</p>');
            //res.end('done');
          //  token = user.generateJwt();
		  var uUser = { 
		  lldate: lldate
		  
		  };
		 // console.log(username);
		  
		  User.findOneAndUpdate({ username: username.username }, uUser, { new: true })
            .then(user => {
                console.log(user);
            })
            .catch(error => {
                throw Error(error);
            });
			
			
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
app.put( "/api/updateUser",jsonParser, ( req, res, next ) =>{
	//let username = req.params.username;
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


app.put( "/api/addUserFav/:username",jsonParser, ( req, res, next ) =>{
	let username = req.params.username;
	let addid = req.body.nid;
	let solut = [];
	let nsol = 0;
	var loop=0;
	var element;
	User.findOne({username : username})
		.then(user => {
			
			solut[0] = user.SolutionOne;
			 solut[1] = user.SolutionTwo;
			 solut[2] = user.SolutionThree;
			 //console.log(addid);
			 Solution.findOne({_id: addid})
				.then( solution =>  {
						//console.log(solution._id);
						let solutionid = solution._id;	
					 
					 if(!solut[0] || solut[0] ==="" ){
						// nsol = 1;
						 element = { SolutionOne : { _id : solutionid} };
					 }
					 else if (!solut[1] || solut[1] ===""){
						 //nsol = 2;
						 element = { SolutionTwo : { _id : solutionid} };
					 }
					 else{
						 //nsol = 3;
						 element = { SolutionThree : { _id : solutionid} };
					 }
					 console.log(element);
					 User.findOneAndUpdate({ username: username }, element, { new: true })
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
			})
			.catch(error => {
						res.statusMessage = "Something went wrong with the solution search. Try again later.";
						return res.status(500).json({
							status: 500,
							message: "Something went wrong with the solution search. Try again later."
						});
				});
		})
		.catch(error => {
			throw Error(error)
		});
		
		
    
	
	
});



app.post("/api/createSolution",jsonParser, (req,res,next) => {
	let title = req.body.title;
	let author = req.body.author;
	let description = req.body.description;
	//let grade = req.body.grade;
	//let gradenum = req.body.gradenum;
	let counteraccess = 0;
	let lastuseraccess = "";
	let imageOne = req.body.imageOne;
	
	grade = 10;
	gradenum = 1;
	//var imgpath = req.body.imgpath;
	let id = uuid();
	//console.log(imageOne);
	
	
	
	let newSolution = {
        title,
        author,
        description,
        grade,
        gradenum,
        counteraccess,
        lastuseraccess,
        id,
        imageOne

    };
	SolutionList.post(newSolution)
		.then( solution => {
			
			return res.status( 201 ).json({
				message : "New Solution Added",
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
	
	var element = {title: title, author: author, description: description};
	console.log(element);
	SolutionList.put(id, element )
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


app.put( "/api/gradeSolution/:id",jsonParser, ( req, res, next ) =>{
	let id = req.params.id;
	let grade = parseInt(req.body.grade);
	let gradenum;
	//let gradenum = req.body.gradenum;
	//let counteraccess = req.body.counteraccess;
	///let lastuseraccess = req.body.lastuseraccess;
	//var element = {grade: grade, grade};
	console.log(grade);
	console.log(id);
	Solution.findOne({_id:id})
		.then(solution => {
			console.log(solution.grade);
			grade = solution.grade + grade;
			gradenum = solution.gradenum+1;
			let element = {
				grade : grade,
				gradenum : gradenum
		
			}
	console.log(element);
	SolutionList.put(id, element )
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
		})
		.catch(error => {
			throw Error(error)
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

app.get( "/api/findOneSolution",( req, res, next ) =>{
		let id = req.query.id;
	
	Solution.findOne({_id : id})
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

app.delete( "/api/deleteSolution/:id",( req, res, next ) =>{
		let id = req.params.id;
	
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















