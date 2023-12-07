//routes for invoices

const express = require("express");
const db = require('../db');
const ExpressError = require("../expressError");
const router = new express.Router();


// Return info on invoices: like {invoices: [{id, comp_code}, ...]}
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.status(200).json({ invoices: results.rows });
    } catch (err) {
        next(err);
    };
});


// Returns obj on given invoice.
// If invoice cannot be found, returns 404. 
// Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}
router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const valid = await db.query(
            `SELECT * FROM invoices
            WHERE id = $1`, [id]);
        if (valid.rows.length === 0) throw new ExpressError('Invoice not found!', 404);

        const invoiceResult = await db.query(
            `SELECT * 
            FROM invoices
            WHERE id=$1`, [id]);
        const companyResult = await db.query(
            `SELECT * 
            FROM companies
            WHERE code=$1`, [invoiceResult.rows[0].comp_code]);
        return res.status(200).json({ invoice: invoiceResult.rows[0], company : companyResult.rows[0] });
    } catch (err) {
        next(err);
    };
});


// Adds an invoice. Needs to be passed in JSON body of: {comp_code, amt}
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
router.post("/", async (req, res, next) => {
    const { comp_code, amt } = req.body;
    try {
        const valid = await db.query(
            `SELECT * FROM companies
            WHERE code = $1`, [comp_code]);
        if (valid.rows.length === 0) throw new ExpressError('Cannot create an invoice for an unregistered company!', 404);

        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt])
        return res.status(200).json({ invoice: results.rows[0] });
    } catch (err) {
        next(err);
    };
});


// Updates an invoice. If invoice cannot be found, returns a 404.
// Needs to be passed in a JSON body of {amt} 
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
router.patch("/:id", async (req, res, next) => {
    const id = req.params.id;
    const { amt } = req.body;
    try {
        const valid = await db.query(
            `SELECT * FROM invoices
            WHERE id = $1`, [id]);
        if (valid.rows.length === 0) throw new ExpressError('Invoice not found!', 404);

        const results = await db.query(
            `UPDATE invoices SET amt=$1
            WHERE id = $2
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, id]);
        return res.status(200).json({ invoice: results.rows[0] });
    } catch (err) {
        next(err);
    };
});


// Deletes an invoice.If invoice cannot be found, returns a 404. 
// Returns: {status: "deleted"} 
router.delete("/:id", async (req, res, next) => {
    const id = req.params.id;

    const valid = await db.query(
        `SELECT * FROM invoices
        WHERE id = $1`, [id]);
    if (valid.rows.length === 0) throw new ExpressError('Invoice not found!', 404);

    await db.query("DELETE FROM invoices WHERE id = $1", [id])
    return res.status(200).json({ "status": "deleted" });
});


module.exports = router;