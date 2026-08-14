'use strict';

const { stripHTML, unescapeHTML } = require('hexo-util');

const FIRST_H1_RE = /<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i;

/**
 * Split rendered source/_data content into the page title and descriptive body.
 *
 * Markdown and HTML data files are rendered by Hexo before they reach helpers.
 * The first <h1> is treated as content metadata and removed from the body so the
 * theme can keep using its existing notes-header structure.
 */
function dataContentPage(value) {
  const html = value === undefined || value === null ? '' : String(value).trim();
  const heading = FIRST_H1_RE.exec(html);

  if (!heading) {
    return { title: '', body: html };
  }

  const title = unescapeHTML(stripHTML(heading[1])).trim();
  const body = `${html.slice(0, heading.index)}${html.slice(heading.index + heading[0].length)}`.trim();

  return { title, body };
}

hexo.extend.helper.register('mdblog_data_content_page', dataContentPage);
