const express=require('express');
const cors=require('cors');
require('dotenv').config();
const {sequelize}=require('./models');

const app=express();
app.use(cors());
app.use(express.json())

app.use('/api/v1/auth',require('./routes/authRoutes'));
app.use('/api/v1/tasks',require('./routes/taskRoutes'));

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(err.status||500).json({
        success:false,
        message:err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({alter:true})
    .then(()=>{
        console.log('PostgreSQL database synchronization succesful.');
        app.listen(PORT,()=>console.log(`Server executing active over port: ${PORT}`));
    })
    .catch(err=>console.error('Unable to establish database pipeline connection:',err));