'use strict';
const viewerStage=document.getElementById('viewer-stage');
let embeddedViewer,viewerVisible=false;
function loadEmbeddedViewer(){
  if(embeddedViewer)return;
  embeddedViewer=document.createElement('iframe');
  embeddedViewer.src=`viewer.html?v=20261104-2&embedded=1&lang=${window.egoI18n.locale}`;
  embeddedViewer.allow='fullscreen';
  embeddedViewer.className='rerun-frame';
  // Rerun focuses its keyboard input at startup. Keep that from moving the page.
  embeddedViewer.inert=true;
  viewerStage.dataset.state='loading';
  viewerStage.append(embeddedViewer);
  embeddedViewer.addEventListener('load',()=>{updateViewerLanguage();updateViewerVisibility();});
  updateViewerLanguage();
}
function updateViewerLanguage(){
  if(embeddedViewer){
    embeddedViewer.title=window.egoI18n.translate('RoboMoCap interactive recording');
    embeddedViewer.contentWindow?.postMessage({type:'egomotion-language',locale:window.egoI18n.locale},location.origin);
  }else if(location.protocol==='file:'){
    document.getElementById('viewer-message').textContent=window.egoI18n.translate('Open the local HTTP preview to use the 3D viewer.');
  }
}
function updateViewerVisibility(){
  embeddedViewer?.contentWindow?.postMessage({type:'egomotion-visibility',visible:viewerVisible&&!document.hidden},location.origin);
}
if(location.protocol==='file:'){
  document.getElementById('viewer-message').hidden=false;
  viewerStage.dataset.state='local-file';
}else{
  new IntersectionObserver(entries=>{
    viewerVisible=entries[0].isIntersecting;
    if(viewerVisible)loadEmbeddedViewer();
    updateViewerVisibility();
  }).observe(viewerStage);
}
window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==embeddedViewer?.contentWindow||event.data?.type!=='egomotion-viewer-state')return;
  viewerStage.dataset.state=event.data.state;
  if(event.data.state==='ready'||event.data.state==='failed')embeddedViewer.inert=false;
  if(event.data.state==='ready'){updateViewerLanguage();updateViewerVisibility();}
});
document.addEventListener('visibilitychange',updateViewerVisibility);
document.addEventListener('languagechange',updateViewerLanguage);
updateViewerLanguage();
