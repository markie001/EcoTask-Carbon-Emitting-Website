import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Bill extends Model {}

Bill.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'users', key: 'id' },
        },
        units: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        month: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        billNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        matched: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Bill',
        tableName: 'bills',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false,
    }
);

export default Bill;
