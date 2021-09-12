

exports.main = async function(event: any, context: any,callback:any) {

  var token = event.headers.Authorization;

   switch (token) {
       case 'allow':
           callback(null, generatePolicy('user', 'Allow', event.methodArn));
           break;
       case 'deny':
           callback(null, generatePolicy('user', 'Deny', event.methodArn));
           break;
       case 'unauthorized':
           callback("Unauthorized");   // Return a 401 Unauthorized response
           break;
       default:
           callback("Error: Invalid token"); // Return a 500 Invalid token response
   }
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId: string, effect: string, resource: any) {
   var authResponse = {
    policyDocument:{},
    context:{},
    principalId:''
   };
   
   authResponse.principalId = principalId;
   if (effect && resource) {
       var policyDocument ={
       Version : '2012-10-17',
       Statement : [{
        Action : 'execute-api:Invoke',
        Effect : effect,
        Resource : resource,
       }],
       }
      
       
       
       authResponse.policyDocument = policyDocument;
   }
   

   authResponse.context = {
       "stringKey": "stringval",
       "numberKey": 123,
       "booleanKey": true
   };
   return authResponse;
}