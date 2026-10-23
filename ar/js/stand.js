// MIA · Stand AR. UNA escena: los 3 muros forman un stand de 3x3 m; cualquier cartel coloca el stand completo.
// Unidades = ancho de la imagen ancla (≈0.254 m en el cartel tabloide) -> 1 m = U unidades.
const U=1/0.254;
// Carteles colgados arriba (centro ≈2.05 m). Origen = ancla del muro de fondo. Muros a 1.5 m del centro.
const POSES=[{p:[-1.5*U,0,1.5*U],ry:90},{p:[0,0,0],ry:0},{p:[1.5*U,0,1.5*U],ry:-90}];
const ESC=window.ESC_STAND||1.3; // contenido AR ampliado x2 alrededor del cartel (offsets en unidades/2)
const TEMAS={1:'Quiénes somos',2:'Movement & Alliances Impact',3:'Servicios',4:'Nuestro método',5:'Pilares',6:'ESG · GRI · ODS',7:'Ciclo de proyecto',8:'Islas Verdes MIA',9:'Diseño curricular (CONOCER)',10:'Contacto'};
const SERV=[['Islas Verdes MIA','Ecotecnias urbanas: 10 módulos (espiral de aromáticas, torre de lombrices, jardín de polinizadores, captación de lluvia, riego con ollas de barro…) y 5 sistemas combinables.','img/serv0.jpg'],
 ['Feria del Huerto a la Mesa','Taller para equipos: circuito de 10 estaciones, de la semilla al plato y de vuelta a la tierra.','img/serv1.jpg'],
 ['Gallinero inteligente productivo','Corrales, captación de lluvia, alimentación por gravedad, vermicompostaje y respaldo solar.','img/serv2.jpg'],
 ['Consultoría y capacitación','Diagnóstico, implementación modular, indicadores ESG/ODS, manuales y talleres. Basamos nuestro diseño curricular en metodologías CONOCER (MIA no certifica).','img/serv3.jpg']];
// Todo debajo y a los lados del cartel (cartel: x ±0.55, y -0.81..+0.89)
const MUROS=[
 {obj:[['manos',1,-0.85,0.25],['semilla',2,0.85,0.25],['hoja',5,-0.85,-0.45]]},
 {tv:true,obj:[['engrane',4,-0.85,0.25],['gota',6,0.85,0.25],['dron',7,-0.85,-0.45],['maceta',9,0.85,-0.45]]},
 {obj:[['maceta',8,-0.85,0.25],['gallina',3,0.85,0.25]]}];
