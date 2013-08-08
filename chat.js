var net = require('net');

var people = [];

var message = function(msg, from){
	
	people.forEach(function(person){
		if(person.id != from && person.writable){
			person.write(msg);
		}
	});
	
}

var server = net.createServer(function(socket){
	
	socket.id = people.length;
	message('\n\r#' + socket.id + ' joined the conversation. \n\r');
	socket.on('end', function(){
		message('\n\r#' + socket.id + ' left the conversation. \n\r ');
	});
	
	var people_logged_in = "";
	
	people.forEach(function(p){
		people_logged_in += '#' + p.id + '\n\r';
	});

	socket.write("Welcome!\n\r");
	if(people.length > 0){
		socket.write("People in the conversation:\n\r" + people_logged_in);
	}
	else{
		socket.write("You're all alone :(\n\r");
	}

	socket.on('data', function(data){
		var msg = '#' + socket.id + ' says: ' + data;		
		message(msg, socket.id);
	});
	
	people.push(socket);
	
});

server.listen(5000);
server.on('end', function(){
	message("That's it, folks.");
});
