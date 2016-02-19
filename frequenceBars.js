(function() {
	
var 
	numBars = 64,
	hats = [],
	test = 0,
	heightPerc = 0.5,
	spacePerc = 0.1,
	uniColor = 1
;

api.visualisations.add(
	"Frequence bars",
	function( info ) {
		var
			magnitude,
			offset,
			x = 0,
			y = 0,
			i = 0,
			j = 0,
			fallingSpeed = 3,
			ctx = info.ctxCanvas,
			w = ctx.canvas.width,
			h = ctx.canvas.height,
			wLine = Math.round( 1 + 0.005 * h),
			scaling = h * heightPerc,
			data = info.data,
			barSpacing = ctx.canvas.width / ( ( numBars - 1 ) + ( numBars * 1 / spacePerc ) ) ,
			barWidth = barSpacing * 1 / spacePerc,
			mult = info.analyser.frequencyBinCount / numBars,
			linear = ctx.createLinearGradient( 0, scaling, 0, h )
		;

		if ( barSpacing < 1 )
			barSpacing = 0;
		info.analyser.getByteFrequencyData( data );
		ctx.clearRect( 0, 0, w, h );
		linear.addColorStop(0, 'white');
		linear.addColorStop(1, '#00f');
		
		for ( ; i < numBars; ++i ) {
			magnitude = 0;
			offset = Math.floor( i * mult );
			
			// average for bars
			for ( j = 0; j < mult; ++j ) {
				magnitude += data[ offset + j ];
			}
			magnitude = magnitude / mult / 255;

			// update hats coord
			if ( hats[ i ] === undefined || hats[ i ] < magnitude ) {
				hats[ i ] = magnitude ;
			}

			x = i * ( barWidth + barSpacing );

			// draw bars
			ctx.fillStyle = uniColor ? linear : "hsl( " + Math.round( i * 360 / numBars ) + ", 100%, 50% )";
			ctx.fillRect(
				x,
				h,
				barWidth,
				-magnitude * scaling
			);

			// draw hats
			ctx.beginPath();
			ctx.lineWidth = wLine;
			ctx.strokeStyle = "#fff";
			ctx.moveTo( x, h - hats[ i ] * scaling );
			ctx.lineTo( x + barWidth, h - hats[ i ] * scaling );
			ctx.stroke();

			// decrease hats values for the next time
			hats[ i ] = hats[ i ] - fallingSpeed / scaling;
		}
	}
);

})();
