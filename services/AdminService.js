const AdminRepository = require("../repository/AdminRepository");
const { HttpNotFound } = require("../utils/HttpError");

module.exports = class AdminService {
	#repository;

	constructor() {
		this.#repository = new AdminRepository();
	}
};
