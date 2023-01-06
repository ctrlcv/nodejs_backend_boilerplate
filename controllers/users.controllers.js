const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./../config/dev');
const Utils = require('./../service/utils');

exports.signin = async function(req, res) {
    try {
        const { email, password } = req.body;

        if (Utils.isEmpty(email) || Utils.isEmpty(password)) {
            return res.status(400).json({ 
                success: false, 
                message: "이메일과 비밀번호를 입력하세요." 
            });
        }

        let findUser = await User.findUser(email);
        if (Utils.isEmpty(findUser) || findUser.length === 0) {
            return res.status(400).json({
                success: false,
                message: "존재하지 않는 사용자입니다."
            });
        }

        // console.log(findUser);

        let isMatch = await bcrypt.compare(password, findUser[0].password);
        if (isMatch === false) {
            return res.status(400).json({ 
                success: false,
                message: "비밀번호가 올바르지 않습니다."
            });
        }

        const payload = {
            id: findUser[0].id,
            name: findUser[0].name,
            email: findUser[0].email
        };

        const refreshPayload = {
            email: findUser[0].email,
            name: findUser[0].name,
            id: findUser[0].id
        };

        let expiresdate = new Date();
        expiresdate.setDate(expiresdate.getDate() + 1);

        let refreshExpiresdate = new Date();
        refreshExpiresdate.setDate(refreshExpiresdate.getDate() + 30);

        const token = jwt.sign(payload, config.secretOrKey, {expiresIn: '1d'});
        const refreshToken = jwt.sign(refreshPayload, config.secretOrRefreshKey, {expiresIn: '30d'});

        if (!Utils.isNull(token) && !Utils.isNull(refreshToken)) {
            return res.status(200).json({
                success: true,
                message: "User successfully authenticated",
                id: findUser[0].id,
                email: findUser[0].email,
                name: findUser[0].name,
                phonenumber: findUser[0].phonenumber,
                is_superuser: findUser[0].is_superuser,
                is_staff: findUser[0].is_staff,
                organization_id: findUser[0].organization_id,
                accesstoken: token,
                expiresdate: expiresdate.getTime(),
                refreshtoken : refreshToken,
                refreshexpiresdate: refreshExpiresdate.getTime()
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "exception has occurred",
            error: err.message
        });
    }
}

exports.signup = async function(req, res) {
    const { name, email, password, phonenumber, is_superuser, is_staff, organization_id } = req.body;

    if (Utils.isNull(email) || Utils.isNull(password) || Utils.isNull(name)) {
        return res.status(400).json({
            success: false,
            message: "이메일, 비밀번호, 이름은 반드시 제공되어야 합니다." 
        });
    }

    try {
        let findUser = await User.findUser(email);
        if (findUser.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "사용할 수 없는 이메일입니다." 
            });
        }

        let hash = await bcrypt.hash(password, 10);
        let newUser = await User.createUser(name, email, hash, phonenumber, is_superuser, is_staff, organization_id);

        if (Utils.isEmpty(newUser) || newUser.changedRows === 0) {
            return res.status(500).json({ 
                success: false, 
                message: "fail to create user" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            insertId: newUser.insertId 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "exception has occurred",
            error: err.message
        });
    }
}

exports.getToken = async function(req, res) {
    try {
        const clientToken = req.headers['x-access-token'] || req.query.token

        if (Utils.isEmpty(clientToken)) {
            return res.status(400).json({
                success: false,
                message: 'not logged'
            })
        }

        let userid;
        let name;
        let useremail;

        try {
            const decoded = jwt.verify(clientToken, config.secretOrRefreshKey);
            if (Utils.isEmpty(decoded)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'unauthorized'
                });
            }

            userid = decoded.id;
            name = decoded.name;
            useremail = decoded.email;
        } catch (err) {
            console.error(err);
            return res.status(400).json({
                success: false,
                message: "token expired",
                error: err.message
            });
        }

        const payload = {
            id: userid,
            name: name,
            email: useremail
        };

        const refreshPayload = {
            email: useremail,
            name: name,
            id: userid
        }

        let expiresdate = new Date();
        expiresdate.setDate(expiresdate.getDate() + 1);

        let refreshExpiresdate = new Date();
        refreshExpiresdate.setDate(refreshExpiresdate.getDate() + 30);

        const token = jwt.sign(payload, config.secretOrKey, {expiresIn: '1d'});
        const refreshToken = jwt.sign(refreshPayload, config.secretOrRefreshKey, {expiresIn: '30d'});

        res.status(200).json({
            success: true,
            message: "token successfully updated",
            accesstoken: token,
            expiresdate: expiresdate.getTime(),
            refreshtoken : refreshToken,
            refreshExpiresdate: refreshExpiresdate.getTime(),
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "exception has occurred",
            error: err.message
        });
    }
}

