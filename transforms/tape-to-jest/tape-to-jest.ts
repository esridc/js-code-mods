import { ExpressionKind } from "ast-types/gen/kinds";
import {
  ASTPath,
  CallExpression,
  FunctionExpression,
  Identifier,
  MemberExpression,
  SpreadElement,
  Transform,
} from "jscodeshift";

const transform: Transform = (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const testExprs = root.find(j.CallExpression, {
    callee: {
      name: "test",
    },
  });

  testExprs.forEach((path) => {
    (path.value.callee as Identifier).name = "it";
    (path.value.arguments[1] as FunctionExpression).params = []; // no longer passing in "assert"
  });

  const asserts = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: { type: "Identifier", name: "t" },
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

  interface ExpectationInfo {
    /**
     * The expect function name.
     * E.g. "toBe"
     */
    name: string;
    /**
     * Arguments to be passed to the expected member.
     * E.g. toBe(...info.args)
     */
    args: (ExpressionKind | SpreadElement)[];
    /**
     * Whether to negate the expect statement.
     */
    negated: boolean;
  }

  const getExpectationInfo = (path: ASTPath<CallExpression>) => {
    let ret: ExpectationInfo;
    const args = path.value.arguments;
    const assertionFnName = (
      (path.value.callee as MemberExpression).property as Identifier
    ).name;
    switch (assertionFnName) {
      case "equals":
        ret = {
          name: "toBe",
          args: [args[1]],
          negated: false,
        };
        break;
      case "equal":
        ret = {
          name: "toBe",
          args: [args[1]],
          negated: false,
        };
        break;
      case "notEqual":
        ret = {
          name: "toBe",
          args: [args[1]],
          negated: true,
        };
        break;
      case "deepEquals":
        ret = {
          name: "toEqual",
          args: [args[1]],
          negated: false,
        };
        break;
      case "deepEqual":
        ret = {
          name: "toEqual",
          args: [args[1]],
          negated: false,
        };
        break;
      case "isEquivalent":
        ret = {
          name: "toEqual",
          args: [args[1]],
          negated: false,
        };
        break;
      case "strictEqual":
        ret = {
          name: "toStrictEqual",
          args: [args[1]],
          negated: false,
        };
        break;
      case "ok":
        ret = {
          name: "toBeTruthy",
          args: [],
          negated: false,
        };
        break;
      case "notOk":
        ret = {
          name: "toBeFalsy",
          args: [],
          negated: false,
        };
        break;
      case "fail":
        ret = {
          name: "fail",
          args: [],
          negated: false,
        };
        break;
      case "end":
        ret = null;
        break;
      case "plan":
        ret = null;
        break;
      default:
        throw new Error("Unrecognized assertion: " + assertionFnName);
    }
    return ret;
  };

  asserts.forEach((assertExpr) => {
    const args = assertExpr.value.arguments;
    const info = getExpectationInfo(assertExpr);
    if (info === null) {
      assertExpr.prune();
      return;
    }
    assertExpr.replace(createExpectCall([args[0]], info.name, info.args, info.negated));
  });

  return root.toSource();
};

export default transform;