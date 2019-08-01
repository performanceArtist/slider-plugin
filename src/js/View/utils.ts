export function createNode(
  type: string,
  attributes: { [key: string]: string } = {},
) {
  const node = document.createElement(type);

  Object.keys(attributes).forEach(key => {
    node.setAttribute(key, attributes[key]);
  });

  return node;
}
