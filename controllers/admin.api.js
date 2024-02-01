const { validationResult, body, param } = require("express-validator");
// Service
const AdminService = require("../services/AdminService");

// Http Errors
const { HttpUnprocessableEntity } = require("../utils/HttpError");

// Configurations
const logger = require("../config/winston");

module.exports = (app) => {
	const service = new AdminService();
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

	// Admin approval API
	app.patch("/emsp/admin/approve/:cpo_id", async (req, res) => {
		const { country_code, cpo_id } = req.params;

		logger.info({
			APPROVE_CPO_API_REQUEST: { message: { country_code, cpo_id } },
		});

		try {
			validate(req, res);

			await service.ApproveChargingPointOperator(cpo_id);

			logger.info({
				APPROVE_CPO_API_RESPONSE: { status: 200, message: "APPROVED" },
			});

			return res.status(200).json({ status: 200, data: [] });
		} catch (err) {
			if (err !== null) {
				logger.error({ APPROVE_CPO_API_ERROR: { message: err.message } });

				return res.status(err.status ? err.status : 500).json({
					status: err.status ? err.status : 500,
					data: err.data,
					message: err.message,
				});
			}

			logger.error({
				APPROVE_CPO_API_ERROR: {
					message: "Internal Server Error",
				},
			});
			return res
				.status(500)
				.json({ status: 500, data: [], message: "Internal Server Error" });
		}
	});
};
