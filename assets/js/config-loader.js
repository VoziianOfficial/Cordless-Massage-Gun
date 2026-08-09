(function(){
  'use strict';
  const cfg=window.SITE_CONFIG||{};
  const configScript=document.querySelector('script[src$="config/config.js"]');
  const siteRoot=new URL(configScript?.src||'./',location.href);
  if(siteRoot.pathname.endsWith('/config/config.js'))siteRoot.pathname=siteRoot.pathname.slice(0,-'config/config.js'.length);
  const sitePath=(path)=>typeof path==='string'&&path.startsWith('/')?new URL(path.slice(1),siteRoot.href).href:path;
  const normalizePaths=(value)=>{if(Array.isArray(value)){value.forEach(normalizePaths);return}if(value&&typeof value==='object'){Object.keys(value).forEach(key=>{const item=value[key];if(typeof item==='string'&&item.startsWith('/'))value[key]=sitePath(item);else normalizePaths(item)})}};
  normalizePaths(cfg);
  window.PulsoPath=sitePath;
  const get=(path)=>path.split('.').reduce((v,k)=>v&&v[k],cfg);
  const money=(value)=>new Intl.NumberFormat('en-US',{style:'currency',currency:(cfg.product&&cfg.product.currency)||'USD',maximumFractionDigits:0}).format(value||0);
  window.PulsoConfig={get,money,cfg};
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.site-announcement').forEach(el=>{el.textContent=[cfg.policies?.shipping,cfg.policies?.returns,cfg.policies?.warranty].filter(Boolean).join('  |  ')});
    document.querySelectorAll('.brand').forEach(el=>{let label=el.querySelector('span');if(!label){label=document.createElement('span');el.append(label)}label.textContent=cfg.brand?.name||''});
    document.querySelectorAll('.footer-bottom>span:first-child').forEach(el=>{el.textContent='© '+new Date().getFullYear()+' '+(cfg.brand?.companyName||'')+'. '+(cfg.footer?.copyrightText||'')});
    document.querySelectorAll('.contact-detail').forEach(el=>{if(el.querySelector('span,a'))return;const key=el.querySelector('b')?.textContent.trim();if(key==='Studio')el.append(cfg.contact?.address||'');if(key==='Response')el.append(cfg.contact?.responseTime||'')});
    document.querySelectorAll('.legal-hero .site-container>p:last-child').forEach(el=>{if(el.textContent.trim().startsWith('Effective'))el.textContent='Effective '+(cfg.legal?.effectiveDate||'')});
    if(Array.isArray(cfg.certifications)&&cfg.certifications.length){document.querySelectorAll('.trust-strip__inner').forEach(host=>{host.textContent='';cfg.certifications.slice(0,3).forEach(item=>{const card=document.createElement('div');card.className='trust-item';const mark=document.createElement('b');mark.textContent='✓';const copy=document.createElement('div');const title=document.createElement('strong');title.textContent=item.name||'Verified standard';const detail=document.createElement('span');detail.textContent=item.detail||'';copy.append(title,detail);card.append(mark,copy);host.append(card)})})}
    document.querySelectorAll('[data-config]').forEach(el=>{const value=get(el.dataset.config);if(value!==undefined&&value!==null)el.textContent=value});
    document.querySelectorAll('[data-config-email]').forEach(el=>{const email=get('contact.email');el.textContent=email;el.href='mailto:'+email});
    document.querySelectorAll('[data-config-price]').forEach(el=>{const value=get(el.dataset.configPrice||'product.price');if(value!==undefined)el.textContent=money(value)});
    if(document.body.dataset.productSchema==='true'&&cfg.product){const schema={'@context':'https://schema.org','@type':'Product','name':cfg.product.name,'description':cfg.product.subtitle,'sku':cfg.product.sku,'image':new URL(cfg.product.image,location.origin).href,'offers':{'@type':'Offer','priceCurrency':cfg.product.currency,'price':String(cfg.product.price),'availability':cfg.product.stock?'https://schema.org/InStock':'https://schema.org/OutOfStock'}};const script=document.createElement('script');script.type='application/ld+json';script.textContent=JSON.stringify(schema);document.head.append(script)}
  });
})();
