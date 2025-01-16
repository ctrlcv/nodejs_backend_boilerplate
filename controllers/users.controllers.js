const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./../config/dev');
const Utils = require('./../service/utils');

exports.signIn = async function(req, res) {
    try {
        const { email, password } = req.body;

        if (Utils.isEmpty(email) || Utils.isEmpty(password)) {
            return res.status(400).json({ 
                code: "8001",
                message: "There is no required value.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null
            });
        }

        let findUsers = await User.findUser(email);
        if (Utils.isEmpty(findUsers) || findUsers.length === 0) {
            return res.status(400).json({
                code: "8002",
                message: "This user does not exist.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null 
            });
        }
        
        const findUser = findUsers[0];

        let isMatch = await bcrypt.compare(password, findUser.password);
        if (isMatch === false) {
            return res.status(400).json({ 
                code: "8003",
                message: "ID/PW is incorrect.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null 
            });
        }

        const payload = {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email
        };

        const refreshPayload = {
            email: findUser.email,
            name: findUser.name,
            id: findUser.id
        };

        let expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);

        let refreshExpireDate = new Date();
        refreshExpireDate.setDate(refreshExpireDate.getDate() + 30);

        const token = jwt.sign(payload, config.SECRET_OR_KEY, {expiresIn: '7d'});
        const refreshToken = jwt.sign(refreshPayload, config.SECRET_OR_REFRESH_KEY, {expiresIn: '30d'});

        if (!Utils.isNull(token) && !Utils.isNull(refreshToken)) {
            return res.status(200).json({
                code: "0000",
                message: "success",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: {
                    id: findUser.id,
                    email: findUser.email,
                    name: findUser.name,
                    phoneNumber: findUser.phone_number,
                    imageUrl: findUser.image_url,
                    accessToken: token,
                    expireDate: expireDate.getTime(),
                    refreshToken : refreshToken,
                    refreshExpireDate: refreshExpireDate.getTime()
                }
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: "9999",
            message: "exception has occurred",
            additionalMessage: err.message,
            responseTime: Utils.getCurrentTime(),
            body: null 
        });
    }
}

