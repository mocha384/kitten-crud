'use strict';
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.create = async (event, context) => {
    let bodyObj = {}
    try {
      bodyObj = JSON.parse(event.body)
    } catch (jsonError) {
      console.log('Error', jsonError)
      return {
        statusCode: 400
      }
    }
    if (typeof bodyObj.name === 'undefined' ||
    typeof bodyObj.age === 'undefined') {
      console.log('Missing parameters')
      return {
        statusCode: 400
      }
    }
    let putParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Item: {
        name: bodyObj.name,
        age: bodyObj.age
      }
    }
    let putResult = {}
    try {

      putResult = await dynamodb.put(putParams).promise()
    } catch(putError) {
      console.log('putError', putParams)
      return {
        statusCode: 500
      }
    }
    return {
      statusCode: 201
    }
}
