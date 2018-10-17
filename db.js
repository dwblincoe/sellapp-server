const Sequelize = require('sequelize')

const sequelize = new Sequelize(`postgresql://postgres:${encodeURIComponent(process.env.PASS)}@localhost/sellapplog`, {
    dialect: 'postgres'
})

sequelize.authenticate().then(
    () => {
        console.log('Connected to sellapplog database')
    }, 
    err => console.log(err)
)

module.exports = sequelize