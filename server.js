
let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let multer = require ('multer');
let uuid = require('uuid/v4');
let fs = require('fs');
let { UserList } = require('./model');
let { SolutionList } = require('./model');
const { DATABASE_URL, PORT } = require('./config');


let app = express();
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use( express.static( "public" ) );

app.use( morgan( "dev" ) );

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
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.post( "/api/postuser", jsonParser, ( req, res, next ) => {
	let username = req.body.username;
	let passwd  = req.body.passwd;
	let country = req.body.country;
	let business = req.body.business;
	let lldate = req.body.lldate;
    var level = 0;
	//var Solution = {};
	let newUser = {
		username,
		passwd,
		level,
		lldate,
		country,
		business
		//Solution
	}
	var i;
			for(i in usersaux)
			{
				if(newUser.username == usersaux[i].username)
					return res.status( 400 ).json({
							status : 400,
							message : "User name already exists"
						})
				
			}
	UserList.post(newUser)
		.then( user => {
			
			return res.status( 201 ).json({
				message : "User added to the list",
				status : 201,
				user : user
			});
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
	/*
	if ( ! name || ! id ){
		res.statusMessage = "Missing field in body!";
		return res.status( 406 ).json({
			message : "Missing field in body!",
			status : 406
		});
	}

	for( let i = 0; i < students.length; i ++ ){
		if ( id == students[i].id ){
			res.statusMessage = "Repeated identifier, cannot add to the list.";

			return res.status( 409 ).json({
				message : "Repeated identifier, cannot add to the list.",
				status : 409
			});
		}
	}

	let newStudent = {
		id : id,
		name : name
	};

	students.push( newStudent );

	return res.status( 201 ).json({
		message : "Student added to the list",
		status : 201,
		student : newStudent
	});
	*/

});

app.get( "/api/getUser", jsonParser,( req, res, next ) =>{
	let username = req.body.username;
	let passwd  = req.body.passwd;

	UserList.getuser(username, passwd)
		.then( user => {
			return res.status( 200 ).json( user );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
	
	
	// if ( !id ){
		// res.statusMessage = "Missing 'id' field in params!";
		// return res.status( 406 ).json({
			// message : "Missing 'id' field in params!",
			// status : 406
		// });
	// }

	// for( let i = 0; i < students.length; i ++ ){
		// if ( id == students[i].id ){
			// return res.status( 202 ).json({
				// message : "Student found in the list",
				// status : 202,
				// student : students[i]
			// });
		// }
	// }

	// res.statusMessage = "Student not found in the list.";

	// return res.status( 404 ).json({
		// message : "Student not found in the list.",
		// status : 404
	// });

});


app.put( "/api/updateUser/:username",jsonParser, ( req, res, next ) =>{
	let username = req.params.username;
	let usernamebdy = req.body.username;
	let passwd  = req.body.passwd;
	let country = req.body.country;
	let business = req.body.business;
	var element = {username: usernamebdy, passwd: passwd, country: country, business: business};
	
	UserList.put(username, element )
		.then( user => {
			return res.status( 200 ).json( user );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
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
	var imgcontType
	
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
		
	}
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
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
	
	
	
});
app.get( "/api/solutionslist", ( req, res, next ) => {
	SolutionList.get()
		.then( solution => {
			return res.status( 200 ).json( solution );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
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
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
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
	let 
	var element = {title: title, author: author, description: description, grade: grade, gradenum: gradenum, counteraccess: counteraccess, lastuseraccess: lastuseraccess};
	
	SolutionList.put(id, element )
		.then( user => {
			return res.status( 200 ).json( user );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
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
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
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
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
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
				})
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















