\c biztime

DROP TABLE IF EXISTS companies_industries;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;


CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL CHECK (amt > 0),
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL
);

CREATE TABLE companies_industries (
    comp_code TEXT REFERENCES companies ON DELETE CASCADE,
    ind_code TEXT REFERENCES industries ON DELETE CASCADE,
    PRIMARY KEY (comp_code, ind_code)
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, industry)
  VALUES ('acct', 'Accounting'),
         ('tech', 'Technology'),
         ('sus', 'Sustainability'),
         ('semi', 'Semi-conductor');

INSERT INTO companies_industries (comp_code, ind_code)
  VALUES ('apple', 'tech'),
         ('apple', 'sus'),
         ('apple', 'semi'),
         ('ibm', 'tech');