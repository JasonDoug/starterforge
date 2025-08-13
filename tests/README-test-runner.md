This project includes tests written for Node's built-in test runner (node:test).

To run the tests locally, use the following command:
  node --test

Notes:
- The tests under tests/setup.test.js validate the behavior of tests/setup.js.
- They do not introduce any external test dependencies.
- If your project uses Jest or Vitest, you can adapt the test imports accordingly.