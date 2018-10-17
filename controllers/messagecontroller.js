let express = require('express')
let router = express.Router()
let sequelize = require('../db')
let MessageModel = sequelize.import('../models/message')
let validateSession = require('../middleware/validate-session')

router.post('/create', validateSession, (req, res) => {
    let user = req.user.id
    
    MessageModel.create({
        recieverId: req.body.recieverId,
        senderId: user,
        itemId: req.body.itemId,
        message: req.body.message
    })
    .then(message => res.json(message))
})

router.get('/', validateSession, (req,res) => {
    let user = req.user.id
    MessageModel.findAll({where:{recieverId:user}})
        .then(message => res.json(message))
        .catch(err => res.send({error:err}))
})

router.get('/:itemId/:senderId', validateSession, (req, res) => {
    let user = req.user.id
    MessageModel.findAll({where: {
        recieverId: [user, req.params.senderId],
        itemId: req.params.itemId,
        senderId: [req.params.senderId, user]
        
    }})
    .then(message => res.json(message))
})

router.delete('/:itemId/:senderId', validateSession, (req, res) => {
    let user = req.user.id
    MessageModel.destroy({where:{
        recieverId: [user, req.params.senderId],
        itemId: req.params.itemId,
        senderId: [req.params.senderId, user]
    }})
    .then(message => res.json(message))
})

module.exports = router