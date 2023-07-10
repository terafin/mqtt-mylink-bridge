# mqtt-mylink-bridge

This is a simple docker container that I use to bridge to/from my MQTT bridge.

I have a collection of bridges, and the general format of these begins with these environment variables:

```mqtt
      TOPIC_PREFIX: /your_topic_prefix  (eg: /some_topic_prefix/somthing)
      MQTT_HOST: YOUR_MQTT_URL (eg: mqtt://mqtt.yourdomain.net)
      (OPTIONAL) MQTT_USER: YOUR_MQTT_USERNAME
      (OPTIONAL) MQTT_PASS: YOUR_MQTT_PASSWORD
```

This bridge only supports 3 actions, up, down and stop. You need to send the commands in the following format (with CC1137F2.1 as my example blind integration target)

```mqtt
   topic: /mylink/CC1137F2.1/action
   value: (up|down|stop)
```

Here's an example docker compose:

```mqtt
version: '3.3'
services:
  mqtt-mylink-bridge:
    image: ghcr.io/terafin/mqtt-mylink-bridge:latest
    environment:
      LOGGING_NAME: mqtt-mylink-bridge
      TZ: America/Los_Angeles
      TOPIC_PREFIX: /your_topic_prefix  (eg: /mylink/living_room)

      MYLINK_HOST: YOUR_MYLINK_IP
      MYLINK_SYSTEM_ID: YOUR_MYLINK_SYSTEM_ID

      MQTT_HOST: YOUR_MQTT_URL (eg: mqtt://mqtt.yourdomain.net)
      (OPTIONAL) MQTT_USER: YOUR_MQTT_USERNAME
      (OPTIONAL) MQTT_PASS: YOUR_MQTT_PASSWORD
```
