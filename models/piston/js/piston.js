
var amp = 1.8, t = 0, rodLength = 4.5, pistonPinPos = Math.sqrt(Math.pow(
		rodLength, 2)
		- Math.pow(amp, 2));
var cosX = [], cosY = [];
var sinfn = function(x) {
	return amp * Math.sin(x);
};
var cosfn = function(x) {
	return amp * Math.cos(x);
};
// //managing geometric elements
var board = JXG.JSXGraph.initBoard('jBox', {
	boundingbox : [ -3.3, 10, 10, -3.5 ],
	axis : false,
	keepaspectratio : true,
	showcopyright : false,
	shownavigation : false
});
var p1 = board.create('point', [ 0.4, 0 ], {
	visible : false,
	fixed : true
});
var p2 = board.create('point', [ 0.4, 10 ], {
	visible : false,
	fixed : true
});
var p3 = board.create('point', [ -0.4, 10 ], {
	visible : false,
	fixed : true
});
var p4 = board.create('point', [ -0.4, 0 ], {
	visible : false,
	fixed : true
});
// create the long pole
var poly = board.create('polygon', [ p1, p2, p3, p4 ], {
	withLines : true,
	fillOpacity : 1,
	fillColor : '#ccccb3',
	borders : {
		strokeWidth : 5,
		strokeColor : '#0000e6'
	},
	highlight : false,
	gradient : 'linear',
	gradientsecondcolor : '#999'
});
poly.createGradient();
var q = [];
q.push(board.create('point', [ 0.3, pistonPinPos - 0.2 ], {
	visible : false
}));
q.push(board.create('point', [ 0.3, pistonPinPos + 0.3 ], {
	visible : false
}));
q.push(board.create('point', [ -0.3, pistonPinPos + 0.3 ], {
	visible : false
}));
q.push(board.create('point', [ -0.3, pistonPinPos - 0.2 ], {
	visible : false
}));
// create pin
var poly2 = board.create('polygon', q, {
	withLines : true,
	fillOpacity : 1,
	fillColor : '#999',
	borders : {
		strokeWidth : 1,
		strokeColor : '#888'
	},
	highlight : false,
	gradient : 'linear',
	gradientsecondcolor : '#fff'
});
poly2.createGradient();
g = board.create("group", q);
// the big circle, radius depend on amp, and change accordingly.
var crank = board.create("circle", [ [ 0, 0 ], function() {
	return amp + 0.3;
} ], {
	strokeColor : '#888',
	fillColor : '#0000e6',
	fillOpacity : 0.8
});
// dot that move around the crank and be attach to the pole
var dot = board.create("point", [ amp, 0 ], {
	size : 3,
	highlight : false,
	strokeColor : "#888",
	fillColor : "#165a71",
	showinfobox : false,
	name : ""
});
var pistonPin = board.create("point", [ 0, pistonPinPos ], {
	visible : false
});
var rod = board.create("segment", [ dot, pistonPin ], {
	strokeWidth : 3,
	highlight : false,
	strokeColor : "#888",
	fillColor : "#165a71",
	showinfobox : false,
	name : ""
});
// add dynamic cos graph
var cosgrph = board.create("curve", [ [], [] ], {
	strokeColor : "#0000e6",
	strokeWidth : 2,
	highlight : false
});
var ptonCurve = board.create("point", [ 1, pistonPinPos ], {
	size : 1,
	color : "#0000e6",
	name : ""
});
// line between the piston pin and the curve, use to draw a wave.
var hori = board.create("segment", [ pistonPin, ptonCurve ], {
	strokWidth : 1,
	highlight : false,
	strokeColor : "#ccc",
	fillColor : "#d00",
	showinfobox : false,
	name : ""
});

board.create("text", [ 4, 8, "amplitude" ]);
board.create("text", [ 4, 9, "rod length" ]);
// amplitude slider.
var amp_slid1 = board.create("slider",
		[ [ 7, 8 ], [ 10, 8 ], [ 0.5, amp, 3 ] ], {
			strokeColor : "#d00",
			fillColor : "#d00",
			size : 4,
			withTicks : false
		});
