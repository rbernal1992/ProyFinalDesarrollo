let mongoose = require('mongoose');

mongoose.Promise = global.Promise;


let imageSchema = mongoose.Schema({
	img:{
		data: { type: Buffer},
		contentType: {type: String}
		
	}
	
});
let Images = mongoose.model('Images', imageSchema);
let solutionSchema = mongoose.Schema({
	title:	{ type: String },
	author: { type: String },
	description: { type: String },
	datecreated: { type: String }, 
	grade : { type : Number } ,
	gradenum: { type: Number },
	counteraccess: { type: Number },
	lastuseraccess: { type: String },
	id: {type: String },
	Images: {
		data:{ type: Buffer},
		contentType: {type:String}
		
		
	}
	
});
let Solution = mongoose.model( 'Solution', solutionSchema );
let userSchema = mongoose.Schema({
	username:	{ type: String },
	passwd: { type: String },
	level: { type: Number }, 
	lldate : { type: String },
	country: { type: String },
	business: { type: String },
	Solution: {type: mongoose.Schema.Types.ObjectId,
	Ref: 'Solution'}
});
let User = mongoose.model( 'User', userSchema );





let UserList = {
	get : function(){
		return User.find()
				.then( users => {
					return users;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	post : function( newUser ){
		return User.create(newUser)
				.then(user => {
					return user;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	getuser : function(username, passwd){
		return User.findOne({username: username, passwd: passwd})
				.then( user => {
					return user;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	put : function(username, uUser){
		return User.findOneAndUpdate({username:username}, uUser, {new:true})
				.then( user => {
					return user;
				})
				.catch( error => {
					throw Error(error);
				});
	}
	/*DELETE: function(id){
		return Student.findOneAndRemove({id:id})
				.then( student => {
					return student;
				})
				.catch( error => {
					throw Error(error);
				});
		
	},*/
}

let SolutionList = {
	get : function(){
		return Solution.find()
				.then( solutions => {
					return solutions;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	post : function( newSolution ){
		return Solution.create(newSolution)
				.then( solution => {
					return solution;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	getsolution : function(title, author, id){
		return Solution.findOne({title: title, author: author, id: id})
				.then( solution => {
					return solution;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	getsolutionbyauthor : function(author){
		return Solution.find({author: author})
				.then( solution => {
					return solution;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	put : function(id, uSolution){
		return Solution.findOneAndUpdate({id:id}, uSolution, {new:true})
				.then( solution => {
					return solution;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	
	DELETE: function(id){
		return Solution.findOneAndRemove({id:id})
				.then( student => {
					return student;
				})
				.catch( error => {
					throw Error(error);
				});
		
	}
	
	
	
	
}

module.exports = { UserList, SolutionList };


