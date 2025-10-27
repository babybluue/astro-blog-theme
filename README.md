# astro blog

![Index](/src/data/images/c3009907.png)
![Lighthouse](/lighthouse.png)

## How to create a new post with abbrlink

`create.cjs` file will help to create a new post with params title and dir, the dir default is drafts.

```bash
 yarn run new --title='title-test'
```

The command will generate a markdown file under _src/data_ directory, and the markdown file content will look like this:

```yaml
---
title: title-test
date: 2024-04-18T02:50:36.418Z
abbrlink: 21cdefe2
---
```
