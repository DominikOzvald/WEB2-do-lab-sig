import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import path from "path";
import http from "http";
import routes from "./routes/routes";

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.json());

const baseURL = process.env.RENDER_EXTERNAL_URL ? process.env.RENDER_EXTERNAL_URL : process.env.BASE_URL;
const port = parseInt(process.env.PORT as string);

app.use("/", routes);

if (process.env.RENDER_EXTERNAL_URL) {
	const hostname = "0.0.0.0";
	app.listen(port, hostname, () => {
		console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${baseURL}`);
	});
} else {
	http.createServer(app).listen(port, () => {
		console.log(`Server running at ${baseURL}/`);
	});
}
