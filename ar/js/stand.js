// MIA · Stand AR v4 — sin muros: el display completo (60x160 cm) es la imagen ancla y los mismos
// elementos del stand anterior flotan a su alrededor. Coordenadas en METROS: display en el plano z=0,
// x∈[-0.3,0.3], y∈[0.1,1.7] (centro a 0.9 m); el visitante está en +z.
// Unidades MindAR = ancho de la imagen ancla (0.60 m) -> U unidades por metro.
const U=1/0.6, HA=0.9; // altura del centro del display
const POSES=[{p:[0,0,0],ry:0}];
const WA='https://wa.me/524441749695?text=', TEL='tel:+524441749695', MAIL='mailto:danae@miaglobalconsulting.com';
const wa=s=>WA+encodeURIComponent('Hola, vi el stand virtual de MIA y me interesa '+s);
const O='#FF914C',K='#1F1F1F',W='#FFFFFF',CY='#9FF6FF';
// ---------- contenido (Marketing) ----------
const MURO=[
 {preg:'Quiénes somos',t:'Estrategia e implementación en un solo equipo.',s:'No solo contamos el impacto: lo construimos con ustedes, en el territorio y con la comunidad.',sig:'¿Su organización está aquí? Siga al muro 2 →'},
 {preg:'Cómo trabajamos',t:'Del diagnóstico a la autogestión.',s:'Leemos el terreno con modelos 3D y lo confirmamos en campo con la comunidad.',sig:'Vea qué podemos instalar en su espacio →'},
 {preg:'Qué ofrecemos',t:'Empiece con un módulo. Escale cuando quiera.',s:'Soluciones listas para implementar, por etapas y a su presupuesto.',sig:'Cuéntenos su prioridad →'}];
const HOLOS=[ // muro, tipo, x(m, sobre el muro), y(m, altura), titulo, lineas, cta, wa-solucion
 [0,'manos',-0.95,1.55,'Nuestra forma de ser',['Ética y cercanía con cada actor.','Resultados claros, no solo narrativa.','Rutas a la medida: usted elige la prioridad y nosotros armamos la ruta.'],'Hablar con MIA','trabajar con ustedes'],
 [0,'brujula',0.95,1.55,'¿Para quién?',['Fundaciones y desarrollos con territorio y comunidad.','Industria que busca economía circular.','Empresas que necesitan impacto ESG visible.'],'Mi organización está aquí','una ruta para mi organización'],
 [1,'gota',-1.05,1.75,'Territorio',['Agua, suelo, nutrición y ecotecnias.','Lo físico que hace funcionar el proyecto.'],'Hablar de mi terreno','un diagnóstico de mi terreno'],
 [1,'engrane',1.05,1.75,'Organización',['Gobernanza, roles, indicadores y comunicación de impacto.','Lo que hace que el proyecto dure.'],'Hablar de mi equipo','fortalecer la organización de mi proyecto'],
 [1,'ciclo',1.05,0.95,'Ciclo de mejora',['Diagnosticar, planear, actuar, observar, mejorar.','Cada etapa con evidencia.'],'Iniciar diagnóstico','iniciar un diagnóstico']];
const SOL=[ // soluciones (muro 3 y menú Soluciones)
 {k:'isla',n:'Puntos verdes',ico:'maceta',l:['Espacios verdes pequeños, de bajo mantenimiento, para oficinas, casas y empresas.','10 módulos y 5 sistemas combinables, como Huerto a la vista o Agua que riega sola.'],cta:'Quiero un Punto verde',img:'img/serv0.jpg'},
 {k:'feria',n:'Feria de sostenibilidad',ico:'zanahoria',l:['Circuito de 10 estaciones de la semilla al plato.','Su equipo aprende con las manos y cada persona se lleva algo vivo a casa.'],cta:'Llevar la feria a mi organización',img:'img/serv1.jpg'},
 {k:'gallinero',n:'Gallinero inteligente',ico:'gallina',l:['Autoconsumo con tecnología pasiva: agua de lluvia, alimentación por gravedad, vermicomposta y respaldo solar.','Menos trabajo, más impacto.'],cta:'Cotizar gallinero',img:'img/serv2.jpg'},
 {k:'formacion',n:'Formación',ico:'libro',l:['Talleres y manuales propios para transferir la tecnología a su gente.','Basamos nuestro diseño curricular en metodologías CONOCER.'],cta:'Pedir programa de talleres',img:'img/serv3.jpg'},
 {k:'esg',n:'ESG / ODS',ico:'barras',l:['Indicadores, rutas de biodiversidad y comunicación de impacto que su consejo y su comunidad sí entienden.'],cta:'Revisar mis indicadores',img:'img/gal10.jpg'}];
