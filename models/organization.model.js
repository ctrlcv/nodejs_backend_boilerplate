const db = require('../database/dbconnection');
const Utils = require('../service/utils');

exports.getList = async (id, name, part_name, code) => {
    try {
        const query = `
            SELECT id, name, part_name, code, 
                   DATE_FORMAT(created_ts, '%Y-%m-%d %H:%i:%S') as created_ts, 
                   DATE_FORMAT(updated_ts, '%Y-%m-%d %H:%i:%S') as updated_ts 
              FROM organization
        `;

        let whereStr = '     WHERE 1 = 1 ';

        if (!Utils.isEmpty(id)) {
            whereStr += `      AND id = '${id}`;
        }

        if (!Utils.isEmpty(name)) {
            whereStr += `      AND name LIKE '%${name}%'`;
        }

        if (!Utils.isEmpty(part_name)) {
            whereStr += `      AND part_name LIKE '%${part_name}%'`;
        }

        if (!Utils.isEmpty(code)) {
            whereStr += `      AND code = '${code}'`;
        }

        whereStr += ` ORDER BY name, part_name`;

        // console.log(query + whereStr);
        const result = await db.query(query + whereStr);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.addOrganization = async (name, part_name, code) => {
    try {
        let query = `
            INSERT INTO organization
                (name, part_name, code)
            VALUES
                ('${name}', '${part_name}', '${code}')
        `;
        
        // console.log(query);
        const result = await db.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.updateOrganization = async (id, name, part_name, code) => {
    try {
        const query = `
            UPDATE organization
            SET
                updated_ts = CURRENT_TIMESTAMP
        `;

        let addedStr = '';

        if (!Utils.isEmpty(name)) {
            addedStr += ` , name = '${name}'`;
        }
        
        if (!Utils.isEmpty(part_name)) {
            addedStr += ` , part_name = '${part_name}'`;
        }

        if (!Utils.isEmpty(code)) {
            addedStr += ` , code = '${code}'`;
        }

        let whereStr = ` WHERE id = ${id} `;

        // console.log(query);
        const result = await db.query(query + addedStr + whereStr);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.deleteOrganization = async (id) => {
    try {
        const query = `
            DELETE FROM organization
            WHERE id = ${id}
        `;

        const result = await db.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}