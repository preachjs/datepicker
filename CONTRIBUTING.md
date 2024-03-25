# Contribution Notes

## Basics

1. This packages ships it's source as is. There's no transpilation of the JSX, nor is there a build step for the final package.
2. To develop and test, use the `example` that's in place as your playground
3. Any changes made to the `example` need to go through the `e2e` tests again or simply put, if you change the example, sync the tests for the same.

## Development

1. You'll need `node>=18` to be able to run the example.

## PR Stratergy

1. We Squash the changes so don't worry so much about the commit messages on your branch.
2. Make sure the PR themselves are very focused and not trying to change a wider scope of the project
