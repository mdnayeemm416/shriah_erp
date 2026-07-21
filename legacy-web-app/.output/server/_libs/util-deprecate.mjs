import require$$0 from "node:util";
var node;
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node;
  hasRequiredNode = 1;
  node = require$$0.deprecate;
  return node;
}
export {
  requireNode as r
};
