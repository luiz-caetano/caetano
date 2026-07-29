(() => {
'use strict';

const DB_NAME = 'instaSimDB';
const DB_VERSION = 1;

const DEFAULTS = {
  username: 'seu_usuario',
  name: 'Nome do cliente',
  verified: false,
  bio: 'Edite essa bio pra mostrar o posicionamento ideal',
  linkText: '',
  linkUrl: '',
  posts: 0,
  followers: 0,
  following: 0,
  isFollowing: false,
  highlights: [],
  grid: Array.from({ length: 6 }, () => ({ reel: false, pinned: false })),
};

let state = structuredClone(DEFAULTS);
let editMode = false;
let currentUploadSlot = null;
const objectUrls = {};

// ---------- IndexedDB ----------
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('images')) db.createObjectStore('images');
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbGet(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const r = tx.objectStore(store).get(key);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function idbSet(store, key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function idbDelete(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function idbClearStore(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function saveState() {
  idbSet('meta', 'state', state);
}

// ---------- image handling ----------
function centerCropResize(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        const target = Math.min(maxDim, size);
        const canvas = document.createElement('canvas');
        canvas.width = target;
        canvas.height = target;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, size, size, 0, 0, target, target);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function blobToDataURL(blob) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(blob);
  });
}
async function loadImageIntoSlot(key, imgEl, emptyEl) {
  const blob = await idbGet('images', key);
  if (objectUrls[key]) {
    URL.revokeObjectURL(objectUrls[key]);
    delete objectUrls[key];
  }
  if (blob) {
    const url = URL.createObjectURL(blob);
    objectUrls[key] = url;
    imgEl.src = url;
    imgEl.hidden = false;
    if (emptyEl) emptyEl.hidden = true;
  } else {
    imgEl.hidden = true;
    if (emptyEl) emptyEl.hidden = false;
  }
}
function slotMaxDim(slot) {
  if (slot === 'avatar') return 480;
  if (slot.startsWith('post')) return 640;
  return 320; // highlight covers
}

// ---------- helpers ----------
const $ = (sel) => document.querySelector(sel);
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function placeCaretEnd(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// ---------- render ----------
async function render() {
  $('#usernameEl').textContent = state.username;
  $('#nameEl').textContent = state.name;
  $('#bioEl').textContent = state.bio;
  $('#postsEl').textContent = state.posts.toLocaleString('pt-BR');
  $('#followersEl').textContent = state.followers.toLocaleString('pt-BR');
  $('#followingEl').textContent = state.following.toLocaleString('pt-BR');

  const verifiedBtn = $('#verifiedBtn');
  verifiedBtn.classList.toggle('active', state.verified);

  const followBtn = $('#followBtn');
  followBtn.textContent = state.isFollowing ? 'Seguindo' : 'Seguir';
  followBtn.classList.toggle('following', state.isFollowing);

  $('#linkAnchor').href = state.linkUrl || '#';

  document.title = `${state.name} (@${state.username}) • Instagram photos and videos`;

  await loadImageIntoSlot('avatar', $('#avatarImg'), $('#avatarEmpty'));
  renderHighlights();
  renderGrid();
  applyEditMode();
}

function renderHighlights() {
  const row = $('#highlightsRow');
  row.innerHTML = '';
  state.highlights.forEach((h) => {
    const item = document.createElement('div');
    item.className = 'ig-highlight';
    item.innerHTML = `
      <div class="ig-highlight-circle" data-hl="${h.id}">
        <img class="ig-highlight-img" hidden alt="">
        <div class="ig-highlight-empty"><i class="fa-regular fa-image"></i></div>
        <button class="ig-hl-remove" data-remove-hl="${h.id}" title="Remover destaque"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="ig-highlight-label" data-editable-text data-hl-label="${h.id}">${escapeHtml(h.label)}</div>
    `;
    row.appendChild(item);
    loadImageIntoSlot('hl_' + h.id, item.querySelector('.ig-highlight-img'), item.querySelector('.ig-highlight-empty'));
  });
  const add = document.createElement('div');
  add.className = 'ig-highlight ig-highlight-add';
  add.innerHTML = `<div class="ig-highlight-circle ig-add-circle" id="addHighlightBtn"><i class="fa-solid fa-plus"></i></div><div class="ig-highlight-label">Novo</div>`;
  row.appendChild(add);
}

function renderGrid() {
  const wrap = $('#igGrid');
  wrap.innerHTML = '';
  state.grid.forEach((cell, idx) => {
    const div = document.createElement('div');
    div.className = 'ig-grid-cell';
    div.dataset.index = idx;
    div.innerHTML = `
      <img class="ig-grid-img" hidden alt="">
      <div class="ig-grid-empty"><i class="fa-regular fa-image"></i></div>
      <i class="fa-solid fa-thumbtack ig-badge-pin" ${cell.pinned ? '' : 'hidden'}></i>
      <i class="fa-solid fa-clapperboard ig-badge-reel" ${cell.reel ? '' : 'hidden'}></i>
      <div class="ig-grid-overlay">
        <button data-action="pin" data-index="${idx}" title="Fixar"><i class="fa-solid fa-thumbtack"></i></button>
        <button data-action="reel" data-index="${idx}" title="Marcar como Reel"><i class="fa-solid fa-clapperboard"></i></button>
        <button data-action="clear" data-index="${idx}" title="Remover imagem"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    wrap.appendChild(div);
    loadImageIntoSlot('post' + idx, div.querySelector('.ig-grid-img'), div.querySelector('.ig-grid-empty'));
  });
}

function applyEditMode() {
  document.body.classList.toggle('edit-on', editMode);
  document.querySelectorAll('[data-editable-text]').forEach((el) => {
    el.contentEditable = editMode ? 'true' : 'false';
  });
  $('#editToggle').innerHTML = editMode
    ? '<i class="fa-solid fa-check"></i> Concluir'
    : '<i class="fa-solid fa-pen"></i> Editar';
  $('#editorBar').hidden = !editMode;
  $('#editorHint').hidden = !editMode;

  const linkTextEl = $('#linkTextEl');
  if (!(editMode && document.activeElement === linkTextEl)) {
    linkTextEl.textContent = state.linkText || (editMode ? 'Adicionar link' : '');
  }
  $('#linkRow').style.display = state.linkText || editMode ? 'flex' : 'none';
}

// ---------- highlight add/remove ----------
function addHighlight() {
  const id = 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  state.highlights.push({ id, label: 'Novo' });
  saveState();
  renderHighlights();
  requestAnimationFrame(() => {
    const label = document.querySelector(`[data-hl-label="${id}"]`);
    if (label) {
      label.contentEditable = 'true';
      label.focus();
      document.execCommand('selectAll', false, null);
    }
  });
}
async function removeHighlight(id) {
  if (!confirm('Remover esse destaque?')) return;
  state.highlights = state.highlights.filter((h) => h.id !== id);
  saveState();
  await idbDelete('images', 'hl_' + id);
  renderHighlights();
}

// ---------- upload ----------
function triggerUpload(slot) {
  currentUploadSlot = slot;
  const input = $('#fileInput');
  input.value = '';
  input.click();
}

// ---------- export / import / reset ----------
function allImageKeys() {
  const keys = ['avatar'];
  for (let i = 0; i < 6; i++) keys.push('post' + i);
  state.highlights.forEach((h) => keys.push('hl_' + h.id));
  return keys;
}
async function exportData() {
  const images = {};
  for (const key of allImageKeys()) {
    const blob = await idbGet('images', key);
    if (blob) images[key] = await blobToDataURL(blob);
  }
  const payload = { version: 1, exportedAt: new Date().toISOString(), state, images };
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `instasim-${state.username || 'perfil'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
async function importData(file) {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    alert('Arquivo inválido.');
    return;
  }
  state = Object.assign(structuredClone(DEFAULTS), payload.state, {
    highlights: (payload.state && payload.state.highlights) || [],
    grid: payload.state && payload.state.grid && payload.state.grid.length === 6
      ? payload.state.grid
      : structuredClone(DEFAULTS.grid),
  });
  await idbSet('meta', 'state', state);
  await idbClearStore('images');
  for (const [key, dataUrl] of Object.entries(payload.images || {})) {
    const blob = await (await fetch(dataUrl)).blob();
    await idbSet('images', key, blob);
  }
  await render();
}
async function resetAll() {
  if (!confirm('Limpar tudo e voltar ao modelo em branco? Isso apaga fotos e textos deste navegador.')) return;
  state = structuredClone(DEFAULTS);
  await idbSet('meta', 'state', state);
  await idbClearStore('images');
  await render();
}

// ---------- stat commit ----------
function commitStat(field, el) {
  const digits = el.textContent.replace(/\D/g, '');
  state[field] = digits ? parseInt(digits, 10) : 0;
  el.textContent = state[field].toLocaleString('pt-BR');
  saveState();
}

// ---------- events ----------
document.addEventListener('click', async (e) => {
  if (e.target.closest('#editToggle')) {
    editMode = !editMode;
    applyEditMode();
    return;
  }
  if (e.target.closest('#followBtn')) {
    state.isFollowing = !state.isFollowing;
    saveState();
    render();
    return;
  }
  if (e.target.closest('#hintClose')) {
    $('#editorHint').hidden = true;
    return;
  }
  const menuBtn = e.target.closest('#menuBtn');
  if (menuBtn) {
    $('#menuDropdown').hidden = !$('#menuDropdown').hidden;
    return;
  }
  if (e.target.closest('[data-menu-copy]')) {
    $('#menuDropdown').hidden = true;
    try {
      await navigator.clipboard.writeText(location.href);
      alert('Link copiado.');
    } catch {
      alert(location.href);
    }
    return;
  }
  if (e.target.closest('[data-menu-close]')) {
    $('#menuDropdown').hidden = true;
    return;
  }
  if (!e.target.closest('.ig-menu-wrap')) {
    $('#menuDropdown').hidden = true;
  }

  const linkAnchor = e.target.closest('#linkAnchor');
  if (linkAnchor) {
    if (editMode || !state.linkUrl) e.preventDefault();
    return;
  }

  if (e.target.closest('#btnExport')) { exportData(); return; }
  if (e.target.closest('#btnImport')) { $('#importFile').click(); return; }
  if (e.target.closest('#btnReset')) { resetAll(); return; }

  if (!editMode) return;

  const verifiedBtn = e.target.closest('#verifiedBtn');
  if (verifiedBtn) {
    state.verified = !state.verified;
    saveState();
    render();
    return;
  }

  const editLinkBtn = e.target.closest('#editLinkUrlBtn');
  if (editLinkBtn) {
    const v = prompt('URL do link (bio):', state.linkUrl || 'https://');
    if (v !== null) {
      state.linkUrl = v.trim();
      saveState();
      render();
    }
    return;
  }

  const avatarWrap = e.target.closest('[data-upload-slot="avatar"]');
  if (avatarWrap) { triggerUpload('avatar'); return; }

  const actionBtn = e.target.closest('[data-action]');
  if (actionBtn) {
    const idx = +actionBtn.dataset.index;
    const action = actionBtn.dataset.action;
    if (action === 'pin') { state.grid[idx].pinned = !state.grid[idx].pinned; saveState(); renderGrid(); }
    else if (action === 'reel') { state.grid[idx].reel = !state.grid[idx].reel; saveState(); renderGrid(); }
    else if (action === 'clear') { await idbDelete('images', 'post' + idx); renderGrid(); }
    return;
  }
  const gridCell = e.target.closest('.ig-grid-cell');
  if (gridCell) { triggerUpload('post' + gridCell.dataset.index); return; }

  const removeHl = e.target.closest('[data-remove-hl]');
  if (removeHl) { removeHighlight(removeHl.dataset.removeHl); return; }

  const addHl = e.target.closest('#addHighlightBtn');
  if (addHl) { addHighlight(); return; }

  const hlCircle = e.target.closest('[data-hl]');
  if (hlCircle) { triggerUpload('hl_' + hlCircle.dataset.hl); return; }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const el = e.target;
    if (el && el.isContentEditable && el.id !== 'bioEl') {
      e.preventDefault();
      el.blur();
    }
  }
  if (e.key === 'Escape') $('#menuDropdown').hidden = true;
});

document.addEventListener('focusin', (e) => {
  const el = e.target;
  if (['postsEl', 'followersEl', 'followingEl'].includes(el.id)) {
    el.textContent = state[el.id.replace('El', '')];
    placeCaretEnd(el);
  }
});

document.addEventListener('focusout', (e) => {
  const el = e.target;
  if (!el.id && !(el.dataset && el.dataset.hlLabel)) return;
  if (el.id === 'usernameEl') { state.username = el.textContent.trim() || 'seu_usuario'; saveState(); document.title = `${state.name} (@${state.username}) • Instagram photos and videos`; }
  else if (el.id === 'nameEl') { state.name = el.textContent.trim(); saveState(); }
  else if (el.id === 'bioEl') { state.bio = el.innerText.replace(/\n+$/, ''); saveState(); }
  else if (el.id === 'linkTextEl') { state.linkText = el.textContent.trim(); saveState(); render(); }
  else if (el.id === 'postsEl') commitStat('posts', el);
  else if (el.id === 'followersEl') commitStat('followers', el);
  else if (el.id === 'followingEl') commitStat('following', el);
  else if (el.dataset && el.dataset.hlLabel) {
    const h = state.highlights.find((x) => x.id === el.dataset.hlLabel);
    if (h) { h.label = el.textContent.trim() || 'Destaque'; saveState(); }
  }
});

$('#fileInput').addEventListener('change', async () => {
  const file = $('#fileInput').files[0];
  if (!file || !currentUploadSlot) return;
  const blob = await centerCropResize(file, slotMaxDim(currentUploadSlot), 0.85);
  await idbSet('images', currentUploadSlot, blob);
  if (currentUploadSlot === 'avatar') await loadImageIntoSlot('avatar', $('#avatarImg'), $('#avatarEmpty'));
  else if (currentUploadSlot.startsWith('post')) renderGrid();
  else if (currentUploadSlot.startsWith('hl_')) renderHighlights();
  currentUploadSlot = null;
});

$('#importFile').addEventListener('change', async () => {
  const file = $('#importFile').files[0];
  if (file) await importData(file);
  $('#importFile').value = '';
});

// non-grid tabs are visual only — show a generic empty state, keep "posts" the sole editable tab
document.querySelectorAll('.ig-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ig-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    const isPosts = tab.dataset.tab === 'posts';
    $('#igGrid').hidden = !isPosts;
    $('#igEmptyTab').hidden = isPosts;
  });
});

// ---------- init ----------
(async function init() {
  const saved = await idbGet('meta', 'state');
  if (saved) {
    state = Object.assign(structuredClone(DEFAULTS), saved, {
      highlights: saved.highlights || [],
      grid: saved.grid && saved.grid.length === 6 ? saved.grid : structuredClone(DEFAULTS.grid),
    });
  }
  await render();
})();
})();
