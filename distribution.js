'use strict';

let lockedDistributionFamily='HH';

// Both levels use the same recording-hour catalog as the action cloud.
window.renderDistribution=function(catalog,locale,palette){
  const root=document.getElementById('coverage-chart'),zh=locale==='zh';
  const svgNS='http://www.w3.org/2000/svg';
  const percent=new Intl.NumberFormat(zh?'zh-CN':'en-US',{style:'percent',maximumFractionDigits:1});
  const hours=value=>`${value.toFixed(2)} h`;
  const text=(tag,className,value)=>{
    const node=document.createElement(tag);node.className=className;
    if(value!==undefined)node.textContent=value;
    return node;
  };
  const svg=(tag,attributes)=>{
    const node=document.createElementNS(svgNS,tag);
    Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,value));
    return node;
  };
  const describe=(item,total)=>`${item.id} · ${item.name[locale]} · ${hours(item.hours)} · ${percent.format(item.hours/total)}`;

  // No minimum-angle padding: even very short actions retain their true share.
  function pie(items,label,colorFor,activate,doubleClick){
    const total=items.reduce((sum,item)=>sum+item.hours,0);
    const chart=svg('svg',{viewBox:'0 0 360 360',class:'distribution-pie',role:'group','aria-label':label});
    let angle=-Math.PI/2;
    const slices=items.filter(item=>item.hours>0).map((item,index)=>{
      const end=angle+item.hours/total*Math.PI*2;
      const point=a=>`${180+160*Math.cos(a)},${180+160*Math.sin(a)}`;
      const d=item.hours===total
        ?'M180,20 A160,160 0 1 1 180,340 A160,160 0 1 1 180,20 Z'
        :`M180,180 L${point(angle)} A160,160 0 ${end-angle>Math.PI?1:0} 1 ${point(end)} Z`;
      const slice=svg('path',{d,fill:colorFor(item,index),class:'distribution-slice',role:'button',tabindex:index===0?'0':'-1','aria-label':describe(item,total),'data-id':item.id,'data-hours':item.hours});
      slice.addEventListener('pointerenter',()=>activate(item));
      slice.addEventListener('focus',()=>activate(item));
      slice.addEventListener('click',()=>(doubleClick||activate)(item));
      angle=end;chart.append(slice);return slice;
    });
    chart.addEventListener('keydown',event=>{
      const index=slices.indexOf(document.activeElement);if(index<0)return;
      const next=event.key==='ArrowRight'||event.key==='ArrowDown'?(index+1)%slices.length
        :event.key==='ArrowLeft'||event.key==='ArrowUp'?(index+slices.length-1)%slices.length
        :event.key==='Home'?0:event.key==='End'?slices.length-1:-1;
      if(next>=0){
        event.preventDefault();slices.forEach((slice,i)=>slice.setAttribute('tabindex',i===next?'0':'-1'));
        slices[next].focus({preventScroll:true});
      }else if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        const item=items.find(item=>item.id===slices[index].dataset.id);
        (doubleClick||activate)(item);
      }
    });
    return chart;
  }
  function shade(hex,index){
    const mix=.12+((index*7)%13)/12*.62;
    const rgb=hex.match(/[a-f\d]{2}/gi).map(channel=>Math.round(parseInt(channel,16)*(1-mix)+247*mix));
    return `rgb(${rgb.join(',')})`;
  }

  const families=text('figure','distribution-family');
  const familyHeading=text('figcaption','distribution-heading',zh?'动作类别':'Action families');
  const detail=text('figure','distribution-detail');
  detail.id='distribution-detail';detail.hidden=true;
  const detailHeading=text('figcaption','distribution-heading');
  const detailName=text('span',''),detailHours=text('span','distribution-hours');
  const detailLabel=text('span','distribution-label'),unlock=text('button','distribution-lock');
  unlock.type='button';unlock.hidden=true;
  unlock.title=zh?'已锁定，点击解锁':'Locked. Click to unlock';
  unlock.setAttribute('aria-label',zh?'解锁类别':'Unlock family');
  const lockIcon=svg('svg',{viewBox:'0 0 24 24','aria-hidden':'true'});
  lockIcon.append(svg('path',{d:'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5zM12 14v3'}));
  unlock.append(lockIcon);detailLabel.append(detailName,unlock);detailHeading.append(detailLabel,detailHours);
  const detailPlot=text('div','distribution-detail-plot');
  const readout=text('div','distribution-readout');
  readout.setAttribute('aria-live','polite');readout.setAttribute('aria-atomic','true');
  detail.append(detailHeading,detailPlot,readout);
  let activeFamily=null;
  const sortedFamilies=[...catalog.families].sort((a,b)=>b.hours-a.hours||a.id.localeCompare(b.id));
  const familyPie=pie(sortedFamilies,zh?'各动作类别的录制时长分布':'Recording hours by action family',family=>palette[catalog.families.indexOf(family)],showFamily,toggleLock);
  const legend=text('div','distribution-legend');
  const total=catalog.families.reduce((sum,family)=>sum+family.hours,0);
  sortedFamilies.forEach(family=>{
    const button=text('button','distribution-key');button.type='button';button.tabIndex=-1;
    button.dataset.id=family.id;button.setAttribute('aria-label',describe(family,total));
    button.setAttribute('aria-controls',detail.id);button.setAttribute('aria-pressed','false');
    const swatch=text('i','distribution-swatch');swatch.style.backgroundColor=palette[catalog.families.indexOf(family)];swatch.setAttribute('aria-hidden','true');
    button.append(swatch,text('span','distribution-key-name',family.name[locale]),text('span','distribution-share',percent.format(family.hours/total)));
    button.addEventListener('pointerenter',()=>showFamily(family));
    button.addEventListener('focus',()=>showFamily(family));
    button.addEventListener('click',()=>toggleLock(family));
    legend.append(button);
  });
  familyPie.querySelectorAll('path').forEach(slice=>{
    slice.setAttribute('aria-controls',detail.id);slice.setAttribute('aria-pressed','false');
  });
  families.append(familyHeading,familyPie,legend);
  root.replaceChildren(families,detail);

  function updateLock(){
    unlock.hidden=!lockedDistributionFamily;root.dataset.lockedFamily=lockedDistributionFamily||'';
  }
  function toggleLock(family){
    lockedDistributionFamily=lockedDistributionFamily===family.id?null:family.id;
    updateLock();showFamily(family);
  }
  unlock.addEventListener('click',()=>{lockedDistributionFamily=null;updateLock();});
  function markFamily(id){
    families.querySelectorAll('[data-id]').forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.id===id)));
  }
  function showFamily(family){
    if(lockedDistributionFamily&&lockedDistributionFamily!==family.id)return;
    if(activeFamily===family.id)return;
    activeFamily=family.id;markFamily(family.id);
    detailName.textContent=family.name[locale];detailHours.textContent=hours(family.hours);
    // Zero-hour actions stay in the catalog/cloud, but have no pie area.
    const actions=catalog.records.filter(item=>item.family===family.id&&item.hours>0).sort((a,b)=>b.hours-a.hours||a.id.localeCompare(b.id));
    const base=palette[catalog.families.indexOf(family)];
    const chart=pie(actions,zh?`${family.name.zh}：动作基元的录制时长分布`:`${family.name.en}: recording hours by action`,(_,index)=>shade(base,index),action=>{
      chart.querySelectorAll('path').forEach(slice=>slice.classList.toggle('is-active',slice.dataset.id===action.id));
      readout.replaceChildren(text('p','distribution-action',`${action.id} · ${action.name[locale]}`),text('p','distribution-action-value',`${hours(action.hours)} · ${percent.format(action.hours/family.hours)}`));
    });
    detailPlot.replaceChildren(chart);readout.replaceChildren();detail.hidden=false;
    if(family.id==='HH'){
      const initial=actions.find(action=>action.id==='HH03');
      if(initial)readout.replaceChildren(text('p','distribution-action',`${initial.id} · ${initial.name[locale]}`),text('p','distribution-action-value',`${hours(initial.hours)} · ${percent.format(initial.hours/family.hours)}`));
    }
  }
  function clear(){
    if(lockedDistributionFamily)return;
    activeFamily=null;markFamily(null);detail.hidden=true;detailPlot.replaceChildren();readout.replaceChildren();
  }
  // Keep the detail available while crossing the gap or inspecting its slices.
  root.onpointerleave=event=>{
    if(event.pointerType==='mouse'&&!root.querySelector(':focus-visible'))clear();
  };
  root.onfocusout=event=>{if(!root.contains(event.relatedTarget))clear();};
  root.onkeydown=event=>{if(event.key==='Escape'){lockedDistributionFamily=null;updateLock();clear();}};
  updateLock();
  if(lockedDistributionFamily)showFamily(catalog.families.find(family=>family.id===lockedDistributionFamily));
};
