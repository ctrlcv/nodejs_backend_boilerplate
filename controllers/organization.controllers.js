const Organization = require('./../models/organization.model');
const Utils = require('./../service/utils');

exports.getOrganizations = async function(req, res) {
    const { id, name, part_name, code } = req.body;
    //const id = req.params.id;

    try {
        let organizationList = await Organization.getList(id, name, part_name, code);

        if (organizationList === false) {
            return res.status(500).json({
                success: false,
                message: "organization query failed"
            });
        }

        return res.status(200).json({
            success: true,
            result: organizationList
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

exports.addOrganization = async function(req, res) {
    const { name, part_name, code } = req.body;

    if (Utils.isEmpty(name) || Utils.isEmpty(part_name)) {
        return res.status(400).json({
            success: false,
            message: "name, part_name are required"
        });
    }

    try {
        let addResult = await Organization.addOrganization(name, part_name, code);

        if (Utils.isEmpty(addResult) || addResult === false) {
            return res.status(500).json({
                success: false,
                message: "organization insert fail"
            });
        }

        return res.status(200).json({
            success: true,
            insertId: addResult.insertId
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

exports.updateOrganization = async function(req, res) {
    const { id, name, part_name, code } = req.body;

    if (Utils.isEmpty(id) || Utils.isEmpty(id) || Utils.isEmpty(id) || Utils.isEmpty(id) ) {
        return res.status(400).json({
            success: false,
            message: "id, name, part_name, code are required"
        });
    }

    try {
        let updateResult = await Organization.updateOrganization(id, name, part_name, code);

        if (Utils.isEmpty(updateResult) || updateResult === false) {
            return res.status(500).json({
                success: false,
                message: "organization update failed"
            });
        }

        // console.log(updateResult);

        return res.status(200).json({
            success: true,
            changedRows: updateResult.changedRows
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

exports.deleteOrganization = async function(req, res) {
    const { id } = req.body;

    if (Utils.isEmpty(id)) {
        return res.status(400).json({
            success: false,
            message: "id is required"
        });
    }

    try {
        let deleteResult = await Organization.deleteOrganization(id);

        if (Utils.isEmpty(deleteResult) || deleteResult === false) {
            return res.status(500).json({
                success: false,
                message: "organization delete failed"
            });
        }

        return res.status(200).json({
            success: true,
            affectedRows: deleteResult.affectedRows
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