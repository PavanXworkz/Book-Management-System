const express = require("express");
const NewObject = require("../models/contact");
const app = express.Router();

app.get("/getcontacts", async (req, resp) => {
	const data = await NewObject.find();
	resp.json(data);
});

app.post("/addcontact", async (req, resp) => {
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
module.exports = app;