var d=document.getElementById('lb'),im=document.getElementById('lbi'),t=document.getElementById('lbt');
document.querySelectorAll('.gi').forEach(function(a){a.addEventListener('click',function(e){if(!d.showModal)return;e.preventDefault();var i=a.querySelector('img');im.src=a.href;im.alt=i.alt;t.textContent=i.alt;d.showModal();});});
document.getElementById('lbc').onclick=function(){d.close()};d.addEventListener('click',function(e){if(e.target===d)d.close()});