const RADIAL=[[0,0.75,-1.3],[1,0,-1.05],[2,0,-1.15]];
const OPC=[['TEMAS',()=>menuTemas()],['SERVICIOS',()=>explorar()],['VIDEOS',()=>menuVideos()],['CONTACTO',()=>menuContacto()]];
const O='#FF914C',CY='#9FF6FF',K='#1F1F1F';
const HOLO=(c=O,op=.9)=>`shader: flat; color: ${c}; wireframe: true; transparent: true; opacity: ${op}`;
const SOLIDO=(c=O,op=.25)=>`shader: flat; color: ${c}; transparent: true; opacity: ${op}; depthWrite: false`;
function el(t,a,p){const e=document.createElement(t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e;}
function forma(tipo,g){const m=(t,a)=>el(t,Object.assign({material:HOLO(a.c||O)},a),g);
 ({manos:()=>{m('a-torus',{radius:.16,'radius-tubular':.04,'segments-tubular':12,'segments-radial':6,position:'-.08 0 0'});m('a-torus',{radius:.16,'radius-tubular':.04,'segments-tubular':12,'segments-radial':6,position:'.08 0 0',c:CY});},
  semilla:()=>{m('a-sphere',{radius:.18,scale:'1 1.4 1','segments-width':8,'segments-height':6});m('a-cone',{'radius-bottom':.06,height:.2,'segments-radial':6,position:'0 .3 0',c:CY});},
  hoja:()=>{m('a-sphere',{radius:.22,scale:'1.4 .7 .2','segments-width':8,'segments-height':6});m('a-cylinder',{radius:.012,height:.5,rotation:'0 0 90','segments-radial':4,c:CY});},
  engrane:()=>{m('a-cylinder',{radius:.2,height:.08,rotation:'90 0 0','segments-radial':12});for(let i=0;i<8;i++)m('a-box',{width:.07,height:.1,depth:.07,position:`${.24*Math.cos(i*.785)} ${.24*Math.sin(i*.785)} 0`,rotation:`0 0 ${i*45}`,c:CY});},
  gota:()=>{m('a-sphere',{radius:.17,'segments-width':8,'segments-height':6,c:CY});m('a-cone',{'radius-bottom':.16,height:.24,'segments-radial':8,position:'0 .19 0'});},
  dron:()=>{m('a-box',{width:.24,height:.07,depth:.24});[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>m('a-torus',{radius:.08,'radius-tubular':.01,'segments-tubular':10,'segments-radial':3,rotation:'90 0 0',position:`${a*.19} .05 ${b*.19}`,c:CY}));},
  maceta:()=>{m('a-cone',{'radius-bottom':.12,'radius-top':.18,height:.25,'segments-radial':8});m('a-dodecahedron',{radius:.13,position:'0 .25 0',c:CY});},
  gallina:()=>{m('a-sphere',{radius:.2,'segments-width':8,'segments-height':6,c:CY});m('a-sphere',{radius:.1,'segments-width':6,'segments-height':4,position:'.15 .2 0',c:CY});m('a-cone',{'radius-bottom':.04,height:.08,'segments-radial':4,position:'.27 .2 0',rotation:'0 0 -90'});}
 })[tipo]();}
// Holograma: objeto + anillos giratorios + línea de escaneo + 3 partículas
function holograma(g,x,y,tipo){
 const r=el('a-entity',{position:`${x} ${y} 0.35`,class:'clicable'},g);
 const o=el('a-entity',{animation:'property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear',animation__f:'property: position; from: 0 -.04 0; to: 0 .04 0; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine'},r);
 forma(tipo,o);
 el('a-ring',{'radius-inner':.3,'radius-outer':.32,'segments-theta':24,material:SOLIDO(O,.8),rotation:'-90 0 0',position:'0 -.3 0',animation:'property: rotation; from: -90 0 0; to: -90 0 360; loop: true; dur: 4000; easing: linear'},r);
 el('a-ring',{'radius-inner':.36,'radius-outer':.37,'segments-theta':24,'theta-length':260,material:SOLIDO(CY,.6),rotation:'-90 0 0',position:'0 -.3 0',animation:'property: rotation; from: -90 0 360; to: -90 0 0; loop: true; dur: 6000; easing: linear'},r);
 el('a-plane',{width:.6,height:.012,material:SOLIDO(CY,.7),animation:'property: position; from: 0 -.3 0; to: 0 .35 0; loop: true; dur: 1800; easing: linear'},r);
 for(let i=0;i<3;i++)el('a-sphere',{radius:.015,'segments-width':4,'segments-height':3,material:SOLIDO(i%2?CY:O,.9),position:`${(i-1)*.18} -.25 0`,animation:`property: position; from: ${(i-1)*.18} -.25 0; to: ${(i-1)*.18} .4 0; loop: true; dur: ${1800+i*500}; easing: linear`,animation__o:`property: material.opacity; from: .9; to: 0; loop: true; dur: ${1800+i*500}`},r);
 el('a-sphere',{radius:.38,'segments-width':6,'segments-height':4,material:'opacity: 0; transparent: true; depthWrite: false',class:'clicable'},r); // zona de toque
 reactivo(r,o);return r;}
// Reacción: hover/tap = brillo (escala) y giro rápido + pulso
function reactivo(r,o){r.setAttribute('animation__hin','property: scale; to: 1.18 1.18 1.18; dur: 180; startEvents: mouseenter');
 r.setAttribute('animation__hout','property: scale; to: 1 1 1; dur: 220; startEvents: mouseleave');
 r.setAttribute('animation__pulso','property: scale; from: 1.35 1.35 1.35; to: 1 1 1; dur: 450; easing: easeOutElastic; startEvents: click');
 if(o){r.addEventListener('mouseenter',()=>o.setAttribute('animation','dur',2000));r.addEventListener('mouseleave',()=>o.setAttribute('animation','dur',8000));}}
// Panel translúcido con borde luminoso; aparece con escala/fade
function panelHolo(g,x,y,src){
 const p=el('a-entity',{position:`${x} ${y} 0.55`,scale:'0.001 0.001 0.001',visible:false,
   animation__in:'property: scale; from: 0.001 0.001 0.001; to: 1 1 1; dur: 350; easing: easeOutBack; startEvents: abrir',
   animation__out:'property: scale; to: 0.001 0.001 0.001; dur: 200; easing: easeInQuad; startEvents: cerrar'},g);
 el('a-plane',{width:1.2,height:.8,material:SOLIDO('#0B1A24',.6)},p);
 [[0,.4,1.2,.012],[0,-.4,1.2,.012],[-.6,0,.012,.8],[.6,0,.012,.8]].forEach(([a,b,w,h])=>el('a-plane',{width:w,height:h,position:`${a} ${b} .002`,material:SOLIDO(O,.95)},p));
 el('a-image',{src,width:1.1,height:.69,position:'0 0 .004',material:'shader: flat; transparent: true; opacity: .92',class:'clicable'},p);
 p.addEventListener('click',()=>cerrarPanel(p));
 p.addEventListener('animationcomplete__out',()=>p.setAttribute('visible',false));return p;}
function abrirPanel(p){p.setAttribute('visible',true);p.emit('abrir');}
function cerrarPanel(p){p.emit('cerrar');}
function construirStand(stand,abrir){
 MUROS.forEach((M,i)=>{const P=POSES[i];
  const g=el('a-entity',{scale:`${ESC} ${ESC} ${ESC}`},el('a-entity',{position:P.p.join(' '),rotation:`0 ${P.ry} 0`},stand));
  if(M.tv){ // TV debajo del cartel (≈1.3 m del piso)
   el('a-plane',{position:'0 -2.25 0.02',width:1.72,height:1.0,material:SOLIDO(O,.9)},g);
   el('a-plane',{position:'0 -2.25 0.025',width:1.64,height:.94,material:SOLIDO('#0B1A24',.95)},g);
   const tv=el('a-video',{src:'#tv',position:'0 -2.25 0.03',width:1.6,height:.9,class:'clicable'},g);
   tv.addEventListener('click',()=>{const v=document.getElementById('tv');v.paused?v.play():v.pause();});}
  M.obj.forEach(([tipo,tema,x,y])=>{const o=holograma(g,x,y,tipo);
   const pn=panelHolo(g,x<0?x-.2:x+.2,y-.05,`img/tema${tema}.jpg`);
   o.addEventListener('click',()=>{if(pn.getAttribute('visible'))cerrarPanel(pn);else{abrirPanel(pn);abrir(detalle(tema));}});});
 });
 // Portarretratos (muro izq, debajo-izquierda del cartel): 10 fotos reales cada 3 s
 const gi=el('a-entity',{scale:`${ESC} ${ESC} ${ESC}`},el('a-entity',{position:POSES[0].p.join(' '),rotation:`0 ${POSES[0].ry} 0`},stand));
 el('a-plane',{position:'-0.3 -1.75 0.03',width:1.06,height:.83,material:SOLIDO(O,.9)},gi);
 const fr=el('a-image',{src:'img/gal0.jpg',position:'-0.3 -1.75 0.04',width:1.0,height:.75,material:'shader: flat',class:'clicable'},gi);let fi=0;
 setInterval(()=>{fi=(fi+1)%10;fr.setAttribute('src',`img/gal${fi}.jpg`);},3000);
 fr.addEventListener('click',()=>abrir('<h2>Proyecto en campo</h2>'+[...Array(10).keys()].map(i=>`<img src="img/gal${i}.jpg">`).join('')));
 // Menús radiales 3D (holograma): anillo que gira; al tocar el núcleo se despliegan 4 opciones en abanico
 RADIAL.forEach(([w,x,y])=>{const g=el('a-entity',{scale:`${ESC} ${ESC} ${ESC}`},el('a-entity',{position:POSES[w].p.join(' '),rotation:`0 ${POSES[w].ry} 0`},stand));
  menuRadial(g,x,y);});
 plantasYFauna(stand);
 fetch('config.json').then(r=>r.json()).then(c=>{const L=c.videos||[];let k=0;const v=document.getElementById('tv');if(!v||!L.length)return;
  const set=()=>{v.src=L[k].src;};set();if(L.length>1){v.loop=false;v.addEventListener('ended',()=>{k=(k+1)%L.length;set();v.play();});}}).catch(()=>{});
}
// Fusión: cada cartel visible propone pose del stand = Target * inv(PoseCartel); se promedian y suavizan.
AFRAME.registerComponent('fusion-stand',{init(){this.inv=POSES.map(P=>new THREE.Matrix4().compose(new THREE.Vector3(...P.p),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,THREE.MathUtils.degToRad(P.ry),0)),new THREE.Vector3(1,1,1)).invert());
  this.pos=new THREE.Vector3();this.q=new THREE.Quaternion();this.sc=new THREE.Vector3(1,1,1);this.has=false;this.lost=0;},
 tick(t,dt){const p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3();let n=0;
  const m=new THREE.Matrix4(),tp=new THREE.Vector3(),tq=new THREE.Quaternion(),ts=new THREE.Vector3();
  [0,1,2].forEach(i=>{const e=document.getElementById('t'+i);if(!e||!e.object3D.visible)return;
   m.multiplyMatrices(e.object3D.matrixWorld,this.inv[i]);m.decompose(tp,tq,ts);if(!(ts.x>1e-6)||[tq.x,tq.y,tq.z,tq.w,tp.x,tp.y,tp.z].some(v=>!isFinite(v)))return;tq.normalize();p.add(tp);sc.add(ts);if(n===0)q.copy(tq);else q.slerp(tq,1/(n+1));n++;});
  const o=this.el.object3D;
  if(n&&this.has&&![this.q.x,this.q.y,this.q.z,this.q.w,this.pos.x].every(isFinite))this.has=false;
  if(n){p.divideScalar(n);sc.divideScalar(n);if(!this.has){this.pos.copy(p);this.q.copy(q);this.sc.copy(sc);this.has=true;}else{this.pos.lerp(p,.3);this.q.slerp(q,.3);this.sc.lerp(sc,.3);}this.lost=0;o.visible=true;}
  else if(this.has){this.lost+=dt;if(this.lost>2500)o.visible=false;}
  o.position.copy(this.pos);o.quaternion.copy(this.q);o.scale.copy(this.sc);}});
