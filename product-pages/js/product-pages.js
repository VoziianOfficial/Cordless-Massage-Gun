(function(){
  const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];
  qa('[data-select]').forEach(b=>b.addEventListener('click',()=>{const group=b.closest('[data-selector-group]')||document;qa('[data-select]',group).forEach(x=>x.classList.toggle('is-active',x===b));const target=q('[data-selector-content]');if(target){q('h3',target).textContent=b.dataset.title;q('p',target).textContent=b.dataset.copy;const img=q('img',target);if(img)img.src=b.dataset.image}}));
  qa('[data-filter]').forEach(b=>b.addEventListener('click',()=>{qa('[data-filter]').forEach(x=>x.classList.toggle('is-active',x===b));qa('[data-review-stars]').forEach(card=>card.hidden=b.dataset.filter!=='all'&&card.dataset.reviewStars!==b.dataset.filter)}));
  qa('.mini-speed button').forEach(b=>b.addEventListener('click',()=>{qa('.mini-speed button').forEach(x=>x.classList.toggle('is-active',x===b));qa('[data-page-add]').forEach(x=>x.dataset.variant=b.textContent.trim());window.PulsoUpdateCartButtons?.()}));
})();
