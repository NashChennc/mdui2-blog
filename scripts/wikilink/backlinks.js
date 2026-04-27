'use strict';

const buildIndex = require('./indexer');
const { isImageTarget } = require('./utils');
const { resolveWikiTarget } = buildIndex;

const WIKI_LINK_RE = /(?<!\!)\[\[(.*?)(?:\\?\|(.*?))?\]\]/g;

function postKey(post) {
  if (!post) return '';
  return String(post._id || post.source || post.path || post.slug || post.title || '');
}

function postTime(post) {
  const value = post && (post.updated || post.date);

  if (!value) return 0;
  if (typeof value.valueOf === 'function') return value.valueOf();

  return new Date(value).getTime() || 0;
}

function buildBacklinkIndex(hexo) {
  const cached = hexo.locals.get('foam_backlinks');
  if (cached) return cached;

  const wikiIndex = buildIndex(hexo);
  const backlinks = new Map();
  const seenByTarget = new Map();
  const posts = hexo.model('Post') ? hexo.model('Post').toArray() : [];

  posts.forEach(sourcePost => {
    const raw = String(sourcePost.raw || sourcePost._content || '');
    if (!raw.includes('[[')) return;

    WIKI_LINK_RE.lastIndex = 0;

    let match;
    while ((match = WIKI_LINK_RE.exec(raw))) {
      const resolved = resolveWikiTarget(wikiIndex, match[1]);

      if (!resolved.post || isImageTarget(resolved.target)) continue;

      const targetKey = postKey(resolved.post);
      const sourceKey = postKey(sourcePost);

      if (!targetKey || !sourceKey || targetKey === sourceKey) continue;

      let seenSources = seenByTarget.get(targetKey);
      if (!seenSources) {
        seenSources = new Set();
        seenByTarget.set(targetKey, seenSources);
      }

      if (seenSources.has(sourceKey)) continue;

      seenSources.add(sourceKey);

      let sources = backlinks.get(targetKey);
      if (!sources) {
        sources = [];
        backlinks.set(targetKey, sources);
      }

      sources.push(sourcePost);
    }
  });

  backlinks.forEach(sources => {
    sources.sort((a, b) => postTime(b) - postTime(a));
  });

  hexo.locals.set('foam_backlinks', backlinks);
  return backlinks;
}

module.exports = function registerBacklinkHelper(hexo) {
  hexo.extend.helper.register('post_backlinks', function(post) {
    const backlinks = buildBacklinkIndex(hexo);
    return backlinks.get(postKey(post)) || [];
  });
};
