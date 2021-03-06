const fieldsToValidate = [ 'game_index' ];
const mustUseRecursion = [ 'array', 'object' ];

export const mapJsonIntoFields = jsonToParse => {
  const resultObject = {};

  Object.keys(jsonToParse).forEach(key => {
    const theProperty = jsonToParse[key];

    // anything null won't be mapped, but an empty string is allowed to become a field
    if (!theProperty && theProperty !== '') return;

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
      // only the the deepest levels of the tree we must validate
      // since those will be the nodes that will become html fields

      resultObject[key] = {
        type: theType,
        value: theProperty,
        validateAs: fieldsToValidate.includes(key) ? [ 'required' ] : null,
      };
    }

    // console.log(resultObject);
  });

  return resultObject;
};
