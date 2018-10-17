require('dotenv').config()

let express = require('express')
let app = express()
let user = require('./controllers/usercontroller')
let item = require('./controllers/itemcontroller')
let message = require('./controllers/messagecontroller')
let sequelize = require('./db')
let bodyParser = require('body-parser')

sequelize.sync();
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use(require('./middleware/headers'))
app.use('/user', user)
app.use('/item', item)
app.use('/messages', message)



app.listen(process.env.PORT, () => {
    console.log('App is listening on 3001')
})