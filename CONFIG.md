# mdui2-blog 主题配置说明

> 基于 Hexo + MDUI 2 的个人博客主题，内置 MDUI 2、Material Symbols、KaTeX、Mermaid 前端资源，支持 Obsidian/Foam 风格 Wiki Links。

---

## 目录

- [一、快速安装](#一快速安装)
- [二、配置体系说明](#二配置体系说明)
- [三、站点级配置 `_config.yml`](#三站点级配置-_configyml)
- [四、主题级配置 `_config.yml`](#四主题级配置-_configyml)
  - [4.1 Banner（顶部横幅）](#41-banner顶部横幅)
  - [4.2 顶栏头像 (sidebar_config)](#42-顶栏头像-sidebar_config)
  - [4.3 分类索引页 (category_page)](#43-分类索引页-category_page)
  - [4.4 KaTeX 数学公式](#44-katex-数学公式)
  - [4.5 社交链接 (social)](#45-社交链接-social)
  - [4.6 页脚 (footer)](#46-页脚-footer)
  - [4.7 首页主体区 (index_page)](#47-首页主体区-index_page)
  - [4.8 首页分类·标签芯片 (index_taxonomy)](#48-首页分类标签芯片-index_taxonomy)
  - [4.9 活动热力图 (activity_heatmap)](#49-活动热力图-activity_heatmap)
  - [4.10 分析工具 (google_analytics)](#410-分析工具-google_analytics)
  - [4.11 其他配置项](#411-其他配置项)
  - [4.12 Hexo 内置 / 兼容配置](#412-hexo-内置--兼容配置)
- [五、多语言 (i18n)](#五多语言-i18n)
- [六、文章 Front-matter](#六文章-front-matter)
- [七、Markdown 扩展](#七markdown-扩展)
- [八、内置 JS 脚本](#八内置-js-脚本)
- [九、内置 CSS 模块](#九内置-css-模块)
- [十、站点级自定义覆盖](#十站点级自定义覆盖)

---

## 一、快速安装

```bash
cd your-hexo-site
git clone https://github.com/NashChennc/mdui2-blog.git themes/mdui2-blog
npm install hexo-wordcount hexo-renderer-markdown-it --save
cd themes/mdui2-blog
npm install
```

在站点根目录 `_config.yml` 中启用：

```yaml
theme: mdui2-blog
```

---

## 二、配置体系说明

配置优先级（由高到低）：

| 优先级 | 来源 | 说明 |
|--------|------|------|
| 1 | `site.data` | 仅首页/分类页文案：站点 `source/_data` 中的 Markdown/HTML |
| 2 | `theme.xxx` | 主题 `_config.yml` |
| 3 | `config.xxx` | 站点 `_config.yml` |
| 4 | `__('key')` | i18n 多语言文本 |
| 5 | 硬编码默认值 | 模板内的兜底值 |

**常见可跨级使用的字段**：`title`、`subtitle`、`author`、`google_analytics` 等同时在主题和站点配置中生效，主题优先。`site.data` 的最高优先级只适用于首页和分类页内容。

---

## 三、站点级配置 `_config.yml`

以下字段是站点根 `_config.yml` 中与主题相关的配置：

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | String | 站点标题，显示于浏览器标签页和顶栏 |
| `subtitle` | String | 站点副标题，Banner 无自定义文案时回退显示 |
| `author` | String | 作者名，显示在页脚版权行 |
| `language` | String | 站点语言，如 `cn`（对应 `zh-CN.yml`） |
| `url` | String | 站点 URL，如 `https://example.github.io` |
| `theme` | String | 设为 `mdui2-blog` |
| `google_analytics` | String | Google Tag ID，如 `G-XXXXXXXXXX`。主题配置空时回退到此 |
| `search.path` | String | 搜索索引路径，默认 `search.json`（需配合 `hexo-generator-searchdb`） |
| `mermaid.enable` | Boolean | 是否启用 Mermaid 图表（`layout.ejs` 读取此字段） |
| `auto_category.enable` | Boolean | 是否启用自动分类（`hexo-auto-category` 插件） |

---

## 四、主题级配置 `_config.yml`

配置文件位置：`themes/mdui2-blog/_config.yml`

### 4.1 Banner（顶部横幅）

控制首页全屏 Hero Banner 和内页顶部横幅。

```yaml
banner:
  hero:
    enable: false        # 首页全屏 Hero Banner 开关
  post:
    enable: false        # 文章/分类页顶部横幅开关
  image: /image/banner.jpeg  # Banner 背景图路径（当本地目录无图时的兜底）
```

**首页多行标题** `title_index_rows`（仅当 `hero.enable: true` 时生效）：

```yaml
  title_index_rows:
    -
      - { upper: "NOUS SOMMES", lower: "我们是" }
      - { upper: "DES ENFANTS", lower: "孩子"}
      - { lower: "，" }
    -
      - { upper: "MAIS", lower: "但" }
      - { upper: "DES ENFANTS", lower: "我们" }
      - { lower: "，" }
```

每行为一个数组，每项一个「列」，`upper` 为小字（上方），`lower` 为大字（下方）。无 `upper` 或 `lower` 则不渲染对应行。留空则回退到 `config.title`。

**内页横幅标题** `title_inner_columns`：

```yaml
  title_inner_columns:
    - { upper: "NOUS SOMMES", lower: "我们是" }
    - { upper: "DES ENFANTS", lower: "孩子"}
    - { lower: "，" }
```

与首页语义一致，但以单行横向排列。留空则回退到 `config.title`。

**副标题** `subtitle_block`：

```yaml
  subtitle_block:
    cite_upper: "ÉVARISTE GALOIS (1811-1832)"
    cite_lower: "埃瓦里斯特 · 伽罗瓦"
    aside: "，1831年 于巴黎政治审判庭上的辩护"
```

- `cite_upper`：引文上排（原文/法语）
- `cite_lower`：引文下排（中文/翻译）
- `aside`：旁注说明文字

任一字段为空时不渲染对应部分；全部为空则回退到 `config.subtitle`。

---

### 4.2 顶栏头像 (sidebar_config)

```yaml
sidebar_config:
  avatar: /image/avatar.jpeg  # 头像图片路径，建议正方形
```

点击头像跳转到 `/about`。未设置则显示 Material Icons 的 `person` 图标。

---

### 4.3 分类索引页 (category_page)

控制 `categories/:name/` 页面的展示（数字花园式卡片网格）。

分类页文案存放在站点内容目录中，文件名必须与文章 front-matter 的分类名完全一致：

```markdown
<!-- source/_data/categories/笔记.md -->
# 笔记 Notes

记录我尚未完全理解的事物。
```

也可以改用同名 HTML 文件：

```html
<!-- source/_data/categories/笔记.html -->
<h1>笔记 Notes</h1>
<p>记录我尚未完全理解的事物。</p>
```

第一个一级标题作为页面标题，剩余内容放入现有 `.notes-subtitle` 区域。不要同时保留同名的 `.md` 和 `.html` 文件。

以下主题配置仅在对应内容文件不存在时作为兼容回退：

```yaml
category_page:
  lede: ""   # 全站分类页默认副标题；留空则尝试 i18n category_page_default_lede

  by_category:     # 按分类名覆盖
    笔记:
      class_name: 笔记  Notes            # 页面主标题（<h1>）
      class_description: 记录我尚未完全理解的事物。  # 副标题说明
    散文:
      class_name: 散文  Essays
      class_description: 只是一些散落的文字。
```

- `class_name`：不填则用 Hexo 分类名 `page.category`
- `class_description`：不填则回退到 `lede` → i18n
- 键名必须与文章 front-matter `categories` 完全一致

---

### 4.4 KaTeX 数学公式

```yaml
katex:
  enable: true
```

主题通过客户端渲染注入 KaTeX。设为 `false` 可全站关闭以减小前端体积。

分隔符支持：`$$...$$`（块级）、`$...$`（行内）、`\(...\)`、`\[...\]`。

---

### 4.5 社交链接 (social)

同时显示于顶栏头像旁（hover 展开）和页脚。

```yaml
social:
  github:
    text: "NashChennc"                          # 显示文字（hover tooltip）
    link: "https://github.com/nashchennc"       # 链接
    icon: fa-brands fa-github                   # Font Awesome class
    color: mdui-text-color-black                # MDUI 文字颜色 class
  bilibili:
    text: "哔哩哔哩"
    link: "https://space.bilibili.com/1574355304"
    icon: fa-brands fa-bilibili
    color: mdui-text-color-pink
  email:
    text: "example@gmail.com"
    link: "mailto:example@gmail.com"
    icon: fa-solid fa-envelope
    color: mdui-text-color-blue
```

- `link` 支持 `https://`、`http://`、`mailto:`、`tel:` 和站内相对路径
- `icon` 使用 Font Awesome 6 class，会经过安全过滤
- `color` 使用 MDUI 文字颜色 utility class，会经过安全过滤
- 键名（如 `github`、`bilibili`）可自定义，无特殊含义

---

### 4.6 页脚 (footer)

```yaml
footer:
  show_social: true                    # 是否显示社交图标行
  social_intro: "无聊死了。来找我聊会天。"  # 社交图标上方短句，不填则用 i18n footer_social_intro
  nav:                                 # 页脚导航链接
    - { i18n: home, path: "/" }
    - { i18n: archive_a, path: "/archives" }
    - { i18n: files, path: "/files" }
    - { i18n: about, path: "/about" }
```

- `nav` 中每项的 `i18n` 对应 `languages/*.yml` 中的键，`text` 可直接写死文案（任意语言）
- `path` 必填

---

### 4.7 首页主体区 (index_page)

Hero 下方的主内容区，位于分类/标签芯片上方：

```markdown
<!-- source/_data/home.md -->
# 生猛活海鲜大排档

这是什么？白河豚？一刀剁了。

这里主要用来堆放我的 [笔记](/categories/笔记/)。
```

也可以写成 `source/_data/home.html`。第一个一级标题作为 `.notes-title`，其余 Markdown/HTML 放入 `.notes-subtitle`；每个 Markdown 段落沿用原来的多行间距。

`index_page.title` 和 `index_page.lede` 仅在 `home.md` / `home.html` 都不存在时作为兼容回退；之后再回退到 `config.title` 和 i18n。

---

### 4.8 首页分类·标签芯片 (index_taxonomy)

```yaml
index_taxonomy:
  tags_visible_initial: 8   # 标签超过此数量时折叠，点「展开」显示其余；0 = 始终全部展示
```

分类芯片始终全量展示（按文章数量排序）。标签芯片仅统计当前页 `page.posts` 范围内的标签。

---

### 4.9 活动热力图 (activity_heatmap)

GitHub 风格的文章活跃度热力图，显示于归档页、分类页、标签页。

```yaml
activity_heatmap:
  enable: true             # 是否启用
  detail_window_days: 7    # 点击某天时，详情面板显示前后 N 天的文章列表
```

**加载位置**：
- 归档页 (`/archives`)：统计全站文章
- 分类页 (`/categories/:name/`)：统计该分类文章
- 标签页 (`/tags/:name/`)：统计该标签文章

---

### 4.10 分析工具 (google_analytics)

```yaml
google_analytics:           # 为空时不注入；填写 G-XXXXXXXXXX 后启用 Google Tag
gauges_analytics:           # Gauges 分析（未实现）
```

**推荐做法**：在站点根 `_config.yml` 中设置，避免主题更新时丢失：

```yaml
# 站点 _config.yml
google_analytics: G-LV49J0P7YC
```

主题 `layout.ejs` 的读取逻辑为 `theme.google_analytics || config.google_analytics`，两边都可以。

---

### 4.11 其他配置项

```yaml
rss: /atom.xml                    # RSS 订阅链接
favicon: /favicon.png             # 网站图标路径
theme_color: '#6495ED'            # 浏览器 UI 主题色（meta theme-color），矢车菊 #6495ED
```

- `theme_color`：同时影响 MDUI 2 组件主题色（通过 `mdui.setColorScheme` 设置）
- 替换建议：桔梗 `#5654A2` / 饱和 `#433BCC` / `#4B00FF`

---

### 4.12 Hexo 内置 / 兼容配置

以下配置项保留用于兼容性，部分在当前主题中未实际使用：

**菜单** `menu`（当前未在 topbar 中使用，顶栏菜单由分类动态生成）：

```yaml
menu:
  Home: /
  Categories: /categories
  Archives: /archives
  About: /about
```

**内容**：

```yaml
fancybox: true   # 灯箱（未在当前版本使用）
```

**侧边栏**（未使用）：

```yaml
sidebar: right
widgets:
#- category
#- tag
```

**字数统计**：

```yaml
symbols_count_time:
  separated_meta: true
  item_text_post: true
  item_text_total: false
  awl: 2
  wpm: 275
```

**索引生成器**：

```yaml
index_generator:
  path: ''
  per_page: 10
  order_by: -updated
```

**Markdown 渲染器**：

```yaml
markdown:
  render:
    html: true
    xhtmlOut: false
    breaks: true
    linkify: true
    typographer: true
  plugins:
    - markdown-it-anchor
    - markdown-it-toc-done-right
  anchors:
    level: 1           # 从 H1 开始生成锚点 ID
    collisionSuffix: ''
    permalink: false
```

---

## 五、多语言 (i18n)

语言文件位于 `themes/mdui2-blog/languages/`。

**已支持语言**：

| 文件 | 语言 |
|------|------|
| `zh-CN.yml` | 简体中文 |
| `zh-TW.yml` | 繁體中文 |
| `default.yml` | English |
| `de.yml` | Deutsch |
| `es.yml` | Español |
| `fr.yml` | Français |
| `ja.yml` | 日本語 |
| `ko.yml` | 한국어 |
| `nl.yml` | Nederlands |
| `no.yml` | Norsk |
| `pt.yml` | Português |
| `ru.yml` | Русский |

**站点语言设置**（站点 `_config.yml`）：

```yaml
language: cn   # 对应 zh-CN.yml
```

**可覆盖的 i18n 键**（部分常用）：

| 键 | 中文 (zh-CN) | 说明 |
|---|---|---|
| `home` | 首页 | 导航文字 |
| `about` | 关于 | 导航文字 |
| `archive_a` | 归档 | 导航文字 |
| `search` | 搜索 | 搜索按钮 aria-label |
| `search_placeholder` | 搜索文章… | 搜索框占位文字 |
| `search_no_results` | 没有匹配的文章 | 搜索无结果 |
| `toc` | 目录 | 文章目录 |
| `post_backlinks_title` | 这篇文章被哪篇引用 | 反向链接区块标题 |
| `prev_post` / `next_post` | 上一篇 / 下一篇 | 文章导航 |
| `footer_social_intro` | 无聊死了。来找我聊会天。 | 页脚社交区默认文案 |
| `category_card_kind` | 笔记 | 卡片上无标签时的兜底标签文字 |
| `min_read` | 分钟阅读 | 阅读时长单位 |
| `theme_toggle_to_dark` | 切换到深色模式 | |
| `theme_toggle_to_light` | 切换到浅色模式 | |
| `theme_toggle_follow_system` | 使用系统主题 | |

---

## 六、文章 Front-matter

每篇 Markdown 文章支持的 front-matter 变量：

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | String | 文章标题 |
| `blog_title` | String | **博客展示标题**（优先级高于 `title`，用于 SEO 标题与展示标题分离） |
| `date` | Date | 发布日期 |
| `updated` | Date | 更新日期（卡片和文章页均显示此日期） |
| `categories` | String/Array | 分类 |
| `tags` | String/Array | 标签 |
| `description` | String | 文章摘要（卡片上优先使用） |
| `banner` | String | 文章封面图 URL（优先级最高） |
| `photos` | Array | 封面图备选（优先级第二） |
| `toc` | Boolean | 设为 `false` 可隐藏文章目录 |
| `cover` | String | 封面图（同 banner，兼容字段） |

**封面图优先级**：`banner` > `photos[0]` > 正文首图 > 本地 banner 目录哈希选图

---

## 七、Markdown 扩展

### Wiki Links

主题内置 `[[...]]` 和 `![[...]]` 语法支持（Obsidian/Foam 风格），通过 `scripts/wikilink/` 实现。

```markdown
[[目标文章]]              # 内部链接
[[目标文章|显示文字]]      # 带别名链接
![[image.png|图片说明]]    # 嵌入图片
```

**反向链接**：文章底部自动显示引用了当前文章的其他文章列表。

### 文件列表标签

```markdown
{% list_files files %}
```

列出 `source/` 下的一层目录名，输出链接会做 URL 编码并加上 `rel="noopener noreferrer"`。仅允许列出 `source/` 一级子目录。

---

## 八、内置 JS 脚本

所有脚本位于 `themes/mdui2-blog/source/js/`：

| 文件 | 功能 | 加载方式 |
|------|------|----------|
| `site-navigation.js` | 站点导航交互（drawer、滚动） | defer |
| `note-card-layout.js` | 卡片网格布局自适应 | defer |
| `theme-toggle.js` | 亮/暗/自动主题切换（localStorage 持久化） | defer |
| `site-search.js` | 搜索面板（Ctrl+K / Meta+K 唤起） | defer |
| `motion-scroll-reveal.js` | 滚动渐入动画 | defer |
| `post-toc-scrollspy.js` | 文章目录滚动监听 + 进度条 | defer |
| `index-taxonomy-tags.js` | 标签芯片折叠/展开交互 | defer |
| `activity-heatmap.js` | GitHub 风格活跃度热力图 | defer |
| `banner-title-layout.js` | 内页 Banner 标题自适应排版 | defer（仅 banner 页） |
| `mermaid-theme.js` | Mermaid 图表亮/暗主题同步 | defer（仅当 mermaid 启用） |

### 需要配合的插件

| npm 包 | 用途 |
|--------|------|
| `hexo-wordcount` | 字数统计 + 阅读时间（`min2read` helper） |
| `hexo-renderer-markdown-it` | Markdown 渲染 |
| `hexo-generator-searchdb` | 生成 `search.json` 搜索索引 |
| `hexo-auto-category` | 根据目录结构自动设置分类 |
| `hexo-filter-mermaid-diagrams` | Mermaid 图表预处理 |

---

## 九、内置 CSS 模块

所有样式位于 `themes/mdui2-blog/source/css/`：

| 文件 | 功能 |
|------|------|
| `tokens.css` | CSS 自定义属性（颜色、间距、圆角、阴影等设计令牌） |
| `global-layout.css` | 全局布局（页面容器、网格系统） |
| `topbar.css` | 顶栏样式 |
| `motion-scroll-reveal.css` | 滚动渐入动画样式 |
| `lists-cards.css` | 文章卡片网格样式 |
| `categories-postinfo.css` | 分类/文章元信息样式 |
| `footer.css` | 页脚样式 |
| `article-prose.css` | 文章正文排版（mdui-prose 扩展） |
| `index-taxonomy.css` | 分类/标签芯片样式 |
| `activity-heatmap.css` | 活跃度热力图样式 |
| `site-search.css` | 搜索面板样式 |
| `hero.css` | 首页全屏 Hero Banner（仅 `hero.enable` 时加载） |
| `banner-page.css` | 内页横幅样式（仅 `hero.enable` 或 `post.enable` 时加载） |
| `custom.css` | **用户自定义样式入口**（最后加载，可覆盖一切） |

---

## 十、站点级自定义覆盖

可在站点 `source/` 目录下放置同名文件覆盖主题资源：

| 路径 | 用途 |
|------|------|
| `source/css/custom.css` | 用户自定义样式（已在 layout 中最后加载） |
| `source/js/banner-title-layout.json` | 覆盖 Banner 标题排版参数 |
| `source/image/avatar.jpeg` | 覆盖头像（如果主题配置指向此路径） |
| `source/image/banner.jpeg` | 覆盖 Banner 背景图 |
| `source/image/banner/*` | 本地 Banner 图库（首页封面图哈希选取的来源） |
| `source/favicon.png` | 网站图标 |

站点 `scripts/` 目录下的 JS 文件会被 Hexo 自动加载，可用于注册额外的 Helper/Filter/Tag。
