const express = require('express') 
const path = require('path');
require("dotenv").config();
const {Leopard} = require("@picovoice/leopard-node");
const { NlpManager } = require('node-nlp');
const {manager} = require('./train-nlp');
const fs = require('fs') ;
const { LangEn } = require('@nlpjs/lang-en');
const { ConsoleConnector } = require('@nlpjs/console-connector');
const trainnlp = require('./train-nlp')
const { SpeechRecorder } = require("speech-recorder")
const { devices } = require("speech-recorder")
const Recorder = require('audio-recorder-js');





const app = express()
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

app.get('/', async (req,res) => {
    res.status(200).render('home',{
        values:ans,
    });

})
// Train and save the model.
const nlp = new NlpManager({ languages: ['en'], threshold: 0.5 });
nlp.container.register('fs', fs);
//app.use(LangEn);

const connector = new ConsoleConnector();
connector.onHear = async (parent, line) => {
  
         result = await nlp.process(line);
        if(result.answer){
            ans.push(result.answer);
            connector.say(result.answer);
            
        }else{
            ans.push(result.answer);
            connector.say('i am not capable');
        }
  
};

(async () => {
    await trainnlp(nlp);
    connector.say('Ask me');
})();


app.listen(PORT,()=>{
    console.log(`app is working on port: ${PORT}`)
})