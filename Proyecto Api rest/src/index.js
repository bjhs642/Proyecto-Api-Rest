const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
//Inicializacion
const app = express();
//require('./lib/passport');
//Configuracion
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/indexController'));
app.use(require('./routes/authController'));
app.use(express.static(path.join(__dirname, 'public')));
//Inicio
app.listen(app.get('port'), () => {
    console.log('El server esta en el puerto ', app.get('port'));
})