function detalle(n){let h=`<h2>Tema ${n} · ${TEMAS[n]}</h2><img src="img/tema${n}.jpg">`;
 if(n==3||n==8)h+=SERV.map((d,i)=>`<p><button onclick="abrir(ficha(${i}))">${d[0]}</button></p>`).join('');return h;}
function ficha(i){const d=SERV[i];return `<h2>${d[0]}</h2><img src="${d[2]}"><p>${d[1]}</p><p><a class="btn" style="background:#25D366" target="_blank" href="https://wa.me/524441749695?text=${encodeURIComponent('Hola, me interesa: '+d[0])}">Cotizar por WhatsApp</a> <a class="btn" href="mailto:danae@miaglobalconsulting.com?subject=${encodeURIComponent(d[0])}">Correo</a></p>`;}
function abrir(h){document.getElementById('pc').innerHTML=h;document.getElementById('panel').style.display='block';}
function cerrar(){document.getElementById('panel').style.display='none';}
function explorar(){abrir('<h2>Productos y servicios</h2>'+SERV.map((d,i)=>`<p><button onclick="abrir(ficha(${i}))">${d[0]}</button></p>`).join(''));}
function menuTemas(){abrir('<h2>Los 10 temas MIA</h2>'+Object.keys(TEMAS).map(n=>`<p><button onclick="abrir(detalle(${n}))">${n}. ${TEMAS[n]}</button></p>`).join(''));}
function menuVideos(){fetch('config.json').then(r=>r.json()).then(c=>abrir('<h2>Videos</h2>'+(c.videos||[]).map(v=>`<p><button onclick="const t=document.getElementById('tv');t.src='${v.src}';t.play();cerrar()">${v.titulo}</button></p>`).join('')+'<p>Los 10 videos MIA se agregan en config.json.</p>'));}
function menuContacto(){abrir('<h2>Contacto</h2><p><a class="btn" style="background:#25D366" target="_blank" href="https://wa.me/524441749695">WhatsApp 444 174 9695</a></p><p><a class="btn" href="mailto:danae@miaglobalconsulting.com">danae@miaglobalconsulting.com</a></p><p><a class="btn" target="_blank" href="https://tortugadante.github.io/mia-global-consulting/">Sitio web</a></p>');}