// rodLength slider.
var rod_slid = board.create("slider", [ [ 7, 9 ], [ 10, 9 ],
		[ 0.5, rodLength, 6 ] ], {
	strokeColor : "#d00",
	fillColor : "#d00",
	size : 4,
	withTicks : false
});

amp_slid1.highline.setAttribute({
	strokeColor : "#0000e6"
});
amp_slid1.baseline.setAttribute({
	strokeColor : "#0000e6"
});

amp_slid1.on("drag",
		function() {
			cosX.length = 0;
			cosY.length = 0;

			rodLength = rod_slid.Value();
			amp = amp_slid1.Value();

			for (i = 0; i < t; i += 0.1) {
				cosX.push(i + 1);
				cosY.push(rodLength + cosfn(Math.PI / 2 - i));
			}
			if (rodLength < amp) {
				rod_slid.moveTo([ 0.2 + Math.max(amp_slid1.X(), rod_slid.X()),
						-1 ], 0);
			}
			board.update();
		});
rod_slid.highline.setAttribute({
	strokeColor : "#0000e6"
});
rod_slid.baseline.setAttribute({
	strokeColor : "#0000e6"
});
rod_slid.on("drag",
		function() {
			rodLength = rod_slid.Value();
			amp = amp_slid1.Value();
			cosX.length = 0;
			cosY.length = 0;
			for (m = 0; m < t; m += 0.1) {
				cosX.push(m + 1);
				cosY.push(rodLength + cosfn(Math.PI / 2 - m));// draw of the
																// line will
																// adapat the
																// change with
																// rod
			}
			if (rodLength < amp) {
				amp_slid1.moveTo([ Math.min(amp_slid1.X(), rod_slid.X()) - 0.2,
						-1 ], 0);
			}
			board.update();
		});

// draw dynamic cos when point move
cosgrph.updateDataArray = function() {
	this.dataX = cosX;// x positon of the cos wave -->responsible for draw
	this.dataY = cosY;// y positon of the cos wave
};
// the static cos wave.
var cosgrphReal = board.create("functiongraph", [ function(x) {
	return rodLength + cosfn(Math.PI / 2 - x + 1);
}, 1, 1 + 6 * Math.PI ], {
	strokeColor : "#165a71",
	strokeWidth : 1,
	opacity : 0.5,
	highlight : false
});
move = function() {
	// set the position of the pin back to start after 6 waves
	if (t < 6 * Math.PI) {
		if (t == 0) {
			cosX = [ 1 ];
			cosY = [ pistonPinPos ];
		} else {
			cosX.push(t + 1);
			cosY.push(pistonPinPos);
		}
		// point:move the the drawing dot.
		ptonCurve.setPositionDirectly(JXG.COORDS_BY_USER, [ 1, t + 1,
				pistonPinPos ]);
		// piston pin move
		q[0].setPositionDirectly(JXG.COORDS_BY_USER, [ 1, 0.3,
				pistonPinPos - 0.2 ]);
		t += 0.0333;
	} else {
		t = 0;
		cosX = [ 1 ];
		cosY = [ pistonPinPos ];
	}
	// dot move according to radius of circle(amp) in circle(dot inside big
	// circle)
	dot.moveTo([ cosfn(t), sinfn(t) ]);
	// theta = PI/2 - t = 90-t --> because sin(90-t)=cos(t)
	// x=rcosA+sqrt(L^2-r^2sin^2 theta)`
	pistonPinPos = amp
			* Math.cos(Math.PI / 2 - t)
			+ Math.sqrt(Math.pow(rodLength, 2) - Math.pow(amp, 2)
					* Math.pow(Math.sin(Math.PI / 2 - t), 2));
	pistonPin.moveTo([ 0, pistonPinPos ]);
}

$("#goButt").click(function() {
	if ($(this).text() == "Stop") {
		clearInterval(doMove);
		$(this).text("Start");
	} else {
		startTime = Date.now();
		interval = 50;
		doMove = setInterval(move, interval);
		$(this).text("Stop");
	}
});
