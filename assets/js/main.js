(function(){
  "use strict";
  var doc=document.documentElement; doc.classList.add("js");
  var header=document.querySelector(".site-header");
  var toggle=document.querySelector(".nav-toggle");
  var mobile=document.getElementById("mobile-menu");
  var bar=document.querySelector(".mobile-order-bar");
  var hero=document.querySelector(".hero");

  // Sticky header state + mobile order bar
  function onScroll(){
    var y=window.scrollY||0;
    header.classList.toggle("is-scrolled",y>8);
    if(bar&&hero){bar.classList.toggle("is-visible",y>hero.offsetHeight*0.8)}
  }
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();

  // Mobile menu
  function closeMenu(){toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open menu");mobile.hidden=true;document.body.style.overflow=""}
  toggle.addEventListener("click",function(){
    var open=toggle.getAttribute("aria-expanded")==="true";
    if(open){closeMenu()}else{toggle.setAttribute("aria-expanded","true");toggle.setAttribute("aria-label","Close menu");mobile.hidden=false}
  });
  mobile.addEventListener("click",function(e){if(e.target.closest("a"))closeMenu()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!mobile.hidden){closeMenu();toggle.focus()}});
  window.addEventListener("resize",function(){if(window.innerWidth>1080&&!mobile.hidden)closeMenu()});

  // Menu tabs (accessible tablist)
  var tabs=[].slice.call(document.querySelectorAll(".menu-tab"));
  function select(tab,focus){
    tabs.forEach(function(t){
      var on=t===tab; t.setAttribute("aria-selected",on?"true":"false"); t.tabIndex=on?0:-1;
      document.getElementById(t.getAttribute("aria-controls")).hidden=!on;
    });
    if(focus)tab.focus();
    var wrap=tab.parentElement; var l=tab.offsetLeft-wrap.clientWidth/2+tab.clientWidth/2;
    wrap.scrollTo({left:l,behavior:"smooth"});
  }
  tabs.forEach(function(t,i){
    t.addEventListener("click",function(){select(t,false)});
    t.addEventListener("keydown",function(e){
      var n=null;
      if(e.key==="ArrowRight")n=tabs[(i+1)%tabs.length];
      else if(e.key==="ArrowLeft")n=tabs[(i-1+tabs.length)%tabs.length];
      else if(e.key==="Home")n=tabs[0]; else if(e.key==="End")n=tabs[tabs.length-1];
      if(n){e.preventDefault();select(n,true)}
    });
  });

  // Active nav link on scroll
  var links=[].slice.call(document.querySelectorAll(".nav-links a"));
  if("IntersectionObserver" in window){
    var secObs=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){var id=en.target.id;links.forEach(function(a){a.classList.toggle("is-active",a.getAttribute("href")==="#"+id)})}
      });
    },{rootMargin:"-45% 0px -50% 0px"});
    links.forEach(function(a){var s=document.querySelector(a.getAttribute("href"));if(s)secObs.observe(s)});

    var rev=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add("is-visible");rev.unobserve(en.target)}});
    },{rootMargin:"0px 0px -8% 0px"});
    document.querySelectorAll(".reveal").forEach(function(el,i){el.style.transitionDelay=(i%4)*70+"ms";rev.observe(el)});
  } else {
    document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("is-visible")});
  }

  // Open / closed status (Vancouver time)
  try{
    var parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Vancouver",weekday:"short",hour:"numeric",minute:"numeric",hour12:false}).formatToParts(new Date());
    var get=function(t){var p=parts.find(function(x){return x.type===t});return p?p.value:""};
    var dayIdx=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(get("weekday"));
    var mins=(parseInt(get("hour"),10)%24)*60+parseInt(get("minute"),10);
    var close=(dayIdx===5||dayIdx===6)?23*60+30:22*60;
    var open=mins>=11*60&&mins<close;
    var badge=document.querySelector(".js-open-badge");
    if(badge){badge.hidden=false;badge.textContent=open?"Open now":"Closed now";badge.classList.add(open?"is-open":"is-closed")}
    document.querySelectorAll(".hours tr[data-days]").forEach(function(tr){
      if(tr.getAttribute("data-days").split(",").indexOf(String(dayIdx))>-1)tr.classList.add("is-today");
    });
    var st=document.querySelector(".js-open-status");
    if(st){st.textContent=open?"Open now":"Opens 11am"}
  }catch(e){}

  var yr=document.querySelector(".js-year"); if(yr)yr.textContent=new Date().getFullYear();
})();
