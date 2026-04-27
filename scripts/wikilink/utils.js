const path = require('path');

function normalizeWikiTarget(link) {
  let target = String(link || '').trim();

  try { target = decodeURIComponent(target); } catch (e) {}

  target = target.replace(/\\/g, '/');
  target = target.replace(/^(\.\/|\/)+/, '');

  return target;
}

function getWikiTargetLookup(link) {
  const target = normalizeWikiTarget(link);
  const pathKey = target.replace(/\.(md|markdown)$/i, '').toLowerCase();
  const basenameWithExt = target.split('/').pop();
  const pureName = basenameWithExt.replace(/\.(md|markdown)$/i, '');
  const nameKey = pureName.toLowerCase();
  const keys = [nameKey, pathKey];
  const parts = pathKey.split('/');

  if (parts.length > 1) {
    parts.shift();
    keys.push(parts.join('/'));
  }

  return {
    target,
    pathKey,
    basenameWithExt,
    pureName,
    nameKey,
    keys: Array.from(new Set(keys.filter(Boolean)))
  };
}

module.exports = {
  escapeHtml: function(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  },

  escapeUrl: function(url) {
    if (!url) return '';
    return encodeURI(String(url)).replace(/['"<>]/g, '');
  },
  
  // 路径标准化工具
  normalizePath: function(p) {
    return p.replace(/\\/g, '/');
  },

  normalizeWikiTarget,
  getWikiTargetLookup,

  isImageTarget: function(target) {
    return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(String(target || ''));
  }
};
