const _ = require('lodash')
const logging = require('homeautomation-js-lib/logging.js')
const health = require('homeautomation-js-lib/health.js')
const mqtt_helpers = require('homeautomation-js-lib/mqtt_helpers.js')
const SomfySynergy = require('somfy-synergy')


var topic_prefix = process.env.TOPIC_PREFIX

if (_.isNil(topic_prefix)) {
    logging.warn('TOPIC_PREFIX not set, not starting')
    process.abort()
}

const MYLINK_HOST = process.env.MYLINK_HOST

if (_.isNil(MYLINK_HOST)) {
    logging.warn('MYLINK_HOST not set, not starting')
    process.abort()
}

const MYLINK_SYSTEM_ID = process.env.MYLINK_SYSTEM_ID

if (_.isNil(MYLINK_SYSTEM_ID)) {
    logging.warn('MYLINK_SYSTEM_ID not set, not starting')
    process.abort()
}


var mqttOptions = { qos: 1 }

var shouldRetain = process.env.MQTT_RETAIN

if (_.isNil(shouldRetain)) {
    shouldRetain = true
}

mqttOptions['retain'] = shouldRetain

var connectedEvent = function() {
    health.healthyEvent()

    const topics = [topic_prefix + '/+/action']

    logging.info('Connected, subscribing ')
    topics.forEach(function(topic) {
        logging.info(' => Subscribing to: ' + topic)
        client.subscribe(topic, { qos: 1 })
    }, this)
}

var disconnectedEvent = function() {
    health.unhealthyEvent()
}

// Setup MQTT
const client = mqtt_helpers.setupClient(connectedEvent, disconnectedEvent)

const synergy = new SomfySynergy(MYLINK_SYSTEM_ID, MYLINK_HOST);


async function processMessage(topic, message) {
    if (topic.indexOf('/action') >= 0) {
        const components = topic.split('/')
        const targetString = components[components.length - 2]

        logging.info('Sending action: ' + message + ' to : ' + targetString)
        const target = synergy.target(targetString)
// CC1137F2.1

        switch ('' + message) {
            case 'up':
                logging.info(' * up')
                target.up().then(success => {
                    if (success) {
                      console.log(targetString + ' is now ' + message);
                    } else {
                        console.error('failed to set ' + targetString + ' to ' + message);
                    }
                  });
                
                break;

            case 'down':
                logging.info(' * down')
                target.down()

                break;
            case 'stop':
                logging.info(' * stop')
                target.stop().then(success => {
                    if (success) {
                      console.log(targetString + ' is now ' + message);
                    } else {
                        console.error('failed to set ' + targetString + ' to ' + message);
                    }
                  });

                break;
                    
            default:
                logging.error('Unknown action: ' + message)
                break;
        }
    }
}

client.on('message', (topic, message) => {
    logging.info(' ' + topic + ':' + message, {
        topic: topic,
        value: message
    })

    processMessage(topic, message)
})


// venstar.on('target-temperature-updated', (target) => {
//     client.smartPublish(topic_prefix + '/temperature/target', target.toString(), mqttOptions)
// })