import sequelize from '../config/database.js';
import User from './User.js';
import Footprint from './Footprint.js';
import Bill from './Bill.js';

// Associations
User.hasMany(Footprint, { foreignKey: 'userId' });
Footprint.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Bill, { foreignKey: 'userId' });
Bill.belongsTo(User, { foreignKey: 'userId' });

export { sequelize, User, Footprint, Bill };
