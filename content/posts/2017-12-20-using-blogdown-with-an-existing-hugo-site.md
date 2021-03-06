---
title: Using blogdown with an existing Hugo site
authors: steph
date: '2017-12-20'
slug: using-blogdown-with-an-existing-hugo-site
categories:
  - R
  - Misc Technology
  - Community
tags:
  - blogging
  - hugo
  - blogdown
  - blog
---

If you decide you want to use R in your existing Hugo blog, it's really
easy to convert over. There's a single command you need to know from
blogdown and the rest is working out your deployment process.

To create content, use the blogdown Rstudio add-in to quickly get
started. This niftily reads all tags and categories from past posts to
help you get going.

![](../img/usingblogdownaddin.jpg)

You can then write Rmarkdown as usual. The workflow differs in that,
instead of hitting the Knit button or using `rmarkdown::render()`, you
use `blogdown::build_site()` instead.

``` {.r}
blogdown::build_site()
```

This will process all your `.Rmd` and `.md` files and run the `hugo`
command. This works *in place* of `hugo` so you will need to alter your
deployment process to just pick up from the `public/` directory instead
of running Hugo.

You can then publish the content from the `public/` directory.

Converting your existing Hugo site to `blogdown` is actually super
simple - it's literally one command, `blogdown::build_site()`. The bit
that will take some work is changing your deployment workflow.

Using `blogdown` in a CI/CD environment
---------------------------------------

If you want to use some sort of automated build, you can use
[travis](https://travis-ci.org) to run the `build_site()` and commit
changes the `public/` dir changes. If you do this, don't forget to
include `[ci skip]` at the beginning of your commit message to avoid an
infinite loop of builds.

Once you have the files automatically building, you can then deploy
using something like [netlify](https://netlify.com) and simply remove
the build command as it'll only need to retrieve the content from the
`public/` directory.

Check out how [this project does
it](https://github.com/lockedatapublished/blog) for an approach that
updates the GitHub repo, or check out [Yihui's
example](https://github.com/yihui/travis-blogdown) for a direct GitHub
Pages deployment approach.
