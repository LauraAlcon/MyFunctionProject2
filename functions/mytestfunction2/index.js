/**
 * Describe Myfunction here.
 *
 * The exported method is the entry point for your code when the function is invoked. 
 *
 * Following parameters are pre-configured and provided to your function on execution: 
 * @param event: represents the data associated with the occurrence of an event, and  
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */
 
 "use strict";

 export default async function (event, context, logger) {
  logger.info(
    `Invoking salesforcesdkjs Function with payload ${JSON.stringify(
      event.data || {}
    )}`
  );
 
   // Extract Properties from Payload
   const { name, descripcion } = event.data;

 
   // Validate the payload params
   if (!name) {
     //throw new Error(`Please provide Test Functions name`);
     throw new Error(`Please provide Test Functions name`);
   }
 
   // Define a record using the RecordForCreate type and providing the Developer Name
   const testdata = {
     type: "Test_Functions__c",
     fields: {
       Name: `${name}-${Date.now()}`,
       Description__c: descripcion,
     },
   };
 
   try {
     // Insert the record using the SalesforceSDK DataApi and get the new Record Id from the result
     const { id: recordId } = await context.org.dataApi.create(testdata);
 
     // Query Accounts using the SalesforceSDK DataApi to verify that our new Account was created.
     const soql = `SELECT Name, Description__c, OwnerId, CreatedById FROM Test_Functions__c WHERE Id = '${recordId}'`;
     const queryResults = await context.org.dataApi.query(soql);
     return queryResults;
   } catch (err) {
     // Catch any DML errors and pass the throw an error with the message
     const errorMessage = `Failed to insert record :(  Root Cause: ${err.message}`;
     logger.error(errorMessage);
     throw new Error(errorMessage);
   }
 }
 