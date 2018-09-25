var express = require('express');
var router = express.Router();
var db = require('../database');
var Joi = require('joi');
var bcrypt = require('bcryptjs');
var filter = require('../lib/filter');

const schemaNewUser = Joi.object().keys({
	idPerson: Joi.string().required(),
	username: Joi.string().required(),
	password: Joi.string().required(),
	status: Joi.boolean().required(),
	isOnline: Joi.boolean().required()
});

const schemaUpdateUser = Joi.object().keys({
	username: Joi.string().required(),
	password: Joi.string().required(),
	status: Joi.boolean().required(),
	isOnline: Joi.boolean().required()
});

router.get('/', (req, res, next) => {
	let filters = filter.catchParams('users', 'u', req.params);
	let query = `FOR u IN users ${filters} RETURN u`;
	db.query(query)
		.then((cursor) => {
			cursor.all()
			.then((result) => res.status(200).send(result))
			.catch((error) => {
				console.log(`Router Users - GET /users failed: ${error}`);
				res.status(500).send(`Server Interval Error`);
			});
		})
		.catch((error) => {
			console.log(`Router Users - GET /users failed: ${error}`);
			res.status(500).send(`Server Interval Error`);
		});
});

router.get('/:id', (req, res, next) => {
	let key = req.params.id;
	db.query(`FOR u IN users FILTER u._id == @idUser RETURN u`, { idUser: `users/${key}`})
	.then((cursor) => {
		cursor.all()
		.then((result) => res.status(200).send(result[0]))
		.catch((error) => {
			console.log(`Router Users - GET /users/:id failed: ${error}`);
			res.status(500).send(`Server Interval Error`);	
		});
	})
	.catch((error) => {
		console.log(`Router Users - GET /users/:id failed: ${error}`);
		res.status(500).send(`Server Interval Error`);
	});
});

router.get('/:id/persons', (req, res, next) => {
	let key = req.params.id;
	db.query(`FOR p IN ANY @idUser hasPersonUser RETURN p`, { idUser: `users/${key}`})
	.then((cursor) => {
		cursor.all()
		.then((result) => res.status(200).send(result))
		.catch((error) => {
			console.log(`Router Users - GET /users/:id/persons failed: ${error}`);
			res.status(500).send(`Server Interval Error`);
		});
	})
	.catch((error) => {
		console.log(`Router Users - GET /users/:id/persons failed: ${error}`);
		res.status(500).send(`Server Interval Error`);
	});
});

router.post('/', (req, res, next) => {
	let body = req.body;
	const validate = Joi.validate(body, schemaNewUser);
	if (validate.error) {
		res.status(400).send(validate.error.toString());
	} else {
		let keyPerson = body.idPerson;
		delete body.idPerson;
		body.password = bcrypt.hashSync(body.password, 8);
		db.query(`FOR p IN persons FILTER p._id == @idPerson RETURN p`, { idPerson: `persons/${keyPerson}`})
		.then((cursor) => {
			cursor.all().then((result) => {
				if (result[0] !== undefined) {
					db.query(`INSERT @body INTO users LET userAdded = NEW
					INSERT { _from: @idPerson, _to: userAdded._id } INTO hasPersonUser
					RETURN userAdded`, { body: body, idPerson: result[0]._id})
					.then((cursor) => {
						cursor.all().then((result) => res.status(200).send(result))
						.catch((error) => {
							console.log(`Router Users - POST /users failed: ${error}`);
							res.status(500).send(`Server Interval Error`);				
						});
					})
					.catch((error) => {
						console.log(`Router Users - POST /users failed: ${error}`);
						res.status(500).send(`Server Interval Error`);	
					});
				} else {
					res.status(404).send(`Person not found`);	
				}
			})
			.catch((error) => {
				console.log(`Router Users - POST /users failed: ${error}`);
				res.status(500).send(`Server Interval Error`);	
			});
		})
		.catch((error) => {
			console.log(`Router Users - POST /users failed: ${error}`);
			res.status(500).send(`Server Interval Error`);
		});
	}
});

router.put('/:id', (req, res, next) => {
	let body = req.body;
	let key = req.params.id;
	const validate = Joi.validate(body, schemaUpdateUser);
	if (validate.error) {
		res.status(400).send(validate.error.toString());
	} else {
		db.query(`UPDATE { _key: @idUser } WITH @body INTO users RETURN NEW`, { idUser: key, body: body})
		.then((cursor) => {
			cursor.all().then((result) => res.status(200).send(result))
			.catch((error) => {
				console.log(`Router Users - PUT /users/:id failed: ${error}`);
				res.status(500).send(`Server Interval Error`);		
			});
		})
		.catch((error) => {
			console.log(`Router Users - PUT /users/:id failed: ${error}`);
			res.status(500).send(`Server Interval Error`);
		});
	}
});

module.exports = router;