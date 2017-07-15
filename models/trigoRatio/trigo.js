brd1 = JXG.JSXGraph.initBoard('jxgbox1',{axis:true,boundingbox:[-5.9,8,5.9,-5.9],keepaspectratio:true,showCopyright:false,showNavigation:false});
var qr = [];
var radius = 5;
//center of circle (0,0)
qr[1] = brd1.create('point', [0,0], {name:"",fixed:true,size:1,strokeColor:'blue',fillColor:'blue'});
//point for the radius.
qr[2] = brd1.create('point', [radius,0], {fixed:true,visible:false});
//create circle with two points: center and radius point.
var circ1 = brd1.create('circle',[qr[1],qr[2]],{strokeColor:'#165a71',highlight:false});
//create a glider: point to move on circle
var g = brd1.create('glider', [3.85,4.4,circ1], {name:'P',style:5,fillColor:'#ff00ff'});
//instrucion for draging point as text
var dm = brd1.create('text', [4.1,4.15,"(Drag the red dot)"],{fixed:true,highlight:false});
//vertex of the rectangle,to form for sinus ratio
//depend on movment of p
qr[4] = brd1.create('point', [function(x){return g.X();},0], {visible:false});
//line between zero and p.
var li1 = brd1.create('segment',[qr[1],g],{strokeWidth:2, strokeColor:'#dd00dd',highlight:false});
//line between P to B
var li2 = brd1.create('segment',[qr[4],g],{strokeWidth:2, strokeColor:'#00dddd',highlight:false}); 
var li3 = brd1.create('segment',[qr[1],qr[4]],{strokeWidth:2, strokeColor:'blue',highlight:false}); 
//an arc to mark the angle
var arc1 = brd1.create('angle',[qr[2],qr[1],g],{radius:1,name:"&theta;"});

//calculate theta in radian and degree and show it on screen
t = brd1.create('text', [0.7, 6, function () {
    return '<p>&theta; = ' + (arc1.Value()).toFixed(1) + ' radians<br />&theta; = ' + (arc1.Value() * 180 / Math.PI).toFixed(1) + '&deg;</p>';
}],{highlight:false,fixed:true});

var updtxt = function() {
	brd1.suspendUpdate();
	Pyr = g.Y().toFixed(2);Pxr = g.X().toFixed(2);tanqr = (g.Y()/g.X()).toFixed(2);
	sinqr = (g.Y()/radius).toFixed(2);cosqr = (g.X()/radius).toFixed(2);
	sin2r = Math.pow((g.Y()/radius),2).toFixed(2);cos2r = Math.pow((g.X()/radius),2).toFixed(2);
	$("#output").html("<p>`tan &theta; = text(opp)/text(adj) = " +Pyr+"/"+Pxr+" = "+tanqr+"`<br /><br />`sin &theta; = text(opp)/text(hyp) = " +Pyr+ "/" + radius + " = " +sinqr+"`<br /><br />`cos &theta; = text(adj)/text(hyp) = " +Pxr+ "/" + radius + " = " +cosqr+"`<br /><br />`(sin theta) / (cos theta) = " +sinqr+ "/" + cosqr +" = "+ tanqr +" = tan theta`<br /><br /></p><p>Also:</p><p>`sin^2 theta = " +sin2r+ "`<br /><br />`cos^2 theta = " +cos2r+ "`<br /><br />`sin^2 theta + cos^2 theta = " +sin2r+ " + " +cos2r+ " = 1`</p>");  
	if (typeof(MathJax) != "undefined") {				
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	} else if(typeof(katex) != "undefined") {
		doAMprocessor = true;
		AMfunc(doAMprocessor);				
	}		
	brd1.unsuspendUpdate();
}
updtxt();
g.on("drag",function(){
	updtxt();
	dm.remove();
});
