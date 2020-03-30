'use strict';
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.delete = async (event, context) => {
    let getParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Key: {
        name: event.pathParameters.name
      }
    }
    let deleteResult = {}
    try {
      deleteResult = await dynamodb.delete(getParams).promise()
    } catch(deleteError) {
      console.log('deleteError', deleteError)
      return {
        statusCode: 500
      }
    }
    return {
      statusCode: 200,
    }
};