const MODULOS=['Espiral de aromáticas','Torre de lombrices','Jardín de polinizadores','Hotel de insectos benéficos','Captación de lluvia','Riego con ollas de barro','Riego por goteo','Cama elevada de cultivo','Macetohuerto reciclado','Rincón de convivencia'];
const DIAG={Confianza:['Formación','Talleres y manuales para que las personas crean en el proceso.'],Coordinación:['Organización','Gobernanza, roles e indicadores para que cada actor sepa cómo actuar.'],Participación:['Feria de sostenibilidad','Una experiencia con las manos que suma a todas las voces.'],Continuidad:['Puntos verdes','Módulos de bajo mantenimiento que siguen funcionando.']};
// ---------- utilidades ----------
function el(t,a,p){const e=document.createElement(t);for(const k in a)e.setAttribute(k,a[k]);if(a&&typeof a.position==='string')e.dataset.p=a.position;p&&p.appendChild(e);return e;}
const FLAT=(c,op=1)=>`shader: flat; color: ${c}`+(op<1?`; transparent: true; opacity: ${op}; depthWrite: false`:'');
const MAT=(c,r=.8)=>`color: ${c}; roughness: ${r}; metalness: 0`;
const HOLO=(c=O,op=.9)=>`shader: flat; color: ${c}; wireframe: true; transparent: true; opacity: ${op}`;
// Texto nítido con acentos: lienzo -> dataURL (Poppins)
function lienzo(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);return c.toDataURL('image/png');}
function envolver(x,t,mw){const o=[];let l='';t.split(' ').forEach(p=>{const s=l?l+' '+p:p;if(x.measureText(s).width>mw&&l){o.push(l);l=p;}else l=s;});o.push(l);return o;}
function texPanel(tit,lin,cta,ancho=1024){return lienzo(ancho,640,(x,w,h)=>{x.fillStyle='rgba(11,26,36,0.88)';x.fillRect(0,0,w,h);x.strokeStyle=O;x.lineWidth=10;x.strokeRect(5,5,w-10,h-10);
 x.fillStyle=O;x.fillRect(0,0,w,14);x.fillStyle=W;x.font='800 60px Poppins, sans-serif';let y=100;envolver(x,tit,w-80).forEach(l=>{x.fillText(l,40,y);y+=66;});y+=10;
 x.font='700 38px Poppins, sans-serif';x.fillStyle='#E9F7FA';lin.forEach(p=>{envolver(x,p,w-100).slice(0,2).forEach(l=>{x.fillStyle=O;x.fillRect(40,y-26,14,14);x.fillStyle='#E9F7FA';x.fillText(l,70,y);y+=48;});y+=12;});
 if(cta){x.fillStyle=O;x.fillRect(40,h-110,w-80,78);x.fillStyle=K;x.font='800 40px Poppins, sans-serif';x.fillText(cta+'  →',64,h-58);}});}
function texLetrero(t,s,{w=1400,h=360,bg=W,fg=K}={}){return lienzo(w,h,(x)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=O;x.fillRect(0,0,22,h);
 x.fillStyle=fg;x.font='800 70px Poppins, sans-serif';let y=110;envolver(x,t,w-120).slice(0,2).forEach(l=>{x.fillText(l,60,y);y+=82;});
 if(s){x.font='600 42px Poppins, sans-serif';x.fillStyle=fg==K?'#3a3a3a':'#ddd';envolver(x,s,w-120).slice(0,2).forEach(l=>{x.fillText(l,60,y+10);y+=54;});}});}
