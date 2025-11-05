import { Express } from "express";
import session from "express-session";
import { Request } from "express";
import { randomBytes } from "crypto";

declare module "express-session" {
	interface SessionData {
		user?: {
			id: string;
			username: string;
		};
		CSRFToken?: string;
	}
}

function initSession(app: Express) {
	app.use(
		session({
			secret: process.env.SESSION_SECRET as string,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24,
				httpOnly: true,
				secure: false,
			},
		})
	);
}

function checkUser(req: Request) {
	if (req.session.user) {
		return req.session.user.username;
	} else return undefined;
}

function setUser(req: Request, id: string, username: string) {
	req.session.user = {
		id: id,
		username: username,
	};
}

function setAndCheckCSRFToken(req: Request) {
	if (req.session.CSRFToken && req.session.user) {
		return req.session.CSRFToken;
	} else if (req.session.user) {
		const token = randomBytes(32).toString("hex");
		req.session.CSRFToken = token;
		return token;
	} else {
		return "";
	}
}

function checkValidUser(req: Request, isSafe: boolean, token: string | undefined) {
	let user = undefined;
	if (req.session.user) {
		user = req.session.user;
	}
	if (isSafe) {
		if (req.session.CSRFToken !== token) user = undefined;
	}
	return user;
}

export { initSession, checkUser, setUser, setAndCheckCSRFToken, checkValidUser };
