const { validationResult, body } = require("express-validator");
// Service
const UserService = require("../services/AdminService");

// Http Errors
const { HttpUnprocessableEntity } = require("../utils/HttpError");

// Configurations
const logger = require("../config/winston");

module.exports = (app) => {
	const service = new UserService();
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

	app.get(
		"/emsp/admin/approve/:country_code/:party_id",
		[],
		async (req, res) => {
			logger.info({ GET_ADMIN: { message: "Request" } });

			try {
				validate(req, res);

				logger.info({ GET_USERS_API_RESPONSE: { status: 200 } });

				return res.status(200).json({ status: 200, data: [] });
			} catch (err) {
				if (err !== null) {
					logger.error({ GET_USERS_API_ERROR: { message: err.message } });

					return res
						.status(err.status)
						.json({ status: err.status, data: err.data, message: err.message });
				}

				logger.error({
					GET_USERS_API_ERROR: {
						message: "Internal Server Error",
					},
				});
				return res
					.status(500)
					.json({ status: 500, data: [], message: "Internal Server Error" });
			}
		}
	);
};
