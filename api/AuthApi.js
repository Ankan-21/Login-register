const UserModel = require("../models/User");
const TokenModel = require("../models/Token");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


exports.signin = (req, res, next) => {
    UserModel.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            const hashPassword = data.password;
            if (bcrypt.compareSync(req.body.password, hashPassword)) {
                const token = jwt.sign({
                    id: data._id,
                    username: data.userName
                }, "abhishek-23051998@#1!4959", { expiresIn: '1m' });
                res.cookie("userToken", token);
                if (req.body.rememberme) {
                    res.cookie('email', req.body.email)
                    res.cookie('password', req.body.password)
                }
                res.status(200).json({
                    status: 'success',
                    result: data,
                    message: "Login...."
                });

            } else {
                res.status(404).json({
                    result: err,
                    message: "Invalid Password"
                });
            }

        } else {
            res.status(404).json({
                result: err,
                message: "Invalid Email"
            });
        }
    })
}


exports.signup = (req, res) => {
    UserModel({
        userName: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }).save((err, user) => {
        if (!err) {
            res.status(200).json({
                status: 'success',
                result: user,
                message: "User Added Successfully"
            });
        } else {
            res.status(404).json({
                result: err,
                message: "User Not Added..."
            });
        }
    })
}