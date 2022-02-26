const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs');
const BasicStrategy = require('passport-http').BasicStrategy;
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const res = require('express/lib/response')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const { default: Ajv } = require('ajv');
const ajv = new Ajv();
const products = require('./routes/products')
const userSchema = require('./routes/schema/users.schema.json');
const userValidator = ajv.compile(userSchema);
const usersMw = function(req, res, next) {
    const userResult = userValidator(req.body);
    if (userResult == true) {
        next();
    } else {
        res.sendStatus(400);
    }
}

app.use(bodyParser.json());
passport.use(new BasicStrategy(
    function(username, password, done) {
        console.log(username + ' ' + password);
        users.find(users => (users.username === username) && (bcrypt.compareSync(password, users.password)));
        if (users != undefined) {
            done(null, users);
        } else {
            done(null, false);
        }
    }
));

const users = [{
        "id": uuidv4(),
        "firstName": "Janne",
        "lastName": "M",
        "email": "joku@email.com",
        "DOB": "1900-01-01",
        "emailVerified": true,
        "created": "2012-01-01",
        "phoneNumber": "+358501234567",
        "address": "Jokutie 2 asunto 5, Kello, 90820"
    },
    {
        "id": uuidv4(),
        "firstName": "Jonna",
        "lastName": "K",
        "email": "joku@toinen.com",
        "DOB": "1992-01-01",
        "emailVerified": true,
        "created": "2013-02-02",
        "phoneNumber": "+358502345678",
        "address": "Jokutie 3 asunto 4, Haukipudas, 90830"
    },
    {
        "id": uuidv4(),
        "firstName": "Salla",
        "lastName": "P",
        "email": "joku@eri.com",
        "DOB": "1989-01-01",
        "emailVerified": true,
        "created": "2014-03-03",
        "phoneNumber": "+358503456789",
        "address": "Jokutie 4 asunto 3, Oulu, 90800"
    }
];

app.get('/', (req, res) => {
    res.send('Nice')
})

const secret = process.env.secretkey;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = secret;

passport.use(new JwtStrategy(options, function(jwt_payload, done) {

    const user = users.find(u => u.username === jwt_payload.user)
    done(null, user);

}));

app.post('/login', passport.authenticate('basic', { session: false }), (req, res) => {
    const payloadData = {
        user: req.body.username
    };
    const token = jwt.sign(payloadData, secret);
    res.json({ token: token })
})

app.get('/jwtSecured', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ status: "jwt toimii", user: req.body.username });
})

app.get('/users', (req, res) => {
    res.json(users);
})

app.get('/users/:id', (req, res) => {
    let foundIndex = users.findIndex(t => t.id === req.params.id);
    if (foundIndex === -1) {
        res.sendStatus(404);
        return;
    } else {
        res.json(users[foundIndex]);
    }
})

app.delete('/users/:id', (req, res) => {
    let foundIndex = -1;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === req.params.id) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex === -1) {
        res.sendStatus(404);
        return;
    } else {
        users.splice(foundIndex, 1);
        res.sendStatus(202);
    }
})

app.post('/users', usersMw, (req, res) => {
    const salt = bcrypt.genSaltSync(3);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const userResult = userValidator(req.body);
    console.log(userResult);
    if (userResult == true) {
        users.push({
            id: uuidv4(),
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            DOB: req.body.DOB,
            emailVerified: req.body.emailVerified,
            created: req.body.created,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address
        });
        res.sendStatus(201);
    } else {
        res.sendStatus(400);
    }
})

app.put('/users/:id', (req, res) => {
    let foundUser = users.find(t => t.id === req.params.id);
    if (foundUser) {
        foundUser.firstName = req.body.firstName;
        foundUser.lastName = req.body.lastName;
        foundUser.email = req.body.email;
        foundUser.DOB = req.body.DOB;
        foundUser.emailVerified = req.body.emailVerified;
        foundUser.created = req.body.created;
        foundUser.phoneNumber = req.body.phoneNumber;
        foundUser.address = req.body.address;
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.use('/products', products)
let serverInstance = null;

module.exports = {
    start: function() {
        serverInstance = app.listen(port, () => {
            console.log(`listening port ${port}`)
        })
    },
    close: function() {
        serverInstance.close();
    }
}