process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require('../data_and_db/db');


describe("GET '/invoices/' all invoices & GET /invoice/:id a specific invoice", function () {
    test("get all invoices", async function () {
        const res = await request(app).get('/invoices/');
        expect(res.statusCode).toBe(200);
        expect(res.body.invoices[0].comp_code).toEqual('apple');
    });

    test("get one invoice", async function () {
        const res = await request(app).get('/invoices/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.invoice.id).toEqual(1);
    });
});


describe("POST '/invoices/' create a new invoice, PATCH /invoices/id edit invoice & DELETE /inovoices/:id a specific invoice", function () {
    let invoiceId;
    test("create an invoice", async function () {
        const invoiceData = {
            comp_code: 'apple',
            amt: 999999
        }
        const res = await request(app).post('/invoices/').send(invoiceData);
        invoiceId = res.body.invoice.id;
        expect(res.statusCode).toBe(200);
        expect(res.body.invoice.amt).toEqual(999999);
    });

    test("update an invoice", async function () {
        const amt = 1;
        const res = await request(app).patch(`/invoices/${invoiceId}`).send({ amt });
        expect(res.statusCode).toBe(200);
        expect(res.body.invoice.amt).toEqual(1);
    });

    test("delete an invoice", async function () {
        const res = await request(app).delete(`/invoices/${invoiceId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "status": "deleted" });
    });
});