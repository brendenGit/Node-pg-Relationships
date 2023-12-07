/** Database setup for BizTime. */

const { Client } = require("pg");

// let DB_URI;

// if (process.env.NODE_ENV === "test") {
//     DB_URI = "postgresql:///biztime_test";
// } else {
//     DB_URI = "postgresql:///biztime";
// }

const db = new Client({
    user: 'brenden',
    host: 'localhost',
    database: 'biztime',
    password: 'Izzy9373*',
    port: 5432,
});

db.connect();

module.exports = db;