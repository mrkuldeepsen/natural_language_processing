const express = require('express')
const app = express() 
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

require("dotenv").config();
const {Leopard} = require("@picovoice/leopard-node");
const { NlpManager } = require('node-nlp');
const fs = require('fs') ;
const { LangEn } = require('@nlpjs/lang-en');
const { ConsoleConnector } = require('@nlpjs/console-connector');
const trainnlp = require('./train-nlp')
var ks = require('node-key-sender')


const PORT  = process.env.PORT || 5001 ;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve('./public')));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


const accessKey = process.env.Access_key;
const handle = new Leopard(accessKey);
const ans = [] ;


io.on('connection', function(socket){
    console.log('a user connected');
});

let value = ''
app.get('/', async (req,res) => {
    value = req.body.p;
    //console.log(value)
    res.status(200).render('home',{
        values:ans,
    });
})

// Train and save the model.
const nlp = new NlpManager({ languages: ['en'], threshold: 0.5 });
nlp.container.register('fs', fs);
//app.use(LangEn);

const connector = new ConsoleConnector();

connector.onHear = async (line ) => {
        line = value ;
        result = await  nlp.process(line);
        ks.sendKey('enter');
        if(result.answer){
            ans.push(result.answer);
            connector.say(result.answer);

        }else{
            ans.push('i am not capable');
            connector.say('i am not capable');
        }
};

(async () => {
    await trainnlp(nlp);
    connector.say('Ask me');
})();

http.listen(PORT,()=>{
    console.log(`app is working on port: ${PORT}`)
})