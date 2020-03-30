'use strict';
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.update = async (event, context) => {
    let bodyObj = {}
    try {
      bodyObj = JSON.parse(event.body)
    } catch (parseError) {
      console.log('parseError', parseError)
      return {
        statusCode: 400
      }
    }
    console.log('update query', bodyObj)
    if (typeof bodyObj.name === 'undefined' ||
    typeof bodyObj.age === 'undefined') {
      console.log('Missing parameters')
      return {
        statusCode: 400
      }
    }
    let updateParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Key: {
        name: event.pathParameters.name
      },
      UpdateExpression: 'set #age = :age',
      ExpressionAttributeNames: {
        '#age':'age'
      },
      ExpressionAttributeValues: {
        ':age': bodyObj.age
      }
    }
    try {
      await dynamodb.update(updateParams).promise()
    } catch(updateError) {
      console.log('updateError', updateError)
      return {
        statusCode: 500
      }
    }
    return {
      statusCode: 200
    }
  };
