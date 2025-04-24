// js/main.js

const API_KEY = 'cvvdl69r01qi0bq4ksl0cvvdl69r01qi0bq4kslg';

const input       = document.getElementById('company-input');
const dropdown    = document.getElementById('dropdown-list');
const feedbackBox = document.getElementById('input-feedback');
const form        = document.querySelector('form');

console.log("Script loaded. input=", input, " dropdown=", dropdown);

let timeoutId;
let lastMatches = [];
let activeIndex = -1;

// debounce helper
function debounce(fn, delay = 300) {
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// only allow 1–5 uppercase letters, no dots/dashes
function isCleanTicker(sym) {
  return /^[A-Z]{1,5}$/.test(sym);
}

// render the dropdown and reset navigation state
function renderDropdown(items) {
  dropdown.innerHTML = '';
  lastMatches = items;
  activeIndex = -1;

  if (items.length === 0) {
    dropdown.classList.add('hidden');
    return;
  }

  items.forEach((it, idx) => {
    const li = document.createElement('li');
    li.textContent = `${it.description} (${it.symbol})`;
    li.addEventListener('click', () => selectSuggestion(idx));
    dropdown.appendChild(li);
  });

  dropdown.classList.remove('hidden');
}

// highlight the activeIndex item
function updateActive() {
  const lis = dropdown.querySelectorAll('li');
  lis.forEach(li => li.classList.remove('active'));
  if (activeIndex >= 0 && activeIndex < lis.length) {
    const li = lis[activeIndex];
    li.classList.add('active');
    li.scrollIntoView({ block: 'nearest' });
  }
}

// build a 5-column table: first row = KPI names, second row = values
function selectSuggestion(idx) {
  const match = lastMatches[idx];
  if (!match) return;

  // 1) fill the input with the ticker
  input.value = match.symbol;

  // 2) build the feedback HTML: header + table
  feedbackBox.innerHTML = `
  <div class="company-header">
    ${match.description} (${match.symbol})
  </div>
  <table class="kpi-table">
    <tr class="kpi-row">
      <td>KPI 1</td><td>KPI 2</td><td>KPI 3</td><td>KPI 4</td><td>KPI 5</td>
    </tr>
    <tr class="value-row">
      <td>Value 1</td><td>Value 2</td><td>Value 3</td><td>Value 4</td><td>Value 5</td>
    </tr>
  </table>
  <div class="score-text">
    Score: 80
  </div>
    `;

  // 3) show it, hide the dropdown, reset state
  feedbackBox.classList.remove('hidden');
  dropdown.classList.add('hidden');
  lastMatches = [];
  activeIndex = -1;
  input.focus();
}


// fetch, filter, and render suggestions
async function fetchSuggestions(query) {
  if (!query || query.length < 1) {
    dropdown.classList.add('hidden');
    return;
  }

  // 1) search symbols + names
  const res = await fetch(
    `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${API_KEY}`
  );
  if (!res.ok) {
    console.error('Search error:', res.status);
    dropdown.classList.add('hidden');
    return;
  }
  const { result = [] } = await res.json();

  // 2) dedupe and keep symbol, description, type
  const seen = new Set();
  const unique = result
    .filter(r => !seen.has(r.symbol) && seen.add(r.symbol))
    .map(r => ({
      symbol:      r.symbol,
      description: r.description,
      type:        r.type
    }));

  // 3) enrich with profile2 (country, marketCap)
  const enriched = await Promise.all(unique.map(async it => {
    try {
      const profRes = await fetch(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(it.symbol)}&token=${API_KEY}`
      );
      if (!profRes.ok) throw new Error(profRes.status);
      const prof = await profRes.json();
      return {
        ...it,
        country:   prof.country,
        marketCap: prof.marketCapitalization
      };
    } catch {
      return null;
    }
  }));

  // 4) apply all filters
  const q = query.toLowerCase();
  const filtered = enriched.filter(p =>
    p &&
    p.type === 'Common Stock' &&
    p.country === 'US' &&
    p.marketCap >= 10000 &&
    (p.symbol.toLowerCase().includes(q) ||
     p.description.toLowerCase().includes(q)) &&
    isCleanTicker(p.symbol)
  );

  renderDropdown(filtered);
}

// handle typing
input.addEventListener('input', debounce(e => {
  fetchSuggestions(e.target.value.trim());
}));

// handle arrow keys + Enter
input.addEventListener('keydown', e => {
  if (dropdown.classList.contains('hidden')) return;
  const max = lastMatches.length - 1;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex = activeIndex < max ? activeIndex + 1 : 0;
    updateActive();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex = activeIndex > 0 ? activeIndex - 1 : max;
    updateActive();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const idx = activeIndex >= 0 ? activeIndex : 0;
    selectSuggestion(idx);
  }
});

// hide dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown-container')) {
    dropdown.classList.add('hidden');
  }
});

// prevent form submission
form.addEventListener('submit', e => e.preventDefault());

