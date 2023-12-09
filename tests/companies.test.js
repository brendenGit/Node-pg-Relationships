process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require('../data_and_db/db');


describe("GET '/companies/' all companies & GET /companies/:code a specific company", function () {
    test("get all companies", async function () {
        const res = await request(app).get('/companies/');
        expect(res.statusCode).toBe(200);
        expect(res.body.companies[0].code).toEqual('apple');
    });

    test("get one company", async function () {
        const res = await request(app).get('/companies/apple');
        expect(res.statusCode).toBe(200);
        expect(res.body.company.code).toEqual('apple');
    });
});


describe("POST '/companies/' create a new company, PATCH /companies/code edit company & DELETE /companies/:code a specific company", function () {
    test("create a company", async function () {
        const companyData = {
            code: 'amd',
            name: 'Advanced Micro Devices',
            description: 'A great semiconductor company!'
        }
        const res = await request(app).post('/companies/').send(companyData);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ 'company': companyData });
    });

    test("update a company", async function () {
        const code = 'amd';
        const name = 'AMD';
        const description = 'An average semiconductor company';

        const res = await request(app).patch('/companies/amd').send({ name, description });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ 'company': { code, name, description } });
    });

    test("delete a company", async function () {
        const res = await request(app).delete('/companies/amd');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "status": "deleted" });
    });
});