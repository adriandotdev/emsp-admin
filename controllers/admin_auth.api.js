require("dotenv").config();

const { validationResult, body, param } = require("express-validator");

// Utils
const { HttpUnprocessableEntity } = require("../utils/HttpError");
const JWT = require("../utils/JsonWebToken");

// Configurations
const logger = require("../config/winston");

module.exports = (app) => {
	/**
	 * This function will be used by the express-validator for input validation,
	 * and to be attached to APIs middleware. */
	function validate(req, res) {
		const ERRORS = validationResult(req);

		if (!ERRORS.isEmpty()) {
			throw new HttpUnprocessableEntity(
				"Unprocessable Entity",
				ERRORS.mapped()
			);
		}
	}

	app.get("/ocpi/emsp/token", (req, res) => {
		logger.info({ TOKEN_API_REQUEST: { message: "Request" } });

		const token = JWT.Sign("basic-token", process.env.PARKNCHARGE_SECRET_KEY);

		logger.info({ TOKEN_API_RESPONSE: { message: "Response" } });
		return res.status(200).json({ status: 200, token });
	});
};
