const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize('tech_blog_db', 'your_db_username', 'your_db_password', {
      host: '127.0.0.1',
      dialect: 'postgres',
    });

module.exports = sequelize;
