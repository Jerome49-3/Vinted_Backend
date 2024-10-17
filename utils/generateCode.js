const generateCode = (length) => {
  let code = "";
  for (let i = 0; i < length; i++) {
    // console.log("i on generateCode:", i);
    code = code + Math.floor(Math.random() * 10);
  }
  return code;
};
module.exports = generateCode;
