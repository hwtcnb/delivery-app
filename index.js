const express = require('express');
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const routes = require('./routes/endpoints')


const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(routes)



const PORT = process.env.PORT || 5000;



async function start() {
    try {
        await mongoose.connect('mongodb+srv://user:user@cluster0.j0dex.mongodb.net/shop', {
            useNewUrlParser: true,
        })
        app.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();