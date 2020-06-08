export const mapJsonIntoFields = jsonToParse => {
  const resultObject = {};
  const mustUseRecursion = ['array', 'object'];

  Object.keys(jsonToParse).forEach(key => {
    const theProperty = jsonToParse[key];
    if (!theProperty) return;
    const theType = Array.isArray(theProperty)
      ? 'array'
      : typeof jsonToParse[key];

    if (mustUseRecursion.includes(theType)) {
      const recursiveResult = mapJsonIntoFields(theProperty);
      resultObject[key] = {
        type: theType,
        value:
          theType === 'array'
            ? Object.keys(recursiveResult).map(key => recursiveResult[key])
            : recursiveResult,
      };
    } else {
      resultObject[key] = {
        type: theType,
        value: theProperty,
      };
    }
  });

  return resultObject;
};
