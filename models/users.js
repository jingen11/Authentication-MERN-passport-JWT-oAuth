const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
    inAppId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        require: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, "too short"],
        validate(value) {
            if (value.includes("password")) {
                throw new Error("Password cannot be 'password'")
            }
        }
    },

    provider: {
        type: String,
        default: "local",
        required: true,

    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("This is not a valid password")
            }
        }
    },
    phoneNum: Number,
    DOB: {
        type: Date,
        default: Date.now()
    }
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.inAppId;
    return userObject;
}

userSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.hash(user.password, 10, function (err, hash) {
            if (err) {
                throw new Error(err);
            }
            user.password = hash;
        })
    }

    next();
})

const User = mongoose.model("User", userSchema);


module.exports = User;