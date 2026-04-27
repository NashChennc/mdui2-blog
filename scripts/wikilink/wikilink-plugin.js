const { escapeHtml, escapeUrl } = require('./utils');
const buildIndex = require('./indexer');
const { resolveWikiTarget } = buildIndex;

module.exports = function(hexo) {
  return function processWikiLinks(data) {
    if (!data.content || !data.content.includes('[[')) return data;

    const index = buildIndex(hexo);
    const linkRegex = /(?<!\!)\[\[(.*?)(?:\\?\|(.*?))?\]\]/g;

    data.content = data.content.replace(linkRegex, (match, link, text) => {
      const resolved = resolveWikiTarget(index, link);
      const post = resolved.post;

      // ======================================================================
      // 步骤 D: 渲染
      // ======================================================================
      const display = text ? text.trim() : (post && post.title ? post.title : resolved.pureName);
      const displayEscaped = escapeHtml(display);

      if (post) {
        let url = hexo.config.root + post.path;
        url = url.replace(/\/{2,}/g, '/');
        url = escapeUrl(url);
        const titleEscaped = escapeHtml(post.title || '');

        return `<a href="${url}" title="${titleEscaped}">${displayEscaped}</a>`;
      }

      // Image Safety Net
      if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(resolved.target)) return match;

      // Dead Link (Keep Debug Info)
      return `<span title="${escapeHtml('Missing: ' + resolved.target + ' | Try Key: ' + resolved.nameKey)}">${displayEscaped}</span>`;
    });

    return data;
  };
};
