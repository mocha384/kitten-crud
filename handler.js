'use strict';
const AWS = require('aws-sdk')

module.exports = {
  create : async(event, context) => {
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
      let dynamodb = new AWS.DynamoDB.DocumentClient()
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
  },
  list : async(event, context) => {
    let scanParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
    }
    let scanResult = {}
    try {
        let dynamodb = new AWS.DynamoDB.DocumentClient()
        scanResult = await dynamodb.scan(scanParams).promise()
    } catch(scanError) {
      console.log('scanError', scanError)
      return {
        statusCode: 500
      }
    }
    console.log('Item', scanResult)
    if (scanResult.Items === null || scanResult.Items.length === 0) {
      return {
        statusCode: 404
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(scanResult.Items.map(kitten => {
        return {
          name: kitten.name,
          age: kitten.age
        }
      }))
    }
  },
  get: async(event, context) => {
    let getParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Key: {
        name: event.pathParameters.name
      }
    }
    let getResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      getResult = await dynamodb.get(getParams).promise()
    } catch(deleteError) {
      console.log('deleteError', deleteError)
      return {
        statusCode: 500
      }
    }
    

    if (getResult.Item === null) {
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
  },
  update: async(event, context) => {
    let bodyObj = {}
    try {
      bodyObj = JSON.parse(event.body)
    } catch (parseError) {
      console.log('parseError', parseError)
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
    let updateParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Key: {
        name: event.pathParameters.name
      },
      UpdateExpression: 'set #age = :age',
      ExpressionAttributeName: {
        '#age':'age'
      },
      ExpressionAttributeValues: {
        ':age': bodyObj.age
      }
    }
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      await dynamodb.update(updateParams).promise()
    } catch(deleteError) {
      console.log('deleteError', deleteError)
      return {
        statusCode: 500
      }
    }
    return {
      statusCode: 200
    }
  },
  delete: async(event, context) => {
    let getParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Key: {
        name: event.pathParameters.name
      }
    }
    let deleteResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
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
  },
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
