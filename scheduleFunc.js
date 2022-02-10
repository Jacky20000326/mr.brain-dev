const express = require("express");
const app = express();
const port = process.env.PORT || 3002;

app.get("/", (req, res) => {
	console.log("Hello");
});

app.listen(port, () => {
	console.log(`${port}`);
});
