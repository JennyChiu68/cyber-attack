export const providers = [
  { id: 'hibp', name: 'Have I Been Pwned', label: '泄露收录目录', kind: 'breach', url: 'https://haveibeenpwned.com/', endpoint: 'https://haveibeenpwned.com/api/v3/breaches', detail: '读取已验证、可公开显示的机构泄露目录记录。' },
  { id: 'washington-breach', name: '华盛顿州数据泄露通报', label: '监管通报', kind: 'breach', format: 'socrata-wa', url: 'https://www.atg.wa.gov/data-breach-notifications', endpoint: 'https://data.wa.gov/resource/sb4j-ca4h.json?$select=id,name,datesubmitted,datestart,washingtoniansaffected&$where=datesubmitted%20IS%20NOT%20NULL&$order=datesubmitted%20DESC,id%20DESC&$limit=45', detail: '华盛顿州总检察长收录的通报。人数口径仅为华盛顿州居民。' },
  { id: 'cloudflare', name: 'Cloudflare Status', label: '服务状态', kind: 'status', url: 'https://www.cloudflarestatus.com/', endpoint: 'https://www.cloudflarestatus.com/api/v2/incidents.json', detail: 'Cloudflare 官方服务故障、降级及恢复进展。' },
  { id: 'record', name: 'The Record', label: '新闻线索', kind: 'news', url: 'https://therecord.media/', endpoint: 'https://therecord.media/feed', detail: '原始 RSS 标题，供发现跨国攻击、泄露和公共部门事件。' },
  { id: 'dark-reading', name: 'Dark Reading', label: '新闻线索', kind: 'news', url: 'https://www.darkreading.com/', endpoint: 'https://www.darkreading.com/rss.xml', detail: '原始 RSS 标题，覆盖企业安全、数据泄露和网络攻击报道。' },
  { id: 'google-cloud', name: 'Google Cloud Service Health', label: '服务状态', kind: 'status', format: 'google', url: 'https://status.cloud.google.com/', endpoint: 'https://status.cloud.google.com/incidents.json', detail: 'Google Cloud 官方中断及降级记录。' },
  { id: 'google-workspace', name: 'Google Workspace Status', label: '服务状态', kind: 'status', format: 'google', url: 'https://www.google.com/appsstatus/dashboard/', endpoint: 'https://www.google.com/appsstatus/dashboard/incidents.json', detail: 'Gmail、Drive 等 Workspace 产品官方中断及降级记录。' },
  { id: 'atlassian', name: 'Atlassian Status', label: '服务状态', kind: 'status', url: 'https://status.atlassian.com/', endpoint: 'https://status.atlassian.com/api/v2/incidents.json', detail: 'Atlassian 官方状态记录。' },
  { id: 'github', name: 'GitHub Status', label: '服务状态', kind: 'status', url: 'https://www.githubstatus.com/', endpoint: 'https://www.githubstatus.com/api/v2/incidents.json', detail: 'GitHub 官方服务故障、降级及恢复进展。' },
];

const statusNames = {
  investigating: '调查中', identified: '已定位', monitoring: '监测中', resolved: '已恢复',
  postmortem: '已发布复盘', scheduled: '计划维护', in_progress: '进行中', verifying: '验证中', completed: '已完成',
};

export const shanghaiDate = (value) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date(value));

