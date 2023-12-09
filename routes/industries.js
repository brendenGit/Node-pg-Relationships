// Add routes for:

// adding an industry
// listing all industries, which should show the company code(s) for that industry
// associating an industry to a company

//routes for industries

const express = require("express");
const db = require('../data_and_db/db');
const ExpressError = require("../middleware/expressError");
const router = new express.Router();


// Returns a list of all industries
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM industries`);
        return res.status(200).json({ industries: results.rows });
    } catch (err) {
        next(err);
    };
});


// Get a specific industry
// Shows the company code(s) for that industry
router.get("/:code", async (req, res, next) => {
    const code = req.params.code;
    try {
        const [industryResult, companiesResult] = await Promise.all([
            db.query(`SELECT * FROM industries WHERE code=$1`, [code]),
            db.query(
                `SELECT companies_industries.comp_code
            FROM companies_industries
            WHERE companies_industries.ind_code = $1`
                , [code])
        ]);

        if (industryResult.rows.length === 0) throw new ExpressError('Industry not found!', 404);

        const industry = industryResult.rows[0];
        const companies = companiesResult.rows.map(row => row.comp_code);

        return res.status(200).json({ industry: { ...industry, companies: companies } });
    } catch (err) {
        next(err);
    };
});


// Create a new industry
// expect json data {code, industry}
router.post("/", async (req, res, next) => {
    const { code, industry } = req.body;

    try {
        const results = await db.query(
            `INSERT INTO industries (code, industry) 
            VALUES ($1, $2)
            RETURNING code, industry`, [code, industry])
        return res.status(200).json({ industry: results.rows[0] });
    } catch (err) {
        next(err);
    };
});


// Associate an industry with a company
// expecting json data { ind_code }
router.post("/:code", async (req, res, next) => {
    const companyCode = req.params.code;
    const industryCode = req.body.ind_code;

    try {
        const [validComp, validInd] = await Promise.all([
            db.query(`SELECT * FROM companies WHERE code=$1`, [companyCode]),
            db.query(`SELECT * FROM industries WHERE code=$1`, [industryCode])
        ]);

        if (validComp.rows.length === 0) {
            throw new ExpressError('Company not found! Cannot associate industry with unknown company.', 404);
        } else if (validInd.rows.length === 0) {
            throw new ExpressError('Industry not found! Cannot associate unknown industry to company.', 404);
        }

        const results = await db.query(
            `INSERT INTO companies_industries (comp_code, ind_code) 
            VALUES ($1, $2)
            RETURNING comp_code, ind_code`, [companyCode, industryCode])
        return res.status(200).json({ companies_industries: results.rows[0] });
    } catch (err) {
        next(err);
    };
});

module.exports = router;