exports.getAccessToken = async function(req, res) {
    try {
        const clientToken = req.headers['x-access-token'] || req.query.token;
        if (Utils.isEmpty(clientToken)) {
            return res.status(400).json({
                success: false,
                message: 'not logged'
            })
        }

        let userid;
        let name;
        let useremail;

        try {
            const decoded = jwt.verify(clientToken, config.secretOrRefreshKey);

            if (Utils.isEmpty(decoded)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'unauthorized' 
                });
            }

            userid = decoded.id;
            name = decoded.name;
            useremail = decoded.email;
        } catch (err) {
            console.error(err);
            return res.status(400).json({
                success: false,
                message: "token expired",
                error: err.message
            });
        }

        const payload = {
            id: userid,
            name: name,
            email: useremail
        };

        let expiresdate = new Date();
        expiresdate.setDate(expiresdate.getDate() + 1);

        const token = jwt.sign(payload, config.secretOrKey, {expiresIn: '1d'});
        res.status(200).json({
            success: true,
            message: "token successfully updated",
            accesstoken: token,
            expiresdate: expiresdate.getTime()
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "exception has occurred",
            error: err.message
        });
    }
}

exports.updateUser = async function(req, res) {
    try {
        const { email, password, newpassword, name, phonenumber, is_superuser, is_staff, organization_id } = req.body;

        if (Utils.isNull(email) || Utils.isNull(password)) {
            return res.status(400).json({ 
                success: false, 
                message: "이메일과 비밀번호를 입력하세요." 
            });
        }

        let findUser = await User.findUser(email);
        if (Utils.isEmpty(findUser) || findUser.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "존재하지 않는 사용자입니다."
            });
        }

        let isMatch = await bcrypt.compare(password, findUser[0].password);
        if (isMatch === false) {
            return res.status(400).json({ 
                success: false,
                message: "비밀번호가 올바르지 않습니다."
            });
        }

        let newHash;
        if (!Utils.isEmpty(newpassword)) {
            newHash = await bcrypt.hash(newpassword, 10);
        }

        const updateUser = await User.updateUser(email, newHash, name, phonenumber, is_superuser, is_staff, organization_id);

        if (Utils.isEmpty(updateUser) || updateUser.changedRows === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "user update fail"
            });    
        }

        return res.status(200).json({ 
            success: true, 
            message: "update success"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "exception has occurred",
            error: err.message
        });
    }
}

exports.getUserInfo = async function(req, res) {
    try {
        const clientToken = req.headers['x-access-token'] || req.query.token
        if(Utils.isNull(clientToken)) {
            return res.status(400).json({
                success: false,
                message: 'not logged'
            })
        }

        let email;

        try {
            const decoded = jwt.verify(clientToken, config.secretOrKey);

            if (Utils.isEmpty(decoded)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'unauthorized' 
                });
            }

            email = decoded.email;
        } catch (err) {
            console.error(err);
            return res.status(400).json({
                success: false,
                message: "token expired",
                error: err.message
            });
        }

        let findUser = await User.findUser(email);
        if (Utils.isEmpty(findUser) || findUser.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "존재하지 않는 사용자입니다."
            });
        }

        return res.status(200).json({
            success: true,
            message: "User successfully authenticated",
            id: findUser[0].id,
            email: findUser[0].email,
            name: findUser[0].name,
            phonenumber: findUser[0].phonenumber,
            is_superuser: findUser[0].is_superuser,
            is_staff: findUser[0].is_staff,
            organization_id: findUser[0].organization_id,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "exception has occurred",
            error: err.message
        });
    }
}