exports.signUp = async function(req, res) {
    const { name, email, password, phonenumber } = req.body;

    if (Utils.isNull(email) || Utils.isNull(password) || Utils.isNull(name) || Utils.isNull(phonenumber)) {
        return res.status(400).json({
            code: "8001",
            message: "There is no required value.",
            additionalMessage: "",
            responseTime: Utils.getCurrentTime(),
            body: null
        });
    }

    try {
        let findUser = await User.findUser(email);
        if (findUser.length > 0) {
            return res.status(400).json({ 
                code: "8011",
                message: "This email is not available.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null
            });
        }

        let hash = await bcrypt.hash(password, 10);
        let newUser = await User.createUser(name, email, hash, phonenumber);

        if (Utils.isEmpty(newUser) || newUser.changedRows === 0) {
            return res.status(500).json({ 
                code: "8012",
                message: "fail to create user",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null
            });
        }

        return res.status(200).json({ 
            code: "0000",
            message: "success",
            additionalMessage: "",
            responseTime: Utils.getCurrentTime(),
            body: {
                user_id: newUser.insertId 
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: "9999",
            message: "exception has occurred",
            additionalMessage: err.message,
            responseTime: Utils.getCurrentTime(),
            body: null 
        });
    }
}

exports.getAccessToken = async function(req, res) {
    try {
        const clientToken = req.headers['x-access-token'] || req.query.token;
        if (Utils.isEmpty(clientToken)) {
            return res.status(400).json({
                code: "8031",
                message: "token is empty",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null
            });
        }

        let userid;
        let name;
        let useremail;

        try {
            const decoded = jwt.verify(clientToken, config.SECRET_OR_REFRESH_KEY);

            if (Utils.isEmpty(decoded)) {
                return res.status(400).json({ 
                    code: "8032",
                    message: "unauthorized",
                    additionalMessage: "",
                    responseTime: Utils.getCurrentTime(),
                    body: null
                });
            }

            userid = decoded.id;
            name = decoded.name;
            useremail = decoded.email;
        } catch (err) {
            console.error(err);
            return res.status(400).json({
                code: "8033",
                message: "token expired",
                additionalMessage: err.message,
                responseTime: Utils.getCurrentTime(),
                body: null
            });
        }

        const payload = {
            id: userid,
            name: name,
            email: useremail
        };

        let expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);

        const token = jwt.sign(payload, config.SECRET_OR_KEY, {expiresIn: '1d'});
        res.status(200).json({
            code: "0000",
            message: "success",
            additionalMessage: "",
            responseTime: Utils.getCurrentTime(),
            body: {
                accessToken: token,
                expireDate: expireDate.getTime()
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: "9999",
            message: "exception has occurred",
            additionalMessage: err.message,
            responseTime: Utils.getCurrentTime(),
            body: null 
        });
    }
}

exports.updateUser = async function(req, res) {
    try {
        const { email, password, newpassword, name, phonenumber } = req.body;

        if (Utils.isNull(email) || Utils.isNull(password)) {
            return res.status(400).json({ 
                code: "8001",
                message: "There is no required value.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null
            });
        }

        let findUser = await User.findUser(email);
        if (Utils.isEmpty(findUser) || findUser.length === 0) {
            return res.status(400).json({ 
                code: "8002",
                message: "This user does not exist.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null 
            });
        }

        let isMatch = await bcrypt.compare(password, findUser[0].password);
        if (isMatch === false) {
            return res.status(400).json({ 
                code: "8003",
                message: "ID/PW is incorrect.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null
            });
        }

        let newHash;
        if (!Utils.isEmpty(newpassword)) {
            newHash = await bcrypt.hash(newpassword, 10);
        }

        const updateUser = await User.updateUser(email, newHash, name, phonenumber );

        if (Utils.isEmpty(updateUser) || updateUser.changedRows === 0) {
            return res.status(400).json({ 
                code: "8041",
                message: "user update fail.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null
            });    
        }

        return res.status(200).json({ 
            code: "0000",
            message: "success",
            additionalMessage: "",
            responseTime: Utils.getCurrentTime(),
            body: null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: "9999",
            message: "exception has occurred",
            additionalMessage: err.message,
            responseTime: Utils.getCurrentTime(),
            body: null 
        });
    }
}

exports.getUserInfo = async function(req, res) {
    try {
        const clientToken = req.headers['x-access-token'] || req.query.token
        if(Utils.isNull(clientToken)) {
            return res.status(400).json({
                code: "8031",
                message: "token is empty",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null
            })
        }

        let email;

        try {
            const decoded = jwt.verify(clientToken, config.SECRET_OR_KEY);

            if (Utils.isEmpty(decoded)) {
                return res.status(400).json({ 
                    code: "8032",
                    message: "unauthorized",
                    additionalMessage: "",
                    responseTime: Utils.getCurrentTime(),
                    body: null
                });
            }

            email = decoded.email;
        } catch (err) {
            console.error(err);
            return res.status(400).json({
                code: "8033",
                message: "token expired",
                additionalMessage: err.message,
                responseTime: Utils.getCurrentTime(),
                body: null
            });
        }

        let findUsers = await User.findUser(email);
        if (Utils.isEmpty(findUsers) || findUsers.length === 0) {
            return res.status(400).json({ 
                code: "8002",
                message: "This user does not exist.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null 
            });
        }

        const findUser = findUsers[0];

        return res.status(200).json({
            code: "0000",
            message: "success",
            additionalMessage: "",
            responseTime: Utils.getCurrentTime(),
            body: {
                id: findUser.id,
                email: findUser.email,
                name: findUser.name,
                phoneNumber: findUser.phone_number,
                imageUrl: findUser.image_url,
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: "9999",
            message: "exception has occurred",
            additionalMessage: err.message,
            responseTime: Utils.getCurrentTime(),
            body: null 
        });
    }
}

exports.signInByToken = async function(req, res) {
    try {
        const userId = res.locals.id;
        const useremail = res.locals.email;
        const name = res.locals.name;

        let findUsers = await User.findUser(useremail);
        if (Utils.isEmpty(findUsers) || findUsers.length === 0) {
            return res.status(200).json({ 
                code: "8014",
                message: "This user does not exist.",
                additionalMessage: "",
                responseTime: Utils.getCurrentTime(),
                body: null 
            });
        }

        const findUser = findUsers[0];

        const payload = {
            id: userId,
            name: name,
            email: useremail
        };

        const refreshPayload = {
            email: useremail,
            name: name,
            id: userId
        }

        let expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);

        let refreshExpireDate = new Date();
        refreshExpireDate.setDate(refreshExpireDate.getDate() + 30);

        const token = jwt.sign(payload, config.SECRET_OR_KEY, {expiresIn: '7d'});
        const refreshToken = jwt.sign(refreshPayload, config.SECRET_OR_REFRESH_KEY, {expiresIn: '30d'});
        
        return res.status(200).json({
            code: "0000",
            message: "success",
            additionalMessage: "",
            responseTime: Utils.getCurrentTime(),
            body: {
                id: findUser.id,
                email: findUser.email,
                name: findUser.name,
                phoneNumber: findUser.phone_number,
                imageUrl: findUser.image_url,
                accessToken: token,
                expireDate: expireDate.getTime(),
                refreshToken : refreshToken,
                refreshExpireDate: refreshExpireDate.getTime()
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: "9999",
            message: "exception has occurred",
            additionalMessage: err.message,
            responseTime: Utils.getCurrentTime(),
            body: null 
        });
    }
}