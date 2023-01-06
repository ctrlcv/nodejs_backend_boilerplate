const db = require('../database/dbconnection');
const Utils = require('../service/utils');

exports.findUser = async (email) => {
    try {
        const query = 
        `
            SELECT *
              FROM user
             WHERE email = '${email}'
        `
        const result = await db.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.createUser = async (name, email, password, phonenumber, is_superuser, is_staff, organization_id) => {
    let query1 = `
        INSERT INTO user
            (email, password, name`;
    
    let query2 = `) VALUES (
            '${email}', '${password}', '${name}'`;

    if (!Utils.isEmpty(phonenumber)) {
        query1 += `, phonenumber`;
        query2 += `, '${phonenumber}'`;
    }

    if (!Utils.isEmpty(is_superuser)) {
        query1 += `, is_superuser`;
        query2 += `, ${is_superuser}`;
    }

    if (!Utils.isEmpty(is_staff)) {
        query1 += `, is_staff`;
        query2 += `, ${is_staff}`;
    }

    if (!Utils.isEmpty(organization_id)) {
        query1 += `, organization_id`;
        query2 += `, ${organization_id}`;
    }

    let query3 = `)`;

    const result = await db.query(query1 + query2 + query3);
    return result[0];
}

exports.updateUser = async (email, newpassword, name, phonenumber, is_superuser, is_staff, organization_id) => {
    const query = `
        UPDATE user
        SET
            updated_ts = CURRENT_TIMESTAMP `;

    let whereStr = '';

    if (!Utils.isEmpty(newpassword)) {
        whereStr += `, password = '${newpassword}'`;
    }

    if (!Utils.isEmpty(name)) {
        whereStr += `, name = '${name}'`;
    }

    if (!Utils.isEmpty(phonenumber)) {
        whereStr += `, phonenumber = '${phonenumber}'`;
    }

    if (!Utils.isEmpty(is_superuser)) {
        whereStr += `, is_superuser = ${is_superuser}`;
    }

    if (!Utils.isEmpty(is_staff)) {
        whereStr += `, is_staff = ${is_staff}`;
    }

    if (!Utils.isEmpty(organization_id)) {
        whereStr += `, organization_id = ${organization_id}`;
    }

    whereStr += `
        WHERE 
            email = '${email}'`;

    // console.log(query + whereStr);
    const result = await db.query(query + whereStr);
    return result[0];
}
