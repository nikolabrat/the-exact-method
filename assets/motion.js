/* Motion layer for all pages. Everything here is decoration: the page works without it. */
(function(){
  var calm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* home page: give its sections the same reveal as the guide pages */
  [].forEach.call(document.querySelectorAll('main section:not(.hero) h2,main section .sec-sub,.page-grid,.drow,.s5,.chap,.why-row,.fit-row,.tier,.free-item,.faq-col details,.flag,.final-in'),function(el){
    if(!el.closest('.hero')&&!el.classList.contains('rise'))el.classList.add('rise');
  });
  [].forEach.call(document.querySelectorAll('.page-grid,.steps5,.chap-list,.why-list,.fit-col,.tier-list,.free-grid,.faq-col'),function(g){
    [].forEach.call(g.querySelectorAll('.rise'),function(el,i){el.style.setProperty('--d',(Math.min(i,6)*0.07).toFixed(2)+'s')});
  });
  /* stagger: children of grids reveal one after another */
  [].forEach.call(document.querySelectorAll('.steps,.habits,.tools,.more,.faq,.list'),function(g){
    [].forEach.call(g.querySelectorAll('.rise'),function(el,i){el.style.setProperty('--d',(i*0.08).toFixed(2)+'s')});
  });

  /* scroll reveal for .rise and kickers, plus sticker wiggle and number count-up */
  var targets=document.querySelectorAll('.rise,.kicker,.hl,h2 .accent,[data-count]');
  function show(el){
    el.classList.add('in');
    if(!calm&&(el.classList.contains('hl')||el.classList.contains('accent'))&&!el.closest('.hero')){el.classList.add('wiggle')}
    if(el.hasAttribute('data-count'))count(el);
  }
  if(!('IntersectionObserver' in window)){[].forEach.call(targets,show)}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -8% 0px'});
    [].forEach.call(targets,function(el){io.observe(el)});
  }

  /* safety net: anything already scrolled past gets revealed even after a very fast scroll */
  var pend=false;
  function sweep(){pend=false;var h=window.innerHeight;[].forEach.call(document.querySelectorAll('.rise:not(.in)'),function(el){var r=el.getBoundingClientRect();if(r.top<h&&r.height)show(el)})}
  window.addEventListener('scroll',function(){if(!pend){pend=true;setTimeout(sweep,120)}},{passive:true});
  /* count-up: numbers in fact strips */
  [].forEach.call(document.querySelectorAll('.facts b,.fact .n,.flag-stat .n'),function(el){
    var m=el.textContent.trim().match(/^(\$?)(\d+)$/);
    if(m){el.setAttribute('data-count',m[2]);el.setAttribute('data-pre',m[1]);if(!calm)el.textContent=m[1]+'0';if(io)io.observe(el)}
  });
  function count(el){
    var to=+el.getAttribute('data-count'),pre=el.getAttribute('data-pre')||'';
    if(calm||to===0){el.textContent=pre+to;return}
    var t0=null,dur=900+Math.min(to,60)*8;
    function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);p=1-Math.pow(1-p,3);el.textContent=pre+Math.round(to*p);if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }

  /* smooth FAQ open and close: the icon turns at once, the height follows */
  [].forEach.call(document.querySelectorAll('details'),function(d){
    var s=d.querySelector('summary');if(!s||calm||!d.animate)return;
    var anim=null;
    function closedH(){var cs=getComputedStyle(d);return s.offsetHeight+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)+parseFloat(cs.borderTopWidth)+parseFloat(cs.borderBottomWidth)}
    s.addEventListener('click',function(e){
      e.preventDefault();
      var start=d.getBoundingClientRect().height;
      if(anim){anim.cancel();anim=null}
      if(d.open&&!d.classList.contains('closing')){
        d.classList.add('closing');
        anim=d.animate({height:[start+'px',closedH()+'px']},{duration:260,easing:'cubic-bezier(.4,0,.2,1)'});
        anim.onfinish=function(){d.open=false;d.classList.remove('closing');anim=null};
      }else{
        d.classList.remove('closing');d.open=true;
        var end=d.getBoundingClientRect().height;
        anim=d.animate({height:[start+'px',end+'px']},{duration:340,easing:'cubic-bezier(.16,1,.3,1)'});
        anim.onfinish=function(){anim=null};
      }
    });
  });

  /* before/after: underline the habits one by one when "Rules off" shows */
  function underline(){
    var off=document.getElementById('ba-off');if(!off||off.hidden)return;
    var t=off.querySelectorAll('.tell');
    [].forEach.call(t,function(x){x.classList.remove('on')});
    [].forEach.call(t,function(x,i){setTimeout(function(){x.classList.add('on')},calm?0:250+i*140)});
  }
  var baBox=document.querySelector('.ba');
  if(baBox){
    if('IntersectionObserver' in window){var bo=new IntersectionObserver(function(es){if(es[0].isIntersecting){underline();bo.disconnect()}},{threshold:.4});bo.observe(baBox)}else underline();
    var tOff=document.getElementById('t-off');if(tOff)tOff.addEventListener('click',function(){setTimeout(underline,30)});
  }

  /* builder: flash the card that changed */
  [['goal','o1'],['lim','o2']].forEach(function(p){
    var i=document.getElementById(p[0]),o=document.getElementById(p[1]);if(!i||!o)return;
    var card=o.closest('.out'),tm;
    i.addEventListener('input',function(){card.classList.remove('flash');void card.offsetWidth;card.classList.add('flash')});
  });

  if(calm||!fine)return;

  /* hero prompt cards follow the mouse, with easing */
  var stack=document.querySelector('.stack');
  if(stack&&stack.querySelector('.pcard')){
    var cards=[].slice.call(stack.querySelectorAll('.pcard')),hero=stack.closest('.hero')||stack;
    var tx=0,ty=0,cx=0,cy=0,run=false;
    function frame(){
      cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
      cards.forEach(function(c,i){var d=i+1;c.style.setProperty('--px',(cx*d*7).toFixed(2)+'px');c.style.setProperty('--py',(cy*d*5).toFixed(2)+'px')});
      if(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)requestAnimationFrame(frame);else run=false;
    }
    function kick(){if(!run){run=true;requestAnimationFrame(frame)}}
    hero.addEventListener('mousemove',function(e){var r=stack.getBoundingClientRect();
      tx=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/(r.width/2)));ty=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height/2))/(r.height/2)));kick()});
    hero.addEventListener('mouseleave',function(){tx=0;ty=0;kick()});
  }

  /* gentle tilt with a soft glare on cards */
  [].forEach.call(document.querySelectorAll('.step,.habit,.tool,.more a,.src-card,.mcard,.gcard'),function(el){
    el.setAttribute('data-tilt','');
    var max=el.offsetWidth>600?3:6;
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
      el.classList.add('is-live');
      el.style.setProperty('--ry',((px-.5)*max).toFixed(2)+'deg');
      el.style.setProperty('--rx',((.5-py)*max*.8).toFixed(2)+'deg');
      el.style.setProperty('--lift','-4px');
      el.style.setProperty('--gx',(px*100).toFixed(1)+'%');el.style.setProperty('--gy',(py*100).toFixed(1)+'%');
    });
    el.addEventListener('pointerleave',function(){el.classList.remove('is-live');el.style.setProperty('--ry','0deg');el.style.setProperty('--rx','0deg');el.style.setProperty('--lift','0px')});
  });

  /* magnetic pull on the big buttons */
  [].forEach.call(document.querySelectorAll('.btn-lg'),function(b){
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();
      b.style.setProperty('--mx',((e.clientX-(r.left+r.width/2))*.12).toFixed(1)+'px');b.style.setProperty('--my',((e.clientY-(r.top+r.height/2))*.18).toFixed(1)+'px')});
    b.addEventListener('pointerleave',function(){b.style.setProperty('--mx','0px');b.style.setProperty('--my','0px')});
  });
})();
