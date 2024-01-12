const db = require('../database/dbconnection');
const Utils = require('../service/utils');

exports.findUser = async (email) => {
    try {
        const query = 
        `
            SELECT *
              FROM users
             WHERE email = '${email}'
        `
        const result = await db.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.createUser = async (name, email, password, phonenumber) => {
    let query1 = `
        INSERT INTO users
            (email, password, name`;
    
    let query2 = `) VALUES (
            '${email}', '${password}', '${name}'`;

    if (!Utils.isEmpty(phonenumber)) {
        query1 += `, phone_number`;
        query2 += `, '${phonenumber}'`;
    }

    let query3 = `)`;

    const result = await db.query(query1 + query2 + query3);
    return result[0];
}

exports.updateUser = async (email, newpassword, name, phonenumber) => {
    const query = `
        UPDATE users
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
        whereStr += `, phone_number = '${phonenumber}'`;
    }

    whereStr += `
        WHERE 
            email = '${email}'`;

    // console.log(query + whereStr);
    const result = await db.query(query + whereStr);
    return result[0];
}
