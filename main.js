const m=document.querySelector('.menu'),nv=document.querySelector('.nav nav');
m.onclick=()=>{nv.classList.toggle('open');m.setAttribute('aria-expanded',nv.classList.contains('open'))};
nv.querySelectorAll('a').forEach(a=>a.onclick=()=>nv.classList.remove('open'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));
// Encuesta: guarda elecciones solo en este navegador (localStorage); no hay estadísticas inventadas.
const K='mia_poll_v1',btns=[...document.querySelectorAll('.poll button')],msg=document.getElementById('pollmsg');
const load=()=>JSON.parse(localStorage.getItem(K)||'{"votes":{},"mine":null}');
function show(d){const tot=Object.values(d.votes).reduce((a,b)=>a+b,0);
 btns.forEach(b=>{const v=d.votes[b.dataset.k]||0;b.classList.toggle('sel',d.mine===b.dataset.k);b.querySelector('i').textContent=tot?`${Math.round(v*100/tot)} % · ${v} elección${v==1?'':'es'}`:''});
 if(d.mine)msg.textContent=`Gracias. Elecciones registradas en este navegador: ${tot}. En MIA trabajamos los cuatro factores desde el diseño.`}
btns.forEach(b=>b.onclick=()=>{const d=load();if(d.mine)d.votes[d.mine]--;d.mine=b.dataset.k;d.votes[d.mine]=(d.votes[d.mine]||0)+1;localStorage.setItem(K,JSON.stringify(d));show(d)});
show(load());
