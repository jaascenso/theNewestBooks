// app.get("/", (req, res) => {
//     res.json("Welcome to my API of the newest books    \
//     /libraries/wook - Get the new releases from Wook\
//     /libraries/bertrand - Get the new releases from Bertrand\
//     /libraries/amazon - Get the new releases from amazon");
// });

// app.get("/libraries", (req, res) => {
//     res.json(articles);
// });

// app.get("/libraries/:bookId", (req, res) => {
//     const bookId = req.params.bookId;
//     const newspaper = books.filter(
//         (newspaper) => newspaper.name == bookId)[0];

//     newspaper.handler(res);
// });


module.exports = app => {
    const controller = require("../controllers/controller.js");
  
    var router = require("express").Router();

    // // Cria um novo registo
    // router.post("/disciplinas/", controller.create);
  
    // Cria um novo utilizador
    router.post("/registar", controller.registar);
  
    // Rota para login - tem de ser POST para não vir user e pass na URL
    router.post("/login", controller.login);

    // Rota para verificar e ativar o utilizador
    router.get("/auth/confirm/:confirmationCode", controller.verificaUtilizador)
  
    // // Envia lista de disciplinas e docentes associados
    // router.get("/disciplinas/", controller.findAll);
  
    // // Busca uma disciplina pelo id
    // router.get("/disciplinas/:id", controller.findOne);
  
    // // Busca todas as disciplinas com uma chave de pesquisa
    // router.get("/disciplinas/key/:id", controller.findKey);

    // // Update a Tutorial with id
    // router.put("/disciplinas/:id", controller.update);
  
    // // Delete a Tutorial with id
    // router.delete("/disciplinas/:id", controller.delete);
  
    // // Create a new Tutorial
    // router.delete("/disciplinas", controller.deleteAll);

    router.get("/", (req, res) => {
        res.json("Welcome to my API of the newest books    \
        /libraries/wook - Get the new releases from Wook\
        /libraries/bertrand - Get the new releases from Bertrand\
        /libraries/amazon - Get the new releases from amazon");
    });

    // router.get("/libraries", (req, res) => {
    //     res.json(articles);
    // });

    // router.get("/libraries/:bookId", (req, res) => {
    //     const bookId = req.params.bookId;
    //     const newspaper = books.filter(
    //         (newspaper) => newspaper.name == bookId)[0];
    
    //     newspaper.handler(res);
    // });
   
    app.use('/api', router);
  };
  