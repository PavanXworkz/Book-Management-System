const express = require("express");
const NewObject = require("../models/newbook");
const app = express.Router();
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
var path = require('path');


app.get("/get", async (req, resp) => {
	const data = await NewObject.find();
	resp.json(data);
});

app.get("/searchbook/:searchtext", async (req, resp) => {
	console.log("Book Text : ", req.params.searchtext);
	const data = await NewObject.find();
	let searchdata = []
	let searchtext = req.params.searchtext
	for (const key in data) {
		if (data[key]['bname'].includes(searchtext) ||
			data[key]['btype'].includes(searchtext)) {
			searchdata.push(data[key])
		}
	}
	console.log("Search Data : ", searchdata)
	resp.json(searchdata);
});

app.get("/get/:id", async (req, resp) => {
	try {
		console.log("Book Id : ",req.params.id);
		let obj = await NewObject.findOne({ "_id": req.params.id});
		console.log("Book : ", obj);
		if (obj===null) {
			console.log("Data Not Found");
			let res = {};
			console.log("Result : ", res);
            resp.send(res);
        }
		else{
			console.log("Book Data Found");
			console.log("Book : ", obj.toObject());
			resp.send(obj.toObject());
		}
	} catch (e) {
		resp.send("Something Went Wrong");
	}
});

/*
app.post("/add", async (req, resp) => {
	try {
		console.log("Body : ", req.body);
		const obj = new NewObject(req.body);
		let result = await obj.save();
		result = result.toObject();
		console.log("Result : ", result);
		if (result) {
			resp.send(req.body);
			console.log(result);
			console.log("Data Inserted Success");
		}
	} catch (e) {
		resp.send("Something Went Wrong");
	}
});
*/


const multer = require('multer');
const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, './files');			
		},
		filename(req, file, cb) {
			cb(null, `${new Date().getTime()}_${file.originalname}`);
		}
	}),
	limits: {
		fileSize: 1000000 // max file size 1MB = 1000000 bytes
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
			return cb(
				new Error(
					'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
				)
			);
		}
		cb(undefined, true); // continue with upload
	}
});

app.post('/add', upload.single('image'),  async (req, res, next) => {
	const { filepath, mimetype } = req.file;
	console.log("Image : ", req.file)
	var obj = {
		bname: req.body.bname,
		btype: req.body.btype,
		quantity: req.body.quantity,
		price: req.body.price,
		detail: req.body.details,
		imagename: req.file.filename,
        file_mimetype: mimetype,
		image: {data: fs.readFileSync(path.join(__dirname + './files/' + req.file.filename)),contentType: 'mimetype'},
	}	
	try {
		const obj1 = new NewObject(obj);
		let result = await obj1.save();
		result = result.toObject();
		console.log("Result : ", result);
		if (result) {
			resp.send(req.body);
			console.log(result);
			console.log("Data Inserted Success");
		}
	} catch (e) {
		res.send("Something Went Wrong");
	}
});

module.exports = app;