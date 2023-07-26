#xiaomi-gateway-bridge

To run the project, you must declare the following environment variables:
- DEVICE_IP: device IP address
- API_KEY: API key for device management
- MQTT_USER: user for authorization in MQTT
- MQTT_PASS: password for authorization in MQTT

To securely connect to EMQX, you must declare `SECURE=on` in the environment variables and add the `ca.pem` file to the `lib/etc` folder.

To run in debug mode, you must declare `DEBUG=on` in the environment variables.

Launch of the project:
```
$ npm run config
$ npm start
```