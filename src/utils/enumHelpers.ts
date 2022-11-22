export const getEnumKeyByValue = (enumObject, searchValue) =>
  Object.keys(enumObject)[Object.values(enumObject).indexOf(searchValue)];
