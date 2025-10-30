import { Router, Request, Response } from "express";
import { getStudentsByGrade } from "../services/service";
const router = Router();

router.get("/", function (req: Request, res: Response) {
	res.render("index");
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

export default router;
