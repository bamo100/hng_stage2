const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./models');
const userRoutes = require('./routes/user');
const organisationRoutes = require('./routes/organisation');
const dotenv = require('dotenv')
const { Sequelize } = require('sequelize');
dotenv.config()


const app = express()

app.use(bodyParser.json())

// User routes
app.use('/auth', userRoutes);
app.use('/api', organisationRoutes);

app.get('/debug', async (req, res) => {
    const pgInstalled = !!require.resolve('pg');
    const sequelize = new Sequelize(process.env.PROD_DB_NAME, process.env.PROD_DB_USER, process.env.PROD_DB_PASSWORD, {
      host: process.env.PROD_DB_HOST,
      port: process.env.PROD_DB_PORT,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  
    try {
      await sequelize.authenticate();
      res.send({
        message: 'Connection has been established successfully.',
        pgInstalled,
        nodeVersion: process.version,
        npmVersion: require('child_process').execSync('npm -v').toString().trim(),
      });
    } catch (error) {
      res.status(500).send({
        message: 'Unable to connect to the database',
        error: error.message,
        pgInstalled,
        nodeVersion: process.version,
        npmVersion: require('child_process').execSync('npm -v').toString().trim(),
      });
    }
  });


const PORT = process.env.PORT || 3000;

// Sync database and start server
sequelize.sync({force: true})
.then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
});
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});


module.exports = app;