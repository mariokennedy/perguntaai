const express = require("express");
const app = express();
const connection = require("./database/database");
const Perguntar = require("./database/Perguntar");
const Resposta = require("./database/Responder");
const Responder = require("./database/Responder");

connection
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

app.set("view engine", "ejs" );
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/' , (req , res)=>{
    
   Perguntar.findAll({raw: true, order: [['id', 'DESC']]}).then(teste => {
      res.render("index",{
         perguntas: teste
      });
   });
});

app.get('/pergunta/:id' , (req , res)=>{

   var id = req.params.id;

   Perguntar.findOne({
      where:{
         id: id
      }
   }).then(pergunta => {
      if(pergunta != undefined){
         Responder.findAll({
            where:{
               perguntaId: pergunta.id
            },
            order: [
               ["id","DESC"]
            ]
         }).then(resposta => {
            res.render("pergunta",{
               pergunta: pergunta,
               resposta: resposta
            });
         });

      }else{
         res.redirect("/");
      }
   });
});

app.get('/perguntar' , (req , res)=>{

   res.render("perguntar");

});

app.post('/salvarpergunta' , (req , res)=>{

   var titulo = req.body.titulo;
   var descricao = req.body.descricao;

   Perguntar.create({
      titulo: titulo,
      descricao: descricao
   }).then(() => {
      res.redirect("/");
   }).catch(erro => {
      res.send("deu erro");
      });
});

app.post('/responder' , (req , res)=>{

   var corpo = req.body.corpo;
   var perguntaId = req.body.pergunta;

   Responder.create({
      corpo: corpo,
      perguntaId: perguntaId
   }).then(() => {
      res.redirect("/pergunta/" + perguntaId);
   });
});


app.listen(80, () => {
    console.log("Server is Running! :)");
});