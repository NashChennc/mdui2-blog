'use strict';

const { load } = require('cheerio');

const ICON_MARKUP =
  '<span class="post-external-link-icon-wrap" aria-hidden="true">' +
  '<mdui-icon name="open_in_new" class="post-external-link-icon"></mdui-icon>' +
  '</span>';

function siteHostname(hexo) {
  try {
    return new URL(hexo.config.url).hostname;
  } catch {
    return '';
  }
}

function pageBaseUrl(data, hexo) {
  if (data.permalink) {
    try {
      return new URL(data.permalink).href;
    } catch (_) {
      /* fall through */
    }
  }
  const root = hexo.config.url.replace(/\/?$/, '/');
  const path = (data.path || '').replace(/\\/g, '/');
  try {
    return new URL(path, root).href;
  } catch (_) {
    return root;
  }
}

function isExternalHref(href, pageBase, siteHost) {
  if (!siteHost || href == null) return false;
  const t = String(href).trim();
  if (!t || t === '#' || t.startsWith('#')) return false;
  const low = t.toLowerCase();
  if (
    low.startsWith('mailto:') ||
    low.startsWith('tel:') ||
    low.startsWith('javascript:')
  ) {
    return false;
  }
  let u;
  try {
    u = new URL(t, pageBase);
  } catch {
    return false;
  }
  if (u.protocol === 'data:' || u.protocol === 'blob:' || u.protocol === 'file:') {
    return false;
  }
  if (!u.hostname) return false;
  return u.hostname !== siteHost;
}

/**
 * Cheerio 序列化会把 &lt;pre&gt;/&lt;code&gt; 内的 --&gt;、&amp; 等转成实体，破坏 Mermaid 与行内代码；
 * 先整体替换再还原。
 */
function maskSensitiveBlocks(html) {
  const blocks = [];
  const pull = (source, re) =>
    source.replace(re, full => {
      const i = blocks.length;
      blocks.push(full);
      return `__HEXO_EXT_LINK_HOLD_${i}__`;
    });

  let masked = pull(html, /<pre\b[^>]*>[\s\S]*?<\/pre>/gi);
  masked = pull(masked, /<code\b[^>]*>[\s\S]*?<\/code>/gi);
  return { masked, blocks };
}

function unmaskSensitiveBlocks(html, blocks) {
  let out = html;
  for (let i = 0; i < blocks.length; i++) {
    out = out.split(`__HEXO_EXT_LINK_HOLD_${i}__`).join(blocks[i]);
  }
  return out;
}

hexo.extend.filter.register(
  'after_post_render',
  function (data) {
    if (!data.content || typeof data.content !== 'string') return data;

    const siteHost = siteHostname(hexo);
    if (!siteHost) return data;

    const pageBase = pageBaseUrl(data, hexo);
    const { masked, blocks } = maskSensitiveBlocks(data.content);
    const $ = load(masked, {}, false);

    $('a[href]').each((_, el) => {
      const $el = $(el);
      if ($el.closest('pre, code').length) return;

      const href = $el.attr('href');
      if (!isExternalHref(href, pageBase, siteHost)) return;

      const $next = $el.next();
      if (
        $next.length &&
        ($next.hasClass('post-external-link-icon-wrap') ||
          $next.hasClass('post-external-link-icon'))
      ) {
        return;
      }

      $el.after(ICON_MARKUP);
    });

    data.content = unmaskSensitiveBlocks($.root().html(), blocks);
    return data;
  },
  15
);
