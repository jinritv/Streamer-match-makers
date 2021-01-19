// Utility function which happened commonly in other parts of code

function keyCount(obj) {
  if (!obj) {
    return 0;
  }
  return Object.keys(obj).length;
}

function isNotEmpty(obj) {
  return keyCount(obj) > 0;
}

module.exports = { keyCount, isNotEmpty };
