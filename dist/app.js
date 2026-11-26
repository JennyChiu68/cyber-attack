import { categories, incidents, priorityCriteria, priorityFor } from './data.js';
import { socialSourceGroups } from './social-sources.js';
import './radar.js';

const byId = (id) => document.getElementById(id);
const dateShort = (date) => `${Number(date.slice(5, 7))} 月 ${Number(date.slice(8, 10))} 日`;

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

function createPagination(rootId, summaryId, pageSize, render) {
  const root = byId(rootId);
  const summary = byId(summaryId);
  const previous = element('button', 'plain-button', '上一页');
  const next = element('button', 'plain-button', '下一页');
  const label = element('label', 'pagination-select');
  const selector = element('select');
  selector.setAttribute('aria-label', '跳至页码');
  label.append(selector);
  previous.type = next.type = 'button';
  root.append(previous, label, next);

  let page = 1;
  let pageCount = 0;
  function changePage(value) {
    if (value === page || value < 1 || value > pageCount) return;
    page = value;
    render();
    summary.focus({ preventScroll: true });
    summary.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  previous.addEventListener('click', () => changePage(page - 1));
  next.addEventListener('click', () => changePage(page + 1));
  selector.addEventListener('change', () => changePage(Number(selector.value)));

  return {
    reset() { page = 1; },
    slice(rows, emptyMessage, unit) {
      const total = rows.length;
      const pages = Math.max(1, Math.ceil(total / pageSize));
      page = Math.min(page, pages);
      if (pages !== pageCount) {
        const options = Array.from({ length: pages }, (_, index) => {
          const option = element('option', '', `第 ${index + 1} 页 / 共 ${pages} 页`);
          option.value = String(index + 1);
          return option;
        });
        selector.replaceChildren(...options);
        pageCount = pages;
      }
      selector.value = String(page);
      previous.disabled = page === 1;
      next.disabled = page >= pages;
      root.hidden = pages === 1;
      const start = (page - 1) * pageSize;
      const end = Math.min(start + pageSize, total);
      summary.textContent = total ? `显示 ${start + 1}–${end} / ${total} 条${unit}` : emptyMessage;
      return rows.slice(start, end);
    },
  };
}

function dateNode(date, className, value = date) {
  const time = element('time', className, value);
  time.dateTime = date;
  return time;
}

function applyColor(node, type) {
  const style = categories[type];
  node.style.setProperty('--tint', style.tint);
  node.style.setProperty('--color', style.color);
  node.style.setProperty('--event-accent', style.accent);
  return node;
}

const search = byId('event-search');
const priorityToggle = byId('priority-toggle');
const timelinePages = createPagination('timeline-pages', 'result-count', 6, renderTimeline);
const workspace = byId('workspace');
const dialog = byId('incident-detail');
const priorityGuide = byId('priority-guide');
const socialSources = byId('social-sources');
let categoryFilter = '';
let priorityOnly = false;
const filterButtons = new Map();

function resetTimelinePage() {
  timelinePages.reset();
  renderTimeline();
}

function setCategory(type) {
  categoryFilter = type;
  resetTimelinePage();
}

for (const [type, label] of [['', '全部事件'], ...Object.entries(categories).map(([key, { label }]) => [key, label])]) {
  const button = element('button', 'filter', label);
  button.type = 'button';
  button.addEventListener('click', () => setCategory(type));
  filterButtons.set(type, button);
  byId('type-filters').append(button);
}

function eventCard(event) {
  const item = applyColor(element('li', 'incident'), event.type);
  const article = element('article', 'event-card');
  const meta = element('div', 'event-meta');
  meta.append(element('span', 'pill', categories[event.type].label), element('span', '', `${event.country} · ${event.sector}`));
  const title = element('h3');
  const trigger = element('button', 'detail-trigger', event.title);
  trigger.type = 'button';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.addEventListener('click', () => showDetail(event));
  title.append(trigger);
  article.append(meta, title, element('p', '', event.summary));
  item.append(dateNode(event.date, 'incident-date', dateShort(event.date)), article);
  return item;
}

function renderTimeline() {
  const words = search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  document.body.dataset.hasEventQuery = String(words.length > 0);
  const filtered = incidents.filter((event) => {
    const searchable = [event.title, event.org, event.country, event.region, event.sector, event.summary, event.impact, event.state, categories[event.type].label].join(' ').toLocaleLowerCase();
    return (!categoryFilter || event.type === categoryFilter)
      && (!priorityOnly || priorityFor(event))
      && words.every((word) => searchable.includes(word));
  }).sort((a, b) => b.date.localeCompare(a.date));
  const visible = timelinePages.slice(filtered, '显示 0 条事件', '事件');
  byId('incident-list').replaceChildren(...visible.map(eventCard));
  byId('empty').hidden = filtered.length !== 0;
  priorityToggle.setAttribute('aria-pressed', String(priorityOnly));
  for (const [type, button] of filterButtons) {
    button.setAttribute('aria-pressed', String(type === categoryFilter));
  }
}

function showDetail(event) {
  byId('detail-meta').textContent = `${categories[event.type].label} · ${event.country} · ${event.state}`;
  byId('detail-title').textContent = event.title;
  byId('detail-summary').textContent = event.summary;
  byId('detail-impact').textContent = event.impact;
  const priority = priorityFor(event);
  byId('detail-priority').hidden = !priority;
  if (priority) {
    byId('detail-priority-criterion').textContent = priorityCriteria[priority.criterion];
    byId('detail-priority-reason').textContent = priority.reason;
  }
  const facts = [['机构', event.org], ['行业', event.sector], ['报道、通报或进展日期', event.date]];
  if (event.firstDate) facts.push(['事件发生或发现日期', event.firstDate]);
  byId('detail-facts').replaceChildren(...facts.map(([label, value]) => {
    const field = element('div');
    field.append(element('dt', '', label), element('dd', '', value));
    return field;
  }));
  byId('detail-sources').replaceChildren(...event.sources.map(({ name }) => element('li', '', name)));
  dialog.showModal();
}

search.addEventListener('input', resetTimelinePage);
priorityToggle.addEventListener('click', () => {
  priorityOnly = !priorityOnly;
  resetTimelinePage();
});
byId('priority-help').addEventListener('click', () => priorityGuide.showModal());
for (const { title, entries } of socialSourceGroups) {
  const section = element('section');
  const list = element('ul', 'social-source-accounts');
  for (const { name, links } of entries) {
    const accounts = links.map(({ name }) => name).filter((label) => label.startsWith('@'));
    const item = element('li');
    item.append(element('strong', '', name), element('p', '', accounts.join(' / ')));
    list.append(item);
  }
  section.append(element('h3', '', title.replace('社交媒体｜', '')), list);
  byId('social-source-list').append(section);
}
byId('show-social-sources').addEventListener('click', () => socialSources.showModal());
byId('clear').addEventListener('click', () => {
  search.value = '';
  priorityOnly = false;
  setCategory('');
  search.focus();
});
for (const modal of [dialog, priorityGuide, socialSources]) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
}

const retiredSections = new Set(['news', 'breaches', 'services', 'sources']);

function route() {
  const target = location.hash.slice(1);
  document.body.dataset.eventSearchOpen = String(target === 'event-search');
  if (retiredSections.has(target)) history.replaceState(history.state, '', '#timeline');
  if (target === 'event-search') {
    search.focus({ preventScroll: true });
    workspace.scrollIntoView();
  } else if (target === 'home' || target === 'timeline' || retiredSections.has(target)) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (target === 'workspace') {
    workspace.scrollIntoView();
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => {
  if (link.hash === location.hash) route();
}));
window.addEventListener('hashchange', route);
window.addEventListener('keydown', (event) => {
  if (event.key !== '/' || event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey
      || dialog.open || priorityGuide.open || socialSources.open || event.target.closest('input, textarea, select, [contenteditable]')) return;
  event.preventDefault();
  if (location.hash === '#event-search') route();
  else location.hash = 'event-search';
});

renderTimeline();
route();
