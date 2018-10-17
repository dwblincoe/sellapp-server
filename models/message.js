module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        recieverId:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        senderId:{
            type: DataTypes.INTEGER
        },
        itemId:{
            type:DataTypes.INTEGER
        },
        message:{
            type:DataTypes.STRING,
            allowNull:false
        }
    })
    return Message
} 