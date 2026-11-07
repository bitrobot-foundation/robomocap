'use strict';
const i18n = window.egoI18n;
const t = text => i18n.translate(text);
const readContent = name => window.egoContent?.[name] ? Promise.resolve(window.egoContent[name]) : fetch(name).then(response => {if(!response.ok) throw new Error('Content unavailable');return response.json();});
const dialog = document.getElementById('asset-dialog');
let returnFocus, media = {}, catalog, projectStats, selectedFamily = 'all';
function refreshMedia(){
  document.querySelectorAll('[data-asset]').forEach(element => {
    const id=element.dataset.asset, item=media[id], image=element.querySelector('img');
    if(!image) return;
    if(item){
      image.src=item.poster || item.src;
      image.alt=item.title?.[i18n.locale] || id;
      element.setAttribute('aria-label',`${t('Open media')}: ${image.alt}`);
      element.querySelector('.media-play')?.remove();
      if(item.type==='video'){
        const badge=document.createElement('span');badge.className='media-play';badge.setAttribute('aria-hidden','true');badge.setAttribute('data-localized','');badge.textContent=`▶ ${t('Play clip')}`;element.append(badge);
      }
    } else {image.src=`assets/${id}${i18n.locale==='en'?'-en':''}.svg`;image.alt=t(image.alt);}
  });
}
function openMedia(trigger){
  const item=media[trigger.dataset.asset];if(!item)return;
  returnFocus=trigger;
  const content=document.getElementById('asset-dialog-content');
  const visual=document.createElement(item.type==='video'?'video':'img');
  visual.className='asset-dialog-image';visual.src=item.src;
  if(item.type==='video'){visual.controls=true;visual.playsInline=true;visual.preload='metadata';visual.poster=item.poster;}
  else visual.alt=item.title[i18n.locale];
  document.getElementById('asset-dialog-title').textContent=item.title[i18n.locale];
  content.replaceChildren(visual);dialog.showModal();
}
readContent('media.json').then(data=>{media=data;refreshMedia();});
document.addEventListener('click',event=>{const trigger=event.target.closest('button[data-asset]');if(trigger)openMedia(trigger);});
document.getElementById('close-asset').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{dialog.querySelectorAll('video').forEach(video=>video.pause());returnFocus?.focus();});
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});

