const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute float aSeed;
attribute float aGroup;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uAspect;
uniform float uReducedMotion;
varying float vSeed;
varying float vGroup;
varying float vAlpha;
void main(){
  float motion=1.0-uReducedMotion;
  float bob=sin(uTime*.68+aGroup*.7)*.018*motion;
  float sway=sin(uTime*.37+aSeed*5.0)*.006*motion;
  vec2 p=aPosition*1.25+vec2(sway,bob);
  vec2 screen=vec2(p.x/uAspect,p.y);
  vec2 delta=screen-uPointer;
  float influence=smoothstep(.46,0.0,length(delta))*uPointerStrength;
  float angle=fract(aSeed*37.17)*6.28318+sin(uTime*.7+aSeed*19.0)*.28;
  float force=.14+fract(aSeed*91.7)*.25;
  vec2 direction=normalize(delta+vec2(.0001));
  p+=vec2(cos(angle)*uAspect,sin(angle))*influence*force*1.3+vec2(direction.x*uAspect,direction.y)*influence*.091;
  gl_Position=vec4(p.x/uAspect,p.y,0.0,1.0);
  gl_PointSize=1.65+fract(aSeed*19.3)*1.45+influence*(1.0+fract(aSeed*11.2)*2.0);
  vSeed=aSeed;vGroup=aGroup;vAlpha=.4+fract(aSeed*13.7)*.58;
}`;

const FRAGMENT_SHADER = `
precision mediump float;
varying float vSeed;
varying float vGroup;
varying float vAlpha;
void main(){
  float d=length(gl_PointCoord-.5);
  float dot=smoothstep(.5,.17,d);
  vec3 deep=vec3(.055,.322,.722);
  vec3 bright=vec3(.004,.502,1.0);
  vec3 color=mix(deep,bright,fract(vSeed*8.71));
  gl_FragColor=vec4(color,dot*vAlpha);
}`;

function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;}
function inPolygon(x,y,points){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const xi=points[i][0],yi=points[i][1],xj=points[j][0],yj=points[j][1];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))inside=!inside;}return inside;}
function segmentDistance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/length)),px=a[0]+t*dx,py=a[1]+t*dy;return Math.hypot(x-px,y-py);}
function polygonEdge(x,y,points,width){for(let i=0;i<points.length;i++)if(segmentDistance(x,y,points[i],points[(i+1)%points.length])<width)return true;return false;}
const leftCover=[[-.72,.34],[-.04,.17],[-.04,-.5],[-.69,-.33]];
const rightCover=[[.72,.34],[.04,.17],[.04,-.5],[.69,-.33]];
function pageBounds(x){
  const side=x<0?-1:1,ax=Math.abs(x),outer=Math.min(1,ax/.68);
  const top=.23+.19*Math.sin(outer*Math.PI*.72)+.045*outer;
  const bottom=-.41+.11*outer-.035*Math.sin(outer*Math.PI);
  return {side,ax,top,bottom};
}
function pageAt(x,y){const b=pageBounds(x);return b.ax>.035&&b.ax<.67&&y>b.bottom&&y<b.top;}
function createPoints(count){
  const values=[];let attempts=0;
  while(values.length<count*4&&attempts<count*65){
    attempts++;const x=Math.random()*1.42-.71,y=Math.random()*1.24-.62;
    const coverShape=x<0?leftCover:rightCover;
    const page=pageAt(x,y),cover=inPolygon(x,y,coverShape);
    if(!page&&!cover)continue;
    const b=pageBounds(x),relative=(y-b.bottom)/(b.top-b.bottom);
    const textZone=page&&Math.abs(x)>.12&&Math.abs(x)<.56&&relative>.2&&relative<.76;
    const textLine=textZone&&Math.abs((relative*10)%1-.5)<.11;
    const outerEdge=page&&(Math.abs(y-b.top)<.068||Math.abs(y-b.bottom)<.068||Math.abs(b.ax-.66)<.06);
    const innerPageEdge=page&&(Math.abs(y-b.top)<.115||Math.abs(y-b.bottom)<.115||Math.abs(b.ax-.66)<.105);
    const centerEdge=page&&b.ax<.13;
    const coverEdge=cover&&polygonEdge(x,y,coverShape,.075);
    const coverInnerEdge=cover&&polygonEdge(x,y,coverShape,.125);
    const keep=page ? (outerEdge||centerEdge ? .99 : innerPageEdge ? .76 : textLine ? .7 : .09) : coverEdge ? .99 : coverInnerEdge ? .72 : .07;
    if(Math.random()>keep)continue;
    const edgeStrength=outerEdge||centerEdge||coverEdge ? 1 : innerPageEdge||coverInnerEdge ? .78 : textLine ? .42 : .12;
    values.push(x,y,Math.random(),edgeStrength);
  }
  return new Float32Array(values);
}

export class ParticleAcademy{
  constructor(canvas){
    this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!this.gl)throw new Error('WebGL unavailable');
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.pointer=[2,2];this.target=[2,2];this.strength=0;this.targetStrength=0;this.start=performance.now();
    const gl=this.gl,program=gl.createProgram();gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,VERTEX_SHADER));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,FRAGMENT_SHADER));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));this.program=program;
    this.points=createPoints(matchMedia('(max-width: 767px)').matches?5200:9200);this.count=this.points.length/4;const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,this.points,gl.STATIC_DRAW);gl.useProgram(program);
    const position=gl.getAttribLocation(program,'aPosition'),seed=gl.getAttribLocation(program,'aSeed'),group=gl.getAttribLocation(program,'aGroup');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,16,0);gl.enableVertexAttribArray(seed);gl.vertexAttribPointer(seed,1,gl.FLOAT,false,16,8);gl.enableVertexAttribArray(group);gl.vertexAttribPointer(group,1,gl.FLOAT,false,16,12);
    this.uniforms=Object.fromEntries(['uTime','uPointer','uPointerStrength','uAspect','uReducedMotion'].map(name=>[name,gl.getUniformLocation(program,name)]));
    canvas.addEventListener('pointermove',event=>{const rect=canvas.getBoundingClientRect(),aspect=rect.width/rect.height;this.target=[((event.clientX-rect.left)/rect.width*2-1)*aspect,1-(event.clientY-rect.top)/rect.height*2];this.targetStrength=1;});canvas.addEventListener('pointerenter',()=>this.targetStrength=1);canvas.addEventListener('pointerleave',()=>{this.target=[2,2];this.targetStrength=0;});
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();this.render=this.render.bind(this);requestAnimationFrame(this.render);
  }
  resize(){const ratio=Math.min(devicePixelRatio||1,2),rect=this.canvas.getBoundingClientRect();this.canvas.width=Math.max(1,rect.width*ratio);this.canvas.height=Math.max(1,rect.height*ratio);this.gl.viewport(0,0,this.canvas.width,this.canvas.height);}
  render(now){const gl=this.gl;this.pointer[0]+=(this.target[0]-this.pointer[0])*.075;this.pointer[1]+=(this.target[1]-this.pointer[1])*.075;this.strength+=(this.targetStrength-this.strength)*.06;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.useProgram(this.program);gl.uniform1f(this.uniforms.uTime,(now-this.start)/1000);gl.uniform2f(this.uniforms.uPointer,this.pointer[0],this.pointer[1]);gl.uniform1f(this.uniforms.uPointerStrength,this.strength);gl.uniform1f(this.uniforms.uAspect,this.canvas.width/this.canvas.height);gl.uniform1f(this.uniforms.uReducedMotion,this.reduced?1:0);gl.drawArrays(gl.POINTS,0,this.count);requestAnimationFrame(this.render);}
}
