# engineerbetter-hugo

The EngineerBetter website.

CI: https://ci.engineerbetter.com/teams/main/pipelines/engineerbetter-hugo

## CSS

We don't generate CSS as part of the Hugo build process, as it needs to be done _prior_ to this when running the site locally for development.

1. Ensure you have Gulp installed: `npm install gulp`
1. Make changes to `src/scss` **and _never_** `static/css`, as the latter is generated from the former
1. `gulp sass`
1. Verify that the changes work
1. Commit the changes
