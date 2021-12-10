const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { roles } = require('../utils/constants');

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Merci de renseigner votre prénom'],
			minlength: [3, 'Votre prénom doit contenir au moins 3 caractères'],
			maxlength: [50, 'Votre prénom doit contenir au plus 50 caractères'],
		},
		lastName: {
			type: String,
			required: [true, 'Merci de renseigner votre nom'],
			minlength: [3, 'Votre nom doit contenir au moins 3 caractères'],
			maxlength: [50, 'Votre nom doit contenir au plus 50 caractères'],
		},
		address: {
			type: String,
			required: [true, 'Merci de renseigner votre adresse'],
			minlength: [3, 'Votre adresse doit contenir au moins 3 caractères'],
			maxlength: [50, 'Votre adresse doit contenir au plus 50 caractères'],
		},
		postalCode: {
			type: String,
			required: [true, 'Merci de renseigner votre code postal'],
			minlength: [5, 'Votre code postal doit contenir au moins 5 caractères'],
			maxlength: [5, 'Votre code postal doit contenir au plus 5 caractères'],
		},
		city: {
			type: String,
			required: [true, 'Merci de renseigner votre ville'],
			minlength: [3, 'Votre ville doit contenir au moins 3 caractères'],
			maxlength: [50, 'Votre ville doit contenir au plus 50 caractères'],
		},
		email: {
			type: String,
			required: [true, 'Merci de renseigner votre email'],
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Merci de fournir un email valide',
			],
			unique: true,
		},
		phone: {
			type: String,
			required: [true, 'Merci de renseigner votre numéro de téléphone'],
			minlength: [10, 'Votre numéro de téléphone doit contenir au moins 10 caractères'],
			maxlength: [10, 'Votre numéro de téléphone doit contenir au plus 10 caractères'],
		},
		password: {
			type: String,
			required: [true, 'Merci de fournir un mot de passe'],
			minlength: 3,
			maxlength: 255,
		},
		role: {
			type: String,
			enum: ['admin', 'moderator', 'user'],
			default: 'user',
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	try {
		if (this.isNew) {
			const salt = await bcrypt.genSalt(12);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
			if (
				(this.email === process.env.ADMIN_EMAIL,
				this.password === process.env.ADMIN_PASSWORD)
			) {
				this.role = roles.admin;
			}
		}
	} catch (error) {
		next(error);
	}
});

userSchema.methods.matchPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);