function texBoton(t,{w=900,h=150,bg=O,fg=K}={}){return lienzo(w,h,(x)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=fg;x.font='800 54px Poppins, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,w/2,h/2+3);});}
function texCabecera(n,t){return lienzo(1600,200,(x,w,h)=>{x.fillStyle=K;x.fillRect(0,0,w,h);x.fillStyle=O;x.fillRect(0,h-16,w,16);x.fillStyle=O;x.font='800 96px Poppins, sans-serif';x.fillText(n,50,130);x.fillStyle=W;x.font='800 84px Poppins, sans-serif';x.fillText(t,200,128);});}
function clic(e,fn){e.classList.add('clicable');e.addEventListener('click',ev=>{fn(ev);});return e;}
function reactivo(r,o){r.setAttribute('animation__hin','property: scale; to: 1.15 1.15 1.15; dur: 160; startEvents: mouseenter');
 r.setAttribute('animation__hout','property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave');
 r.setAttribute('animation__pulso','property: scale; from: 1.3 1.3 1.3; to: 1 1 1; dur: 450; easing: easeOutElastic; startEvents: click');
 if(o){r.addEventListener('mouseenter',()=>o.setAttribute('animation','dur',1800));r.addEventListener('mouseleave',()=>o.setAttribute('animation','dur',8000));}}
// zona flotante: grupo en el aire, girado levemente hacia el visitante (sin muros)
function zona(sala,x,y,z,ry,esc=1){return el('a-entity',{position:`${x} ${y} ${z}`,rotation:`0 ${ry} 0`,scale:`${esc} ${esc} ${esc}`},sala);}
function flota(e,amp=.02,dur=2600){const p=e.getDOMAttribute?e.getDOMAttribute('position'):null;const pa=e.dataset.p.split(' ').map(Number);
 e.setAttribute('animation__flota',`property: position; from: ${pa[0]} ${pa[1]-amp} ${pa[2]}; to: ${pa[0]} ${pa[1]+amp} ${pa[2]}; dir: alternate; loop: true; dur: ${dur}; easing: easeInOutSine`);return e;}
// ---------- elementos del stand (los mismos de los muros), reacomodados en el aire ----------
function standFisico(sala){
 const Z=[zona(sala,-1.12,0,.3,22,.52),zona(sala,0,0,.12,0,.62),zona(sala,1.12,0,.3,-22,.52)];window._Z=Z;
 // cabeceras y letreros de las 3 zonas (antes en lo alto de cada muro)
 const pos=[[0,3.75,3.3],[0,4.22,3.86],[0,3.75,3.3]];
 [0,1,2].forEach(i=>{const M=MURO[i],[x,yc,yl]=pos[i];
  flota(el('a-image',{src:texCabecera('0'+(i+1),M.preg),width:1.6,height:.2,position:`${x} ${yc} 0`,material:'shader: flat'},Z[i]),.02,3000+i*300);
  flota(el('a-image',{src:texLetrero(M.t,M.s),width:1.5,height:.386,position:`${x} ${yl} 0`,material:'shader: flat'},Z[i]),.02,3200+i*300);});
 // TV (antes en el muro de fondo): ahora flota sobre el display
 const f=Z[1];
 el('a-box',{width:1.12,height:.66,depth:.05,position:'0 3.07 -.03',material:MAT('#111',.3)},f);
 const tv=el('a-video',{src:'#tv',width:1.06,height:.6,position:'0 3.07 0',material:'shader: flat'},f);
 clic(tv,()=>{const v=document.getElementById('tv');v.paused?v.play():v.pause();});
 window._sub=el('a-image',{src:texBoton(' ',{w:1060,h:110,bg:'rgba(0,0,0,0.75)',fg:W}),width:1.06,height:.11,position:'0 2.71 .01',material:'shader: flat; transparent: true'},f);
 clic(el('a-image',{src:texBoton('Ver más casos',{w:700,h:130}),width:.5,height:.093,position:'0 3.45 .02',material:'shader: flat'},f),()=>verCasos());
 // pedestales con productos (antes al pie del muro derecho): flotan a la derecha, abajo
 const de=Z[2];
 window._ped=pedestal(de,-.45,'Punto verde');pedestal(de,.45,'Gallinero');
 islaVerde(window._ped.top,'despues');gallinero(de.querySelector('.ped-Gallinero'));
 [...de.querySelectorAll('[class^=ped-]')].forEach((p,i)=>flota(p,.03,2800+i*400));
}
function pedestal(g,x,t){const p=el('a-entity',{position:`${x} 0.25 .2`,class:'ped-'+t},g);
 el('a-box',{width:.5,height:.6,depth:.5,position:'0 .3 0',material:MAT(W,.7)},p);el('a-box',{width:.52,height:.03,depth:.52,position:'0 .61 0',material:FLAT(O)},p);
 el('a-image',{src:texBoton(t,{w:600,h:120,bg:K,fg:W}),width:.4,height:.08,position:'0 .5 .252',material:'shader: flat'},p);
 const top=el('a-entity',{position:'0 .625 0'},p);return {p,top};}
function islaVerde(top,modo,sel){top.innerHTML='';
 el('a-box',{width:.42,height:.06,depth:.42,position:'0 .03 0',material:MAT('#8A6A48',.95)},top); // tarima/espacio
 if(modo==='antes'){el('a-box',{width:.36,height:.01,depth:.36,position:'0 .065 0',material:MAT('#A9A9A9',1)},top);return;}
 el('a-box',{width:.38,height:.07,depth:.38,position:'0 .095 0',material:MAT('#5A3E2B',.95)},top);
 const mods=sel&&sel.length?sel:[0,4,7];
 mods.forEach((m,i)=>{const a=i/mods.length*Math.PI*2,r=mods.length>1?.11:0,x=r*Math.cos(a),z=r*Math.sin(a);modulo(top,m,x,z);});}
function modulo(top,m,x,z){const g=el('a-entity',{position:`${x} .13 ${z}`,scale:'0.001 0.001 0.001',animation:'property: scale; to: 1 1 1; dur: 450; easing: easeOutBack'},top);
 const v=(c)=>MAT(c,.9);
 [()=>{for(let i=0;i<5;i++)el('a-cylinder',{radius:.05-i*.008,height:.025,position:`0 ${i*.025} 0`,'segments-radial':10,material:v(i%2?'#7B9E5A':'#9C7A55')},g);},
  ()=>{el('a-cylinder',{radius:.035,height:.16,position:'0 .08 0','segments-radial':8,material:v('#6B4B33')},g);},
  ()=>{[O,'#F7D154',W].forEach((c,i)=>el('a-sphere',{radius:.025,position:`${(i-1)*.03} .05 0`,material:v(c)},g));},
  ()=>{el('a-box',{width:.07,height:.09,depth:.04,position:'0 .045 0',material:v('#B88B5A')},g);el('a-cone',{'radius-bottom':.06,height:.04,'segments-radial':4,position:'0 .11 0',material:v(K)},g);},
  ()=>{el('a-cylinder',{radius:.04,height:.12,position:'0 .06 0','segments-radial':10,material:v('#DDEFF5')},g);},
  ()=>{el('a-sphere',{radius:.035,scale:'1 1.2 1',position:'0 .035 0',material:v('#B5653A')},g);},
  ()=>{el('a-torus',{radius:.05,'radius-tubular':.005,rotation:'90 0 0',position:'0 .01 0',material:v(K)},g);el('a-sphere',{radius:.03,position:'0 .04 0',material:v('#6E9F4A')},g);},
  ()=>{el('a-box',{width:.1,height:.05,depth:.06,position:'0 .025 0',material:v('#7A5636')},g);el('a-sphere',{radius:.03,position:'0 .07 0',material:v('#6E9F4A')},g);},
  ()=>{el('a-cylinder',{radius:.03,height:.06,position:'0 .03 0','segments-radial':8,material:v('#E0E0E0')},g);el('a-sphere',{radius:.025,position:'0 .07 0',material:v('#6E9F4A')},g);},
  ()=>{el('a-box',{width:.08,height:.02,depth:.04,position:'0 .03 0',material:v('#B88B5A')},g);}][m]();}
function gallinero(p){const top=p.querySelector('a-entity');
 el('a-box',{width:.3,height:.18,depth:.24,position:'0 .12 0',material:MAT(W,.7)},top);
 el('a-cone',{'radius-bottom':.24,height:.12,'segments-radial':4,rotation:'0 45 0',position:'0 .27 0',material:MAT(O,.7)},top);
 el('a-box',{width:.14,height:.01,depth:.1,position:'.0 .33 .0',rotation:'-30 0 0',material:MAT('#223',.3)},top);
 el('a-cylinder',{radius:.04,height:.16,position:'.19 .1 0',material:MAT('#DDEFF5',.6)},top);
 el('a-sphere',{radius:.04,position:'-.08 .05 .16',material:MAT(W,.9)},top);}
// ---------- capa holográfica ----------
function forma(tipo,g){const m=(t,a)=>el(t,Object.assign({material:HOLO(a.c||O)},a),g);
 ({manos:()=>{m('a-torus',{radius:.07,'radius-tubular':.016,'segments-tubular':12,'segments-radial':5,position:'-.035 0 0'});m('a-torus',{radius:.07,'radius-tubular':.016,'segments-tubular':12,'segments-radial':5,position:'.035 0 0',c:CY});},
  brujula:()=>{m('a-torus',{radius:.08,'radius-tubular':.008,'segments-tubular':16,'segments-radial':3});m('a-cone',{'radius-bottom':.025,height:.13,'segments-radial':4,c:CY});},
  gota:()=>{m('a-sphere',{radius:.07,'segments-width':8,'segments-height':6,c:CY});m('a-cone',{'radius-bottom':.066,height:.1,'segments-radial':8,position:'0 .08 0'});},
  engrane:()=>{m('a-cylinder',{radius:.08,height:.03,rotation:'90 0 0','segments-radial':12});for(let i=0;i<8;i++)m('a-box',{width:.03,height:.04,depth:.03,position:`${.1*Math.cos(i*.785)} ${.1*Math.sin(i*.785)} 0`,rotation:`0 0 ${i*45}`,c:CY});},
  ciclo:()=>{m('a-torus',{radius:.08,'radius-tubular':.012,'segments-tubular':16,'segments-radial':4,'arc':300});m('a-cone',{'radius-bottom':.025,height:.05,'segments-radial':4,position:'.08 .02 0',c:CY});},
  maceta:()=>{m('a-cone',{'radius-bottom':.05,'radius-top':.075,height:.1,'segments-radial':8});m('a-dodecahedron',{radius:.055,position:'0 .1 0',c:CY});},
  zanahoria:()=>{m('a-cone',{'radius-bottom':.04,height:.16,'segments-radial':6,rotation:'180 0 0'});m('a-cone',{'radius-bottom':.03,height:.06,'segments-radial':4,position:'0 .11 0',c:CY});},
  gallina:()=>{m('a-sphere',{radius:.08,'segments-width':8,'segments-height':6,c:CY});m('a-sphere',{radius:.04,'segments-width':6,'segments-height':4,position:'.06 .08 0',c:CY});m('a-cone',{'radius-bottom':.016,height:.035,'segments-radial':4,position:'.11 .08 0',rotation:'0 0 -90'});},
  libro:()=>{m('a-box',{width:.14,height:.1,depth:.025,rotation:'0 25 0'});m('a-box',{width:.14,height:.1,depth:.025,rotation:'0 -25 0',c:CY});},
  barras:()=>{[.06,.1,.14].forEach((h,i)=>m('a-box',{width:.03,height:h,depth:.03,position:`${(i-1)*.045} ${h/2-.06} 0`,c:i==2?O:CY}));}
 })[tipo]();}
function holograma(g,x,y,tipo,titulo){const r=el('a-entity',{position:`${x} ${y} 0.25`},g);
 const o=el('a-entity',{animation:'property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear',animation__f:'property: position; from: 0 -.015 0; to: 0 .015 0; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine'},r);forma(tipo,o);
 el('a-ring',{'radius-inner':.12,'radius-outer':.128,'segments-theta':24,material:FLAT(O,.85),rotation:'-90 0 0',position:'0 -.12 0',animation:'property: rotation; from: -90 0 0; to: -90 0 360; loop: true; dur: 4000; easing: linear'},r);
 el('a-ring',{'radius-inner':.145,'radius-outer':.15,'segments-theta':24,'theta-length':260,material:FLAT(CY,.6),rotation:'-90 0 0',position:'0 -.12 0',animation:'property: rotation; from: -90 0 360; to: -90 0 0; loop: true; dur: 6000; easing: linear'},r);
 el('a-plane',{width:.24,height:.005,material:FLAT(CY,.7),animation:'property: position; from: 0 -.12 0; to: 0 .14 0; loop: true; dur: 1800; easing: linear'},r);
 el('a-image',{src:texBoton(titulo,{w:900,h:120,bg:'rgba(11,26,36,0.85)',fg:W}),width:.42,height:.056,position:'0 -.17 0',material:'shader: flat; transparent: true'},r);
 clic(el('a-sphere',{radius:.16,'segments-width':6,'segments-height':4,material:'opacity: 0; transparent: true; depthWrite: false'},r),()=>{});
 r.classList.add('clicable');reactivo(r,o);return r;}
function panelHolo(g,x,y,src,ancho=.62){const p=el('a-entity',{position:`${x} ${y} 0.33`,scale:'0.001 0.001 0.001',visible:false,
 animation__in:'property: scale; from: 0.001 0.001 0.001; to: 1 1 1; dur: 320; easing: easeOutBack; startEvents: abrir',
 animation__out:'property: scale; to: 0.001 0.001 0.001; dur: 180; startEvents: cerrar'},g);
 el('a-image',{src,width:ancho,height:ancho*.625,material:'shader: flat; transparent: true'},p);
 p.addEventListener('animationcomplete__out',()=>p.setAttribute('visible',false));return p;}
function togglePanel(p,act){if(p.getAttribute('visible')){p.emit('cerrar');}else{p.setAttribute('visible',true);p.emit('abrir');act&&act();}}
function capaHolo(sala){const Z=window._Z;
 // hologramas de "Quiénes somos" (zona izq) y "Cómo trabajamos" (alrededor del display)
 const LUG=[[0,-.5,2.75],[0,.5,2.75],[1,-.88,2.45],[1,.88,2.45],[1,.88,1.45]];
 HOLOS.forEach(([w,tipo,x0,y0,tit,lin,cta,sol],k)=>{const [zi,x,y]=LUG[k],g=Z[zi];const h=holograma(g,x,y,tipo,tit);
  const px=zi==1?(x<0?x+.35:x-.35):0; const pn=panelHolo(g,px,y+.1,texPanel(tit,lin,cta));
  h.addEventListener('click',()=>{cierraOtros(pn);togglePanel(pn);});pn.setAttribute('data-sp','');clic(pn,()=>abrir(fichaGen(tit,lin,cta,sol)));});
 // Zona der: soluciones (mismas esferas)
 const g3=Z[2];
 SOL.forEach((s,i)=>{const x=[-.55,0,.55,-.28,.28][i],y=i<3?2.75:2.2;const h=holograma(g3,x,y,s.ico,s.n);
  const pn=panelHolo(g3,0,y+.2,texPanel(s.n,s.l,s.cta),.7);
  h.addEventListener('click',()=>{cierraOtros(pn);togglePanel(pn);});pn.setAttribute('data-sp','');clic(pn,()=>abrir(ficha(i)));});
 // Portarretratos (zona izq)
 const g1=Z[0];el('a-box',{width:.62,height:.48,depth:.03,position:'0 2.0 -.02',material:MAT(K,.4)},g1);
 const fr=el('a-image',{src:'img/gal0.jpg',width:.56,height:.42,position:'0 2.0 0',material:'shader: flat'},g1);let fi=0;
 setInterval(()=>{fi=(fi+1)%12;fr.setAttribute('src',`img/gal${fi}.jpg`);},3500);clic(fr,()=>verCasos());
 // Interacciones de pedestal: Arma tu Punto verde + Antes/Después
 const pd=window._ped.p;let antes=false;
 clic(el('a-image',{src:texBoton('Arma tu Punto verde',{w:800,h:130}),width:.48,height:.078,position:'0 .36 .255',material:'shader: flat'},pd),()=>armaIsla());
 clic(el('a-image',{src:texBoton('Antes / Después',{w:800,h:130,bg:K,fg:W}),width:.48,height:.078,position:'0 .25 .255',material:'shader: flat'},pd),()=>{antes=!antes;islaVerde(window._ped.top,antes?'antes':'despues',window._sel);});
 // Diagnóstico (brújula, antes sobre el mostrador): flota a la izquierda, abajo
 const h=holograma(g1,0,1.15,'brujula','¿Qué necesita su proyecto?');h.addEventListener('click',()=>diagnostico());
 // Sitio MIA (ventana flotante con la última versión del sitio)
 clic(el('a-image',{src:texBoton('Ver sitio MIA',{w:700,h:130,bg:K,fg:W}),width:.5,height:.093,position:'0 3.57 .02',material:'shader: flat'},Z[1]),()=>verSitio());
 plantasYFauna(sala);
}
function cierraOtros(pn){document.querySelectorAll('[data-sp]').forEach(o=>{if(o!==pn&&o.getAttribute('visible'))o.emit('cerrar');});}
// ---------- plantas y fauna (discretas) ----------
function plantasYFauna(sala){[[-1.3,.25],[1.3,.25],[-1.3,2.8],[-0.7,.2]].forEach(([x,z],i)=>{const p=el('a-entity',{position:`${x} .09 ${z}`},sala);
  el('a-cylinder',{radius:.09,height:.22,'segments-radial':10,position:'0 .11 0',material:MAT(i%2?K:W,.7)},p);
  const t=el('a-entity',{position:'0 .22 0',animation:`property: rotation; from: 0 0 -3; to: 0 0 3; dir: alternate; loop: true; dur: ${2200+i*300}; easing: easeInOutSine`},p);
  [[0,.18,0],[.07,.12,25],[-.07,.13,-25],[.03,.25,10]].forEach(([a,b,r])=>el('a-cone',{'radius-bottom':.045,height:.2,'segments-radial':4,position:`${a} ${b} 0`,rotation:`0 0 ${-r}`,scale:'1 1 .35',material:MAT('#5E8F3E',.9)},t));});
 const ala=(g,c,dur,amp)=>{[1,-1].forEach(sg=>{const w=el('a-entity',{animation:`property: rotation; from: 0 ${sg*amp} 0; to: 0 ${-sg*10} 0; dir: alternate; loop: true; dur: ${dur}`},g);
   el('a-triangle',{'vertex-a':'0 0 0','vertex-b':`${sg*.05} .035 0`,'vertex-c':`${sg*.04} -.03 0`,material:FLAT(c,.85)+'; side: double'},w);});};
 const ruta=(e,pts,dur)=>{pts.forEach((pt,i)=>{const nx=pts[(i+1)%pts.length];e.setAttribute(`animation__p${i}`,`property: position; from: ${pt}; to: ${nx}; dur: ${dur}; easing: easeInOutSine; startEvents: ${i?'p'+i:'arranca'}`);
   e.addEventListener(`animationcomplete__p${i}`,()=>e.emit(i+1<pts.length?'p'+(i+1):'arranca'));});setTimeout(()=>e.emit('arranca'),400);};
 [[O,['-0.9 1.3 0.6','-0.3 1.6 1.0','0.4 1.2 0.7']],[CY,['0.9 1.0 1.4','0.3 1.4 0.6','-0.5 1.1 1.2']]].forEach(([c,pts],i)=>{const b=el('a-entity',{},sala);ala(b,c,170,70);ruta(b,pts,5500+i*700);});
 const hb=el('a-entity',{},sala);el('a-cone',{'radius-bottom':.018,height:.07,'segments-radial':5,material:FLAT(CY),rotation:'0 0 90'},hb);ala(hb,O,60,60);ruta(hb,['1.0 1.7 0.8','0 1.9 0.5','-1.0 1.6 0.9','0 1.5 1.3'],4200);}
// ---------- menú radial (Soluciones / Videos / Diagnóstico / Contacto) ----------
const OPC=[['Soluciones',()=>menuSoluciones()],['Videos',()=>menuVideos()],['Diagnóstico',()=>diagnostico()],['Contacto',()=>menuContacto()]];
function menuRadial(g,x,y){const r=el('a-entity',{position:`${x} ${y} 0.3`},g);const hub=el('a-entity',{class:'clicable'},r);
 el('a-circle',{radius:.07,segments:20,material:FLAT('#0B1A24',.9),class:'clicable'},hub);el('a-ring',{'radius-inner':.07,'radius-outer':.08,'segments-theta':20,material:FLAT(O)},hub);
 el('a-ring',{'radius-inner':.1,'radius-outer':.105,'segments-theta':20,'theta-length':280,material:FLAT(CY,.7),animation:'property: rotation; to: 0 0 360; loop: true; dur: 5000; easing: linear'},hub);
 el('a-image',{src:texBoton('MENÚ',{w:300,h:120,bg:'rgba(0,0,0,0)',fg:W}),width:.12,height:.048,position:'0 0 .01',material:'shader: flat; transparent: true'},hub);reactivo(hub);
 const fan=el('a-entity',{scale:'0.001 0.001 0.001',visible:false,animation__in:'property: scale; to: 1 1 1; dur: 350; easing: easeOutBack; startEvents: abrir',animation__out:'property: scale; to: 0.001 0.001 0.001; dur: 180; startEvents: cerrar'},r);
 OPC.forEach(([t,fn],i)=>{const a=(150-i*40)*Math.PI/180,R=.22;const b=el('a-entity',{position:`${R*Math.cos(a)} ${R*Math.sin(a)} .02`,class:'clicable'},fan);
  el('a-image',{src:texBoton(t,{w:560,h:150,bg:i%2?CY:O}),width:.2,height:.054,class:'clicable',material:'shader: flat'},b);reactivo(b);b.addEventListener('click',fn);});
 fan.addEventListener('animationcomplete__out',()=>fan.setAttribute('visible',false));
 hub.addEventListener('click',()=>{if(fan.getAttribute('visible'))fan.emit('cerrar');else{fan.setAttribute('visible',true);fan.emit('abrir');}});}
// ---------- construir ----------
function construirStand(stand){
 const sala=el('a-entity',{scale:`${U} ${U} ${U}`,position:`0 ${-HA*U} 0`},stand); // metros -> unidades del ancla (centro del display en el origen)
 el('a-entity',{light:'type: ambient; intensity: 0.75'},stand);el('a-entity',{light:'type: directional; intensity: 0.7',position:'1 3 2'},stand);
 standFisico(sala);capaHolo(sala);
 menuRadial(window._Z[1],-.88,1.45);
 fetch('config.json').then(r=>r.json()).then(c=>{const L=c.videos||[];let k=0;const v=document.getElementById('tv');if(!v||!L.length)return;
  const set=()=>{v.src=L[k].src;subt(L[k].subtitulos||[]);};set();if(L.length>1){v.loop=false;v.addEventListener('ended',()=>{k=(k+1)%L.length;set();v.play();});}}).catch(()=>{});
}
let _st;function subt(arr){clearInterval(_st);if(!arr.length||!window._sub)return;let i=0;const show=()=>{window._sub.setAttribute('src',texBoton(arr[i%arr.length],{w:1060,h:110,bg:'rgba(0,0,0,0.75)',fg:W}));i++;};show();_st=setInterval(show,3500);}
// ---------- fusión de anclas (cualquier cartel coloca todo; varios = refuerzo) ----------
AFRAME.registerComponent('fusion-stand',{init(){this.inv=POSES.map(P=>new THREE.Matrix4().compose(new THREE.Vector3(...P.p),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,THREE.MathUtils.degToRad(P.ry),0)),new THREE.Vector3(1,1,1)).invert());
  this.pos=new THREE.Vector3();this.q=new THREE.Quaternion();this.sc=new THREE.Vector3(1,1,1);this.has=false;this.lost=0;},
 tick(t,dt){const p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3();let n=0;const m=new THREE.Matrix4(),tp=new THREE.Vector3(),tq=new THREE.Quaternion(),ts=new THREE.Vector3();
  POSES.forEach((P,i)=>{const e=document.getElementById('t'+i);if(!e||!e.object3D.visible)return;m.multiplyMatrices(e.object3D.matrixWorld,this.inv[i]);m.decompose(tp,tq,ts);
   if(!(ts.x>1e-6)||[tq.x,tq.y,tq.z,tq.w,tp.x,tp.y,tp.z].some(v=>!isFinite(v)))return;tq.normalize();p.add(tp);sc.add(ts);if(n===0)q.copy(tq);else q.slerp(tq,1/(n+1));n++;});
  const o=this.el.object3D;if(n&&this.has&&![this.q.x,this.q.y,this.q.z,this.q.w,this.pos.x].every(isFinite))this.has=false;
  if(n){p.divideScalar(n);sc.divideScalar(n);if(!this.has){this.pos.copy(p);this.q.copy(q);this.sc.copy(sc);this.has=true;}else{this.pos.lerp(p,.3);this.q.slerp(q,.3);this.sc.lerp(sc,.3);}this.lost=0;o.visible=true;}
  else if(this.has){this.lost+=dt;if(this.lost>2500)o.visible=false;}
  o.position.copy(this.pos);o.quaternion.copy(this.q);o.scale.copy(this.sc);}});
