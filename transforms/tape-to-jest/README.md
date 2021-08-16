# Tape-to-Jest

This mod takes tests written for the [Tape](https://github.com/substack/tape) framework and makes them compatible with [Jest](https://jestjs.io/).

Specificially it
- changes `test` to `it`
- removes the Tape-style assertion object parameter
- changes Tape assertions to Jest `expect` statements