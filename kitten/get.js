'use strict';
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.get = async (event, context) => {
    let getParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Key: {
        name: event.pathParameters.name
      }
    }
    let getResult = {}
    try {
      getResult = await dynamodb.get(getParams).promise()
    } catch(getError) {
      console.log('getError', getError)
      return {
        statusCode: 500
      }
    }
    if (getResult.Item == null) {
      return {
        statusCode: 404
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        name: getResult.Item.name,
        age: getResult.Item.age
      })
    }
}
