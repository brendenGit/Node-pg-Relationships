//routes for companies

const express = require('express');
const ExpressError = require('../expressError');
const router = new express.Router();
const db = require('../db');


// Returns a list of companies {companies: [{code, name}, ...]}
router.get("/companies", (err, req, res, next) => {
    try {
        
        return res.status(200).json(item);
    } catch (err) {
        next(err);
    };
});


// Return obj of company: {company: {code, name, description}}
// If the company given cannot be found, this should return a 404 status response.
router.get("/companies/:code", (err, req, res, next) => {
    const code = req.params.code;
});


// Adds a company. Needs to be given JSON like: {code, name, description} 
// Returns obj of new company:  {company: {code, name, description}}
router.post("/companies/:code", (err, req, res, next) => {
    const code = req.params.code;
});


// Edit existing company. Should return 404 if company cannot be found.
// Needs to be given JSON like: {name, description} 
// Returns update company object: {company: {code, name, description}}
router.patch("/companies/:code", (err, req, res, next) => {
    const code = req.params.code;
});


// Deletes company. Should return 404 if company cannot be found.
// Returns {status: "deleted"}
router.delete("/companies/:code", (err, req, res, next) => {
    const code = req.params.code;
});