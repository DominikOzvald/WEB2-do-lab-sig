function drawStudents(students) {
	const container = document.getElementsByClassName("student-container")[0];
	container.innerHTML = "";
	students.forEach((student) => {
		const p = document.createElement("p");
		p.innerText = JSON.stringify(student);
		container.appendChild(p);
	});
}
function isValidGrade(grade) {
	const parsedGrade = parseInt(grade);
	return !isNaN(parseInt(parsedGrade)) && parsedGrade > 1 && parsedGrade < 6;
}

async function submitGrade() {
	const isSafe = document.getElementById("sql-check").checked;
	const grade = document.getElementById("sql-input").value;

	let students = [];
	let isValid = true;
	if (isSafe) isValid = isValidGrade(grade);

	if (isValid) {
		const response = await axios.post("students", { isSafe: isSafe, grade: grade });
		students = response.data.students;
	} else document.getElementById("sql-input").value = "";

	if (isSafe && isValid) document.getElementById("sql-input").value = parseInt(grade);

	drawStudents(students);
}

window.onload = async () => {
	document.getElementById("btnSql").addEventListener("click", submitGrade);
};
