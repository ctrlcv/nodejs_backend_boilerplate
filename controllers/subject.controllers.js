const Subject = require('./../models/subject.model');
const Utils = require('./../service/utils');

exports.getSubject = async function(req, res) {
    const id = req.params.id;
    // const id = req.query.id;
    // const name = req.query.name;
    // const phonenumber = req.query.phonenumber;

    if (Utils.isEmpty(id)) {
        return res.status(400).json({
            success: false,
            message: "id is required"
        });
    }

    try {
        let subject = await Subject.getSubject(id);

        if (Utils.isEmpty(subject) || subject === false) {
            return res.status(500).json({
                success: false,
                message: "subject query fail",
            });
        }

        return res.status(200).json({
            success: true,
            result: subject
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

exports.getSubjects = async function(req, res) {
    const { id, phonenumber, name, gender, birthday, number, point, organization_id } = req.body;

    try {
        let subjectList = await Subject.getSubjects(id, phonenumber, name, gender, birthday, number, point, organization_id);

        if (subjectList === false) {
            return res.status(500).json({
                success: false,
                message: "subject query fail",
            });
        }

        return res.status(200).json({
            success: true,
            result: subjectList
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

exports.addSubject = async function(req, res) {
    const { phonenumber, name, gender, birthday, number, point, organization_id } = req.body;

    if (Utils.isEmpty(name) || 
        Utils.isEmpty(phonenumber)|| 
        Utils.isEmpty(birthday)|| 
        Utils.isEmpty(organization_id)) {
        return res.status(400).json({
            success: false,
            message: "name, phonenumber, birthday, number, organization_id are required"
        });
    }

    try {
        let mv101User = await Subject.addMv101User(phonenumber, name, gender, birthday);
        if (Utils.isEmpty(mv101User) || mv101User === false) {
            return res.status(500).json({
                success: false,
                message: "user_mv101 insert fail",
            });
        }

        let insertId = mv101User.insertId;
        let subject = await Subject.addSubject(number, point, organization_id, insertId);
        if (Utils.isEmpty(mv101User) || mv101User === false) {
            return res.status(500).json({
                success: false,
                message: "subject insert fail",
            });
        }

        return res.status(200).json({
            success: true,
            insertId: subject.insertId
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

exports.updateSubject = async function(req, res) {
    const { id, phonenumber, name, gender, birthday, number, point, organization_id } = req.body;

    if (Utils.isEmpty(id)) {
        return res.status(400).json({
            success: false,
            message: "id is required"
        });
    }

    try {
        let subject = await Subject.getSubjectById(id);
        if (Utils.isEmpty(subject) || subject.length === 0) {
            return res.status(400).json({
                success: false,
                message: "invalid subject id"
            });
        }

        console.log(subject);

        if (!Utils.isEmpty(phonenumber) ||  !Utils.isEmpty(name) || !Utils.isEmpty(gender) || !Utils.isEmpty(birthday)) {
            let mv101UserResult = await Subject.updateMv101User(subject[0].id, phonenumber, name, gender, birthday);

            if (Utils.isEmpty(mv101UserResult) || mv101UserResult === false) {
                return res.status(500).json({
                    success: false,
                    message: "user_mv101 update fail",
                });
            }
        }

        let subjectResult = await Subject.updateSubject(id, number, point, organization_id);

        if (Utils.isEmpty(subjectResult) || subjectResult === false) {
            return res.status(500).json({
                success: false,
                message: "subject update fail",
            });
        }

        return res.status(200).json({
            success: true,
            changedRows: subjectResult.changedRows
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

exports.deleteSubject = async function(req, res) {
    const { id } = req.body;

    if (Utils.isEmpty(id)) {
        return res.status(400).json({
            success: false,
            message: "id is required"
        });
    }

    try {
        let subject = await Subject.getSubjectById(id);
        if (Utils.isEmpty(subject) || subject.length === false || subject.length === 0) {
            return res.status(400).json({
                success: false,
                message: "invalid subject id"
            });
        }

        // console.log(subject);

        let mv101UserResult = await Subject.deleteMv101User(subject[0].id);
        if (Utils.isEmpty(mv101UserResult) || mv101UserResult === false) {
            return res.status(500).json({
                success: false,
                message: "user_mv101 delete fail",
            });
        }

        let subjectResult = await Subject.deleteSubject(id);
        if (Utils.isEmpty(subjectResult) || subjectResult === false) {
            return res.status(500).json({
                success: false,
                message: "subject delete fail",
            });
        }

        return res.status(200).json({
            success: true,
            affectedRows: mv101UserResult.affectedRows
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