const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		postalCode: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		alert: {
			type: [
				{
					alertId: String,
					type: String,
					description: String,
					timestamp: Number,
				},
			],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Alert', PostSchema);
