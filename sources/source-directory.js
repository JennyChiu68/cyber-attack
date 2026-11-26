import { socialSourceGroups } from '../dist/social-sources.js';

export const sourceDirectory = [
  {
    title: '官方公告与状态记录',
    entries: [
      { name: '美国 SEC EDGAR', detail: '查找上市公司公开申报。美国发行人的重大网络安全事件通常可按 Form 8-K 的 Item 1.05 检索。', links: [{ name: 'EDGAR 全文搜索', url: 'https://www.sec.gov/edgar/search/' }] },
      { name: '美国州级数据泄露通报', detail: '查找企业提交给州总检察长的通知，核对日期和影响范围。同一事件可能多州申报，州内人数与总人数分开记录。', links: [{ name: '华盛顿州通报目录', url: 'https://www.atg.wa.gov/data-breach-notifications' }, { name: '俄勒冈州泄露通报数据库', url: 'https://justice.oregon.gov/consumer/databreach/' }] },
      { name: '国家网络安全机构', detail: '查找政府发布的威胁通告与重大事件更新。用事件原文核对影响范围和归因。', links: [{ name: '美国 CISA 通告', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories' }, { name: '法国 CERT-FR', url: 'https://cert.cyber.gouv.fr/' }, { name: '日本 JPCERT/CC', url: 'https://www.jpcert.or.jp/english/' }, { name: '韩国个人信息保护委员会', url: 'https://www.pipc.go.kr/' }] },
      { name: '厂商状态与基础设施通报', detail: '核对停机时间、受影响服务、恢复进度和已公布的故障原因。', links: [{ name: 'AWS Health', url: 'https://health.aws.amazon.com/health/status' }, { name: 'Apple 系统状态', url: 'https://www.apple.com/support/systemstatus/' }, { name: 'FAA 空域状态', url: 'https://nasstatus.faa.gov/' }] },
    ],
  },
  {
    title: '交易所与上市公司常设公告',
    entries: [
      { name: '日本 JPX TDnet', detail: '按公司及日文关键词查找入侵、泄露、停业与调查进展。保留公司公告编号，便于跟踪后续。', links: [{ name: 'TDnet 及时披露', url: 'https://www.release.tdnet.info/inbs/I_main_00.html' }] },
      { name: '澳大利亚 ASX', detail: '查找能源、采矿、金融和其他上市公司公告。按受影响设施所在地区归类事件。', links: [{ name: 'ASX 市场公告检索', url: 'https://www.asx.com.au/markets/trade-our-cash-market/announcements' }] },
      { name: '韩国 DART', detail: '按韩文名称及关键词查找企业申报和改报。与韩国个人信息保护委员会通报对照。', links: [{ name: 'DART 韩文申报检索', url: 'https://dart.fss.or.kr/' }] },
      { name: '台湾公开资讯观测站', detail: '按公司、日期和「資訊安全」「資安事件」查找重大讯息。政府系统事件另查当事部门。', links: [{ name: '公开资讯观测站', url: 'https://mops.twse.com.tw/' }] },
      { name: '巨潮资讯', detail: '在公告全文检索「网络安全事件」「数据泄露」「系统中断」，核对上市公司公告和后续处置。', links: [{ name: '公告检索', url: 'https://www.cninfo.com.cn/new/commonUrl?url=disclosure%2Flist%2Fnotice' }] },
      { name: '巴西 CVM', detail: '按发行人查找证券市场披露，关注重大事项类型 Fato Relevante 和市场沟通 Comunicado ao Mercado。', links: [{ name: '巴西 CVM 公开发行人目录', url: 'https://sistemas.cvm.gov.br/cias-abertas.asp' }] },
    ],
  },
  {
    title: '行业、政府与隐私监管通报',
    entries: [
      { name: '美国卫生与公众服务部 OCR', detail: '跟踪美国医疗数据泄露。公开清单以影响至少 500 人的已报告事件为主，临床服务受阻另查院方通报。', links: [{ name: 'HHS OCR 医疗数据泄露目录', url: 'https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf' }] },
      { name: '日本消防厅及国家网络安全办公室', detail: '消防厅公告用于发现应急系统和公共安全事件。国家网络安全办公室通告提供线索，漏洞预警只有核实实际影响后才进入事件时间线。', links: [{ name: '日本消防厅新闻发布', url: 'https://www.fdma.go.jp/pressrelease/houdou/' }, { name: '日本国家网络安全办公室通告', url: 'https://www.cyber.go.jp/news/press/tyuuikanki.html' }] },
      { name: '台湾领务局', detail: '查找护照、签证及领务公共系统的事件披露和服务更新。', links: [{ name: '台湾领务局最新消息', url: 'https://www.boca.gov.tw/lp-56-2.html' }] },
      { name: '香港个人资料私隐专员公署', detail: '在新闻稿和传媒回应中跟进公开披露的本地事故，逐条核对调查结论和涉事机构。', links: [{ name: '香港私隐公署中文入口', url: 'https://www.pcpd.org.hk/tc_chi/' }] },
      { name: '法国 CNIL', detail: '在公开执法决定中补查披露较晚的隐私事件。公开决定只覆盖部分案件。', links: [{ name: 'CNIL 公开处罚决定', url: 'https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil' }] },
      { name: '巴西 ANPD', detail: '在葡语新闻与执法公告中寻找具名事件。汇总统计仅用于判断覆盖缺口。', links: [{ name: '巴西 ANPD 新闻目录', url: 'https://www.gov.br/anpd/pt-br/assuntos/noticias' }] },
      { name: '南非与肯尼亚隐私监管机构', detail: '用新闻通报和公开裁决补查具名事件。关注公告更新时间及案件实际发生时间。', links: [{ name: '南非 Information Regulator 公告', url: 'https://inforegulator.org.za/media-statements/' }, { name: '肯尼亚 ODPC 公开裁决', url: 'https://www.odpc.go.ke/determinations/' }] },
    ],
  },
  {
    title: '媒体报道与事件档案',
    entries: [
      { name: '全球及区域事件数据库', detail: '交叉查询其他地区的同类事件，再回到机构公告或原始报道核对。研究库的收录和更新周期由发布方决定。', links: [{ name: '马里兰大学全球网络事件数据库', url: 'https://www.gotech.spp.umd.edu/research-impact/publications/cyber-events-database-home' }, { name: 'EuRepoC 全球数据库', url: 'https://eurepoc.eu/database/' }, { name: '欧洲网络事件观察站', url: 'https://lab.globaltradealert.org/cyber-incidents' }, { name: 'CSIS 重大网络事件', url: 'https://www.csis.org/programs/strategic-technologies-program/significant-cyber-incidents' }] },
      { name: 'SecurityWeek', detail: '发现跨境企业和工业领域事件，优先核对报道引用的原始公告。', links: [{ name: 'SecurityWeek 新闻网站', url: 'https://www.securityweek.com/' }] },
      { name: 'CERT-EU 月度网络简报', detail: '用月度发布复核欧洲及跨境重大事件。简报偏向欧盟相关威胁，涉及具名事件时回查原始披露。', links: [{ name: 'CERT-EU 威胁情报发布目录', url: 'https://cert.europa.eu/publications/threat-intelligence/' }] },
      { name: '美联社与路透社', detail: '核对涉及政府、金融或公共安全的重大报道，留意是否直接引述当事机构，以及报道是否来自独立采访。', links: [{ name: '美联社科技新闻', url: 'https://apnews.com/hub/technology' }, { name: '路透社科技新闻', url: 'https://www.reuters.com/technology/' }] },
    ],
  },
  ...socialSourceGroups,
];
