# engineerbetter-hugo

The EngineerBetter website, which is built for the [Hugo static site generator](https://gohugo.io/).

CI: https://ci.engineerbetter.com/teams/main/pipelines/engineerbetter-hugo

## Running locally

```terminal
hugo serve -FD
```

Where `-F` builds and serves stuff built in the future, and `-D` builds and serves posts marked as drafts.

## CSS

We don't generate CSS as part of the Hugo build process, as it needs to be done _prior_ to this when running the site locally for development.

1. Ensure you have Gulp installed: `npm install gulp`
1. Make changes to `src/scss` **and _never_** `static/css`, as the latter is generated from the former
1. `gulp sass`
1. Verify that the changes work
1. Commit the changes
