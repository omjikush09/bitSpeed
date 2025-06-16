import express from "express";
import { config } from "dotenv";
const app = express();
const PORT = process.env.PORT || 8000;
import contactRouter from "./contacts/contact.route";

config({ path: ".env" });
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.use("/identity", contactRouter);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
