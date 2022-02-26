const chai = require('chai');
const assert = require('assert');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);
const serverAddress = "http://localhost:3000";
const productarray = require('../routes/schema/productarray.json')
const userarray = require('../routes/schema/userarray.json')
describe('Api tests', function() {

    before(function() {
        server.start();
    });

    after(function() {
        server.close();
    })

    describe('GET /products', function() {
        it('should return all product data', function(done) {
            chai.request(serverAddress)
                .get('/products')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    expect(res.body).to.be.jsonSchema(productarray)

                    done();
                })

        })
    })

    describe('add product', function() {
        it('should accept product when data is correct', function(done) {
            chai.request(serverAddress)
                .post('/products')
                .send({
                    id: "12345",
                    "title": "Old computer",
                    "description": "Used but in good condition Pentium II",
                    "userCategory": "electronics",
                    "location": "Kello",
                    "image1": null,
                    "image2": null,
                    "image3": null,
                    "image4": null,
                    "askingPrice": 4000,
                    "dateCreated": "2021-12-01",
                    "deliveryType": 1,
                    "sellersName": "Janne",
                    "sellersContact": 1
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    done();
                })
        })
        it('should reject request when there is missing fields', function(done) {
            chai.request(serverAddress)
                .post('/products')
                .send({
                    id: "23456",
                    "title": "Couch",
                    "description": "Nice leather couch",
                    "userCategory": "furniture",
                    "location": "Haukipudas",
                    "image1": null,
                    "image2": null,
                    "image3": null,
                    "image4": null,
                    "askingPrice": 1550,
                    "dateCreated": "2022-01-01",
                    // deliveryType missing
                    "sellersName": "Jonna",
                    "sellersContact": 2
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                })
        })
        it('should reject request with incorrect datatypes', function(done) {
            chai.request(serverAddress)
                .post('/products')
                .send({
                    id: 34567, // inorrect datatype
                    "title": "Violin",
                    "description": "Lightly used pink violin with extra strings",
                    "userCategory": "music",
                    "location": "Oulu",
                    "image1": null,
                    "image2": null,
                    "image3": null,
                    "image4": null,
                    "askingPrice": 200,
                    "dateCreated": "2022-02-01",
                    "deliveryType": 3,
                    "sellersName": "Salla",
                    "sellersContact": 3
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                })
        })
        it('should reject empty post', function(done) {
            chai.request(serverAddress)
                .post('/products')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                })
        })

        describe('add user', function() {
            it('should accept user when data is correct', function(done) {
                chai.request(serverAddress)
                    .post('/users')
                    .send({

                        id: "",
                        firstName: "Testi",
                        lastName: "Kayttaja",
                        email: "testi@email.com",
                        DOB: "1990-01-01",
                        emailVerified: true,
                        created: "2022-02-22",
                        phoneNumber: "+358501111111",
                        address: "Tie 1 talo 2, Kunta, 00000"
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        done();
                    })
            })
            it('should reject empty post', function(done) {
                chai.request(serverAddress)
                    .post('/users')
                    .end(function(err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        done();
                    })
            })
            it('should reject request with incorrect datatypes', function(done) {
                chai.request(serverAddress)
                    .post('/users')
                    .send({
                        id: "11111",
                        firstName: "Testi",
                        lastName: "Kayttaja",
                        email: "testi@email.com",
                        DOB: "1990-01-01",
                        emailVerified: true,
                        created: "Testi", // incorrect datatype
                        phoneNumber: "+358501111111",
                        address: "Tie 1 talo 2, Kunta, 00000"
                    })
                    .end(function(err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        done();
                    })
            })
            it('should reject request when there is missing fields', function(done) {
                chai.request(serverAddress)
                    .post('/users')
                    .send({
                        id: "11111",
                        firstName: "Testi",
                        lastName: "Kayttaja",
                        email: "testi@email.com",
                        DOB: "1990-01-01",
                        emailVerified: true,
                        // created missing
                        phoneNumber: "+358501111111",
                        address: "Tie 1 talo 2, Kunta, 00000"

                    })
                    .end(function(err, res) {
                        expect(err).to.be.null;
                        expect(res).to.have.status(400);
                        done();
                    })
            })
        })
    })
})