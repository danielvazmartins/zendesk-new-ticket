$(function() {
	// Abrir novo ticket
	$("#bt-new-ticket").click(function(e){
		e.preventDefault();

		$.ajax({
			url: "/new-ticket",
			type: "POST",
			data: $("#form-new-ticket").serialize(),
			success: function(data) {
				console.log("sucesso", data);
			},
			error: function(x,y,z) {
				console.log("Erro: ", x, y, z);
			}
		});
	});
});