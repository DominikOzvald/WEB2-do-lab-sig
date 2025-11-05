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
	return !isNaN(parseInt(parsedGrade)) && parsedGrade > 1 && parsedGrade < 6 && grade.trim().length < 2;
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
	} else {
		document.getElementById("sql-input").value = "";
	}

	drawStudents(students);
}
function drawToggleCSRFSafety() {
	let toggleButton = document.getElementById("btnCSRF");
	toggleButton.value = toggleButton.value == "Uključi ranjivost" ? "Isključi ranjivost" : "Uključi ranjivost";
}

async function toggleCSRF() {
	const result = await axios.post("CSRF/toggle");
	if (result.status == 200) drawToggleCSRFSafety();
}

function drawLoggedInState() {
	Array.from(document.getElementsByClassName("visible-logged-out")).forEach((elemnt) => {
		elemnt.hidden = true;
	});
	Array.from(document.getElementsByClassName("visible-logged-in")).forEach((elemnt) => {
		elemnt.hidden = false;
	});
	document.getElementById("warning").hidden = true;
}
function drawWraning() {
	document.getElementById("CSRF-login-username").value = "";
	document.getElementById("CSRf-login-password").value = "";
	document.getElementById("warning").hidden = false;
}

function drawLoggedOutState() {
	Array.from(document.getElementsByClassName("visible-logged-out")).forEach((elemnt) => {
		elemnt.hidden = false;
	});
	Array.from(document.getElementsByClassName("visible-logged-in")).forEach((elemnt) => {
		elemnt.hidden = true;
	});
	Array.from(document.getElementsByClassName("cleanable-value")).forEach((elemnt) => {
		elemnt.value = "";
	});
	document.getElementById("show-username").innerText = "";
	document.getElementById("change-password-status").innerText = "";
	document.getElementById("password-verify-status").innerText = "";
}

async function login() {
	const username = document.getElementById("CSRF-login-username").value;
	const password = document.getElementById("CSRf-login-password").value;
	try {
		const result = await axios.post("login", { username: username, password: password });
		drawLoggedInState();
		const CSRFToken = result.data.CSRFToken;
		document.getElementById("CSRF-token-input").value = CSRFToken;
		document.getElementById("show-username").innerText = username;
	} catch {
		drawWraning();
	}
}

async function logout() {
	const result = await axios.post("logout");
	if (result.status == 200) {
		drawLoggedOutState();
	}
}

async function changePassword() {
	const newPassword = document.getElementById("CSRF-change-password").value;
	const controlPassword = document.getElementById("CSRF-change-control-password").value;
	const token = document.getElementById("CSRF-token-input").value;
	try {
		const result = await axios.get("change", {
			params: {
				newPassword: newPassword,
				controlPassword: controlPassword,
				token: token,
			},
		});
		if (result.status == 200) {
			document.getElementById("change-password-status").innerText = "Password changed successfully";
			document.getElementById("change-password-status").style.color = "green";
		}
	} catch {
		document.getElementById("change-password-status").innerText = "Passwords must match";
		document.getElementById("change-password-status").style.color = "orange";
	}
}

async function verifyPassword() {
	const password = document.getElementById("CSRF-verify-password").value;
	try {
		const result = await axios.post("verify", { password: password });
		if (result.data.message == "Valid password") {
			document.getElementById("password-verify-status").innerText = "Valid password";
			document.getElementById("password-verify-status").style.color = "green";
		} else {
			document.getElementById("password-verify-status").innerText = "Invalid password";
			document.getElementById("password-verify-status").style.color = "orange";
		}
	} catch {}
}

window.onload = async () => {
	document.getElementById("btnSql").addEventListener("click", submitGrade);
	document.getElementById("btnCSRF").addEventListener("click", toggleCSRF);
	document.getElementById("btn-CSRF-login").addEventListener("click", login);
	document.getElementById("btn-CSRF-logout").addEventListener("click", logout);
	document.getElementById("btn-CSRF-change").addEventListener("click", changePassword);
	document.getElementById("btn-verify-password").addEventListener("click", verifyPassword);
};
