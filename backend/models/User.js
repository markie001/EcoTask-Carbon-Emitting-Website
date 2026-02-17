import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        badges: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
);

export default User;
