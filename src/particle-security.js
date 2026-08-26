const VS=`
attribute vec2 aPosition;attribute float aSeed;
uniform float uTime;uniform vec2 uPointer;uniform float uPointerStrength;uniform float uAspect;uniform float uReducedMotion;uniform float uHero;
varying float vSeed;varying float vAlpha;
void main(){float motion=1.0-uReducedMotion;float bob=sin(uTime*(.52+uHero*.12))*(.012+uHero*.005)*motion;float pulse=1.0+sin(uTime*.38)*(.004+uHero*.002)*motion;vec2 p=aPosition*pulse+vec2(sin(uTime*.31)*.004*motion,bob);float group=floor(aSeed*6.0);float shardAngle=group*1.0472+.35;float breathe=(.004+.004*sin(uTime*.72+group))*uHero*motion;p+=vec2(cos(shardAngle),sin(shardAngle))*breathe;float depth=(fract(aSeed*6.0)-.5)*.22*uHero;float turn=(-.07+sin(uTime*.24)*.018*motion)*uHero;float rx=p.x*cos(turn)+depth*sin(turn);depth=-p.x*sin(turn)+depth*cos(turn);p.x=rx;vec2 projected=vec2(p.x/uAspect,p.y);vec2 delta=projected-uPointer;float influence=smoothstep(.46,0.0,length(delta))*uPointerStrength;float randomAngle=fract(aSeed*37.17)*6.28318+sin(uTime*.7+aSeed*19.0)*.28;float randomForce=.14+fract(aSeed*91.7)*.25;vec2 burst=vec2(cos(randomAngle)*uAspect,sin(randomAngle))*influence*randomForce*1.3;vec2 repel=normalize(delta+vec2(.0001))*influence*.091;p+=burst+vec2(repel.x*uAspect,repel.y);depth+=influence*(fract(aSeed*53.1)-.2)*.936;float perspective=1.0/(1.0-depth*.2);p*=perspective;gl_Position=vec4(p.x/uAspect,p.y,0,1);gl_PointSize=(1.35+fract(aSeed*19.3)*1.45+influence*(1.0+fract(aSeed*11.2)*2.0)+uHero*.3)*perspective;vSeed=aSeed;vAlpha=.4+fract(aSeed*13.7)*.58;}`;
const FS=`precision mediump float;varying float vSeed;varying float vAlpha;uniform float uStandards;void main(){float d=length(gl_PointCoord-.5);float dot=smoothstep(.5,.17,d);vec3 deep=vec3(.055,.322,.722);vec3 bright=vec3(.004,.502,1.0);vec3 color=mix(deep,bright,fract(vSeed*8.71));if(uStandards>.5){vec3 logoBlue=vec3(.055,.39,.96);vec3 logoOrange=vec3(.98,.47,.08);color=vSeed<.5?logoBlue:logoOrange;}gl_FragColor=vec4(color,dot*vAlpha);}`;
function line(ctx,x1,y1,x2,y2,w=12){ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function circle(ctx,x,y,r,w=10){ctx.lineWidth=w;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}
function drawShield(ctx,hero=false){ctx.lineWidth=hero?18:13;ctx.beginPath();ctx.moveTo(450,55);ctx.bezierCurveTo(365,105,300,110,245,118);ctx.lineTo(245,258);ctx.bezierCurveTo(245,370,350,424,450,472);ctx.bezierCurveTo(550,424,655,370,655,258);ctx.lineTo(655,118);ctx.bezierCurveTo(600,110,535,105,450,55);ctx.stroke();circle(ctx,450,258,80,hero?15:11);ctx.strokeRect(405,245,90,82);ctx.beginPath();ctx.arc(450,245,46,Math.PI,0);ctx.stroke();line(ctx,450,282,450,314,13);}
function shieldPath(ctx,inset=0){ctx.beginPath();ctx.moveTo(450,55+inset);ctx.bezierCurveTo(365,105+inset*.35,300+inset,110+inset*.25,245+inset,118+inset*.2);ctx.lineTo(245+inset,258);ctx.bezierCurveTo(245+inset,370-inset*.4,350,424-inset*.35,450,472-inset);ctx.bezierCurveTo(550,424-inset*.35,655-inset,370-inset*.4,655-inset,258);ctx.lineTo(655-inset,118+inset*.2);ctx.bezierCurveTo(600-inset,110+inset*.25,535,105+inset*.35,450,55+inset);ctx.closePath();}
function cube(ctx,cx,cy,s){polygon(ctx,[[cx,cy-s],[cx+s,cy-s*.48],[cx,cy+4],[cx-s,cy-s*.48]],7);polygon(ctx,[[cx-s,cy-s*.48],[cx,cy+4],[cx,cy+s],[cx-s,cy+s*.46]],7);polygon(ctx,[[cx+s,cy-s*.48],[cx,cy+4],[cx,cy+s],[cx+s,cy+s*.46]],7)}
function drawTrustShield(ctx){ctx.save();ctx.translate(450,260);ctx.rotate(-.025);ctx.translate(-450,-260);ctx.lineJoin='round';shieldPath(ctx,0);ctx.globalAlpha=.035;ctx.fill();ctx.globalAlpha=1;ctx.lineWidth=50;ctx.stroke();ctx.lineWidth=19;shieldPath(ctx,22);ctx.stroke();line(ctx,348,255,422,330,54);line(ctx,422,330,558,178,54);ctx.restore()}
function drawCryptoCoin(ctx,x,y,type){
  circle(ctx,x,y,42,8);circle(ctx,x,y,32,3);
  if(type==='btc'){
    line(ctx,x-8,y-23,x-8,y+23,6);line(ctx,x-16,y-17,x+6,y-17,6);line(ctx,x-16,y,x+8,y,6);line(ctx,x-16,y+18,x+5,y+18,6);
    ctx.lineWidth=6;ctx.beginPath();ctx.arc(x+5,y-9,10,-Math.PI/2,Math.PI/2);ctx.arc(x+5,y+9,10,-Math.PI/2,Math.PI/2);ctx.stroke();
  }else if(type==='eth'){
    polygon(ctx,[[x,y-25],[x-17,y+2],[x,y+12],[x+17,y+2]],5);polygon(ctx,[[x,y+17],[x-15,y+7],[x,y+27],[x+15,y+7]],4);
  }else{
    line(ctx,x-19,y-17,x+19,y-17,6);line(ctx,x,y-17,x,y+20,6);ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(x,y-5,21,7,0,0,Math.PI*2);ctx.stroke();
  }
}
function drawLock(ctx){
  ctx.save();
  ctx.translate(450,270);ctx.scale(1.12,1.12);ctx.translate(-450,-270);
  ctx.lineJoin='round';ctx.lineCap='round';

  // Heavy rounded shackle, based on a polished product-style padlock silhouette.
  ctx.lineWidth=42;ctx.beginPath();ctx.moveTo(315,224);ctx.lineTo(315,158);
  ctx.bezierCurveTo(315,73,374,42,450,42);
  ctx.bezierCurveTo(526,42,585,73,585,158);ctx.lineTo(585,224);ctx.stroke();
  ctx.globalAlpha=.42;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(332,218);ctx.lineTo(332,158);
  ctx.bezierCurveTo(332,91,382,61,450,61);
  ctx.bezierCurveTo(518,61,568,91,568,158);ctx.lineTo(568,218);ctx.stroke();ctx.globalAlpha=1;

  // Wide body with a straight shoulder and a soft, bulbous lower edge.
  ctx.beginPath();ctx.moveTo(238,214);ctx.lineTo(662,214);ctx.lineTo(662,346);
  ctx.bezierCurveTo(662,438,584,480,450,480);
  ctx.bezierCurveTo(316,480,238,438,238,346);ctx.closePath();
  ctx.globalAlpha=.28;ctx.fill();ctx.globalAlpha=1;ctx.lineWidth=28;ctx.stroke();
  ctx.globalAlpha=.5;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(257,229);ctx.lineTo(643,229);ctx.stroke();ctx.globalAlpha=1;

  // Distinct circular keyhole and tapered stem cut out of the particle mask.
  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath();ctx.arc(450,322,42,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(434,350);ctx.lineTo(466,350);ctx.lineTo(478,417);
  ctx.quadraticCurveTo(450,438,422,417);ctx.closePath();ctx.fill();
  ctx.globalCompositeOperation='source-over';
  ctx.lineWidth=8;ctx.beginPath();ctx.arc(450,322,47,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(432,353);ctx.lineTo(418,421);ctx.quadraticCurveTo(450,446,482,421);ctx.lineTo(468,353);ctx.stroke();
  ctx.restore();
}
function drawHero(ctx){
  ctx.save();ctx.translate(450,260);ctx.scale(1.24,1.06);ctx.translate(-450,-260);drawTrustShield(ctx);ctx.restore();
}
function drawWorld(ctx){
  drawLock(ctx);
}
function polygon(ctx,points,w=12){ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(...points[0]);points.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();ctx.stroke()}
function drawStandards(ctx){
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  ctx.strokeStyle='#267cf4';ctx.lineWidth=68;ctx.beginPath();ctx.moveTo(205,300);ctx.lineTo(355,150);ctx.quadraticCurveTo(380,125,408,150);ctx.lineTo(505,238);ctx.stroke();
  ctx.strokeStyle='#f47f22';ctx.lineWidth=72;ctx.beginPath();ctx.moveTo(205,324);ctx.lineTo(340,444);ctx.quadraticCurveTo(382,478,420,436);ctx.lineTo(700,128);ctx.stroke();
  ctx.restore();
}
function mask(mode){const canvas=document.createElement('canvas');canvas.width=900;canvas.height=520;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.strokeStyle='#fff';ctx.fillStyle='#fff';mode==='hero'?drawHero(ctx):mode==='world'?drawWorld(ctx):drawStandards(ctx);return {data:ctx.getImageData(0,0,900,520).data,width:900,height:520}}
function makePoints(mode,count){const m=mask(mode),out=[];let tries=0;while(out.length<count*3&&tries<count*110){tries++;const x=Math.floor(Math.random()*m.width),y=Math.floor(Math.random()*m.height),i=(y*m.width+x)*4,alpha=m.data[i+3];if(alpha<2||Math.random()>alpha/255)continue;const seed=mode==='hero'?((x<300?0:x>600?2:1)+(y>280?3:0)+Math.random()*.82)/6:mode==='standards'?(m.data[i]>m.data[i+2]?(.55+.4*Math.random()):(.05+.4*Math.random())):Math.random();out.push((x/m.width*2-1)*.92,(1-y/m.height*2)*.86,seed)}return new Float32Array(out)}
function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader}
export class ParticleSecurityVisual{
  constructor(canvas,mode){this.canvas=canvas;this.mode=mode;this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!this.gl)throw new Error('WebGL unavailable');this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.pointer=[2,2];this.target=[2,2];this.strength=0;this.targetStrength=0;this.start=performance.now();const gl=this.gl,p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,VS));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));this.program=p;const mobile=matchMedia('(max-width:767px)').matches,count=mode==='hero'?(mobile?5200:9400):(mobile?3500:6200);this.data=makePoints(mode,count);this.count=this.data.length/3;const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,this.data,gl.STATIC_DRAW);gl.useProgram(p);const position=gl.getAttribLocation(p,'aPosition'),seed=gl.getAttribLocation(p,'aSeed');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,12,0);gl.enableVertexAttribArray(seed);gl.vertexAttribPointer(seed,1,gl.FLOAT,false,12,8);this.uniforms=Object.fromEntries(['uTime','uPointer','uPointerStrength','uAspect','uReducedMotion','uHero','uStandards'].map(n=>[n,gl.getUniformLocation(p,n)]));canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect(),a=r.width/r.height;this.target=[((e.clientX-r.left)/r.width*2-1)*a,1-(e.clientY-r.top)/r.height*2];this.targetStrength=1});canvas.addEventListener('pointerenter',()=>this.targetStrength=1);canvas.addEventListener('pointerleave',()=>{this.target=[2,2];this.targetStrength=0});this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();this.render=this.render.bind(this);requestAnimationFrame(this.render)}
  resize(){const d=Math.min(devicePixelRatio||1,2),r=this.canvas.getBoundingClientRect();this.canvas.width=Math.max(1,r.width*d);this.canvas.height=Math.max(1,r.height*d);this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}
  render(now){const gl=this.gl;this.pointer[0]+=(this.target[0]-this.pointer[0])*.075;this.pointer[1]+=(this.target[1]-this.pointer[1])*.075;this.strength+=(this.targetStrength-this.strength)*.06;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.useProgram(this.program);gl.uniform1f(this.uniforms.uTime,(now-this.start)/1000);gl.uniform2f(this.uniforms.uPointer,this.pointer[0],this.pointer[1]);gl.uniform1f(this.uniforms.uPointerStrength,this.strength);gl.uniform1f(this.uniforms.uAspect,this.canvas.width/this.canvas.height);gl.uniform1f(this.uniforms.uReducedMotion,this.reduced?1:0);gl.uniform1f(this.uniforms.uHero,this.mode==='hero'?1:0);gl.uniform1f(this.uniforms.uStandards,this.mode==='standards'?1:0);gl.drawArrays(gl.POINTS,0,this.count);requestAnimationFrame(this.render)}
}
