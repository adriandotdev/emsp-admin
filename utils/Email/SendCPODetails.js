require("dotenv").config();

// config
const logger = require("../../config/winston");
const config = require("../../config/config");
// Utils
const Email = require("../Email");
const { HttpInternalServerError } = require("../HttpError");

module.exports = class SendCPODetails extends Email {
	constructor(email_address, data) {
		super(email_address, data);
	}

	async SendEmail() {
		try {
			let htmlFormat = `
			  <h1>Welcome to ParkNcharge</h1>
	
			  <h2>The information below is blah blah blah</h2>
			  <p>PARTY ID: ${this.GetData().party_id}</p>
			  <p>COUNTRY CODE: ${this.GetData().country_code}</p>
              <p>TOKEN: ${this.GetData().token}</p>

			  <p>Kind regards,</p>
			  <p><b>ParkNcharge</b></p>
			`;

			let textFormat = `ParkNcharge\n\nPLEASE DO NOT SHARE THIS OTP TO ANYONE\n\nKind regards,\nParkNCharge`;
			// send mail with defined transport object
			const info = await this.GetTransporter().sendMail({
				from: process.env.NODEMAILER_USER, // sender address
				to: this.GetEmail(), // list of receivers
				subject: "ParkNcharge Credentials (no-reply)", // Subject line
				text: textFormat, // plain text body
				html: htmlFormat, // html body
			});

			logger.info("Message sent: APPROVED %s", info.messageId);
		} catch (err) {
			throw new HttpInternalServerError("Internal Server Error", err);
		}
	}
};
