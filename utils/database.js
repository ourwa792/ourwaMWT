require('dotenv').config()
const Sequelize = require("sequelize");

const {Op} = require('sequelize'); 

const seq = new Sequelize("ourwa_mwt", "root", "12345", {
  dialect: "mysql",
  host: "localhost",
  logging: false, // قم بتعطيل السجلات إذا كنت لا تحتاجها
});  

Database = (async () => {
  try {
    // Verify that database connection is valid
    await seq.authenticate();
    console.log("DB Created Successfuly .. ");
    // Drops existing tables if there are any
    await seq.sync({ alter: true });
  } catch (e) {
    console.log(`Error in database : ${e}`);
  }
})();

/* 
// استخدام المتغيرات البيئية من ملف .env
const seq = new Sequelize(
  process.env.MYSQL_ADDON_DB,
  process.env.MYSQL_ADDON_USER,
  process.env.MYSQL_ADDON_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.MYSQL_ADDON_HOST,
    logging: false, // قم بتعطيل السجلات إذا كنت لا تحتاجها
    dialectOptions: {
      connectTimeout: 60000, // زيادة مدة المهلة للاتصال
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  }
);

const Database = (async () => {
  try {
    // التحقق من صحة الاتصال بقاعدة البيانات
    await seq.authenticate();
    console.log('DB Created Successfully .. ourwaMWT');
    // مزامنة قاعدة البيانات (تعديل الجداول إذا لزم الأمر)
    await seq.sync({ alter: true });
  } catch (e) {
    console.log(`Error in database: ${e}`);
  }
})();
 */

module.exports = { Database ,seq ,Op }
