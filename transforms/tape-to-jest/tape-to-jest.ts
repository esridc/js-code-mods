import { ExpressionKind } from "ast-types/gen/kinds";
import {
  FunctionExpression,
  Identifier,
  SpreadElement,
  Transform,
} from "jscodeshift";
import { getExpectationInfo } from "./utils/get-expectation-info";

const transform: Transform = (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const testExprs = root.find(j.CallExpression, {
    callee: {
      name: "test",
    },
  });

  const createExpectStatement = (args: (ExpressionKind | SpreadElement)[]) =>
    j.callExpression(j.identifier("expect"), args);

  const createExpectCall = (
    expectArgs: (ExpressionKind | SpreadElement)[],
    expectationName: string,
    expectationArgs: (ExpressionKind | SpreadElement)[],
    negated: boolean
  ) => {
    const innerExpr = negated
      ? j.memberExpression(
          createExpectStatement(expectArgs),
          j.identifier("not")
        )
      : createExpectStatement(expectArgs);

    const fullMemberExpr = j.memberExpression(
      innerExpr,
      j.identifier(expectationName)
    );

    return j.callExpression(fullMemberExpr, expectationArgs);
  };

  testExprs.forEach((path) => {
    (path.value.callee as Identifier).name = "it"; // change "test" to "it"

    const assertObjectName = ((path.value.arguments[1] as FunctionExpression).params[0] as Identifier).name;

    (path.value.arguments[1] as FunctionExpression).params = []; // no longer pass in assertion object

    const asserts = j(path).find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: assertObjectName },
      },
    });

    asserts.forEach((assertExpr) => {
      const args = assertExpr.value.arguments;
      const info = getExpectationInfo(assertExpr);
      if (info === null) {
        assertExpr.prune();
        return;
      }
      assertExpr.replace(createExpectCall([args[0]], info.name, info.args, info.negated));
    });
  });

  return root.toSource();
};

export default transform;