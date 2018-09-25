var express = require('express');
var router = express.Router();
var db = require('../database');
var Joi = require('joi');
var filter = require('../lib/filter');

const schemaPerson = Joi.object().keys({
	name: Joi.string().required(),
	phone: Joi.string().required(),
	email: Joi.string().required(),
	documentNumber: Joi.string().required(),
	birthDate: Joi.number().required(),
	mothersName: Joi.string().required()
});

router.get('/', (req, res, next) => {
	let filters = filter.catchParams('persons', 'p', req.query);
	let query = `FOR p IN persons ${filters} RETURN p`;
	db.query(query)
		.then((cursor) => {
			cursor.all()
			.then((result) => res.status(200).send(result))
			.catch((error) => {
				console.log(`Router Persons - GET /persons failed: ${error}`);
				res.status(500).send(`Server Interval Error`);
			});
		})
		.catch((error) => {
			console.log(`Router Persons - GET /persons failed: ${error}`);
			res.status(500).send(`Server Interval Error`);
		});
});

router.get('/:id', (req, res, next) => {
	let key = req.params.id;
	db.query(`FOR p IN persons FILTER p._id == @idPerson RETURN p`, { idPerson: `persons/${key}`})
	.then((cursor) => {
		cursor.all()
		.then((result) => res.status(200).send(result[0]))
		.catch((error) => {
			console.log(`Router Persons - GET /persons/:id failed: ${error}`);
			res.status(500).send(`Server Interval Error`);	
		});
	})
	.catch((error) => {
		console.log(`Router Persons - GET /persons/:id failed: ${error}`);
		res.status(500).send(`Server Interval Error`);
	});
});

router.get('/:id/users', (req, res, next) => {
	let key = req.params.id;
	db.query(`FOR u IN ANY @idPerson hasPersonUser RETURN u`, { idPerson: `persons/${key}`})
	.then((cursor) => {
		cursor.all()
		.then((result) => res.status(200).send(result))
		.catch((error) => {
			console.log(`Router Persons - GET /persons/:id/users failed: ${error}`);
			res.status(500).send(`Server Interval Error`);
		});
	})
	.catch((error) => {
		console.log(`Router Users - GET /persons/:id/users failed: ${error}`);
		res.status(500).send(`Server Interval Error`);
	});
});

router.post('/', (req, res, next) => {
	let body = req.body;
	const validate = Joi.validate(body, schemaPerson);
	if (validate.error) {
		res.status(400).send(validate.error.toString());
	} else {
		db.query(`INSERT @body INTO persons RETURN NEW`, { body: body })
		.then((cursor) => {
			cursor.all().then((result) => res.status(200).send(result))
			.catch((error) => {
				console.log(`Router Persons - POST /persons failed: ${error}`);
				res.status(500).send(`Server Interval Error`);				
			});
		})
		.catch((error) => {
			console.log(`Router Persons - POST /persons failed: ${error}`);
			res.status(500).send(`Server Interval Error`);
		});
	}
});

router.put('/:id', (req, res, next) => {
	let body = req.body;
	let key = req.params.id;
	const validate = Joi.validate(body, schemaPerson);
	if (validate.error) {
		res.status(400).send(validate.error.toString());
	} else {
		db.query(`UPDATE { _key: @idPerson } WITH @body INTO persons RETURN NEW`, { idPerson: key, body: body})
		.then((cursor) => {
			cursor.all().then((result) => res.status(200).send(result))
			.catch((error) => {
				console.log(`Router Persons - PUT /persons/:id failed: ${error}`);
				res.status(500).send(`Server Interval Error`);		
			});
		})
		.catch((error) => {
			console.log(`Router Persons - PUT /persons/:id failed: ${error}`);
			res.status(500).send(`Server Interval Error`);
		});
	}
});

module.exports = router;