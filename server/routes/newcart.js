const express = require("express");
const NewObject = require("../models/newcart");
const newcart = require("../models/newcart");
const app = express.Router();

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

app.get("/getbyuserid/:userid", async (req, resp) => {
	console.log("UserId : ", req.params.userid);
	const data = await NewObject.find();
	let searchdata = []
	let searchtext = req.params.searchtext
	for (const key in data) {
		if (data[key]['userid']==req.params.userid) {
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
			console.log("Data Found");
			console.log("Book : ", obj.toObject());
			resp.send(obj.toObject());
		}
	} catch (e) {
		resp.send("Something Went Wrong");
	}
});

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

app.put('/paymentdone/:userid/:ids', (req, res, next) => {
	console.log("User Id : ",req.params.userid);
	console.log("Ids : ",req.params.ids);

	let ids = req.params.ids.split(",")
	console.log("Ids : ",ids, " Length : ", ids.length);
	for (let i=0; i<ids.length; i++)
	{
		const new_cart = new newcart({
			'paymentstatus': 'PaymentDone',
			'_id': ids[i],
		});
		console.log("New Cart : ", new_cart)
		newcart.updateOne({ _id: ids[i] }, new_cart).then(
			() => {
				console.log("Payment updated successfully!")
			}
		).catch(
			(error) => {
				res.status(400).json({
					error: error
				});
				console.log("Error : ", error)
			}
		);
	}
	res.status(201).json({
		message: 'Payment updated successfully!'
	});
	/*const newexam = new NewExam({
		'compname': req.body.compname,
		'compid': req.body.compid,
		'recruitted': 'Yes',
		'_id': req.params.id,
	});
	console.log("Exam Id : ", req.params.id)
	console.log("Exam Details : ", newexam.toObject())
	NewExam.updateOne({ _id: req.params.id }, newexam).then(
		() => {
			console.log("Recruitment updated successfully!")
			res.status(201).json({
				message: 'Recruitment updated successfully!'
			});
		}
	).catch(
		(error) => {
			res.status(400).json({
				error: error
			});
		}
	);*/
});
/*
app.post("/paymentdone/:userid", async (req, resp) => {
	try {
		console.log("Body : ", req.body);
		console.log("User Id : ",req.params.userid);
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
module.exports = app;