test('does a thing', function (t) {
  t.plan(4);

  t.equals(something, expected, 'Some failure message');

  t.equal(something, expected, 'Some failure message');

  t.notEqual(something, expected, 'Some failure message');

  t.deepEquals(something, expected, 'Some failure message');

  t.deepEqual(something, expected, 'Some failure message');

  t.isEquivalent(something, expected, 'Some failure message');

  t.strictEqual(something, expected, 'Some failure message');

  t.ok(something, 'Some failure message');

  t.notOk(something, 'Some failure message');

  t.end();
});