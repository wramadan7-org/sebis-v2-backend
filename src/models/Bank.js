const { sequelize, DataTypes, SequelizeInstance } = require('../config/database');

const Bank = sequelize.define('bank', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: SequelizeInstance.UUIDV4,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bankNumber: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
    },
    bankOwnerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    temporaryIdentityId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    paranoid: true,
});

module.exports = {
    Bank,
};
