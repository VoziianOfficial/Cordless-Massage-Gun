(function(){
  'use strict';
  const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];
  const cfg=()=>window.SITE_CONFIG||{};
  const header=q('.site-header');
  addEventListener('scroll',()=>header?.classList.toggle('is-scrolled',scrollY>8),{passive:true});

  if(header&&!q('[data-menu-toggle]')){
    const brand=q('.brand',header),button=document.createElement('button');
    button.className='brand__menu';
    button.type='button';
    button.dataset.menuToggle='';
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-controls','mobile-menu');
    button.setAttribute('aria-label','Open menu');
    button.append(...[1,2,3].map(()=>document.createElement('span')));
    if(brand){const wrap=document.createElement('div');wrap.className='brand-shell';brand.before(wrap);wrap.append(button,brand)}
    if(!q('#mobile-menu')){
      const nav=document.createElement('nav');
      nav.className='mobile-menu';
      nav.id='mobile-menu';
      nav.setAttribute('aria-label','Mobile');
      (cfg().navigation||[]).forEach(item=>{const a=document.createElement('a');a.href=item.href;a.textContent=item.label;nav.append(a)});
      header.after(nav);
    }
  }

  const menu=q('.mobile-menu'),menuBtn=q('[data-menu-toggle]');
  menuBtn?.addEventListener('click',()=>{const open=menu.classList.toggle('is-open');menuBtn.setAttribute('aria-expanded',String(open))});
  qa('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>menu?.classList.remove('is-open')));

  const productForButton=(button)=>{
    const id=button.dataset.id||'pulso-massage-gun';
    const bundle=(cfg().bundles||[]).find(x=>x.id===id);
    const p=cfg().product||{};
    const offer=button.hasAttribute('data-offer')&&cfg().offer?.enabled;
    if(bundle)return {id:bundle.id,sku:bundle.sku,name:bundle.name,price:bundle.price,image:bundle.image,variant:'Bundle'};
    return {
      id:offer?p.id+'-offer':p.id,
      sku:p.sku,
      name:p.name,
      price:offer?cfg().offer.price:p.price,
      image:p.image,
      variant:offer?'Limited-Time Offer · '+(button.dataset.variant||'BALANCE'):(button.dataset.variant||'BALANCE')
    };
  };

  const isInCart=(item)=>window.PulsoCart?.has(item.id,item.variant);
  const updateAddButtons=()=>{
    qa('[data-add-product]').forEach(button=>{
      if(!button.dataset.addLabel)button.dataset.addLabel=button.textContent.trim()||'Add to bag';
      const item=productForButton(button),active=isInCart(item);
      button.classList.toggle('is-in-cart',active);
      button.setAttribute('aria-pressed',String(active));
      button.textContent=active?'Remove from bag':button.dataset.addLabel;
    });
  };
  window.PulsoUpdateCartButtons=updateAddButtons;

  const badge=()=>{
    const count=window.PulsoCart?.count()||0;
    qa('[data-cart-count]').forEach(x=>x.textContent=count);
  };
  badge();
  document.addEventListener('pulso:cart',()=>{
    badge();
    updateAddButtons();
    renderDrawer();
    qa('[data-cart-count]').forEach(x=>{x.animate?.([{transform:'scale(1)'},{transform:'scale(1.35)'},{transform:'scale(1)'}],{duration:260})});
  });

  if(!q('#cart-drawer')){
    const aside=document.createElement('aside');
    aside.className='cart-drawer';
    aside.id='cart-drawer';
    aside.setAttribute('aria-hidden','true');
    const backdrop=document.createElement('button');
    backdrop.className='drawer-backdrop';
    backdrop.dataset.drawerClose='';
    backdrop.setAttribute('aria-label','Close cart');
    const panel=document.createElement('div');
    panel.className='drawer-panel';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    const head=document.createElement('div');
    head.className='drawer-head';
    const title=document.createElement('h2');
    title.textContent='Added to your bag.';
    const close=document.createElement('button');
    close.className='drawer-close';
    close.dataset.drawerClose='';
    close.setAttribute('aria-label','Close');
    close.textContent='×';
    head.append(title,close);
    const items=document.createElement('div');
    items.dataset.drawerItems='';
    const actions=document.createElement('div');
    actions.className='drawer-actions';
    const total=document.createElement('div');
    total.className='drawer-total';
    const totalLabel=document.createElement('span');
    totalLabel.textContent='Subtotal';
    const totalValue=document.createElement('span');
    totalValue.dataset.drawerTotal='';
    total.append(totalLabel,totalValue);
    const continueButton=document.createElement('button');
    continueButton.className='btn btn--outline';
    continueButton.dataset.drawerClose='';
    continueButton.textContent='Continue shopping';
    const cartLink=document.createElement('a');
    cartLink.className='btn btn--wine';
    cartLink.href=window.PulsoPath?window.PulsoPath('/cart/'):'cart/';
    cartLink.textContent='View cart';
    actions.append(total,continueButton,cartLink);
    panel.append(head,items,actions);
    aside.append(backdrop,panel);
    document.body.append(aside);
  }

  const drawer=q('#cart-drawer');let returnFocus=null;
  if(drawer&&!q('.drawer-backdrop',drawer)){
    const backdrop=document.createElement('button');
    backdrop.className='drawer-backdrop';
    backdrop.dataset.drawerClose='';
    backdrop.setAttribute('aria-label','Close cart');
    drawer.prepend(backdrop);
  }
  const closeDrawer=()=>{drawer?.classList.remove('is-open');drawer?.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked');returnFocus?.focus()};
  function renderDrawer(){
    if(!drawer||!window.PulsoCart)return;
    const items=window.PulsoCart.get(),host=q('[data-drawer-items]',drawer);
    if(!host)return;
    host.textContent='';
    host.classList.toggle('is-empty',!items.length);
    if(!items.length){
      const empty=document.createElement('p');
      empty.className='drawer-empty';
      empty.textContent='Your bag is empty.';
      host.append(empty);
    }
    items.forEach(item=>{
      const wrap=document.createElement('div');
      wrap.className='drawer-item';
      const img=document.createElement('img');
      img.src=(item.image||'').replace('/product/product-main.jpg','/product-main.jpg');
      img.alt='';
      const copy=document.createElement('div');
      const title=document.createElement('h3');
      title.textContent=item.name;
      const meta=document.createElement('p');
      meta.textContent=(item.variant||'Configured product')+' · Qty '+item.quantity;
      const price=document.createElement('strong');
      price.textContent=window.PulsoConfig.money(item.price*item.quantity);
      const remove=document.createElement('button');
      remove.type='button';
      remove.className='drawer-remove';
      remove.dataset.drawerRemove='';
      remove.dataset.id=item.id;
      remove.dataset.variant=item.variant||'';
      remove.textContent='Remove';
      remove.setAttribute('aria-label','Remove '+item.name+' from bag');
      copy.append(title,meta,price,remove);
      wrap.append(img,copy);
      host.append(wrap);
    });
    const total=q('[data-drawer-total]',drawer);
    if(total)total.textContent=window.PulsoConfig.money(window.PulsoCart.subtotal());
  }
  const openDrawer=(trigger)=>{if(!drawer)return;returnFocus=trigger||document.activeElement;renderDrawer();drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('is-locked');q('.drawer-close',drawer)?.focus()};
  window.openCartDrawer=openDrawer;

  qa('[data-cart-open]').forEach(b=>b.addEventListener('click',()=>openDrawer(b)));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-drawer-close]'))closeDrawer();
    const drawerRemove=e.target.closest('[data-drawer-remove]');
    if(drawerRemove){window.PulsoCart.remove(drawerRemove.dataset.id,drawerRemove.dataset.variant||undefined);return}
    const add=e.target.closest('[data-add-product]');
    if(!add)return;
    const item=productForButton(add);
    if(isInCart(item))window.PulsoCart.remove(item.id,item.variant);
    else window.PulsoCart.add(item);
    openDrawer(add);
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeDrawer();closeModal()}
    if(e.key==='Tab'){
      const panel=q('.is-open .drawer-panel');
      if(!panel)return;
      const focusable=qa('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])',panel).filter(x=>x.offsetParent!==null);
      if(!focusable.length)return;
      const first=focusable[0],last=focusable.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });

  const modal=q('#quote-modal');
  const closeModal=()=>{modal?.classList.remove('is-open');modal?.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked')};
  window.openQuoteModal=()=>{if(!modal)return;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('is-locked');q('.form-field input',modal)?.focus()};
  qa('[data-modal-close]').forEach(b=>b.addEventListener('click',closeModal));
  qa('.aos').forEach(el=>el.setAttribute('data-aos','fade-up'));
  if(window.AOS)window.AOS.init({once:true,duration:600});else qa('.aos').forEach(el=>el.classList.add('is-visible'));
  document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement&&!e.target.dataset.fallbackApplied){e.target.dataset.fallbackApplied='true';e.target.classList.add('is-fallback');e.target.alt=e.target.alt||'Image unavailable'}},true);
  if(matchMedia('(prefers-reduced-motion: no-preference)').matches&&innerWidth>760){
    const pars=qa('[data-parallax]');
    addEventListener('scroll',()=>requestAnimationFrame(()=>pars.forEach(el=>el.style.transform=`translateY(${(el.getBoundingClientRect().top-innerHeight/2)*-.025}px)`)),{passive:true});
  }
  updateAddButtons();
  renderDrawer();
})();
