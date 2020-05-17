const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
//const path = require('path') //TRABALHAR COM DIRETORIOS - chamei bootstrap pelo link nao pelo arquivo. então nao precisa
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//sessão
app.use(session({
    secret: "curso",
    resave:true,
    saveUninitialized: true
}))
//flash - tem que ficar abaixo da session
app.use(flash())
//middlewares - configurar a sessão
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg") //variavel global
    res.locals.error_msg = req.flash("error_msg")
    next()//obrigatorio senao trava
})
//middlewares
app.use((req,res,next)=>{
    //console.log("oi, sou um middle")
    next()//OBRIGATORIO SENAO TRAVA
})

//configuracoes
app.engine('handlebars',handlebars({
    defaultLayout: 'main'
}))
app.set('view engine','handlebars')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/blogapp", {
    //conf adicional
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then( () => {
    console.log("conectado!")
}).catch((erro) =>{
    console.log('ha um erro: ' +erro);
})

//ROUTES GRUP. PREFIXO /admin
app.use('/admin',admin)

app.use(express.static('public'));

const port = 8089
app.listen(port,() => {
    console.log("rodando")
})