function menuRadial(g,x,y){const r=el('a-entity',{position:`${x} ${y} 0.3`},g);
 const hub=el('a-entity',{class:'clicable'},r);
 el('a-circle',{radius:.13,'segments':16,material:SOLIDO('#0B1A24',.8),class:'clicable'},hub);
 el('a-ring',{'radius-inner':.13,'radius-outer':.15,'segments-theta':20,material:SOLIDO(O,.95)},hub);
 el('a-ring',{'radius-inner':.19,'radius-outer':.2,'segments-theta':20,'theta-length':280,material:SOLIDO(CY,.7),animation:'property: rotation; to: 0 0 360; loop: true; dur: 5000; easing: linear'},hub);
 el('a-text',{value:'MENU',align:'center',color:'#FFFFFF',width:1.3,position:'0 0 .01'},hub);
 reactivo(hub);
 const fan=el('a-entity',{scale:'0.001 0.001 0.001',visible:false,animation__in:'property: scale; to: 1 1 1; dur: 380; easing: easeOutBack; startEvents: abrir',animation__out:'property: scale; to: 0.001 0.001 0.001; dur: 200; startEvents: cerrar',
  animation__giro:'property: rotation; from: 0 0 -40; to: 0 0 0; dur: 380; easing: easeOutQuad; startEvents: abrir'},r);
 OPC.forEach(([t,fn],i)=>{const a=(150-i*40)*Math.PI/180,R=.42;const b=el('a-entity',{position:`${R*Math.cos(a)} ${R*Math.sin(a)} .02`,class:'clicable'},fan);
  el('a-plane',{width:.4,height:.13,material:SOLIDO('#0B1A24',.8),class:'clicable'},b);el('a-plane',{width:.42,height:.15,position:'0 0 -.002',material:SOLIDO(i%2?CY:O,.95)},b);
  el('a-text',{value:t,align:'center',color:'#FFFFFF',width:1.4,position:'0 0 .01'},b);reactivo(b);
  b.addEventListener('click',e=>{e.stopPropagation&&e.stopPropagation();fn();});});
 fan.addEventListener('animationcomplete__out',()=>fan.setAttribute('visible',false));
 hub.addEventListener('click',()=>{if(fan.getAttribute('visible'))fan.emit('cerrar');else{fan.setAttribute('visible',true);fan.emit('abrir');}});}
