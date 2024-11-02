const NewBook = require("../server/models/newbook");
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
var path = require('path');
// To connect with your mongoDB database
const mongoose = require('mongoose');

const connectToMongo = async () => {
	await mongoose.connect('mongodb://localhost:27017/BookDB');
	console.log("Connected to MongoDB");
};

connectToMongo();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", async (req, resp) => {
	resp.send("App is Working");	
});


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

app.post('/adminaddbook', upload.single('image'),  async (req, res, next) => {
	const { filepath, mimetype } = req.file;
	console.log("Image : ", req.file)
	var obj = {
		bname: req.body.bname,
		btype: req.body.btype,
		quantity: req.body.quantity,
		price: req.body.price,
		details: req.body.details,
		imagename: req.file.filename,
        file_mimetype: mimetype,
		image: {data: fs.readFileSync(path.join(__dirname + '/files/' + req.file.filename)),contentType: 'mimetype'},
	}	
	try {
		const obj1 = new NewBook(obj);
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


// Importing routes
const contact = require('./routes/contact');
const newbook = require('./routes/newbook');
const newstaff = require('./routes/newstaff');
const newuser = require('./routes/newuser');
const newcart = require('./routes/newcart');

// Using routes
app.use("/api/contact", contact);
app.use("/api/newbook", newbook);
app.use("/api/newstaff", newstaff);
app.use("/api/newuser", newuser);
app.use("/api/newcart", newcart);

app.listen(5000);