# engineerbetter-hugo

The EngineerBetter website, which is built for the [Hugo static site generator](https://gohugo.io/).

CI: https://ci.engineerbetter.com/teams/main/pipelines/engineerbetter-hugo

## Running locally

At the time of writing, you'll need an _ancient_ [version of Hugo(v0.32.2)](https://github.com/gohugoio/hugo/releases/tag/v0.32.2). If you have a more contemporary version already installed, we recommend renaming the old one `hugold` (see what we did there?).

```terminal
hugo serve -FD
```

Where `-F` builds and serves stuff built in the future, and `-D` builds and serves posts marked as drafts.

## CSS

The CSS is a mess. It used to be manually dynamically generated from SCSS, but at some point the tooling stopped working with modern MacOS/Node. Hence changes have been made directly to the generated CSS files, which would normally be a bad idea.
