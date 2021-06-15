const VALIDATOR_TYPE_REQUIRE = "REQUIRE";
const VALIDATOR_TYPE_MINLENGTH = "MINLENGTH";
const VALIDATOR_TYPE_MAXLENGTH = "MAXLENGTH";
const VALIDATOR_TYPE_MIN = "MIN";
const VALIDATOR_TYPE_MAX = "MAX";
const VALIDATOR_TYPE_EMAIL = "EMAIL";
const VALIDATOR_TYPE_FILE = "FILE";
const VALIDATOR_TYPE_SAMEVALUE = "SAMEVALUE";
const VALIDATOR_TYPE_ISNUMBER = "ISNUMBER";
const VALIDATOR_TYPE_PHONE = "PHONE";
const VALIDATOR_TYPE_HOUR = "HOUR";
const VALIDATOR_TYPE_OLD_MAIL = "OLDMAIL";

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val,
});
export const VALIDATOR_MAXLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val,
});
export const VALIDATOR_MIN = (val) => ({ type: VALIDATOR_TYPE_MIN, val: val });
export const VALIDATOR_MAX = (val) => ({ type: VALIDATOR_TYPE_MAX, val: val });
export const VALIDATOR_SAMEVALUE = (val) => ({
  type: VALIDATOR_TYPE_SAMEVALUE,
  val: val,
});
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });
export const VALIDATOR_ISNUMBER = () => ({ type: VALIDATOR_TYPE_ISNUMBER });
export const VALIDATOR_PHONE = () => ({ type: VALIDATOR_TYPE_PHONE });
export const VALIDATOR_HOUR = () => ({ type: VALIDATOR_TYPE_HOUR });
export const VALIDATOR_OLD_EMAIL = (val) => ({
  type: VALIDATOR_TYPE_OLD_MAIL,
  val: val,
});

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_SAMEVALUE) {
      isValid = isValid && value.localeCompare(validator.val) === 0;
    }
    if (validator.type === VALIDATOR_TYPE_ISNUMBER) {
      let a = Number.isInteger(Number(value)) && Number(value) > 0;
      isValid = isValid && a;
    }
    if (validator.type === VALIDATOR_TYPE_PHONE) {
      let regex =
        /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/;
      isValid = isValid && regex.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_HOUR) {
      let regex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
      isValid = isValid && regex.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_OLD_MAIL) {
      console.log(value);
      console.log(validator.val);
      isValid = isValid && value.localeCompare(validator.val) === 0;
    }
  }
  return isValid;
};
