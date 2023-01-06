const db = require('../database/dbconnection');
const Utils = require('../service/utils');

exports.getSubjectById = async (id) => {
    try {
        let query = `
            SELECT * FROM subject
            WHERE id = ${id} `;

        // console.log(query);
        const result = await db.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.getSubject = async (id) => {
    try {
        let query = `
            SELECT 
                a.id AS subject_id, a.number, a.point, a.user_mv101_id,
                b.name,
                b.phonenumber,
                b.gender,
                DATE_FORMAT(b.birthday, '%Y-%m-%d') as birthday,
                a.organization_id, 
                c.name AS organization_name,
                c.part_name AS organization_part, 
                c.code AS organization_code
            FROM subject a, user_mv101 b, organization c 
           WHERE a.user_mv101_id = b.id 
             AND a.organization_id = c.id
             AND a.id = ${id}
        `;
        
        // console.log(query);
        const result = await db.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.getSubjects = async (id, phonenumber, name, gender, birthday, number, point, organization_id) => {
    try {
        let query = `
            SELECT 
                a.id AS subject_id, a.number, a.point, a.user_mv101_id,
                b.name,
                b.phonenumber,
                b.gender,
                DATE_FORMAT(b.birthday, '%Y-%m-%d') as birthday,
                a.organization_id, 
                c.name AS organization_name,
                c.part_name AS organization_part, 
                c.code AS organization_code
            FROM subject a, user_mv101 b, organization c `;

        let whereStr =            
        ` 
            WHERE a.user_mv101_id = b.id 
              AND a.organization_id = c.id
        `;

        if (!Utils.isEmpty(id)) {
            whereStr += ` AND a.id = ${id}`;
        }

        if (!Utils.isEmpty(phonenumber)) {
            whereStr += ` AND b.phonenumber LIKE '%${phonenumber}%'`;
        }

        if (!Utils.isEmpty(name)) {
            whereStr += ` AND b.name LIKE '%${name}%'`;
        }

        if (!Utils.isEmpty(gender)) {
            whereStr += ` AND b.gender LIKE '%${gender}%'`;
        }

        if (!Utils.isEmpty(birthday)) {
            whereStr += ` AND b.birthday = '${birthday}'`;
        }

        if (!Utils.isEmpty(number)) {
            whereStr += ` AND a.number = '${number}'`;
        }

        if (!Utils.isEmpty(point)) {
            whereStr += ` AND a.point = '${point}'`;
        }

        if (!Utils.isEmpty(organization_id)) {
            whereStr += ` AND a.organization_id = ${organization_id}`;
        }

        // console.log(query + whereStr);
        const result = await db.query(query + whereStr);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.addMv101User = async (phonenumber, name, gender, birthday) => {
    try {
        let query1 = `
            INSERT INTO user_mv101
                (name `;

        let query2 = ` ) VALUES ('${name}' `;

        if (!Utils.isEmpty(phonenumber)) {
            query1 += `, phonenumber`;
            query2 += `, '${phonenumber}'`;
        }

        if (!Utils.isEmpty(gender)) {
            query1 += `, gender`;
            query2 += `, '${gender}'`;
        }

        if (!Utils.isEmpty(birthday)) {
            query1 += `, birthday`;
            query2 += `, '${birthday}'`;
        }

        let query3 = `)`;

        // console.log(query1 + query2 + query3);
        const result = await db.query(query1 + query2 + query3);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.updateMv101User = async (id, phonenumber, name, gender, birthday) => {
    try {
        const query = `
            UPDATE user_mv101
            SET
                updated_ts = CURRENT_TIMESTAMP
        `;

        let addedStr = '';

        if (!Utils.isEmpty(phonenumber)) {
            addedStr += ` , phonenumber = '${phonenumber}'`;
        }
        
        if (!Utils.isEmpty(name)) {
            addedStr += ` , name = '${name}'`;
        }

        if (!Utils.isEmpty(gender)) {
            addedStr += ` , gender = '${gender}'`;
        }

        if (!Utils.isEmpty(birthday)) {
            addedStr += ` , birthday = '${birthday}'`;
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

exports.deleteMv101User = async (id) => {
    try {
        const query = `
            DELETE FROM user_mv101
            WHERE id = ${id}
        `;

        const result = await db.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.addSubject = async (number, point, organization_id, user_mv101_id) => {
    try {
        let query1 = `
            INSERT INTO subject
                (organization_id, user_mv101_id
        `;    

        let query2 = `) VALUES ('${organization_id}', '${user_mv101_id}' `;
            
        if (!Utils.isEmpty(number)) {
            query1 += `, number`;
            query2 += `, '${number}'`;
        }

        if (!Utils.isEmpty(point)) {
            query1 += `, point`;
            query2 += `, ${point}`;
        }

        let query3 = `)`;
        
        // console.log(query1 + query2 + query3);
        const result = await db.query(query1 + query2 + query3);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

exports.updateSubject = async (id, number, point, organization_id) => {
    try {
        const query = `
            UPDATE subject
            SET
                updated_ts = CURRENT_TIMESTAMP
        `;

        let addedStr = '';

        if (!Utils.isEmpty(number)) {
            addedStr += ` , number = '${number}'`;
        }
        
        if (!Utils.isEmpty(point)) {
            addedStr += ` , point = '${point}'`;
        }

        if (!Utils.isEmpty(organization_id)) {
            addedStr += ` , organization_id = ${organization_id}`;
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

exports.deleteSubject = async (id) => {
    try {
        const query = `
            DELETE FROM subject
            WHERE id = ${id}
        `;

        const result = await db.query(query);
        return result[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}