const lib = require('./lib');
let data;

// Lambda function index.handler - thin wrapper around lib.authenticate
module.exports.handler = async (event, context, callback) => {
  console.log(" main handler event>>",event);
  console.log(" main handler  context>>",context);

  var token=event.headers.Authorization;
  console.log("Token >>",token);

  try {
    data = await lib.authenticate(event);
  }
  catch (err) {
      console.log(err);
      return context.fail("Unauthorized");
  }
  return data;
};
