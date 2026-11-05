import { WebViewer } from './vendor/rerun/index.js';
const params=new URLSearchParams(location.search);
let locale=params.get('lang')==='zh'?'zh':'en';
let state='loading',viewer,recordingId,timeout,generation=0;
let visible=true;
const texts={
 en:{loading:'Loading interactive viewer…',detail:'Loading camera views and measured motion.',failed:'The viewer could not start.',failureDetail:'Try reloading the recording.',retry:'Try again',back:'Back to project ↗',title:'HH03 · Handover while walking'},
 zh:{loading:'正在加载交互式查看器…',detail:'正在加载相机画面与实测运动。',failed:'查看器暂时无法启动。',failureDetail:'请重新加载录制。',retry:'重试',back:'返回项目页 ↗',title:'HH03 · 行走中交接'}
};
if(params.has('embedded'))document.body.classList.add('embedded');
function render(){
 const copy=texts[locale],title=copy.title;
 document.documentElement.lang=locale==='zh'?'zh-CN':'en';
 document.title=`${title} · RoboMoCap`;
 document.getElementById('status-title').textContent=copy[state==='failed'?'failed':'loading'];
 document.getElementById('status-detail').textContent=copy[state==='failed'?'failureDetail':'detail'];
 document.getElementById('retry').textContent=copy.retry;
 document.getElementById('back-link').textContent=copy.back;
 document.querySelector('.viewer-title > span:not(.viewer-brand)').textContent=title;
 document.getElementById('viewer-status').hidden=state==='ready';
 document.getElementById('retry').hidden=state!=='failed';
 document.getElementById('rerun-root').dataset.state=state;
}
function setState(next){
 state=next;render();
 parent.postMessage({type:'egomotion-viewer-state',state},location.origin);
}
function pauseWhenHidden(){if(!visible&&viewer?.ready&&recordingId)viewer.set_playing(recordingId,false);}
async function start(){
 const current=++generation;
 clearTimeout(timeout);viewer?.stop();viewer=undefined;recordingId=undefined;
 setState('loading');
 const instance=new WebViewer();viewer=instance;
 // Isolate the surface so the SDK failure UI cannot replace our retry status.
 const surface=document.getElementById('rerun-surface');surface.replaceChildren();
 instance.on('recording_open',event=>{
   if(current!==generation)return;
   recordingId=event.recording_id;clearTimeout(timeout);setState('ready');pauseWhenHidden();
 });
 timeout=setTimeout(()=>{if(current===generation&&state==='loading'){instance.stop();setState('failed');}},90000);
 try{
   await instance.start(new URL('media/egomotion-hh03.rrd?v=6',location.href).href,surface,{width:'100%',height:'100%',hide_welcome_screen:true,theme:'dark',enable_history:false});
   if(current!==generation){instance.stop();return;}
   for(const panel of ['blueprint','selection','time'])instance.override_panel_state(panel,'collapsed');
 }catch(error){
   instance.stop();
   if(current!==generation)return;
   clearTimeout(timeout);setState('failed');console.error('Rerun viewer failed:',error.message);
 }
}
document.getElementById('retry').addEventListener('click',start);
document.getElementById('viewer-language').addEventListener('click',()=>{locale=locale==='en'?'zh':'en';render();});
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==parent)return;
 const message=event.data;
 if(message?.type==='egomotion-language'&&['en','zh'].includes(message.locale)){locale=message.locale;render();}
 if(message?.type==='egomotion-visibility'){visible=Boolean(message.visible);pauseWhenHidden();}
});
window.addEventListener('pagehide',()=>{generation++;clearTimeout(timeout);viewer?.stop();});
render();start();
