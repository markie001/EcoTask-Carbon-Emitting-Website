import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Footprint extends Model {}

Footprint.init(
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
        sessionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        transport: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        energy: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        food: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        shopping: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        total: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Footprint',
        tableName: 'footprints',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false,
    }
);

export default Footprint;
