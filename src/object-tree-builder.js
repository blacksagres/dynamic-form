let tooManyTimes = 0;

export const mapObjectTreeFromProperty = (htmlField, currentTree) => {
  let tree = currentTree || '';

  while (!htmlField.dataset.root) {
    tooManyTimes++;
    if (tooManyTimes > 300) {
      throw new Error('no infinite allowed');
    }

    const fieldName = htmlField.dataset.fieldName;
    tree += fieldName !== undefined ? '.' + fieldName : '';
    return mapObjectTreeFromProperty(htmlField.parentNode, tree);
  }

  tooManyTimes = 0;
  return tree;
};