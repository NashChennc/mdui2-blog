# mdui2-blog

一个基于 Hexo 和 MDUI 2 的自用 Markdown 风格博客主题。主题内置 MDUI 2、Material Symbols、KaTeX、Mermaid 前端资源，并支持 Obsidian/Foam 风格的 Wiki Links。

## Features

- 响应式首页、分类页、文章页布局
- MDUI 2 组件与 Material Symbols 图标
- Font Awesome 品牌图标
- KaTeX 客户端数学公式渲染
- Mermaid 亮/暗主题同步
- `[[内部链接]]`、`![[图片]]` 和文章 backlinks
- `{% list_files [folder_name] %}` 文件列表标签
- 搜索面板与主题切换

## Install

```bash
cd your-hexo-site
git clone https://github.com/NashChennc/mdui2-blog.git themes/mdui2-blog
npm install hexo-wordcount hexo-renderer-markdown-it --save
cd themes/mdui2-blog
npm install
```

在 Hexo 根目录 `_config.yml` 中启用主题：

```yaml
theme: mdui2-blog
```

主题的 `postinstall` 会把 `mdui` 和 `material-symbols` 复制到 `source/mdui2/`。如果只想重新生成 vendored 资源：

```bash
cd themes/mdui2-blog
npm run vendor
```

## Build

```bash
cd your-hexo-site
npm run build
```

## Theme Config

主题配置位于 `themes/mdui2-blog/_config.yml`。常用配置：

```yaml
banner:
  enable: true
  image: /image/banner.jpeg

sidebar_config:
  avatar: /image/avatar.jpeg

katex:
  enable: true

social:
  github:
    text: GitHub
    link: https://github.com/yourname
    icon: fa-brands fa-github
    color: mdui-text-color-black
  email:
    text: you@example.com
    link: mailto:you@example.com
    icon: fa-solid fa-envelope
    color: mdui-text-color-blue

footer:
  show_social: true
  nav:
    - { i18n: home, path: "/" }
    - { i18n: archive_a, path: "/archives" }

google_analytics:
```

### Social Icons

`social.*.icon` 使用 Font Awesome class，例如：

- `fa-brands fa-github`
- `fa-brands fa-bilibili`
- `fa-solid fa-envelope`

`social.*.link` 支持 `https://`、`http://`、`mailto:`、`tel:` 和站内相对路径。主题会过滤不安全协议与 class token。

### KaTeX

主题默认加载客户端 KaTeX：

```yaml
katex:
  enable: true
```

如果站点不需要公式，可以关闭以减少前端资源：

```yaml
katex:
  enable: false
```

### Analytics

`google_analytics` 为空时不会注入 Google Tag。需要统计时填入站点自己的 ID：

```yaml
google_analytics: G-XXXXXXXXXX
```

## Markdown Extensions

Wiki Links：

```markdown
[[目标文章]]
[[目标文章|显示文字]]
![[image.png|图片说明]]
```

文件列表：

```markdown
{% list_files files %}
```

`list_files` 只允许列出 `source/` 下的一层目录名，输出链接会做 URL 编码并加上 `rel="noopener noreferrer"`。

## Notes

- 主题配置优先于站点配置；为空时部分字段回退到 Hexo 根 `_config.yml` 或 i18n 文本。
- `index_page.lede` 支持 HTML，适合站点 owner 自定义首页说明。
- 文章内容本身仍由 Hexo Markdown renderer 负责清洗/渲染；公开站点不建议开启不可信用户投稿的原始 HTML。

## License

MIT
