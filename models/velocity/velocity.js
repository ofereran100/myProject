    var board,ptA,t0=0,segmentA,myTimer =false,startTime,tangA,frameTime;
    //number of radiant per second
    var revolution = 0 ,t1,w=0.2,v=1,freq,t=0,aSlide,boardPloter,circleA,g,arc1;
    var scope = {};
	var drawPulleys = function() {
		board0 = JXG.JSXGraph.initBoard('jxgbox0', {
				  boundingbox:[-10.35, 12, 22.5, 7],//-10.35, 12, 22.5, 7
				  showCopyright:false, grid:false, axis:false, showNavigation:false, snapToGrid:true
				});
		board = JXG.JSXGraph.initBoard('jxgbox', {
				  boundingbox:[-6.5, 6.5, 21.5, -6.5],
				  showCopyright:false, grid:false, axis:false, showNavigation:false, snapToGrid:true, keepaspectratio:true
				});
      
       boardPloter = JXG.JSXGraph.initBoard('jxgbox2', {
  boundingbox:[-11, 8.55, 10.9, -8.55], 
  showCopyright:false, grid:true, axis:true, snapToGrid:true, keepaspectratio:false
});
      
        aSlide = board0.create("slider",[[-10,11.5],[0,11.5],[0.5,5,6]],{name:"r<sub>1</sub>",strokeColor:"#f5f",fillColor:"#f5f",highlightFillColor:"#f9f",size:4,withTicks:false});
		aSlide.highline.setAttribute({strokeColor:"#165a71"});
		aSlide.baseline.setAttribute({strokeColor:"#165a71"});
      
        board.create('point', [0,0],{fixed:true,size:5,strokeColor:'#0000FF',fillColor:'#165a71',name:'',highlight:false,showInfobox:false,visible:false});
        //radius of circle set to be slide value
		circleA = board.create('circle',[[0,0],function(){ return aSlide.Value();}],{fixed:true,strokeColor:'#7FFF00',fillColor:'none',highlight:false,visible:true});
            tangA = board.create('point', [aSlide.Value()/15,aSlide.Value()],{fixed:true,size:5,strokeColor:'#0000FF',fillColor:'#165a71',name:'',highlight:false,showInfobox:false,visible:false});

      //creat segmentA
      var qr = [];
      qr[0] = board.create('point', [0,0], {fixed:false,style:3,strokeColor:'#ff00ff',fillColor:'#ff00ff',visible:false});  
      var lim1 = board.create('segment',[qr[0],tangA], 
      {strokeWidth:2, strokeColor:'#ff00ff'}); 


            qr[1] = board.create('point', [aSlide.Value(),0], {fixed:false,style:3,strokeColor:'#ff00ff',fillColor:'#ff00ff',visible:false});  
       arc1 = board.create('angle',[qr[1],[0,0],tangA],{radius:1,name:"",strokeColor:'red',visible:true});
    }();


aSlide.on("drag",function(){
      
  
  board.update();      
});

var cosfn1=function(x){return aSlide.Value()*Math.cos(x/aSlide.Value());}
var sinfn1=function(x){return aSlide.Value()*Math.sin(x/aSlide.Value());}

var vRes = aSlide.Value().toFixed(2)*w.toFixed(2);

var angAtxt = board0.create('text',[-10,10,function(){ return "<span class=\"lin\"><strong>Angular velocity:</strong></span><br /><em>&omega;</em><sub>1</sub> = <span class=\"lin\">angular velocity</span> = "+w.toFixed(2)+" rad/s";} ],{highlight:false,fixed:true});
		angAtxt.setAttribute({fontSize:15});
var lintxtA = board0.create('text',[-10,8,function(){ return "<span class=\"lin\"><strong>Linear velocity:</strong></span><br /><em>v</em> = <em>r</em><sub>1</sub> &times; <em>&omega;</em><sub>1</sub> = "+aSlide.Value().toFixed(2)+" &times; "+w.toFixed(2)+"="+ v.toFixed(2) +" m/s";} ],{highlight:false,fixed:true});
		lintxtA.setAttribute({fontSize:15});
		

var inc = 15/100;
var move = function(){
 
   tangA.setPositionDirectly(JXG.COORDS_BY_USER,[cosfn1(t) ,sinfn1(t)]);
   
  t+=inc;
  
     
  w = (inc/(aSlide.Value()))/(freq*Math.pow(10,-3));
  v= w*aSlide.Value(); 
  //vRes = (w*aSlide.Value()).toFixed(2); 
 
  
  
  board.update();
  boardPloter.update();
  
}

	$("#runBTN").click(function(){
        if($(this).text()=="Stop"){
				myTimer = false;
                //stop interval
				clearInterval(doMove);
				fps=0;
				//clearInterval(doFps);

            $(this).text("Start");
        } else {
            frameTime=0;
				myTimer = true;
				startTime = Date.now();
                freq = 33.33;

				doMove = setInterval(move,freq);
          /*
				doFps = setInterval(function(){
					fps = (1000/frameTime).toFixed(1);
				},500);
          */
           // dot0.setAttribute({fixed:true});
            $(this).text("Stop");
        }
    });

plotter();

function plotter(){
 // console.log("fdfdfdfd");
  
 //get x and return y
  //v=rw --> y=rx while r should be change with slider
 var f=  function f(x){ 
  // x=w;
   return aSlide.Value() * x;          
 }
 
  boardPloter.create('functiongraph', [f,0,10]);
}




