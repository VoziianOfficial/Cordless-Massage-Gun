(function(){
  'use strict';
  const cfg=()=>window.SITE_CONFIG||{};
  const key=()=>cfg().commerce?.localStorageKey||'pulso_cart_v1';
  let items=[];
  try{const parsed=JSON.parse(localStorage.getItem(key())||'[]');items=Array.isArray(parsed)?parsed:[]}catch(_){items=[]}
  const save=()=>{localStorage.setItem(key(),JSON.stringify(items));document.dispatchEvent(new CustomEvent('pulso:cart',{detail:{items}}))};
  const same=(item,id,variant)=>item.id===id&&(variant===undefined||item.variant===variant);
  const api={
    get:()=>items.map(x=>({...x})),
    add:(item)=>{const found=items.find(x=>x.id===item.id&&x.variant===item.variant);found?found.quantity+=(item.quantity||1):items.push({...item,quantity:item.quantity||1});save()},
    update:(id,qty,variant)=>{const item=items.find(x=>same(x,id,variant));if(item)item.quantity=Math.max(1,Number(qty)||1);save()},
    remove:(id,variant)=>{items=items.filter(x=>!same(x,id,variant));save()},
    has:(id,variant)=>items.some(x=>same(x,id,variant)),
    count:()=>items.reduce((n,x)=>n+x.quantity,0),
    subtotal:()=>items.reduce((n,x)=>n+(x.price*x.quantity),0),
    clear:()=>{items=[];save()}
  };
  window.PulsoCart=api;
})();
