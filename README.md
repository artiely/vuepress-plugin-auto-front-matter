# vuepress-plugin-auto-front-matter


自动生成部分重复性的Front Matter。

```
----
author:
title:
date:
summary:
location:
----
```

## Installation

```bash
yarn add -D vuepress-plugin-auto-front-matter
// or npm install vuepress-plugin-auto-front-matter -D

```

## Usage

```js
// .vuepress/config.js

module.exports = {
    plugins: [
      ['auto-front-matter'],
      // other plugins
    ]
}

// or
module.exports = {
    plugins: [
      ['auto-front-matter',{
        author: 'Artiely' // 默认的全局作者
        summary: '详情请查看', // 默认的全局说明
        summaryLength: 200  // 说明的长度
        location: 'Wuhan,China' // 默认的全局地址
      }],
      // other plugins
    ]
}
```
