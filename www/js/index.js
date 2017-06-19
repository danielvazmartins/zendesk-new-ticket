$(function(){
	// Abrir novo ticket
	$("#bt-new-ticket").click(function(e){
		e.preventDefault();
		console.log("Iniciando...");

		$.ajax({
			url: "https://viewit.zendesk.com/api/v2/tickets.json",
			type: "POST",
			data: {

			},
			success: function(data) {
				console.log("sucesso", data);
			},
			error: function(x,y,z) {
				console.log("Erro: ", x, y, z);
			}
		});
	});
});

// Envia via curl
//curl https://viewit.zendesk.com/api/v2/tickets.json -d "{\"ticket\": {\"subject\": \"Teste via curl\", \"comment\": { \"body\": \"Testando\" }}}" -H "Content-Type: application/json" -v -u daniel.martins@viewit.com.br:teste10#$ -X POST