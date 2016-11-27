const AWS = require('aws-sdk')
const _ = require('lodash')
const Promise = require('bluebird')

var config = {}
config.aws_access_key_id = process.env.AWS_ACCESS_KEY_ID || ''
config.aws_secret_access_key = process.env.AWS_SECRET_ACCESS_KEY || ''
config.aws_region = process.env.AWS_REGION || 'eu-west-1'
config.environments = (process.env.EB_ENVIRONMENTS || '').split(',')

AWS.config.credentials = new AWS.Credentials(config.aws_access_key_id, config.aws_secret_access_key)
AWS.config.update({ region: config.aws_region })

console.log(JSON.stringify(config, null, 2))

_.each(config.environments, function (env) {
  var eb = new AWS.ElasticBeanstalk();
  Promise.promisifyAll(eb)
  eb.restartAppServerAsync({ EnvironmentName: env })
    .then(function (data) {
      console.log('Environment ' + env + ' restart operation has been started: ' + JSON.stringify(data, null, 2))
    })
    .catch(function (err) {
      console.log('Error in environment ' + env + ' restart operation : ' + JSON.stringify(err, null, 2))
    })
})



