const UserModel = require("../models/User");
const TokenModel = require("../models/Token");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");



exports.signup = (req, res) => {
    UserModel({
        userName: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }).save((err, user) => {
        if (!err) {
            console.log("User Added Successfully...");
            req.flash("message", "User Added");
            res.redirect("/");
        } else {
            console.log("User Not Added...", err);
        }
    })
}

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
                }, "abhishek-23051998@#1!4959", { expiresIn: '5s' });
                res.cookie("userToken", token);
                if (req.body.rememberme) {
                    res.cookie('email', req.body.email)
                    res.cookie('password', req.body.password)
                }
                console.log(data);
                res.redirect("user-dashboard");
            } else {
                // console.log("Invalid Password...");
                // res.redirect("/");
                req.flash("message", "Invalid Password");
                res.redirect("/");
            }

        } else {
            // console.log("Invalid Email...");
            // res.redirect("/");
            req.flash("message", "Invalid Email");
            res.redirect("/");
        }
    })
}