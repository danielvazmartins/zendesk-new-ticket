var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/default.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zendesk New Tickect' });
});

router.post('/new-ticket', function(req, res, next) {

  // Dados de acesso de uma conta de agente
	var auth = "Basic " + new Buffer(config.zendesk.username + ":" + config.zendesk.password).toString("base64");

  // Parametros do formulario
  var nome = req.body.nome;
  var email = req.body.email;
  var assunto = req.body.assunto;
  var mensagem = req.body.mensagem;

  // Verifica se ja existe um usuario com esse email
  request({
    url: 'https://viewit.zendesk.com/api/v2/users/search.json',
    method: 'GET',
    headers : {
        "Authorization": auth,
        "Content-Type": 'application/json'
    },
    qs: {
      query: '<' + email + '>'
    },
    // Sem esse parametro estava dando erro intemitente nas requisicoes e demorando muito
    forever: true,
    // Retorna o conteudo em json
    json: true   
  }, function(error, response, body) {
    if ( error != null ) {
      res.send('{ok: false}');
    } else {
      if ( body.count == 1 ) {
        // Email encontrado
        console.log("user existent - id = ",body.users[0].id);
        newTicket(body.users[0].id);
        //res.send(body);
      } else {
        // Email nao encontrado, cria um usuário com o e-mail informado
        request({
          url: 'https://viewit.zendesk.com/api/v2/users.json',
          method: 'POST',          
          headers : {
              "Authorization": auth,
              "Content-Type": 'application/json'
          },
          form: {
            user: {
              name: nome,
              email: email
            }
          },
          forever: true,
          json: true
        }, function(error, response, body) {
          // Id do novo usuario
          console.log("new user - id = ",body.user.id);
          newTicket(body.user.id);
          //res.send(body);
        });
      }      
    }
  });

  // Requisicao para abrir um novo ticket
  var newTicket = function(userId) {
    request({
    url : 'https://viewit.zendesk.com/api/v2/tickets.json',
    method: 'POST',   
    headers : {
      "Authorization": auth,
      "Content-Type": 'application/json'
    },
    form: {
      ticket: {
        subject: assunto,
        comment: {
          body: mensagem
        },
        requester_id: userId
      }
    },
    forever: true // Sem esse parametro estava dando erro intemitente nas requisicoes e demorando muito
  }, function(error, response, body) {
    console.log(error, response, body);

    res.send('{ok: true}');
  });
  }

  // Requisicao para abrir um novo ticket
	/*request({
		url : 'https://viewit.zendesk.com/api/v2/tickets.json',
		method: 'POST',		
  		headers : {
  			"Authorization": auth,
  			"Content-Type": 'application/json'
  		},
  		form: {
  			ticket: {
  				subject: req.body.assunto,
  				comment: {
  					body: req.body.mensagem
  				}
  			}
  		},
  		forever: true // Sem esse parametro estava dando erro intemitente nas requisicoes e demorando muito
	}, function(error, response, body) {
		console.log(error, response, body);

    res.send('{ok: true}');
	});	*/

});

module.exports = router;
