//routes for companies

const express = require("express");
const db = require('../db');
const ExpressError = require("../expressError");
const router = new express.Router();


// Returns a list of companies {companies: [{code, name}, ...]}
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.status(200).json({ companies: results.rows });
    } catch (err) {
        next(err);
    };
});


// Return obj of company: {company: {code, name, description}}
// If the company given cannot be found, this should return a 404 status response.
router.get("/:code", async (req, res, next) => {
    const code = req.params.code;
    try {
        const valid = await db.query(
            `SELECT * FROM companies
            WHERE code = $1`, [code]);
        if (valid.rows.length === 0) throw new ExpressError('Company not found!', 404);
        
        const company = await db.query(
            `SELECT * 
            FROM companies
            WHERE code=$1`, [code]);

        const invoices = await db.query(
            `SELECT * 
            FROM invoices
            WHERE comp_code=$1`, [code]);
        
        return res.status(200).json({ company: company.rows[0], invoices: invoices.rows});
    } catch (err) {
        next(err);
    };
});


// Adds a company. Needs to be given JSON like: {code, name, description} 
// Returns obj of new company:  {company: {code, name, description}}
router.post("/", async (req, res, next) => {
    const { code, name, description } = req.body;
    try {
        const results = await db.query(
            `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,[code, name, description])
        return res.status(200).json({ company: results.rows[0] });
    } catch (err) {
        next(err);
    };
});


// Edit existing company. Should return 404 if company cannot be found.
// Needs to be given JSON like: {name, description} 
// Returns update company object: {company: {code, name, description}}
router.patch("/:code", async (req, res, next) => {
    const code = req.params.code;
    const { name, description } = req.body;
    try {
        const valid = await db.query(
            `SELECT * FROM companies
            WHERE code = $1`, [code]);
        if (valid.rows.length === 0) throw new ExpressError('Company not found!', 404);
        
        const results = await db.query(
            `UPDATE companies SET name=$1, description=$2
            WHERE code = $3
            RETURNING code, name, description`, [name, description, code]);
        return res.status(200).json({ company: results.rows[0] });
    } catch (err) {
        next(err);
    };
});


// Deletes company. Should return 404 if company cannot be found.
// Returns {status: "deleted"}
router.delete("/:code", async (req, res, next) => {
    const code = req.params.code;

    const valid = await db.query(
        `SELECT * FROM companies
        WHERE code = $1`, [code]);
    if (valid.rows.length === 0) throw new ExpressError('Company not found!', 404);

    await db.query("DELETE FROM companies WHERE code = $1", [code])
    return res.status(200).json({ "status": "deleted" });
});

module.exports = router;