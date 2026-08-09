(function(){
  'use strict';
  const qa=(s,c=document)=>[...c.querySelectorAll(s)],q=(s,c=document)=>c.querySelector(s);
  qa('[data-speed]').forEach(btn=>btn.addEventListener('click',()=>{const name=btn.dataset.speed;qa('[data-speed]').forEach(x=>x.classList.toggle('is-active',x.dataset.speed===name));const item=(window.SITE_CONFIG.speeds||[]).find(x=>x.name===name);const message=q('[data-rhythm-message]');if(message&&item)message.textContent=item.text;qa('[data-main-add]').forEach(x=>x.dataset.variant=name)}));
  qa('[data-thumb]').forEach(btn=>btn.addEventListener('click',()=>{qa('[data-thumb]').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');const img=q('[data-product-main]');if(img){img.src=btn.dataset.src;img.alt=btn.dataset.alt||'PULSO product view'}}));
  qa('.faq-question').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq-item');qa('.faq-item').forEach(x=>{if(x!==item){x.classList.remove('is-open');q('.faq-question',x)?.setAttribute('aria-expanded','false')}});const open=item.classList.toggle('is-open');btn.setAttribute('aria-expanded',open);btn.querySelector('span:last-child').textContent=open?'−':'+'}));
  const offer=q('[data-countdown]');if(offer){const end=new Date(window.SITE_CONFIG.offer.endsAt).getTime();const render=()=>{const d=end-Date.now();if(d<=0){offer.textContent=window.SITE_CONFIG.offer.expiredMessage||'OFFER ENDED';return}const values=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1000)%60],labels=['DAYS','HRS','MIN','SEC'];offer.textContent='';values.forEach((v,i)=>{const x=document.createElement('div');x.className='count-cell';const s=document.createElement('strong');s.textContent=String(v).padStart(2,'0');const l=document.createElement('span');l.textContent=labels[i];x.append(s,l);offer.append(x)});setTimeout(render,1000)};render()}
  const product=window.SITE_CONFIG.product;document.querySelectorAll('[data-main-add]').forEach(x=>{x.dataset.id=product.id});
  const reviewCfg=window.SITE_CONFIG.reviews||{},ratingValue=q('[data-rating-value]'),ratingEmpty=q('.rating-empty');if(reviewCfg.rating!==null&&ratingValue){ratingValue.hidden=false;q('strong',ratingValue).textContent=Number(reviewCfg.rating).toFixed(1);q('span',ratingValue).textContent=reviewCfg.count!==null?reviewCfg.count+' verified reviews':'Verified customer rating';if(ratingEmpty)ratingEmpty.hidden=true}
  const actionParallax=q('.action-section__inner');
  if(actionParallax&&matchMedia('(prefers-reduced-motion: no-preference)').matches){
    const updateActionParallax=()=>{const rect=actionParallax.getBoundingClientRect(),progress=(rect.top+rect.height/2-innerHeight/2)/innerHeight;actionParallax.style.setProperty('--action-parallax-y',`${Math.max(-18,Math.min(18,progress*-30))}px`)};
    updateActionParallax();
    addEventListener('scroll',()=>requestAnimationFrame(updateActionParallax),{passive:true});
    addEventListener('resize',updateActionParallax);
  }
  if(window.Swiper&&matchMedia('(max-width: 760px)').matches){['.attachment-list','.ugc-strip','.review-cards'].forEach(selector=>{const el=q(selector);if(el)new Swiper(el,{slidesPerView:1.15})})}
})();
