const { body } = require('express-validator');
const { parseError } = require('../util/parser');
const { register, login } = require('../services/userService');

const authController = require('express').Router();


authController.get('/register', (req, res) => {
    // TODO: replace with actual view by assignment
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register',
    body('username')
        .isLength({ min: 5 }).withMessage('Username must be at least 5 characrets long!')
        .isAlphanumeric().withMessage('Username may contain only letters and digits!'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characrets long!')
        .isAlphanumeric().withMessage('Password may contain only letters and digits!'),
    async (req, res) => {
        try {
            if (req.body.username == '' || req.body.password == '') {
                throw new Error('All fields are required!');
            }

            // if(req.body.password.length < 5){
            //     throw new Error('Password must be at least 5 characters long!');
            // }

            if (req.body.password !== req.body.repass) {
                throw new Error('Password missmatch!');
            }
            // TODO: check assignmet if register create session
            const token = await register(req.body.username, req.body.password);
            res.cookie('token', token);
            res.redirect('/');  // TODO: replace with redirect from assignment

        } catch (error) {
            const errors = parseError(error);

            // TODO: add error display to actual template from assignmet
            res.render('register', {
                title: 'Register Page',
                errors,
                body: {
                    username: req.body.username
                }
            });
        }
    });

authController.get('/login', (req, res) => {
    // TODO: replace with actual view by assignment
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.username, req.body.password);

        res.cookie('token', token);
        res.redirect('/');  // TODO: replace with redirect from assignment

    } catch (error) {
        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            errors,
            body: {
                username: req.body.username
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = authController;