playersJugando = require('./jugadores');

class Player {
	constructor(name, rating) {
		this.name = name;
	  this.rating = rating;
	}
}

const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const { generateTeams, generateMatches, printMatch } = require('./teamsFunctions')

/*Teams generator*/

//Numero par
const even = numero => numero % 2 == 0

function generarEquipos(jugadores){
	//Generar equipos posibles
	console.log("Generar equipos 1")
	const equipos1 = generateTeams(jugadores, Math.round(jugadores.length/2))
	console.log("Generar equipos 2")
	const equipos2 = even(jugadores.length) ? equipos1 : generateTeams(jugadores, Math.floor(jugadores.length/2))
	// Generar partidas posibles
	console.log("Generar partidas posibles")
	const partidasPosibles = generateMatches(equipos1, equipos2)
	//Mostrar partidas
	console.log(`La cantidad de partidas posibles es ${partidasPosibles.length}`)

	partidasPosibles.slice(0,5).forEach((match,index) => {
		console.log("--------------")
		console.log("--------------")
		console.log("--------------")
		console.log(`Opcion ${index+1}`)
		printMatch(match)
	})
}


//Run
let inputStream = Fs.createReadStream('jugadores.csv', 'utf8');
let i = 1;
let j = 0;
const players = [];

inputStream
.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
.on('data', function (row) {
	if (playersJugando.includes(i)){
		players[j] = new Player(row[0], row[1]);
		j++;
	}
	i++;
})
.on('end', function (data) {;
	const currentTime = new Date();
	generarEquipos(players);
	const duration = (new Date() - currentTime) / ( 1000 ) //in seconds
	console.log(`EL tiempo que se demoro es ${duration} segundos`)
});