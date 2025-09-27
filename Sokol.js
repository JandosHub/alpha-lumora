<script>
/* ---- Utility: debounce ---- */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* ---- Оқу: inline JSON ---- */
const raw = document.getElementById('site-data').textContent;
const DATA = JSON.parse(raw);
const INDEX = DATA.pages; // массив жазбалар

/* ---- DOM элементтер ---- */
const input = document.getElementById('search-input');
const results = document.getElementById('search-results');

/* ---- Жеңілше іздеу функциясы (case-insensitive substring) ---- */
function search(query) {
  if (!query || query.trim().length < 1) {
    results.innerHTML = ''; 
    return;
  }
  const q = query.trim().toLowerCase();
  // сүзгі: title, summary, tags
  const matched = INDEX.filter(item => {
    if ((item.title||'').toLowerCase().includes(q)) return true;
    if ((item.summary||'').toLowerCase().includes(q)) return true;
    if (Array.isArray(item.tags) && item.tags.join(' ').toLowerCase().includes(q)) return true;
    return false;
  });

  renderResults(matched, q);
}

/* ---- Нәтижелерді көрсету + highlight (қарапайым) ---- */
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function highlight(text, q){
  if(!q) return escapeHtml(text);
  const re = new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')', 'ig');
  return escapeHtml(text).replace(re, '<mark>$1</mark>');
}

function renderResults(list, q){
  if (list.length === 0) {
    results.innerHTML = '<p>Нәтиже табылмады.</p>';
    return;
  }
  const html = list.map(item => {
    return `
      <article class="search-item">
        <h3><a href="${escapeHtml(item.url)}">${highlight(item.title, q)}</a></h3>
        <p class="summary">${highlight(item.summary||'', q)}</p>
        <p class="tags">Тегтер: ${ (item.tags||[]).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ') }</p>
      </article>
    `;
  }).join('');
  results.innerHTML = html;
}

/* ---- Debounced input handler ---- */
const handler = debounce(e => search(e.target.value), 250);
input.addEventListener('input', handler);

/* ---- Optional: enter-perform search immediately ---- */
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    search(input.value);
  }
});
</script>
