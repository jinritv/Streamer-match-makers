const { isNotEmpty } = require("../util/objectutil");

/**
 * Schema for the intermediate JSON objects between business logic and ORM.
 * Each data field has the following properties
 * 1. DB column name as key (i.g. "user_name", "display_name", "is_partner", etc)
 * 2. required: if this field is required for validation. Validation throws error
 *    if required is true and value for that field is missing. Default to false.
 * 3. defaultValue: Default value of the field if missing in input JSON
 * 4. converter: converter function to validate input and convert to DB-friendly value.
 *    Type conversion can also occur (i.g. "true" -> true)
 *
 * TODO: The default values for empty fields were randomly set and need to be re-examined.
 **/
const dataFields = {
  // streamers table
  user_name: {
    required: true,
    converter: usernameConverter,
  },
  nickname: {
    required: false,
    defaultValue: null,
    converter: identity,
  },
  is_partner: {
    required: false,
    defaultValue: null,
    converter: booleanConverter,
  },
  is_fulltime: {
    defaultValue: null,
    converter: booleanConverter,
  },
  uses_cam: {
    defaultValue: true,
    converter: usesCamConverter,
  },
  mature_stream: {
    defaultValue: false,
    converter: booleanConverter,
  },
  logo: {
    defaultValue: null,
    converter: identity,
  },
  description: {
    defaultValue: null,
    converter: identity,
  },
  // streamers_stats table
  followers: {
    defaultValue: 5000,
    converter: nonNegativeIntegerConverter,
  },
  avg_viewers: {
    defaultValue: 5000,
    converter: nonNegativeIntegerConverter,
  },
  avg_stream_duration: {
    defaultValue: null,
    converter: nonNegativeIntegerConverter,
  },
  avg_start_time: {
    defaultValue: null,
    converter: identity,
  },
  stream_start_date: {
    defaultValue: null,
    converter: identity,
  },
  streams_per_week: {
    defaultValue: null,
    converter: nonNegativeIntegerConverter,
  },
  chat_mode: {
    defaultValue: null,
    converter: chatModeConverter,
  },
  // categories table
  categories: {
    defaultValue: [],
    converter: stringListConverter,
  },
  // languages table
  languages: {
    defaultValue: [],
    converter: stringListConverter,
  },
  // chatvibes table
  chat_vibes: {
    defaultValue: [],
    converter: vibeConverter,
  },
 
  // vibes table
  stream_vibes: {
    defaultValue: [],
    converter: vibeConverter,
  },
  /*{ // For future fields..
    name: "",
    dataType: dataTypes.,  // see dataTypes below
    required: , // true or false. Default to false if omitted
    defaultValue: null,  // default value if not present.
  },*/
};

// Names of fields only
const allFieldNames = new Set(Object.keys(dataFields));

// validata Data and returns [validated, error];
// validated is null if there is any error
// error is null if data is valid
function validateData(data) {
  const output = {};
  const errors = {};
  for (let [columnName, value] of Object.entries(data)) {
    // Ignore unrecognized column names.
    // They are probably unpublished values or notes in spreadsheet
    if (!allFieldNames.has(columnName)) {
      continue;
    }
    const columnProps = dataFields[columnName];
    try {
      const converted = convertColumnValue(
        columnName,
        value,
        columnProps.required,
        columnProps.defaultValue,
        columnProps.converter
      );
      output[columnName] = converted;
    } catch (error) {
      errors[columnName] = error.message;
    }
  }
  if (isNotEmpty(errors)) {
    // Return errors if there is any
    return [null, errors];
  }
  return [output, null];
}

function convertColumnValue(
  columnName,
  inputValue,
  required,
  defaultValue,
  converterFunc
) {
  // HACK: Converting all input values to string saves a lot of type checking in the future.
  const stringValue = String(inputValue).trim();

  if (inputValue === undefined || inputValue === null || stringValue === "") {
    // Check if a required field is missing
    if (required) {
      throw new Error(`Missing value for required column ${columnName}`);
    }
    return defaultValue;
  }

  // Convert the input value to DB-friendly value
  return converterFunc(stringValue);
}

// Return the same input string, except being trimmed
function identity(inputValue) {
  return inputValue.trim();
}

// Return sanitized and validated Twitch username
function usernameConverter(inputValue) {
  const value = inputValue.trim().toLowerCase();
  // Twitch username format. Only accepts alphanumeric and _, also between 4 and 25 characters
  if (/^[a-z0-9_]{4,25}$/.test(value)) {
    return value;
  }
  throw new Error(`'${inputValue}' is not in a valid Twitch username format`);
}

// Converter for non-negative integer column values
function nonNegativeIntegerConverter(inputValue) {
  // (Assume US locale) commas are used for separating groups of thousands.
  // Remove all commas before conversion
  const value = inputValue.replace(/,/g, "");
  const numValue = Number(value);
  if (!Number.isInteger(numValue)) {
    throw new Error(`'${inputValue}' cannot be converted to an integer`);
  }
  if (numValue < 0) {
    throw new Error(`'${inputValue}' is not a non-negative number`);
  }

  return numValue;
}

// Converter for boolean column values
function booleanConverter(inputValue) {
  const value = inputValue.toLowerCase();
  // Truthy values
  if (["1", "yes", "y", "true", "t"].includes(value)) {
    return true;
  }
  // Falsey values
  if (["0", "no", "n", "false", "f"].includes(value)) {
    return false;
  }
  // Other values are probably input errors
  throw new Error(`'${inputValue}' cannot be converted to a boolean value`);
}

// Special converter for uses_cam column
function usesCamConverter(inputValue) {
  // uses_cam column has special values "Cam" and "No Cam"
  const value = inputValue.toLowerCase();
  if (value === "cam") {
    return true;
  }
  if (value === "no cam") {
    return false;
  }
  // Otherwise, use standard boolean converter
  return booleanConverter(inputValue);
}

// Strings separated by comma , or slash /
// All splited tokens are trimmed and converted to lowercase.
// TODO: Check if it is really a good idea to convert to lowercase.
function stringListConverter(inputValue) {
  const tokens = inputValue.split(/[,\/]/);
  const output = [];
  for (let token of tokens) {
    const trimmed = token.toLowerCase().trim();
    if (trimmed) {
      // Skip empty tokens
      output.push(trimmed);
    }
  }
  return output;
}

function vibeConverter(inputValue) {
  const tokens = inputValue.split(/[,\/]/);
  const output = [];
  for (let token of tokens) {
    // capitalizing the first letter of the word (to match the values in the table, which are capitaized)
    const vibeName = token.charAt(0).toUpperCase() + token.slice(1);
    if (vibeName) {
      // Skip empty tokens
      output.push(vibeName);
    }
  }
  return output;
}

function chatModeConverter(inputValue){
  // chat_mode column has special values "Anyone", "Subscribers only" and "Followers only"

  const value = inputValue.toLowerCase();
  // we dont really need to convert it, so just return 
  return value;
}



module.exports = { validateData };
