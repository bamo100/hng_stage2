const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./models');
const userRoutes = require('./routes/user');
const organizationRoutes = require('./routes/organization');
const dotenv = require('dotenv')
dotenv.config()


const app = express()

app.use(bodyParser.json())

// User routes
app.use('/auth', userRoutes);
app.use('/api', organizationRoutes);

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