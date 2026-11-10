/* Zevrauk main.js: scroll animations + contact form */
document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded',function(){
  var els=document.querySelectorAll('.rv,.frame');
  try{
    var io=new IntersectionObserver(function(es){es.forEach(function(x){
      if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}
    });},{threshold:.18});
    els.forEach(function(el){io.observe(el);});
  }catch(e){els.forEach(function(el){el.classList.add('in');});}

  var f=document.getElementById('f');
  if(!f)return;
  var msg=document.getElementById('fmsg'),btn=f.querySelector('button');
  f.addEventListener('submit',function(ev){
    ev.preventDefault();
    btn.disabled=true;msg.textContent='Sending...';
    fetch('https://zevra-api.onrender.com/api/contact',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        name:f.elements.name.value,email:f.elements.email.value,
        phone:f.elements.phone.value,message:f.elements.message.value,
        website:f.elements.website.value
      })
    }).then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
    .then(function(x){
      if(x.ok){msg.textContent='Thank you. Your request has been sent. We will reply by email soon.';f.reset();}
      else{msg.textContent=x.j.error||'Something went wrong. Please email info@zevrauk.com.';}
    }).catch(function(){msg.textContent='Could not send. Please email info@zevrauk.com.';})
    .finally(function(){btn.disabled=false;});
  });
});