// ---------- hojas HTML (accesibles, con CTA a WhatsApp) ----------
function btnWA(txt,sol){return `<a class="btn wa" target="_blank" href="${wa(sol)}">${txt}</a>`;}
function fichaGen(t,lin,cta,sol){return `<h2>${t}</h2>`+lin.map(l=>`<p>${l}</p>`).join('')+`<p>${btnWA(cta,sol)}</p>`;}
function ficha(i){const s=SOL[i];return `<h2>${s.n}</h2><img src="${s.img}" alt="">`+s.l.map(l=>`<p>${l}</p>`).join('')+`<p>${btnWA(s.cta,s.n)}</p>`;}
function abrir(h){document.getElementById('pc').innerHTML=h;document.getElementById('panel').style.display='block';}
function cerrar(){document.getElementById('panel').style.display='none';}
function menuSoluciones(){abrir('<h2>Soluciones</h2>'+SOL.map((s,i)=>`<p><button onclick="abrir(ficha(${i}))">${s.n}</button></p>`).join(''));}
const explorar=menuSoluciones;
function menuVideos(){fetch('config.json').then(r=>r.json()).then(c=>abrir('<h2>Videos</h2>'+(c.videos||[]).map((v,i)=>`<p><button onclick="const t=document.getElementById('tv');t.src='${v.src}';t.play();cerrar()">${v.titulo}</button></p>`).join('')+`<p>${btnWA('Ver más casos por WhatsApp','casos de proyectos')}</p>`));}
function menuContacto(){abrir(`<h2>Cuéntenos su prioridad. Armamos juntos la ruta.</h2><p>Una conversación exploratoria de 20 minutos, sin compromiso.</p><p>${btnWA('WhatsApp','una conversación exploratoria')}</p><p><a class="btn" href="${TEL}">Llamar 444 174 9695</a></p><p><a class="btn k" href="${MAIL}">danae@miaglobalconsulting.com</a></p>`);}
function diagnostico(){abrir('<h2>¿Qué necesita su proyecto?</h2><p>Un toque y le recomendamos por dónde empezar.</p>'+Object.keys(DIAG).map(k=>`<p><button onclick="diagRes('${k}')">${k}</button></p>`).join(''));}
function diagRes(k){const [s,d]=DIAG[k];abrir(`<h2>${k}: le recomendamos ${s}</h2><p>${d}</p><p>${btnWA('Hablar de esto por WhatsApp',s+' (mi prioridad: '+k.toLowerCase()+')')}</p>`);}
function armaIsla(){abrir('<h2>Arma tu Punto verde</h2><p>Elija 2 o 3 módulos. Aparecen sobre el pedestal.</p>'+MODULOS.map((m,i)=>`<label class="chk"><input type="checkbox" value="${i}" onchange="selMod()"> ${m}</label>`).join('')+'<p id="cotIsla"></p>');}
function selMod(){const c=[...document.querySelectorAll('#pc input:checked')];if(c.length>3){c[c.length-1].checked=false;return selMod();}
 window._sel=c.map(x=>+x.value);islaVerde(window._ped.top,'despues',window._sel);
 document.getElementById('cotIsla').innerHTML=c.length?btnWA('Cotizar mi Punto verde','un Punto verde con: '+window._sel.map(i=>MODULOS[i]).join(', ')):'';}
function verSitio(){const u='https://tortugadante.github.io/mia-global-consulting/';abrir(`<h2>Sitio MIA</h2><iframe src="${u}" title="Sitio MIA" style="width:100%;height:52vh;border:2px solid #1F1F1F;border-radius:8px" loading="lazy"></iframe><p><a class="btn" target="_blank" href="${u}">Abrir el sitio completo</a></p>`);}
function verCasos(){abrir('<h2>Casos en campo</h2>'+[...Array(12).keys()].map(i=>`<img src="img/gal${i}.jpg" alt="">`).join('')+`<p>${btnWA('Ver más casos','casos de proyectos como estos')}</p>`);}
function irMuro(i){if(window.irA)window.irA(i);}
