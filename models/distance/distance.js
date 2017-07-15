
JXG.Options.grid.gridOpacity = '70';
JXG.Options.grid.gridDash = false;
JXG.Options.axis.ticks.majorHeight = -1;

var board = JXG.JSXGraph.initBoard('jxgbox', {
	boundingbox : [ -11, 8.55, 10.9, -8.55 ],
	showCopyright : false,
	grid : false,
	axis : true,
	snapToGrid : true,
	keepaspectratio : false		
});
var bb = board.getBoundingBox();
board.on('boundingbox', function() {
	bb = board.getBoundingBox();
});
var qr = [];
qr[0] = board.create('point', [ 5, -3 ], {
	fixed : false,
	style : 3,
	strokeColor : '#ff00ff',
	fillColor : '#ff00ff'
});
qr[1] = board.create('point', [ -6, 7 ], {
	fixed : false,
	style : 3,
	strokeColor : '#ff00ff',
	fillColor : '#ff00ff'
});
qr[2] = board.create('point', [ function(x) {
	return qr[1].X();
}, function(x) {
	return qr[0].Y();
} ], {
	fillOpacity : 0,
	strokeOpacity : 0
});
var lim1 = board.create('segment', [ qr[0], qr[1] ], {
	strokeWidth : 2,
	strokeColor : '#ff00ff'
});
var lim2 = board.create('segment', [ qr[1], qr[2] ], {
	strokeWidth : 2,
	strokeColor : '#2222ff',
	dash : 2
});
var lim3 = board.create('segment', [ qr[0], qr[2] ], {
	strokeWidth : 2,
	strokeColor : '#2222ff',
	dash : 2
});

el2 = board
		.create(
				'text',
				[
						function() {
							return bb[2] - (bb[2] - bb[0]) * 0.4;
						},
						function() {
							return bb[1] - (bb[1] - bb[3]) * 0.17;
						},
						function(x) {
							return "<p class='gborder minwidth'>distance AB <br>= &radic; ["
									+ "(<i>x</i><sub>2</sub> &minus;  <i>x</i><sub>1</sub>)<sup>2</sup> + (<i>y</i><sub>2</sub> &minus;  <i>y</i><sub>1</sub>)<sup>2</sup>]<br>= &radic; [("
									+ Math.round(10 * (qr[0].X()))
									/ 10
									+ " &minus; "
									+ Math.round(10 * (qr[2].X()))
									/ 10
									+ ")<sup>2</sup> + ("
									+ Math.round(10 * (qr[1].Y()))
									/ 10
									+ " &minus; "
									+ Math.round(10 * (qr[2].Y()))
									/ 10
									+ ")<sup>2</sup>] <br>= &radic; ["
									+ Math.round(10 * (qr[0].Dist(qr[2])))
									/ 10
									+ "<sup>2</sup> +"
									+ Math.round(10 * (qr[1].Dist(qr[2])))
									/ 10
									+ "<sup>2</sup>] <br>= "
									+ Math.round(10 * (qr[0].Dist(qr[1])))
									/ 10
									+ "</span>";
						} ], {
					fillOpacity : 1
				});

el3 = board.create('text', [
		function(x) {
			return qr[0].X() + 0.7;
		},
		function(x) {
			return qr[0].Y() + 0.5;
		},
		function(x) {
			return "<p>(" + qr[0].X().toFixed(1) + ", " + qr[0].Y().toFixed(1)
					+ ")</p>";
		} ]);

el4 = board.create('text', [
		function(x) {
			return qr[1].X() + 0.7;
		},
		function(x) {
			return qr[1].Y() + 0.5;
		},
		function(x) {
			return "<p>(" + qr[1].X().toFixed(1) + ", " + qr[1].Y().toFixed(1)
					+ ")</p>";
		} ]);

el5 = board.create('text', [
		function(x) {
			return qr[2].X() + 0.7;
		},
		function(x) {
			return qr[2].Y() + 0.7;
		},
		function(x) {
			return "<p>(" + qr[2].X().toFixed(1) + ", " + qr[2].Y().toFixed(1)
					+ ")</p>";
		} ]);

el6 = board
		.create(
				'text',
				[
						function(x) {
							return qr[1].X() - 1;
						},
						function(x) {
							return (qr[1].Y() + qr[2].Y()) / 2;
						},
						function(x) {
							return "<p><i>y</i><sub>2</sub> &minus;  <i>y</i><sub>1</sub> <br>=  "
									+ Math.round(10 * (qr[1].Y()))
									/ 10
									+ " &minus; "
									+ Math.round(10 * (qr[2].Y()))
									/ 10
									+ "<br>= "
									+ (Math.round(10 * (qr[1].Y() - qr[2].Y())) / 10)
									+ "</p>";
						} ]);

el7 = board
		.create(
				'text',
				[
						function(x) {
							return (qr[0].X() + qr[2].X()) / 2 - 1;
						},
						function(x) {
							return qr[2].Y();
						},
						function(x) {
							return "<p><i>x</i><sub>2</sub> &minus;  <i>x</i><sub>1</sub> <br>=  "
									+ Math.round(10 * (qr[0].X()))
									/ 10
									+ " &minus; "
									+ Math.round(10 * (qr[2].X()))
									/ 10
									+ " <br>= "
									+ (Math.round(10 * (qr[0].X() - qr[2].X())) / 10)
									+ "</p>";
						} ]);

var fp = board.create('point', [ 0, 0 ], {
	fixed : true,
	visible : false
});
var l1 = board.create('line', [ fp, [ 5, 0 ] ], {
	strokeWidth : 1,
	strokeColor : '#5b8a9b',
	strokeOpacity : 0.8,
	lastArrow : true
});
var l2 = board.create('line', [ fp, [ 0, 5 ] ], {
	strokeWidth : 1,
	strokeColor : '#5b8a9b',
	strokeOpacity : 0.8,
	lastArrow : true
});
