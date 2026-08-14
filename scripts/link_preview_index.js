'use strict';

const { stripHTML } = require('hexo-util');

const DESC_MAX = 200;

// 从正文抽取第一句作为兜底摘要（当 frontmatter 未写 description 时）
function firstSentence(html) {
  const text = stripHTML(html || '').replace(/\s+/g, ' ').trim();
  const m = text.match(/^.*?[。！？.!?]/);
  return (m ? m[0] : text).trim();
}

function descriptionOf(article) {
  const fromFront = article.description && String(article.description).trim();
  const desc = fromFront || firstSentence(article.content || article._content || '');
  return desc.length > DESC_MAX ? desc.slice(0, DESC_MAX) + '…' : desc;
}

// 生成轻量 link-previews.json（title + description），供前端悬浮预览使用。
// 相比 search.json 更小、且带 curated 摘要；覆盖 post + page。
hexo.extend.generator.register('link-previews', function (locals) {
  const root = hexo.config.root || '/';
  const items = [];

  function push(article) {
    if (!article || !article.path) return;
    const title = (article.title || article.blog_title || '').toString().trim();
    if (!title) return;
    items.push({
      url: encodeURI(root + article.path),
      title: title,
      description: descriptionOf(article)
    });
  }

  locals.posts.forEach(push);
  locals.pages.forEach(push);

  return {
    path: 'link-previews.json',
    data: JSON.stringify(items)
  };
});
