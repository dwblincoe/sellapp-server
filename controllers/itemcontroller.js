let express = require('express')
let router = express.Router()
let sequelize = require('../db')
let Item = sequelize.import('../models/item')
let multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    //reject file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true)
    } else{
        cb(null, false);
    }
}
const upload = multer({
    storage: storage, 
    limits: {fileSize:1024 * 1024 * 5},
    fileFilter: fileFilter
})

let validateSession = require('../middleware/validate-session')


router.get('/', (req, res) => {
    Item.findAll()
        .then(item => res.json(item))
        .catch(err => res.send({error: err}))
})

router.get('/useritems', validateSession, (req, res) => {
    let owner = req.user.id
    
    Item.findAll({where:{userId: owner}})
        .then(item => res.json(item))
        .catch(err => res.send({error:err}))
})

router.get('/:id', validateSession, (req, res) => {
    Item.findOne({where: {id: req.params.id}})
        .then(item => res.json(item))
        .catch(err => res.send({error:err}))
})

router.post('/additem', validateSession, upload.single('itemImg'), (req, res) =>{
    let owner = req.user.id
    const itemFromRequest ={
        itemName: req.body.itemName,
        itemPrice: req.body.itemPrice,
        itemDescription: req.body.itemDescription,
        itemImg: req.file.path,
        userId: owner
    }
    Item.create(itemFromRequest)
        .then(item => res.json({item}))
        .catch(err => res.send({error:err}))
})

router.put('/update/:id', validateSession, (req, res) => {
    let item = req.params.id
    Item.update(req.body, {where: {id: item }})
        .then(updatedItem => res.json(updatedItem))
        .catch(err => res.send({error: err}))
})

router.delete('/delete/:id', validateSession, (req, res) => {
    let item = req.params.id
    Item.destroy({where: { id: item }})
        .then(item => res.json(item))
        .catch(err => res.send({error: err}))
})
module.exports = router