var board, L = 60, alpha = 0, alphaMax = 0.1, t = 0, T = 2, txt = "", g = 9.8;
var boundingBoxHigh = 100, boundingBoxWidth = 100, xPendulum, yPendulum, inc = 0;

xPendulum = L * Math.sin(alphaMax);
yPendulum = boundingBoxHigh - L * Math.cos(alphaMax);

var drawPendulum = function() {
	board = JXG.JSXGraph.initBoard('jxgbox1', {
		boundingbox : [ -boundingBoxWidth, boundingBoxHigh, boundingBoxWidth,
				-boundingBoxHigh ],
		showCopyright : false,
		grid : true,
		axis : true,
		showNavigation : true,
		snapToGrid : true
	});

	amplitudeSlide = board.create("slider", [ [ -100, -90 ], [ -50, -90 ],
			[ 0.1, 0.1, 2 ] ], {
		name : "amplitude: " + txt,
		strokeColor : "#f5f",
		fillColor : "#f5f",
		highlightFillColor : "#f9f",
		size : 4,
		withTicks : false
	});
	// periodSlide =
	// board.create("slider",[[-100,-70],[-50,-70],[0.1,T,6]],{name:"period
	// time",strokeColor:"#f5f",fillColor:"#f5f",highlightFillColor:"#f9f",size:4,withTicks:false});
	mSlide = board.create("slider",
			[ [ -100, 70 ], [ -50, 70 ], [ 2, 5, 20 ] ], {
				name : "radius",
				strokeColor : "#f5f",
				fillColor : "#f5f",
				highlightFillColor : "#f9f",
				size : 4,
				withTicks : false
			});
	lSlide = board.create("slider", [ [ -100, 90 ], [ -50, 90 ],
			[ 10, 50, 100 ] ], {
		name : "L",
		strokeColor : "#f5f",
		fillColor : "#f5f",
		highlightFillColor : "#f9f",
		size : 4,
		withTicks : false
	});

	// Pendulum point
	pPendulum = board.create("point", [ xPendulum, yPendulum ], {
		fixed : true,
		size : 5,
		strokeColor : '#0000FF',
		fillColor : '#165a71',
		name : 'Pendulum',
		highlight : false,
		showInfobox : false,
		visible : false
	});
	sourceP = board.create("point", [ 0, 100 ], {
		fixed : true,
		size : 5,
		strokeColor : '#0000FF',
		fillColor : '#165a71',
		name : 'ceiling',
		highlight : false,
		showInfobox : false
	});
	// line connected to circle
	board.create('segment', [ sourceP, pPendulum ], {
		strokeColor : '#165a71',
		highlight : false
	});
	// create circle
	board.create('circle', [ pPendulum, function() {
		return mSlide.Value();
	} ], {
		fixed : true,
		strokeColor : '#0000FF',
		fillColor : '#0000FF',
		highlight : false
	});

	board.create('text', [ 10, 80, function() {
		return "Amplitude angle: " + txt;
	} ]);

}

drawPendulum();
var sinfnX = function(x) {
	return lSlide.Value() * Math.sin(x);
}
var cosfny = function(x) {
	return boundingBoxHigh - lSlide.Value() * Math.cos(x);
}

var txt = amplitudeSlide.Value() * (180 / Math.PI);
// T = 2*Math.PI(Math.sqrt(L/g));
var move = function() {
	t += 0.1;
	// alpha = alphaMax*Math.cos((2*Math.PI/T)*t);

	T = 2 * Math.PI * (Math.sqrt(lSlide.Value() / g)) / 10;
	alpha = amplitudeSlide.Value() * Math.cos((2 * Math.PI / T) * t);

	// alpha =
	// amplitudeSlide.Value()*Math.cos((2*Math.PI/(periodSlide.Value()))*t);
	// console.log("alphaMax: "+alphaMax);

	// console.log("alpha: "+alpha);
	pPendulum.moveTo([ sinfnX(alpha), cosfny(alpha) ]);

	txt = (amplitudeSlide.Value() * (180 / Math.PI)).toFixed(2);

	// angleP1

	board.update();

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
		// int = 33.33;
		int = 100;
		intOver = 200;
		incAmt = int / intOver;
		doMove = setInterval(move, int);

		$(this).text("Stop");
	}
});
