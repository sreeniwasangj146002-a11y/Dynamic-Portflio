const express = require('express');
const { readDB, writeDB } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function ensureAnalytics(db) {
  if (!db.analytics) db.analytics = {};
  db.analytics.totalViews = Number(db.analytics.totalViews || 0);
  db.analytics.visitors = Array.isArray(db.analytics.visitors) ? db.analytics.visitors : [];
  db.analytics.events = Array.isArray(db.analytics.events) ? db.analytics.events : [];
  db.analytics.projectViews = db.analytics.projectViews || {};
  db.analytics.cvDownloads = Number(db.analytics.cvDownloads || 0);
  db.analytics.contactClicks = Number(db.analytics.contactClicks || 0);
  return db.analytics;
}

router.post('/track', (req, res) => {
  const db = readDB();
  const analytics = ensureAnalytics(db);
  const body = req.body || {};
  const event = String(body.event || 'page_view').slice(0, 40);
  const visitorId = String(body.visitorId || '').slice(0, 100);
  const now = new Date().toISOString();

  if (event === 'page_view') {
    analytics.totalViews += 1;
    if (visitorId && !analytics.visitors.includes(visitorId)) analytics.visitors.push(visitorId);
  } else if (event === 'project_view' && body.projectId) {
    const id = String(body.projectId);
    analytics.projectViews[id] = Number(analytics.projectViews[id] || 0) + 1;
  } else if (event === 'cv_download') {
    analytics.cvDownloads += 1;
  } else if (event === 'contact_click') {
    analytics.contactClicks += 1;
  }

  analytics.events.unshift({
    event,
    at: now,
    visitorId: visitorId || undefined,
    path: String(body.path || '').slice(0, 160),
    referrer: String(body.referrer || '').slice(0, 500),
    searchTerm: String(body.searchTerm || '').slice(0, 160),
    projectId: body.projectId ? String(body.projectId).slice(0, 80) : undefined,
    projectTitle: body.projectTitle ? String(body.projectTitle).slice(0, 180) : undefined,
    screen: String(body.screen || '').slice(0, 40)
  });
  analytics.events = analytics.events.slice(0, 1000);
  analytics.visitors = analytics.visitors.slice(-5000);
  writeDB(db);
  res.json({ ok: true });
});

router.get('/', requireAuth, (req, res) => {
  const db = readDB();
  const a = ensureAnalytics(db);
  const projectMap = Object.fromEntries((db.projects || []).map((p) => [p.id, p.title]));
  const now = Date.now();
  const day = 86400000;
  const pageViews = a.events.filter((e) => e.event === 'page_view');
  const views7d = pageViews.filter((e) => now - new Date(e.at).getTime() <= 7 * day).length;
  const views30d = pageViews.filter((e) => now - new Date(e.at).getTime() <= 30 * day).length;
  const searchVisits = pageViews.filter((e) => e.searchTerm || /google\.|bing\.|yahoo\.|duckduckgo\./i.test(e.referrer || ''));
  const sourceCounts = {};
  pageViews.forEach((e) => {
    let source = 'Direct';
    try { if (e.referrer) source = new URL(e.referrer).hostname.replace(/^www\./, ''); } catch (_) {}
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });
  const topSources = Object.entries(sourceCounts).sort((a,b) => b[1]-a[1]).slice(0,8).map(([source,count]) => ({source,count}));
  const projectViews = Object.entries(a.projectViews).map(([id,count]) => ({ id, title: projectMap[id] || id, count })).sort((a,b) => b.count-a.count);
  const searchTerms = [...new Set(searchVisits.map((e) => e.searchTerm).filter(Boolean))].slice(0,20);

  res.json({
    totalViews: a.totalViews,
    uniqueVisitors: a.visitors.length,
    views7d,
    views30d,
    searchVisits: searchVisits.length,
    cvDownloads: a.cvDownloads,
    contactClicks: a.contactClicks,
    topSources,
    projectViews,
    searchTerms,
    recent: a.events.slice(0,20)
  });
});

module.exports = router;
