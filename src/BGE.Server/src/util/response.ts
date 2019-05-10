const response = (code, result) => {
  return {
    code,
    result,
  };
};

const ok = result => {
  return response(200, result);
};

const error = result => {
  return response(400, result);
};

export { ok, error, response };
