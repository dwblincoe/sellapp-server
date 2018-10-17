let express = require('express')
let router = express.Router()
let sequelize = require('../db')
let UserModel = sequelize.import('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let validateSession = require('../middleware/validate-session')


router.get('/', (req, res) =>{
    res.send('Hey! This is from user controller')
})

router.get('/:getone', validateSession, (req, res) => {
    UserModel.findOne({where: {id: req.params.getone}})
    .then(user => res.json(user))
})

router.post('/signup', (req, res) => {
    const userFromRequest ={
        firstName: req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10)
    }
    UserModel   
        .create(userFromRequest)
        .then(
            createSuccess = (user =>{
                let token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn:60*60*24})
            res.json({
                user:user,
                message: 'User created',
                sessionToken: token
                })
            })
        )
        .catch(err => res.json(req.errors))
})

router.post('/login', (req, res) => {
    UserModel
        .findOne({where: {email: req.body.email}})
        .then(
            user => {
                if(user){
                    bcrypt.compare(req.body.password, user.password, (err, matches) =>{
                        if(matches){
                            let token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn:60*60*24})
                            res.json({
                                user: user,
                                message: 'Successful Login',
                                sessionToken: token
                            })
                        } else {
                            res.status(500).send({err: 'email and passward do not match'})
                        }
                    })
                } else {
                    res.send({err:'Email does not exist'})
                }
            }
        )
        .catch(err => res.send({err:'Failed to process'}))
})

module.exports = router;