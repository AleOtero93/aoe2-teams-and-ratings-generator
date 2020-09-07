const playersJugando = require('./jugadores')

class Player {
	constructor(name, rating) {
		this.name = name;
	  this.rating = rating;
	}
}

const Fs = require('fs');
const CsvReadableStream = require('csv-reader');

const puntajes = {
	"OTE": 25478,
	"JUAN": 26307,
	"MIGLI": 22627,
	"FEDE": 12255,
	"MANU": 19476,
	"GERMAN": 12884,
	"DIRRI": 9582,
	"EMA": 8170
};

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
	const sumatoriaPuntos = sum(puntajes);
	const ratings = [];

	for(player in players) {
		const name = players[player].name;
		ratings[player] = players[player].rating;
	}

	const promedioRating = sum(ratings) / ratings.length;

	for(player in players) {
		const name = players[player].name;
		const rating = players[player].rating;
		const dif = calcularPuntaje(puntajes[name], rating, sumatoriaPuntos, ratings, promedioRating);
		console.log(name, Math.round(dif));
	}
});

function calcularPuntaje(puntos, rating, sumatoriaPuntos, ratings, promedioRating) {
	const porcentaje = puntos / sumatoriaPuntos;
	var difPorcentaje = (porcentaje * 100) - (100 / ratings.length);
	difPorcentaje = difPorcentaje / 100;
	const difRatings = rating - promedioRating;
	const porcRating = difRatings / rating;

	const porPuntuacion = difPorcentaje * (50 * ratings.length);
	const porDifRatings = porcRating * (100);

	console.log(porPuntuacion);
	console.log(porDifRatings);
	return porPuntuacion - porDifRatings;
}

function sum( obj ) {
	var sum = 0;
	for( var el in obj ) {
		if( obj.hasOwnProperty( el ) ) {
			sum += parseFloat( obj[el] );
		}
	}
	return sum;
}