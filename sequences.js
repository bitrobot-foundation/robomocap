'use strict';
(() => {
  const sequences = window.egoSequences;
  const tabs = document.getElementById('sequence-tabs');
  const panel = document.getElementById('sequence-panel');
  if (!sequences?.length || !tabs || !panel) return;
  let active = sequences[0].id;
  const locale = () => window.egoI18n?.locale === 'zh' ? 'zh' : 'en';
  const words = {
    en: {time:'Source time', ego:'Ego view', egoDetail:'RoboCap · left front', exo:'External view', exoDetail:'Third-person camera', pose:'Body motion', poseDetail:'Measured body joints', region:'Camera frames and measured body motion over time'},
    zh: {time:'原始时间', ego:'第一视角', egoDetail:'RoboCap · 左前', exo:'第三视角', exoDetail:'外部相机', pose:'身体运动', poseDetail:'实测身体关节', region:'相机画面与实测身体运动的时间对照'}
  };
  function timeLabel(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`;
  }
  const buttons = sequences.map(sequence => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `sequence-tab-${sequence.id}`;
    button.setAttribute('role','tab');
    button.setAttribute('aria-controls','sequence-panel');
    button.addEventListener('click',() => select(sequence.id));
    tabs.append(button);
    return button;
  });
  function select(id) {
    active = id;
    render();
  }
  function render() {
    const lang = locale();
    const text = words[lang];
    tabs.setAttribute('aria-label',lang === 'zh' ? '切换动作对照' : 'Compare activities');
    const sequence = sequences.find(item => item.id === active);
    buttons.forEach((button,index) => {
      const item = sequences[index];
      const selected = item.id === active;
      button.textContent = `${item.action_id} · ${item.name[lang]}`;
      button.setAttribute('aria-selected',String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby',`sequence-tab-${active}`);
    const scroller = document.createElement('div');
    scroller.className = 'sequence-scroll';
    scroller.tabIndex = 0;
    scroller.setAttribute('role','region');
    scroller.setAttribute('aria-label',text.region);
    const table = document.createElement('table');
    table.className = 'sequence-table';
    const caption = document.createElement('caption');
    caption.className = 'visually-hidden';
    caption.textContent = `${sequence.action_id} · ${sequence.name[lang]}`;
    table.append(caption);
    const head = table.createTHead().insertRow();
    const axis = document.createElement('th');
    axis.scope = 'col';
    axis.textContent = text.time;
    head.append(axis);
    sequence.cells.forEach(cell => {
      const th = document.createElement('th');
      th.scope = 'col';
      const label = document.createElement('span');
      label.textContent = timeLabel(cell.time_seconds);
      th.append(label);
      head.append(th);
    });
    const body = table.createTBody();
    ['ego','exo','pose'].forEach(kind => {
      const row = body.insertRow();
      row.className = `sequence-${kind}`;
      const label = document.createElement('th');
      label.scope = 'row';
      const title = document.createElement('strong');
      title.textContent = text[kind];
      const detail = document.createElement('span');
      detail.textContent = text[`${kind}Detail`];
      label.append(title,detail);
      row.append(label);
      sequence.cells.forEach(cell => {
        const image = document.createElement('img');
        image.src = cell[kind];
        image.alt = `${sequence.action_id} · ${text[kind]} · ${timeLabel(cell.time_seconds)}`;
        image.width = 800;
        image.height = kind === 'ego' ? 450 : 600;
        image.loading = 'lazy';
        image.decoding = 'async';
        row.insertCell().append(image);
      });
    });
    scroller.append(table);
    panel.replaceChildren(scroller);
  }
  tabs.addEventListener('keydown',event => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    select(sequences[next].id);
    buttons[next].focus();
    buttons[next].scrollIntoView({block:'nearest',inline:'nearest'});
  });
  document.addEventListener('languagechange',render);
  render();
})();