// Plantitas holográficas en el piso y fauna (mariposas y colibríes) con aleteo y trayectorias suaves
function plantasYFauna(stand){const piso=-2.0*U, zc=1.5*U;
 [[-1.25,0.25],[-1.25,2.75],[1.25,0.25],[1.25,2.75],[-0.6,0.2],[0.6,0.2]].forEach(([x,z],i)=>{const p=el('a-entity',{position:`${x*U} ${piso} ${z*U}`,scale:`${U*.35} ${U*.35} ${U*.35}`},stand);
  el('a-cone',{'radius-bottom':.12,'radius-top':.17,height:.22,'segments-radial':6,material:HOLO(O,.9),position:'0 .11 0'},p);
  const t=el('a-entity',{position:'0 .22 0',animation:`property: rotation; from: 0 0 -4; to: 0 0 4; dir: alternate; loop: true; dur: ${2000+i*300}; easing: easeInOutSine`},p);
  el('a-cylinder',{radius:.01,height:.3,'segments-radial':3,material:HOLO(CY,.9),position:'0 .15 0'},t);
  [[.08,.2,30],[-.08,.26,-30],[.06,.32,20]].forEach(([a,b,r])=>el('a-cone',{'radius-bottom':.05,height:.14,'segments-radial':4,material:HOLO(i%2?O:CY,.9),position:`${a} ${b} 0`,rotation:`0 0 ${-r*2}`,scale:'1 1 .3'},t));});
 const ala=(g,c,dur,amp)=>{[1,-1].forEach(sg=>{const w=el('a-entity',{animation:`property: rotation; from: 0 ${sg*amp} 0; to: 0 ${-sg*10} 0; dir: alternate; loop: true; dur: ${dur}`},g);
   el('a-triangle',{'vertex-a':'0 0 0','vertex-b':`${sg*.18} .12 0`,'vertex-c':`${sg*.14} -.1 0`,material:SOLIDO(c,.75)+'; side: double'},w);});};
 const ruta=(e,pts,dur)=>{pts.forEach((pt,i)=>{const nx=pts[(i+1)%pts.length];e.setAttribute(`animation__p${i}`,`property: position; from: ${pt}; to: ${nx}; dur: ${dur}; easing: easeInOutSine; startEvents: ${i?'p'+i:'arranca'}`);
   e.addEventListener(`animationcomplete__p${i}`,()=>e.emit(i+1<pts.length?'p'+(i+1):'arranca'));});setTimeout(()=>e.emit('arranca'),300);};
 const P=(x,y,z)=>`${x*U} ${y*U} ${z*U}`;
 [[O,[P(-0.8,-0.6,0.46),P(-0.2,-0.3,0.76),P(0.5,-0.7,0.64),P(0.1,-0.4,0.34)],5200],[CY,[P(0.8,-0.9,0.76),P(0.2,-0.5,0.76),P(-0.5,-0.8,0.76)],6100],[O,[P(-0.3,-1.1,0.76),P(0.6,-0.8,0.76),P(-0.6,-0.5,0.7)],5600]].forEach(([c,pts,d])=>{
  const b=el('a-entity',{scale:`${U*.18} ${U*.18} ${U*.18}`},stand);ala(b,c,180,70);el('a-cylinder',{radius:.012,height:.16,'segments-radial':3,material:HOLO(K,.9)},b);ruta(b,pts,d);});
 [[P(0.9,-0.3,0.7),P(-0.1,-0.1,0.4),P(-0.9,-0.4,0.76),P(0.0,-0.2,0.76)],[P(-0.9,-0.2,0.76),P(0.0,-0.5,0.76),P(0.9,-0.2,0.76)]].forEach((pts,i)=>{
  const h=el('a-entity',{scale:`${U*.18} ${U*.18} ${U*.18}`},stand);
  el('a-cone',{'radius-bottom':.06,height:.22,'segments-radial':5,material:HOLO(CY,.95),rotation:'0 0 90'},h);el('a-cone',{'radius-bottom':.008,height:.14,'segments-radial':3,material:HOLO(O,.95),rotation:'0 0 90',position:'-.17 0 0'},h);
  ala(h,i?O:CY,60,60);ruta(h,pts,4200+i*900);});}