// Every action is shown; each family normalizes its own recording-hour scale.
const cloud=document.getElementById('activity-cloud');
const cloudScroll=cloud.parentElement;
const CLOUD_MIN_FONT=10,CLOUD_MAX_FONT=24,CLOUD_FONT_RANGE=26;
const measure=document.createElement('canvas').getContext('2d');
const palette=['#5d4bff','#62678c','#825d91','#454568','#796444','#8a5577','#516d76','#68619a'];
function packWords(words,width,height){
  let free=[{x:4,y:4,w:width-8,h:height-8}];
  const placed=[];
  for(const word of words){
    let best,score=Infinity;
    for(const r of free){
      if(word.w>r.w||word.h>r.h)continue;
      const x=Math.max(r.x,Math.min(width/2-word.w/2,r.x+r.w-word.w));
      const y=Math.max(r.y,Math.min(height/2-word.h/2,r.y+r.h-word.h));
      const distance=Math.max(Math.abs(x+word.w/2-width/2)/width,Math.abs(y+word.h/2-height/2)/height);
      if(distance<score){best={x,y,w:word.w,h:word.h};score=distance;}
    }
    if(!best)return null;
    const next=[];
    for(const r of free){
      if(best.x>=r.x+r.w||best.x+best.w<=r.x||best.y>=r.y+r.h||best.y+best.h<=r.y){next.push(r);continue;}
      if(best.x>r.x)next.push({...r,w:best.x-r.x});
      if(best.x+best.w<r.x+r.w)next.push({...r,x:best.x+best.w,w:r.x+r.w-best.x-best.w});
      if(best.y>r.y)next.push({...r,h:best.y-r.y});
      if(best.y+best.h<r.y+r.h)next.push({...r,y:best.y+best.h,h:r.y+r.h-best.y-best.h});
    }
    free=next.filter((r,i)=>r.w>6&&r.h>6&&!next.some((other,j)=>j!==i&&other.x<=r.x&&other.y<=r.y&&other.x+other.w>=r.x+r.w&&other.y+other.h>=r.y+r.h&&(j<i||other.x!==r.x||other.y!==r.y||other.w!==r.w||other.h!==r.h)));
    placed.push({...word,x:best.x+best.w/2,y:best.y+best.h/2});
  }
  return placed;
}
function renderCloud(){
  if(!catalog || !cloud.clientWidth)return;
  const all=selectedFamily==='all';
  cloud.dataset.scope=all?'all':'family';
  const source=catalog.records.filter(word=>all||word.family===selectedFamily);
  cloud.style.width='100%';
  cloud.style.height='';
  let width=cloud.clientWidth;
  const height=cloud.clientHeight;
  cloud.setAttribute('aria-label',i18n.locale==='zh'?`${source.length} 个动作，字号按已索引录制时长`:`${source.length} activities, sized by indexed recording hours`);
  const maxHours=Math.max(1e-9,...source.map(word=>word.hours));
  const rankedHours=source.map(word=>word.hours).sort((a,b)=>b-a);
  let capHours=maxHours;
  // Saturate a separated high-duration tier at the following tier's size.
  for(let index=0;index<Math.min(8,Math.floor(source.length*.2),rankedHours.length-1);index++){
    if(rankedHours[index+1]>0&&rankedHours[index]>rankedHours[index+1]*1.6){capHours=rankedHours[index+1];break;}
  }
  const fontSize=(word,scale=1)=>Math.min(CLOUD_MAX_FONT,CLOUD_MIN_FONT+CLOUD_FONT_RANGE*scale*Math.min(word.hours,capHours)/maxHours);
  const sans=getComputedStyle(document.body).fontFamily;
  const words=source.map((word,index)=>{
    const size=fontSize(word);
    const label=word.cloud_label[i18n.locale],weight=Math.min(word.hours,capHours)>capHours*.9?600:400;
    measure.font=`${weight} ${size}px ${sans}`;
    const textWidth=measure.measureText(label).width+6;
    const vertical=(textWidth>width-8 || (index%7===3&&label.length<=(i18n.locale==='zh'?6:17))) && (i18n.locale!=='zh'||/^[\p{Script=Han}]+$/u.test(label));
    const direction=vertical?(i18n.locale==='zh'?'vertical':'turned'):'horizontal';
    return {...word,label,size,weight,direction,font:sans,color:palette[catalog.families.findIndex(f=>f.id===word.family)]};
  }).sort((a,b)=>b.size-a.size||a.id.localeCompare(b.id));
  // Fit the viewport-height canvas without shrinking text below the shared floor.
  // All and each family normalize hours independently, within the same font bounds.
  function measuredWords(scale){
    return words.map(word=>{
      const size=fontSize(word,scale);
      measure.font=`${word.weight} ${size}px ${sans}`;
      const textWidth=Math.ceil(measure.measureText(word.label).width)+2,textHeight=Math.ceil(size*1.08)+1;
      const vertical=word.direction!=='horizontal';
      return {...word,size,w:vertical?textHeight:textWidth,h:vertical?(i18n.locale==='zh'?word.label.length*size+2:textWidth):textHeight};
    });
  }
  let placed=packWords(measuredWords(1),width,height);
  if(!placed){
    placed=packWords(measuredWords(0),width,height);
    // Only narrow screens scroll horizontally; keep every action and readable text.
    while(!placed){width+=64;placed=packWords(measuredWords(0),width,height);}
    let low=0,high=1;
    for(let attempt=0;attempt<7;attempt++){
      const mid=(low+high)/2,candidate=packWords(measuredWords(mid),width,height);
      if(candidate){placed=candidate;low=mid;}else high=mid;
    }
  }
  cloud.style.width=`${width}px`;
  const top=Math.min(...placed.map(word=>word.y-word.h/2));
  const bottom=Math.max(...placed.map(word=>word.y+word.h/2));
  cloud.style.height=`${Math.ceil(bottom-top+8)}px`;
  const nodes=placed.map(word=>{
    const span=document.createElement('span');span.className='cloud-word';span.setAttribute('role','listitem');span.dataset.primitive=word.id;
    span.dataset.direction=word.direction;span.dataset.hours=word.hours;
    span.textContent=word.label;
    const detail=`${word.id} · ${word.name[i18n.locale]} · ${word.hours.toFixed(2)} ${i18n.locale==='zh'?'小时':'h'}`;
    span.title=detail;span.setAttribute('aria-label',detail);
    Object.assign(span.style,{left:`${word.x}px`,top:`${word.y-top+4}px`,fontSize:`${word.size}px`,fontWeight:word.weight,fontFamily:word.font,color:word.color});
    return span;
  });
  cloud.replaceChildren(...nodes);
  document.querySelectorAll('[data-family]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.family===selectedFamily)));
}
Promise.all([readContent('activity-catalog.json'),readContent('project-statistics.json')]).then(([data,project])=>{catalog=data;projectStats=project;renderCloud();renderCoverage();renderExamples();}).catch(()=>{cloud.textContent=t('The activity catalog could not be loaded. Refresh to try again.');});

function renderCoverage(){
  if(!catalog)return;
  const zh=i18n.locale==='zh';
  document.getElementById('action-count').textContent=catalog.total_primitives;
  document.getElementById('family-count').textContent=catalog.families.length;
  const facts=document.getElementById('overview-facts');
  if(facts)facts.replaceChildren(...[[`${projectStats.hours} h`,zh?'录制时长':'recording hours'],[String(projectStats.participants),zh?'位参与者':'participants'],[`${Math.floor(projectStats.storage_gb/1000)}TB+`,zh?'数据量':'data volume'],[`${Math.floor(catalog.total_primitives/10)*10}+`,zh?'已采集动作':'captured actions']].map(([value,label])=>{const item=document.createElement('p'),number=document.createElement('strong'),name=document.createElement('span');number.textContent=value;name.textContent=label;item.append(number,name);return item;}));
  window.renderDistribution(catalog,i18n.locale,palette);
}

const exampleIds={P:['P27','P26'],D:['D54','D43'],SM:['SM27','SM28'],LM:['LM28','LM67'],DR:['DR02','DR08'],HH:['HH04','HH07'],EC:['EC03','EC06'],LH:['LH06','LH10']};
const exampleTabs=document.getElementById('example-tabs'),exampleVideos=document.getElementById('example-videos');
const exampleReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let selectedExampleFamily='P',exampleVisible=false,examplePausedByUser=false;
function updateExamplePlayback(){
  const video=exampleVideos.querySelector('video');if(!video)return;
  if(!exampleVisible||document.hidden||exampleReducedMotion.matches||examplePausedByUser)video.pause();
  else video.play().catch(()=>{});
}
new IntersectionObserver(entries=>{exampleVisible=entries[0].isIntersecting;updateExamplePlayback();},{threshold:0.05}).observe(exampleVideos);
document.addEventListener('visibilitychange',updateExamplePlayback);
exampleReducedMotion.addEventListener('change',updateExamplePlayback);
function renderExamples(){
  if(!catalog)return;
  exampleVideos.querySelectorAll('video').forEach(video=>video.pause());
  const buttons=catalog.families.map(family=>{
    const button=document.createElement('button');
    button.type='button';button.role='tab';button.id=`example-tab-${family.id}`;button.dataset.exampleFamily=family.id;
    button.setAttribute('aria-selected',String(family.id===selectedExampleFamily));
    button.setAttribute('aria-controls','example-videos');button.tabIndex=family.id===selectedExampleFamily?0:-1;
    button.textContent=family.name[i18n.locale];
    return button;
  });
  exampleTabs.setAttribute('aria-label',t('Action categories'));
  exampleTabs.replaceChildren(...buttons);
  exampleVideos.setAttribute('aria-labelledby',`example-tab-${selectedExampleFamily}`);
  const figure=document.createElement('figure'),stack=document.createElement('div');
  stack.className='example-stack';
  const videos=exampleIds[selectedExampleFamily].map((id,index)=>{
    const action=catalog.records.find(record=>record.id===id);
    const video=document.createElement('video');
    const base=`media/slack-examples/${id}`;
    video.muted=true;video.loop=index===0;video.playsInline=true;video.preload='metadata';
    video.poster=`${base}.jpg`;video.src=`${base}.mp4`;video.setAttribute('aria-label',`${id} · ${action.name[i18n.locale]}`);
    return video;
  });
  if(videos.length===2){
    const [primary,secondary]=videos;
    const align=()=>{if(Math.abs(primary.currentTime-secondary.currentTime)>.15)secondary.currentTime=primary.currentTime;};
    primary.addEventListener('play',()=>{align();secondary.play().catch(()=>primary.pause());});
    primary.addEventListener('pause',()=>secondary.pause());
    primary.addEventListener('seeking',align);
    primary.addEventListener('timeupdate',align);
    primary.addEventListener('ratechange',()=>{secondary.playbackRate=primary.playbackRate;});
    secondary.addEventListener('ended',()=>{if(!primary.paused){secondary.currentTime=0;secondary.play().catch(()=>primary.pause());}});
  }
  const primary=videos[0],controls=document.createElement('div'),play=document.createElement('button'),seek=document.createElement('input');
  controls.className='example-controls';play.type='button';seek.type='range';seek.min=0;seek.max=1000;seek.value=0;
  seek.setAttribute('aria-label',t('Seek video'));
  const updatePlay=()=>{const label=t(primary.paused?'Play video':'Pause video');play.textContent=primary.paused?'▶':'Ⅱ';play.setAttribute('aria-label',label);play.title=label;};
  play.addEventListener('click',()=>{examplePausedByUser=!primary.paused;if(primary.paused)primary.play().catch(()=>{});else primary.pause();});
  primary.addEventListener('play',updatePlay);primary.addEventListener('pause',updatePlay);
  primary.addEventListener('timeupdate',()=>{if(primary.duration)seek.value=String(Math.round(primary.currentTime/primary.duration*1000));});
  seek.addEventListener('input',()=>{if(primary.duration)primary.currentTime=primary.duration*Number(seek.value)/1000;});
  updatePlay();controls.append(play,seek);stack.append(...videos);
  figure.append(stack,controls);exampleVideos.replaceChildren(figure);updateExamplePlayback();
}
function selectExampleFamily(id){selectedExampleFamily=id;examplePausedByUser=false;renderExamples();}
exampleTabs.addEventListener('click',event=>{
  const button=event.target.closest('[data-example-family]');if(button)selectExampleFamily(button.dataset.exampleFamily);
});
exampleTabs.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const buttons=[...exampleTabs.querySelectorAll('[role=tab]')],index=buttons.indexOf(document.activeElement);
  if(index<0)return;
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  event.preventDefault();selectExampleFamily(buttons[next].dataset.exampleFamily);exampleTabs.querySelectorAll('[role=tab]')[next].focus();
});

