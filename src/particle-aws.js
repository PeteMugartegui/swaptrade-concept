const VS=`
attribute vec2 aPosition;
attribute float aSeed;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uAspect;
uniform float uReducedMotion;
varying float vSeed;
varying float vAlpha;
void main(){
  float motion=1.0-uReducedMotion;
  float bob=sin(uTime*.58)*.016*motion;
  float sway=sin(uTime*.34)*.008*motion;
  vec2 p=aPosition+vec2(sway,bob);
  vec2 projected=vec2(p.x/uAspect,p.y);
  vec2 delta=projected-uPointer;
  float influence=smoothstep(.46,0.0,length(delta))*uPointerStrength;
  float randomAngle=fract(aSeed*37.17)*6.28318+sin(uTime*.7+aSeed*19.0)*.28;
  float randomForce=.14+fract(aSeed*91.7)*.25;
  vec2 direction=normalize(delta+vec2(.0001));
  p+=vec2(cos(randomAngle)*uAspect,sin(randomAngle))*influence*randomForce*1.3+vec2(direction.x*uAspect,direction.y)*influence*.091;
  gl_Position=vec4(p.x/uAspect,p.y,0.0,1.0);
  gl_PointSize=1.55+aSeed*1.3+influence*(1.0+fract(aSeed*11.2)*2.0);
  vSeed=aSeed;
  vAlpha=.4+aSeed*.58;
}`;
const FS=`
precision mediump float;
varying float vSeed;
varying float vAlpha;
void main(){
  float d=length(gl_PointCoord-.5);
  float dot=smoothstep(.5,.18,d);
  vec3 deepBlue=vec3(.055,.322,.722);
  vec3 brightBlue=vec3(.004,.502,1.0);
  vec3 color=mix(deepBlue,brightBlue,fract(vSeed*8.43));
  gl_FragColor=vec4(color,dot*vAlpha);
}`;

function createAwsMask(){
  const canvas=document.createElement('canvas');canvas.width=900;canvas.height=430;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,900,430);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 245px Arial, Helvetica, sans-serif';ctx.fillText('aws',450,178);
  ctx.strokeStyle='#fff';ctx.lineWidth=23;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(260,292);ctx.bezierCurveTo(380,375,565,378,690,284);ctx.stroke();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(689,284);ctx.lineTo(650,280);ctx.lineTo(690,326);ctx.closePath();ctx.fill();
  return ctx.getImageData(0,0,900,430).data;
}
function createPoints(count){const mask=createAwsMask(),values=[];let attempts=0;while(values.length<count*3&&attempts<count*45){attempts++;const px=Math.floor(Math.random()*900),py=Math.floor(Math.random()*430);if(mask[(py*900+px)*4+3]<100)continue;const x=(px/900*2-1)*.91,y=(1-py/430*2)*.69;values.push(x,y,Math.random());}return new Float32Array(values);}
function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;}
export class ParticleAws{
  constructor(canvas){
    this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!this.gl)throw new Error('WebGL unavailable');this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.pointer=[2,2];this.target=[2,2];this.strength=0;this.targetStrength=0;this.start=performance.now();
    const gl=this.gl,program=gl.createProgram();gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,VS));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));this.program=program;this.data=createPoints(matchMedia('(max-width: 767px)').matches?2800:4800);this.count=this.data.length/3;
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,this.data,gl.STATIC_DRAW);gl.useProgram(program);const position=gl.getAttribLocation(program,'aPosition'),seed=gl.getAttribLocation(program,'aSeed');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,12,0);gl.enableVertexAttribArray(seed);gl.vertexAttribPointer(seed,1,gl.FLOAT,false,12,8);this.uniforms=Object.fromEntries(['uTime','uPointer','uPointerStrength','uAspect','uReducedMotion'].map(name=>[name,gl.getUniformLocation(program,name)]));
    canvas.addEventListener('pointermove',event=>{const rect=canvas.getBoundingClientRect(),aspect=rect.width/rect.height;this.target=[((event.clientX-rect.left)/rect.width*2-1)*aspect,1-(event.clientY-rect.top)/rect.height*2];this.targetStrength=1;});canvas.addEventListener('pointerenter',()=>this.targetStrength=1);canvas.addEventListener('pointerleave',()=>{this.target=[2,2];this.targetStrength=0;});this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();this.render=this.render.bind(this);requestAnimationFrame(this.render);
  }
  resize(){const ratio=Math.min(devicePixelRatio||1,2),rect=this.canvas.getBoundingClientRect();this.canvas.width=Math.max(1,rect.width*ratio);this.canvas.height=Math.max(1,rect.height*ratio);this.gl.viewport(0,0,this.canvas.width,this.canvas.height);}
  render(now){const gl=this.gl;this.pointer[0]+=(this.target[0]-this.pointer[0])*.075;this.pointer[1]+=(this.target[1]-this.pointer[1])*.075;this.strength+=(this.targetStrength-this.strength)*.06;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.useProgram(this.program);gl.uniform1f(this.uniforms.uTime,(now-this.start)/1000);gl.uniform2f(this.uniforms.uPointer,this.pointer[0],this.pointer[1]);gl.uniform1f(this.uniforms.uPointerStrength,this.strength);gl.uniform1f(this.uniforms.uAspect,this.canvas.width/this.canvas.height);gl.uniform1f(this.uniforms.uReducedMotion,this.reduced?1:0);gl.drawArrays(gl.POINTS,0,this.count);requestAnimationFrame(this.render);}
}
