import express from "express";

const app = express();
const PORT = process.env.PORT || 8000;
import contactRouter from "./contacts/contact.route";

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.use(express.json());
app.use("/identity", contactRouter);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