// Native horizontal scrolling, with arrows, mouse dragging, and keyboard access.
const familyList=document.getElementById('family-list');
const familyButtons=[...familyList.querySelectorAll('[data-family]')];
const familyPrev=document.getElementById('family-prev'),familyNext=document.getElementById('family-next');
const scrollBehavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
function updateFamilyScroll(){
  familyPrev.disabled=familyList.scrollLeft<2;
  familyNext.disabled=familyList.scrollLeft+familyList.clientWidth>=familyList.scrollWidth-2;
}
function selectFamily(button){
  selectedFamily=button.dataset.family;renderCloud();
  button.scrollIntoView({block:'nearest',inline:'nearest',behavior:scrollBehavior()});
}
familyButtons.forEach(button=>button.addEventListener('click',()=>selectFamily(button)));
familyPrev.addEventListener('click',()=>familyList.scrollBy({left:-familyList.clientWidth*.7,behavior:scrollBehavior()}));
familyNext.addEventListener('click',()=>familyList.scrollBy({left:familyList.clientWidth*.7,behavior:scrollBehavior()}));
familyList.addEventListener('scroll',updateFamilyScroll,{passive:true});
familyList.addEventListener('keydown',event=>{
  const index=familyButtons.indexOf(document.activeElement);if(index<0)return;
  const target=event.key==='ArrowRight'?Math.min(index+1,familyButtons.length-1):event.key==='ArrowLeft'?Math.max(index-1,0):event.key==='Home'?0:event.key==='End'?familyButtons.length-1:-1;
  if(target<0)return;
  event.preventDefault();familyButtons[target].focus({preventScroll:true});selectFamily(familyButtons[target]);
});
let drag;
familyList.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0)return;
  drag={id:event.pointerId,x:event.clientX,left:familyList.scrollLeft,moved:false};
});
familyList.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const distance=event.clientX-drag.x;
  if(!drag.moved&&Math.abs(distance)<6)return;
  drag.moved=true;familyList.dataset.dragging='';familyList.setPointerCapture(event.pointerId);
  familyList.scrollLeft=drag.left-distance;event.preventDefault();
});
function endFamilyDrag(event){
  if(!drag||drag.id!==event.pointerId)return;
  const moved=drag.moved;drag=null;delete familyList.dataset.dragging;
  if(moved){
    // The click following a drag must not change the selected family.
    const cancelClick=click=>{click.preventDefault();click.stopImmediatePropagation();};
    familyList.addEventListener('click',cancelClick,{capture:true,once:true});
    setTimeout(()=>familyList.removeEventListener('click',cancelClick,true),0);
  }
}
familyList.addEventListener('pointerup',endFamilyDrag);
familyList.addEventListener('pointercancel',endFamilyDrag);
familyList.addEventListener('lostpointercapture',endFamilyDrag);
familyList.addEventListener('pointerleave',event=>{if(drag&&!drag.moved)endFamilyDrag(event);});
new ResizeObserver(updateFamilyScroll).observe(familyList);
let resizeFrame;
let cloudWidth;
function scheduleCloud(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(renderCloud);}
new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width===cloudWidth)return;cloudWidth=width;scheduleCloud();}).observe(cloudScroll);
window.addEventListener('resize',scheduleCloud);
document.fonts.ready.then(()=>{renderCloud();updateFamilyScroll();});

