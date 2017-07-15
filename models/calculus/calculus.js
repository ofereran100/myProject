var brd = JXG.JSXGraph.initBoard('jsxgbox', {
	boundingbox : [ -5, 10, 3, -5 ],
	axis : true,
	showCopyright : false,
});
var amplitude = 3, t = 0;
var p = [];
p.push(brd.create('point', [ -4, (Math.random()) * 5 ], {
	color : "black"
}));
p.push(brd.create('point', [ 1, 4 ], {
	color : "black"
}));
p.push(brd.create('point', [ 2.2, (Math.random()) * 5 ], {
	color : "black"
}));
// Computes the polynomial through a given set of coordinates in Lagrange form
var f = JXG.Math.Numerics.lagrangePolynomial(p);
// var f = JXG.Math.Numerics.lagrangePolynomial(p);

var plot = brd.create('functiongraph', [ f, -5, 5 ], {
	fixed : false,
	size : 5,
	strokeColor : 'black',
	name : '',
	highlight : true,
	showInfobox : false
});
var s = brd.create('glider', [ -2, f(-2), plot ], {
	name : 'drag me'
});
var int = brd.create('integral', [ [ function() {
	return p[0].X();
}, function() {
	return s.X();
} ], plot ], {
	fillOpacity : 0.3
});

var f2 = JXG.Math.Numerics.D(f, null);
var plot2 = brd.create('functiongraph', [ f2, -5, 5 ], {
	color : "#0b4774"
});

var f3 = JXG.Math.Numerics.D(f2, null);
var plot3 = brd.create('functiongraph', [ f3, -5, 5 ], {
	color : "#157fd1"
});

var t1 = brd.create('text', [ 0, f2(0), "f'(x)" ], {
	fontSize : 20,
	color : "#0b4774"
});
var t2 = brd.create('text', [ 1, f3(1), "f''(x)" ], {
	fontSize : 20,
	color : "#157fd1"
});
var t3 = brd.create('text', [ p[1].X() + 0.5, p[1].Y(), "f(x)" ], {
	fontSize : 20
});

brd.on('update', function() {
	t1.moveTo([ 0, f2(0) ]);
	t2.moveTo([ 1, f3(1) ]);
	t3.moveTo([ p[1].X() + 0.5, p[1].Y() ]);

});

t = p[0].X();
var dir = 1;
var move = function() {

	t += dir * 0.1;
	if (t > p[2].X()) {
		dir = -1;
	} else if (t < p[0].X())
		dir = 1;

	s.moveTo([ t, f(t) ]);
	// brd.update();

}

$("#goButt").click(function() {
	if ($(this).text() == "Stop") {
		myTimer = false;
		clearInterval(doMove);

		$(this).text("Start");
	} else {
		frameTime = 0;
		myTimer = true;
		startTime = Date.now();
		int = 100;
		doMove = setInterval(move, int);

		$(this).text("Stop");
	}
});
