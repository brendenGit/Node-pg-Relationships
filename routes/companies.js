//routes for companies

const express = require("express");
const db = require('../data_and_db/db');
const ExpressError = require("../middleware/expressError");
const router = new express.Router();
const slugify = require('slugify');


// Returns a list of companies {companies: [{code, name}, ...]}
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.status(200).json({ companies: results.rows });
    } catch (err) {
        next(err);
    };
});


// Return obj of company: {company: {code, name, description, invoices [], industries[] }}
// If the company given cannot be found, this should return a 404 status response.
router.get("/:code", async (req, res, next) => {
    const code = req.params.code;
    try {
        const [companyResult, invoicesResult, industriesResult] = await Promise.all([
            db.query(`SELECT * FROM companies WHERE code=$1`, [code]),
            db.query(`SELECT * FROM invoices WHERE comp_code=$1`, [code]),
            db.query(
            `SELECT industries.industry
            FROM industries
            JOIN companies_industries ON industries.code = companies_industries.ind_code
            WHERE companies_industries.comp_code = $1`
                , [code])
        ]);

        if (companyResult.rows.length === 0) throw new ExpressError('Company not found!', 404);

        const company = companyResult.rows[0];
        const invoices = invoicesResult.rows;
        const industries = industriesResult.rows.map(row => row.industry);

        return res.status(200).json({ company: {...company, invoices: invoices, industries: industries }});
    } catch (err) {
        next(err);
    };
});


// Adds a company. Needs to be given JSON like: {name, description}. Company code is created for user with slugify.
// Returns obj of new company:  {company: {code, name, description}}
router.post("/", async (req, res, next) => {
    const code = slugify(req.body.name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        lower: true,      // convert to lower case, defaults to `false`
        strict: true,     // strip special characters except replacement, defaults to `false`
    });
    const name = req.body.name;
    const description = req.body.description;

    try {
        const results = await db.query(
            `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3)
            RETURNING code, name, description`, [code, name, description])
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