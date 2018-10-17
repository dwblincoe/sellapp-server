module.exports = (sequelize, DataTypes) =>{
    const Item = sequelize.define('item', {
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemPrice:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        itemDescription:{
            type:DataTypes.STRING,
            allowNull:false
        },
        itemImg:{
            type: DataTypes.STRING,
            allowNull: false

        },
        userId:{
            type: DataTypes.INTEGER,
            references:{
                model:'users',
                key:'id'
            }
        }
    })
    return Item
}