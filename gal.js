function initDeck(dk){var v=dk.querySelector('.slides'),c=dk.querySelector('.dcount'),p=dk.querySelector('.dprev'),x=dk.querySelector('.dnext'),n=v.children.length,cur=0;
function upd(){cur=Math.round(v.scrollLeft/v.clientWidth);c.textContent=(cur+1)+' / '+n;p.disabled=cur==0;x.disabled=cur==n-1;}
function go(i){i=Math.max(0,Math.min(n-1,i));v.scrollTo({left:i*v.clientWidth,behavior:'smooth'});}
v.addEventListener('scroll',function(){clearTimeout(v._t);v._t=setTimeout(upd,60)});
p.onclick=function(){go(cur-1)};x.onclick=function(){go(cur+1)};
dk.addEventListener('keydown',function(e){if(e.key=='ArrowRight'){e.preventDefault();go(cur+1)}if(e.key=='ArrowLeft'){e.preventDefault();go(cur-1)}});upd();}
document.querySelectorAll('.deck').forEach(initDeck);
(function(){var d=document.getElementById('sl');if(!d||!window.EX)return;var v=document.getElementById('slv'),t=document.getElementById('slt'),opener=null;
document.querySelectorAll('.exb').forEach(function(b){b.addEventListener('click',function(){var e=EX[+b.dataset.ex];opener=b;t.textContent=e.t;v.innerHTML=e.h;d.showModal();var dk=v.querySelector('.deck');initDeck(dk);dk.querySelector('.slides').focus();});});
document.getElementById('slc').onclick=function(){d.close()};d.addEventListener('close',function(){if(opener)opener.focus()});
d.addEventListener('click',function(e){if(e.target===d)d.close()});})();
