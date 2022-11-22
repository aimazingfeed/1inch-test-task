export const validateOnlyNumbers = (value: string, isDateValidation: boolean, decimals = 2) => {
  if (isDateValidation) {
    if (!value.match(/^(19|20)\d\d[.](0[1-9]|1[012])[.](0[1-9]|[12][0-9]|3[01])$/)) {
      return false;
    }
    return true;
  }
  if (decimals === 0) {
    if (!value.match(/^(\d{1,18})?$|^$/)) {
      return false;
    }
    return true;
  }
  const regExp = /^(\d{1,3})+(\.)?(\d{1,2})?$|^$/.source.replace('\\d{1,2}', `\\d{1,${decimals}}`);
  if (!value.match(regExp) || value === '00') {
    return false;
  }

  return true;
};
