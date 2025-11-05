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

async function getUser(username: string, password: string) {
	try {
		const query = "SELECT id_user,username FROM logged_user where username=$1 and password=$2";
		const result = await connection.query(query, [username, password]);
		return result.rows[0];
	} catch {
		return undefined;
	}
}

async function changePassword(userId: string, password: string) {
	try {
		const query = "UPDATE logged_user SET password=$1 WHERE id_user=$2";
		await connection.query(query, [password, parseInt(userId)]);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
}
export { getStudentsByGrade, getUser, changePassword };
