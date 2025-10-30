import { Pool } from "pg";

const connection = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
	ssl: process.env.DB_HOST == "localhost" ? false : { rejectUnauthorized: false },
});

async function getStudentsByGrade(grade: number | string) {
	try {
		const query = `SELECT * FROM student WHERE final_grade = ${grade}`;
		const result = await connection.query(query);
		return result.rows;
	} catch (err) {
		return [];
	}
}

export { getStudentsByGrade };
