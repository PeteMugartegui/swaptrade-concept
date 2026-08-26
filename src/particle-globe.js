const VS = `
attribute vec3 aPosition;
attribute float aSeed;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uAspect;
uniform float uReducedMotion;
varying float vAlpha;
varying float vSeed;
void main() {
  float angle = uTime * 0.09 * (1.0-uReducedMotion);
  float ca=cos(angle), sa=sin(angle);
  vec3 p=vec3(ca*aPosition.x+sa*aPosition.z,aPosition.y,-sa*aPosition.x+ca*aPosition.z);
  float tilt=-0.15; float ct=cos(tilt), st=sin(tilt);
  p=vec3(p.x,ct*p.y-st*p.z,st*p.y+ct*p.z);
  vec2 projected=vec2(p.x/uAspect,p.y);
  vec2 delta=projected-uPointer;
  float dist=length(delta);
  float influence=smoothstep(0.52,0.0,dist)*uPointerStrength;
  float randomAngle=fract(aSeed*37.17)*6.28318+sin(uTime*.7+aSeed*19.0)*.28;
  float randomForce=.13+fract(aSeed*91.7)*.24;
  vec2 burst=vec2(cos(randomAngle)*uAspect,sin(randomAngle))*influence*randomForce*1.3;
  vec2 repel=normalize(delta+vec2(0.0001))*influence*.091;
  p.xy += burst+vec2(repel.x*uAspect,repel.y);
  p.z += influence*(fract(aSeed*53.1)-.2)*.936;
  p *= 1.08;
  float perspective=1.0/(2.55-p.z*0.34);
  gl_Position=vec4(p.x*perspective/uAspect*2.05,p.y*perspective*2.05,0.0,1.0);
  gl_PointSize=(1.45+1.15*(p.z+1.0)*0.5+influence*(1.0+fract(aSeed*11.2)*1.9))*min(1.4,1.0/uAspect+0.42);
  vAlpha=mix(0.28,0.98,(p.z+1.0)*0.5)*(0.78+0.22*sin(aSeed*21.0));
  vSeed=aSeed;
}`;
const FS = `
precision mediump float;
varying float vAlpha;
varying float vSeed;
void main(){
  float d=length(gl_PointCoord-0.5);
  float circle=smoothstep(0.5,0.22,d);
  vec3 deepBlue=vec3(0.055,0.322,0.722), brightBlue=vec3(0.004,0.502,1.0);
  vec3 color=mix(deepBlue,brightBlue,fract(vSeed*7.31));
  gl_FragColor=vec4(color,circle*vAlpha);
}`;

const earthLand = feature(landTopology, landTopology.objects.land);
function createLandMask(){
  const width=720,height=360;
  const canvas=document.createElement('canvas');
  canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d',{willReadFrequently:true});
  const projection=geoEquirectangular().fitExtent([[0,0],[width,height]],{type:'Sphere'});
  context.clearRect(0,0,width,height);
  context.fillStyle='#fff';
  context.beginPath();
  geoPath(projection,context)(earthLand);
  context.fill();
  return {data:context.getImageData(0,0,width,height).data,width,height};
}
function makePoints(count){
  const mask=createLandMask();
  const out=[]; let attempts=0;
  while(out.length<count*4 && attempts<count*18){
    attempts++;
    const lat=Math.asin(Math.random()*2-1)*180/Math.PI;
    const lon=Math.random()*360-180;
    const px=Math.max(0,Math.min(mask.width-1,Math.floor((lon+180)/360*mask.width)));
    const py=Math.max(0,Math.min(mask.height-1,Math.floor((90-lat)/180*mask.height)));
    if(mask.data[(py*mask.width+px)*4+3]<100)continue;
    const phi=(90-lat)*Math.PI/180,theta=(lon+180)*Math.PI/180;
    out.push(-Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta),Math.random());
  }
  return new Float32Array(out);
}
function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
export class ParticleGlobe {
  constructor(canvas){
    this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!this.gl)throw new Error('WebGL unavailable');
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.pointer=[2,2];this.target=[2,2];this.strength=0;this.targetStrength=0;this.start=performance.now();
    const gl=this.gl,p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,VS));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));this.program=p;
    const small=matchMedia('(max-width: 767px)').matches;this.points=makePoints(small?4800:8800);this.count=this.points.length/4;
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,this.points,gl.STATIC_DRAW);gl.useProgram(p);
    const pos=gl.getAttribLocation(p,'aPosition'),seed=gl.getAttribLocation(p,'aSeed');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,16,0);gl.enableVertexAttribArray(seed);gl.vertexAttribPointer(seed,1,gl.FLOAT,false,16,12);
    this.uniforms=Object.fromEntries(['uTime','uPointer','uPointerStrength','uAspect','uReducedMotion'].map(n=>[n,gl.getUniformLocation(p,n)]));
    this.move=e=>{const r=canvas.getBoundingClientRect();this.target=[((e.clientX-r.left)/r.width*2-1)*r.width/r.height,1-(e.clientY-r.top)/r.height*2];this.targetStrength=1;};
    canvas.addEventListener('pointermove',this.move);canvas.addEventListener('pointerenter',()=>this.targetStrength=1);canvas.addEventListener('pointerleave',()=>{this.targetStrength=0;this.target=[2,2];});
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.resize();this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
  }
  resize(){const d=Math.min(devicePixelRatio||1,2),r=this.canvas.getBoundingClientRect();this.canvas.width=Math.max(1,r.width*d);this.canvas.height=Math.max(1,r.height*d);this.gl.viewport(0,0,this.canvas.width,this.canvas.height);}
  frame(now){const gl=this.gl;this.pointer[0]+=(this.target[0]-this.pointer[0])*.075;this.pointer[1]+=(this.target[1]-this.pointer[1])*.075;this.strength+=(this.targetStrength-this.strength)*.065;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.useProgram(this.program);gl.uniform1f(this.uniforms.uTime,(now-this.start)/1000);gl.uniform2f(this.uniforms.uPointer,this.pointer[0],this.pointer[1]);gl.uniform1f(this.uniforms.uPointerStrength,this.strength);gl.uniform1f(this.uniforms.uAspect,this.canvas.width/this.canvas.height);gl.uniform1f(this.uniforms.uReducedMotion,this.reduced?1:0);gl.drawArrays(gl.POINTS,0,this.count);requestAnimationFrame(this.frame);}
}
import landTopology from 'world-atlas/land-110m.json';
import { feature } from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';
