const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const AdminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [isEmail, 'Merci de fournir un email valide'],
	},
	password: {
		type: String,
		required: true,
	},
});

AdminSchema.pre('save', async function (next) {
	try {
		if (this.isNew) {
			const salt = await bcrypt.genSalt(12);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
		}
	} catch (error) {
		next(error);
	}
});

AdminSchema.methods.matchPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
