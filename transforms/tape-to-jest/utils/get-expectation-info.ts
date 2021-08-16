import { ExpressionKind } from "ast-types/gen/kinds";
import {
  ASTPath,
  CallExpression,
  Identifier,
  MemberExpression,
  SpreadElement,
} from "jscodeshift";

export function getExpectationInfo (path: ASTPath<CallExpression>) {
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