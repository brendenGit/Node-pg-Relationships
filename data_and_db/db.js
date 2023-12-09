/** Database setup for BizTime. */

const { Client } = require("pg");

let db

if (process.env.NODE_ENV === "test") {
    db = new Client({
        user: 'brenden',
        host: 'localhost',
        database: 'biztime-test',
        password: 'Izzy9373*',
        port: 5432,
    });
} else {
    db = new Client({
        user: 'brenden',
        host: 'localhost',
        database: 'biztime',
        password: 'Izzy9373*',
        port: 5432,
    });
};

db.connect();

module.exports = db;