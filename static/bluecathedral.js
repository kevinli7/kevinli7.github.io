Plotly.d3.csv('https://raw.githubusercontent.com/kevinli7/kevinli7.github.io/master/data/3dtnse.csv', function(err, rows){
	function unpack(rows, key) {
	  return rows.map(function(row) { return row[key]; });
	}
	var xd = unpack(rows, 'x');
	var yd = unpack(rows, 'y');
	var zd = unpack(rows, 'z');
	var color = unpack(rows, 'c');

	var rgb_colors = [
		'rgb(123,109,202)',
		'rgb(96,167,91)',
		'rgb(196,91,179)',
		'rgb(177,150,63)',
		'rgb(91,163,208)',
		'rgb(203,95,57)',
		'rgb(0,0,0)'
	];

	var names = ["plainchant", "baroque", "classical", "classical-romantic", "romantic", "20th and 21st", "Blue Cathedral"];

	var data = [];

	var c = 0,
		x1 = [], 
		y1 = [], 
		z1 = [];

	for (i = 0; i < color.length; i++) {
		if (Math.round(color[i]) != c) {
			data.push(
				{
					x: x1, y: y1, z: z1,
					mode: 'markers',
					marker: {
						color: rgb_colors[c],
					    size: 4,
					    symbol: 'circle',
					    line: {
					      color: 'rgb(204, 204, 204)',
					      width: 1
					    },
					    opacity: 0.7
					},
					name: names[c],
				  	type: 'scatter3d'
				}
			);
			x1, y1, z1 = [], [] , [];
			c = c + 1;
		};
		x1.push(xd[i]);
		y1.push(yd[i]);
		z1.push(zd[i]);
	};
	data.push(
		{
			x: x1, y: y1, z: z1,
			mode: 'markers',
			marker: {
				color: rgb_colors[c],
			    size: 5,
			    symbol: 'circle',
			    line: {
			      color: 'rgb(204, 204, 204)',
			      width: 1
			    },
			    opacity: 0.8
			},
			name: names[c],
		  	type: 'scatter3d'
		}
	);
	var layout = {margin: {
	    l: 0,
	    r: 0,
	    b: 0,
	    t: 0
	  }};
	Plotly.newPlot('3d t-SNE', data, layout);
});