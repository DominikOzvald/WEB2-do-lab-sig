import { Router, Request, Response } from "express";
import { getStudentsByGrade, getUser, changePassword } from "../services/service";
import { checkUser, setUser, setAndCheckCSRFToken, checkValidUser } from "../middleware/middleware";
const router = Router();
let isCSRFSafe = false;
let globalPassword = "123";

router.get("/", function (req: Request, res: Response) {
	const username = checkUser(req);
	const token = setAndCheckCSRFToken(req);
	res.render("index", { isCSRFSafe, username, token });
});

router.post("/students", async function (req: Request, res: Response) {
	let students = [];
	if (req.body.isSafe) {
		const grade = parseInt(req.body.grade);
		if (!isNaN(grade) && grade > 1 && grade < 6) {
			students = await getStudentsByGrade(grade);
		}
	} else {
		students = await getStudentsByGrade(req.body.grade);
	}
	res.status(200).send({ students: students });
});
router.post("/login", async function (req: Request, res: Response) {
	const username = req.body.username;
	const password = req.body.password;
	const user = await getUser(username, password);
	if (user) {
		setUser(req, user.id_user as string, username);
		const token = setAndCheckCSRFToken(req);
		res.status(200).send({ CSRFToken: token });
	} else {
		res.status(400).send();
	}
});

router.get("/change", async function (req: Request, res: Response) {
	const token = req.query.token as string;
	const newPassword = req.query.newPassword as string;
	const controlPassword = req.query.controlPassword as string;

	if (checkValidUser(req, isCSRFSafe, token ? token : "") && newPassword === controlPassword) {
		const changed = await changePassword(req.session.user?.id as string, newPassword);
		if (changed) res.sendStatus(200);
		else res.status(500).send({ message: "error changing password" });
	} else res.sendStatus(400);
});

router.post("/logout", function (req: Request, res: Response) {
	req.session.destroy((err) => {
		if (err) return res.status(500).send();
		res.clearCookie("connect.sid");
		return res.status(200).send();
	});
});

router.post("/CSRF/toggle", function (req: Request, res: Response) {
	isCSRFSafe = !isCSRFSafe;
	res.status(200).send();
});

router.post("/verify", async function (req: Request, res: Response) {
	if (checkValidUser(req, isCSRFSafe, req.session.CSRFToken)) {
		const password = req.body.password;
		const username = req.session.user?.username;
		const user = await getUser(username as string, password);
		if (user) {
			res.status(200).send({ message: "Valid password" });
		} else {
			res.status(200).send({ message: "Invalid password" });
		}
	} else res.sendStatus(400);
});

export default router;
