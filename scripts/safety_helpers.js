'use strict';

const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const URL_UNSAFE_CHARS_RE = /[\u0000-\u001f\u007f<>"'\\]/;
const CLASS_TOKEN_RE = /^[A-Za-z0-9_-]+$/;

function toStringValue(value) {
  return value === undefined || value === null ? '' : String(value);
}

function safeUrl(value, fallback) {
  const raw = toStringValue(value).trim();
  const fallbackValue = toStringValue(fallback);

  if (!raw || URL_UNSAFE_CHARS_RE.test(raw)) return fallbackValue;
  if (/^\/\//.test(raw)) return fallbackValue;
  if (raw.startsWith('#') || /^\/(?!\/)/.test(raw) || /^\.\.?\//.test(raw)) return raw;

  if (!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(raw)) return raw;

  try {
    const parsed = new URL(raw);
    return SAFE_URL_PROTOCOLS.has(parsed.protocol) ? raw : fallbackValue;
  } catch (_) {
    return fallbackValue;
  }
}

function safeCssUrl(value, fallback) {
  const url = safeUrl(value, fallback);
  return url.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\n\r\f]/g, '');
}

function safeClassList(value) {
  return toStringValue(value)
    .split(/\s+/)
    .filter(token => token && CLASS_TOKEN_RE.test(token))
    .join(' ');
}

function safeJson(value) {
  const json = JSON.stringify(value === undefined ? null : value);
  return (json === undefined ? 'null' : json).replace(/[<>&\u2028\u2029]/g, char => {
    switch (char) {
      case '<':
        return '\\u003c';
      case '>':
        return '\\u003e';
      case '&':
        return '\\u0026';
      case '\u2028':
        return '\\u2028';
      case '\u2029':
        return '\\u2029';
      default:
        return char;
    }
  });
}

function analyticsId(value) {
  const raw = toStringValue(value).trim();
  return /^[A-Za-z0-9_-]+$/.test(raw) ? raw : '';
}

hexo.extend.helper.register('mdblog_safe_url', safeUrl);
hexo.extend.helper.register('mdblog_safe_css_url', safeCssUrl);
hexo.extend.helper.register('mdblog_class_list', safeClassList);
hexo.extend.helper.register('mdblog_json', safeJson);
hexo.extend.helper.register('mdblog_analytics_id', analyticsId);
