function sanitize(string) {
  let result = '';
  for (let i = 0; i < string.length; i++) {
    if (string[i] === 'S') {
      result += string[i] + string[i];
    } else {
      result += string[i];
    }
  }
  return result;
}

function desanitize(string) {
  let result = '';
  let addNext = true;
  for (let i = 0; i < string.length; i++) {
    if (addNext) {
      result += string[i];
      if (string[i] === 'S') {
        addNext = false;
      }
    } else {
      addNext = true;
    }
  }
  return result;
}

export { desanitize,sanitize };