function validDate(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function normalizeBreaches(payload) {
  if (!Array.isArray(payload)) throw new Error('无效的泄露目录');
  return payload.filter((row) => row?.IsVerified === true && row.IsSensitive === false
      && row.IsRetired === false && row.IsSpamList === false && row.IsMalware === false
      && row.IsFabricated === false && typeof row.Domain === 'string' && row.Domain
      && typeof row.Name === 'string' && row.Name && typeof row.Title === 'string'
      && validDate(row.BreachDate) && validDate(row.AddedDate))
    .sort((a, b) => Date.parse(b.AddedDate) - Date.parse(a.AddedDate))
    .slice(0, 40).map((row) => ({
      id: row.Name, title: row.Title, date: shanghaiDate(row.AddedDate), firstDate: row.BreachDate, published: row.AddedDate,
      domain: row.Domain, count: Number.isSafeInteger(row.PwnCount) ? row.PwnCount : null,
      url: 'https://haveibeenpwned.com/Breach/' + encodeURIComponent(row.Name),
    }));
}

export function normalizeWashingtonNotices(payload) {
  if (!Array.isArray(payload)) throw new Error('无效的监管通报目录');
  return payload.filter((row) => typeof row?.id === 'string' && /^\d+$/.test(row.id)
      && typeof row.name === 'string' && row.name.trim() && validDate(row.datesubmitted))
    .sort((left, right) => right.datesubmitted.localeCompare(left.datesubmitted))
    .slice(0, 40).map((row) => {
      const count = Number(row.washingtoniansaffected);
      const url = new URL('https://data.wa.gov/resource/sb4j-ca4h.json');
      url.searchParams.set('id', row.id);
      return {
        id: row.id, title: row.name.trim(), date: row.datesubmitted.slice(0, 10),
        firstDate: validDate(row.datestart) ? row.datestart.slice(0, 10) : null,
        count: row.washingtoniansaffected && Number.isSafeInteger(count) && count >= 0 ? count : null,
        url: url.href,
      };
    });
}

export function normalizeStatus(payload, provider) {
  if (!Array.isArray(payload?.incidents)) throw new Error('无效的服务状态目录');
  const origin = new URL(provider.url).origin;
  return payload.incidents.filter((row) => typeof row?.id === 'string'
      && typeof row.name === 'string' && validDate(row.created_at)
      && row.impact !== 'maintenance' && !['scheduled', 'in_progress', 'verifying', 'completed'].includes(row.status))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 12).map((row) => ({
      id: row.id, title: row.name, date: shanghaiDate(row.created_at),
      updated: validDate(row.updated_at) ? row.updated_at : row.created_at,
      serviceState: statusNames[row.status] ?? '状态未分类',
      url: origin + '/incidents/' + encodeURIComponent(row.id),
    }));
}

export function normalizeGoogleStatus(payload, provider) {
  if (!Array.isArray(payload)) throw new Error('无效的服务状态目录');
  const base = new URL(provider.url);
  return payload.filter((row) => typeof row?.id === 'string' && validDate(row.begin)
      && typeof row.external_desc === 'string' && row.external_desc.trim()
      && ['SERVICE_DISRUPTION', 'SERVICE_OUTAGE'].includes(row.status_impact))
    .sort((a, b) => Date.parse(b.begin) - Date.parse(a.begin))
    .slice(0, 12).map((row) => {
      const url = new URL(typeof row.uri === 'string' ? row.uri : '', base);
      return {
        id: row.id, title: row.external_desc.trim().split(/\r?\n/, 1)[0], date: shanghaiDate(row.begin),
        updated: validDate(row.modified) ? row.modified : row.begin,
        serviceState: validDate(row.end) ? '已恢复' : '处理中',
        url: url.origin === base.origin && url.pathname.startsWith(base.pathname) ? url.href : base.href,
      };
    });
}

function normalizeNews(xml, provider) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror') || doc.documentElement.localName !== 'rss') throw new Error('无效的新闻目录');
  const base = new URL(provider.url);
  const articles = [];
  const seen = new Set();
  for (const item of doc.querySelectorAll('channel > item')) {
    const title = item.querySelector('title')?.textContent.trim();
    const date = item.querySelector('pubDate')?.textContent.trim();
    const href = item.querySelector('link')?.textContent.trim();
    if (!title || !validDate(date) || Date.parse(date) > Date.now() + 10 * 60 * 1000 || !href) continue;
    let url;
    try {
      url = new URL(href, base);
    } catch {
      continue;
    }
    if (url.protocol !== 'https:' || url.hostname !== base.hostname || url.username || url.password) continue;
    url.hash = '';
    url.search = '';
    if (seen.has(url.href)) continue;
    seen.add(url.href);
    articles.push({ id: url.href, title, date: shanghaiDate(date), published: date, url: url.href });
  }
  return articles.sort((a, b) => Date.parse(b.published) - Date.parse(a.published)).slice(0, 40);
}

export async function readFeed(provider, fetcher = fetch) {
  const response = await fetcher(provider.endpoint, { signal: AbortSignal.timeout(9000), credentials: 'omit', cache: 'no-cache' });
  if (!response.ok) throw new Error('数据源暂不可用');
  if (provider.kind === 'news') return normalizeNews(await response.text(), provider);
  const payload = await response.json();
  if (provider.format === 'socrata-wa') return normalizeWashingtonNotices(payload);
  if (provider.kind === 'breach') return normalizeBreaches(payload);
  if (provider.format === 'google') return normalizeGoogleStatus(payload, provider);
  return normalizeStatus(payload, provider);
}
