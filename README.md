# engineerbetter-hugo

The EngineerBetter website, which is built for the [Hugo static site generator](https://gohugo.io/).

CI: https://ci.engineerbetter.com/teams/main/pipelines/engineerbetter-hugo

## Running locally

```terminal
hugo serve -FD
```

Where `-F` builds and serves stuff built in the future, and `-D` builds and serves posts marked as drafts.

## CSS

The CSS is a mess. It used to be manually dynamically generated from SCSS, but at some point the tooling stopped working with modern MacOS/Node. Hence changes have been made directly to the generated CSS files, which would normally be a bad idea.
