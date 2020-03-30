'use strict';
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.list = async (event, context) => {
    let scanParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
    }
    let scanResult = {}
    try {
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
  };
