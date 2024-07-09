const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./models');
const userRoutes = require('./routes/user');
const organizationRoutes = require('./routes/organization');
const dotenv = require('dotenv')
dotenv.config()
// const db = require('./models')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const jwtsecret = process.env.JWT_SECRET

const app = express()

app.use(bodyParser.json())

// User routes
app.use('/auth', userRoutes);
app.use('/api', organizationRoutes);

// db.sequelize.sync()
//     .then(() => console.log('Database synced'))
//     .catch((error) => console.error('Error syncing database:', error))


  
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const PORT = process.env.PORT || 3000;

// Sync database and start server
sequelize.sync()
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