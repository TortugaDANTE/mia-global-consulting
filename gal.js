var d=document.getElementById('lb'),im=document.getElementById('lbi'),t=document.getElementById('lbt');
document.querySelectorAll('.gi').forEach(function(a){a.addEventListener('click',function(e){if(!d.showModal)return;e.preventDefault();var i=a.querySelector('img');im.src=a.href;im.alt=i.alt;t.textContent=i.alt;d.showModal();});});
document.getElementById('lbc').onclick=function(){d.close()};d.addEventListener('click',function(e){if(e.target===d)d.close()});
(function(){var d=document.getElementById('sl');if(!d||!window.EX)return;var v=document.getElementById('slv'),t=document.getElementById('slt'),n=document.getElementById('sln'),cur=0,cnt=0,opener=null;
function go(i){i=Math.max(0,Math.min(cnt-1,i));v.scrollTo({left:i*v.clientWidth,behavior:'smooth'});}
function upd(){cur=Math.round(v.scrollLeft/v.clientWidth);n.textContent=(cur+1)+' / '+cnt;document.getElementById('slp').disabled=cur==0;document.getElementById('slx').disabled=cur==cnt-1;}
v.addEventListener('scroll',function(){clearTimeout(v._t);v._t=setTimeout(upd,60)});
document.querySelectorAll('.exb').forEach(function(b){b.addEventListener('click',function(){var e=EX[+b.dataset.ex];opener=b;t.textContent=e.t;cnt=e.i.length;
v.innerHTML=e.i.map(function(x){return '<figure class="sli"><img src="img/'+x[0]+'" alt="'+x[1]+'" loading="lazy"><figcaption>'+x[1]+'</figcaption></figure>'}).join('');
d.showModal();v.scrollLeft=0;upd();v.focus();});});
document.getElementById('slp').onclick=function(){go(cur-1)};document.getElementById('slx').onclick=function(){go(cur+1)};
document.getElementById('slc').onclick=function(){d.close()};d.addEventListener('close',function(){if(opener)opener.focus()});
d.addEventListener('keydown',function(e){if(e.key=='ArrowRight'){e.preventDefault();go(cur+1)}if(e.key=='ArrowLeft'){e.preventDefault();go(cur-1)}});
d.addEventListener('click',function(e){if(e.target===d)d.close()});})();