const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('mobile-nav');
function closeMenu(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',t('Open navigation'));}
menu.addEventListener('click',()=>{const expanded=nav.hidden;nav.hidden=!expanded;menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',t(expanded?'Close navigation':'Open navigation'));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!nav.hidden){closeMenu();menu.focus();}});
const links=[...document.querySelectorAll('.desktop-nav a')];
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)links.forEach(link=>link.classList.toggle('active',link.hash===`#${entry.target.id}`));}),{rootMargin:'-12% 0px -65% 0px',threshold:0});
links.forEach(link=>{const section=document.querySelector(link.hash);if(section)observer.observe(section);});
document.addEventListener('languagechange',()=>{refreshMedia();renderCloud();renderCoverage();renderExamples();requestAnimationFrame(updateFamilyScroll);menu.setAttribute('aria-label',t(nav.hidden?'Open navigation':'Close navigation'));if(dialog.open){const trigger=returnFocus;dialog.close();openMedia(trigger);}});

// Native media playback, respecting reduced motion and the tab's visibility.
const heroFilm=document.getElementById('hero-film'),heroFilmToggle=document.getElementById('hero-film-toggle');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let heroPausedByUser=false;
function updateHeroFilm(){heroFilmToggle.textContent=heroFilm.paused?'▶':'Ⅱ';heroFilmToggle.setAttribute('aria-label',t(heroFilm.paused?'Play background video':'Pause background video'));}
heroFilm.addEventListener('loadeddata',()=>{heroFilmToggle.hidden=false;updateHeroFilm();});
heroFilm.addEventListener('play',updateHeroFilm);heroFilm.addEventListener('pause',updateHeroFilm);
heroFilmToggle.addEventListener('click',()=>{heroPausedByUser=!heroFilm.paused;if(heroFilm.paused)heroFilm.play().catch(()=>{});else heroFilm.pause();});
function applyHeroMotion(){if(reducedMotion.matches||document.hidden||heroPausedByUser)heroFilm.pause();else heroFilm.play().catch(()=>{});}
reducedMotion.addEventListener('change',applyHeroMotion);document.addEventListener('visibilitychange',applyHeroMotion);document.addEventListener('languagechange',updateHeroFilm);
if(reducedMotion.matches){heroFilm.autoplay=false;heroFilm.pause();}

// Respect reduced-motion preferences for ambient activity previews.
if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('.g1-film,.modality-film[autoplay]').forEach(video=>{video.autoplay=false;video.pause();});
