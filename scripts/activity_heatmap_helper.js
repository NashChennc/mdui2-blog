'use strict';

function toArray(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.toArray === 'function') return collection.toArray();

  const items = [];
  if (typeof collection.each === 'function') {
    collection.each(item => items.push(item));
    return items;
  }

  if (typeof collection.forEach === 'function') {
    collection.forEach(item => items.push(item));
  }

  return items;
}

function isUsableDate(value) {
  if (!value) return false;
  if (typeof value.isValid === 'function') return value.isValid();
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function formatDate(ctx, value) {
  if (!isUsableDate(value)) return '';

  let formatted = '';
  if (ctx && typeof ctx.date === 'function') {
    formatted = ctx.date(value, 'YYYY-MM-DD');
  } else if (value && typeof value.format === 'function') {
    formatted = value.format('YYYY-MM-DD');
  } else {
    const d = new Date(value);
    formatted = d.toISOString().slice(0, 10);
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(formatted) ? formatted : '';
}

function collectTaxonomyNames(collection) {
  return toArray(collection)
    .map(item => (item && item.name !== undefined && item.name !== null ? String(item.name).trim() : ''))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

hexo.extend.helper.register('activity_heatmap_data', function (posts, options = {}) {
  const ctx = this;
  const items = toArray(posts);
  const data = [];

  items.forEach(post => {
    if (!post) return;

    const dateValue = isUsableDate(post.updated) ? post.updated : post.date;
    const day = formatDate(ctx, dateValue);
    if (!day) return;

    const title = String(post.blog_title || post.title || '(untitled)');
    const path = post.path || post.permalink || '';
    const url = path && typeof ctx.url_for === 'function' ? ctx.url_for(path) : path || '#';

    data.push({
      title,
      url,
      date: day,
      tags: collectTaxonomyNames(post.tags)
    });
  });

  data.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
  });

  return {
    scope: options.scope || '',
    posts: data
  };
});
