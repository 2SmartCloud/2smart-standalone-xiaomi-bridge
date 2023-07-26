const SECURE = process.env.SECURE === 'on' || process.env.SECURE === 'true';
module.exports = [
    {
        "id": "4d7f3e0f.30622",
        "type": "tab",
        "label": "Xiaomi Gateway Flow",
        "disabled": false,
        "info": ""
    },
    {
        "id": "889c890f.1ded38",
        "type": "xiaomi-gateway-config",
        "z": "",
        "name": "Xiaomi Gateway",
        "address": `${process.env.DEVICE_IP}`,
        "port": "9898",
        "key": `${process.env.API_KEY}`
    },
    {
        "id": "4bc10a21.a9630c",
        "type": "mqtt-broker",
        "z": "",
        "name": "EMQX broker",
        "broker": 'localhost',
        "port": SECURE ? "8883" : "1883",
        "tls": "4b673189.55848",
        "clientid": "",
        "usetls": SECURE,
        "compatmode": true,
        "keepalive": "60",
        "cleansession": true,
        "birthTopic": `sweet-home/${process.env.MQTT_USER}/$state`,
        "birthQos": "0",
        "birthRetain": "true",
        "birthPayload": "init",
        "closeTopic": `sweet-home/${process.env.MQTT_USER}/$state`,
        "closeQos": "0",
        "closeRetain": "true",
        "closePayload": "lost",
        "willTopic": `sweet-home/${process.env.MQTT_USER}/$state`,
        "willQos": "0",
        "willRetain": "true",
        "willPayload": "lost"
    },
    {
        "id": "4b673189.55848",
        "type": "tls-config",
        "z": "",
        "name": "",
        "cert": "",
        "key": "",
        "ca": "",
        "certname": "server-cert.pem",
        "keyname": "",
        "caname": "",
        "servername": "",
        "verifyservercert": true
    },
    {
        "id": "bad93618.102c1",
        "type": "xiaomi-gateway",
        "z": "4d7f3e0f.30622",
        "gateway": "889c890f.1ded38",
        "name": "Xiaomi Gateway",
        "healthcheck": "30",
        "x": 1120,
        "y": 410,
        "wires": [
            [
                "1b504f7b.0cf9f9"
            ]
        ]
    },
    {
        "id": "af4897a2.ed0df",
        "type": "xiaomi-gateway-utils",
        "z": "4d7f3e0f.30622",
        "gateway": "889c890f.1ded38",
        "x": 1260,
        "y": 540,
        "wires": [
            []
        ]
    },
    {
        "id": "1b504f7b.0cf9f9",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Proceed",
        "func": "if (msg.payload.cmd !== 'disconnected') flow.set('status', 'connected');\n\nswitch(msg.payload.cmd) {\n    case 'get_id_list_ack':\n        return [msg, null, null, null];\n    case 'read_ack':\n        return [null, msg, null, null];\n    case 'write_ack':\n    case 'report':\n        return [null, null, msg, null];\n    case 'heartbeat':\n        return [null, null, null, msg];\n    case 'disconnected':\n        flow.set('status', 'disconnected');\n        return [null, null, null, null, { payload: { state: 'disconnected' } }];\n    default:\n        break;\n}\n",
        "outputs": 5,
        "noerr": 0,
        "x": 1305.0000305175781,
        "y": 410.00000190734863,
        "wires": [
            [
                "f013c6cd.287a38"
            ],
            [
                "61151924.ef4618"
            ],
            [
                "1c83d267.0d587e"
            ],
            [
                "af4897a2.ed0df"
            ],
            [
                "67e0093b.b37bf"
            ]
        ]
    },
    {
        "id": "f013c6cd.287a38",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "List of nodes",
        "func": "flow.set('nodes', msg.payload.data);\nconst attached = flow.get('isAttached');\n\nif (!attached) return [msg, null];\n\nreturn [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1510,
        "y": 220,
        "wires": [
            [
                "750cc272.03df5c"
            ],
            []
        ]
    },
    {
        "id": "b274957d.a16458",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Device object initialization",
        "func": `flow.set('rootTopic', 'sweet-home');\nflow.set('errorTopic', 'errors');\nflow.set('isAttached', false);\nflow.set('deviceId', '${process.env.MQTT_USER}');\nflow.set('color', { red: '255', green: '255', blue: '255', brightness: '30' });\n\nconst DEVICE_IP = '${process.env.DEVICE_IP}';\nconst device = {\n    name            : '${process.env.DEVICE_NAME || 'Xiaomi Gateway'}',\n    mac             : 'unknown',\n    localIp         : DEVICE_IP,\n    implementation  : 'unknown',\n    state           : 'ready',\n    firmwareName    : 'xiaomi_gateway',\n    firmwareVersion : '1.4.1',\n    nodes           : {},\n    options         : {}\n};\n\nflow.set('device', device);`,
        "outputs": 1,
        "noerr": 0,
        "x": 334,
        "y": 64,
        "wires": [
            []
        ]
    },
    {
        "id": "750cc272.03df5c",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Device initialization",
        "func": "const device = flow.get('device');\n\nif (!device) return null;\n\nmsg.payload = device;\n\nflow.set('isAttached', true);\n\nconst { red, green, blue, brightness } = flow.get('color');\nconst options = [\n    {\n        isNew: true,\n        payload : {\n            value      : `${red},${green},${blue}`,\n            propertyId : 'rgb'\n        }\n    },\n    {\n        isNew: true,\n        payload : {\n            value      : `${brightness}`,\n            propertyId : 'brightness'\n        }\n    },\n    {\n        isNew: true,\n        payload : {\n            value      : 'true',\n            propertyId : 'switcher'\n        }\n    }\n];\n\nreturn [msg, options];",
        "outputs": 2,
        "noerr": 0,
        "x": 1729.000015258789,
        "y": 165.0000343322754,
        "wires": [
            [
                "b4c8af34.b48668",
                "67e0093b.b37bf",
                "7f06717.b6ac41",
                "41df4c33.97243c",
                "aaa71a5f.2d13d8",
                "22d66cf.0dc4394",
                "8e336959.6f06b8"
            ],
            [
                "d82856bf.a80258"
            ]
        ]
    },
    {
        "id": "60419b23.60033c",
        "type": "mqtt out",
        "z": "4d7f3e0f.30622",
        "name": "EMQX Broker",
        "topic": "",
        "qos": "",
        "retain": "true",
        "broker": "4bc10a21.a9630c",
        "x": 2896.0000762939453,
        "y": 590.0001029968262,
        "wires": []
    },
    {
        "id": "b4c8af34.b48668",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Name",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nmsg.payload = msg.payload.name;\nmsg.topic = `${rootTopic}/${deviceId}/$name`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2060.0000228881836,
        "y": 20,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "67e0093b.b37bf",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "State",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nmsg.payload = msg.payload.state;\nmsg.topic = `${rootTopic}/${deviceId}/$state`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2060.0000228881836,
        "y": 66,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "7f06717.b6ac41",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "MAC address",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nmsg.payload = msg.payload.mac;\nmsg.topic = `${rootTopic}/${deviceId}/$mac`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2089.0000228881836,
        "y": 116,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "41df4c33.97243c",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Local IP",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nmsg.payload = msg.payload.localIp;\nmsg.topic = `${rootTopic}/${deviceId}/$localip`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2068.0000228881836,
        "y": 164,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "aaa71a5f.2d13d8",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Implementation",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nmsg.payload = msg.payload.implementation;\nmsg.topic = `${rootTopic}/${deviceId}/$implementation`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2090.0000228881836,
        "y": 208,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "22d66cf.0dc4394",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Firmware name",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nmsg.payload = msg.payload.firmwareName;\nmsg.topic = `${rootTopic}/${deviceId}/$fw/name`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2090.0000228881836,
        "y": 257,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "8e336959.6f06b8",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Firmware version",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nmsg.payload = msg.payload.firmwareVersion;\nmsg.topic = `${rootTopic}/${deviceId}/$fw/version`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2099.0000228881836,
        "y": 309,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "61151924.ef4618",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Node",
        "func": "const { model, data, sid } = msg.payload;\nconst device = flow.get('device');\nconst DEFAULT_VALUES = global.get('SENSOR_DEFAULT_VALUES')[model] || {};\n\nmsg.isNew = false;\n\nif (!device.nodes[sid]) {\n    msg.payload.data = Object.assign(DEFAULT_VALUES, data);\n    device.nodes[sid] = {};\n    msg.isNew = true;\n}\n\nswitch (model) {\n    case 'magnet':\n        return [msg];\n    case 'motion':\n        return [null, msg];\n    case 'sensor_switch':\n    case 'switch':\n        return [null, null, msg];\n    case 'sensor_ht':\n        return [null, null, null, msg];\n    case 'weather.v1':\n        return [null, null, null, null, msg];\n    case 'sensor_cube.aqgl01':\n    case 'cube':\n    case 'sensor_cube':\n        return [null, null, null, null, null, msg];\n    case 'plug':\n        return [null, null, null, null, null, null, msg];\n    case '86sw1':\n    case 'remote.b186acn01':\n        return [null, null, null, null, null, null, null, msg];\n    case '86sw2':\n    case 'remote.b286acn01':\n        return [null, null, null, null, null, null, null, null, msg];\n    default:\n        break;\n}\n",
        "outputs": 9,
        "noerr": 0,
        "x": 1486.0000305175781,
        "y": 410.00000190734863,
        "wires": [
            [
                "28778aa8.ea2c0e"
            ],
            [
                "f0e3924c.f1213"
            ],
            [
                "39c79359.4992d4"
            ],
            [
                "1b29899e.b87ab6"
            ],
            [
                "f77606bc.2be4c8"
            ],
            [
                "ffd0e429.2857a8"
            ],
            [
                "b7e6ddf3.8d9d3"
            ],
            [
                "9aa1c5f0.0c0478"
            ],
            [
                "c5b8e976.441f68"
            ]
        ]
    },
    {
        "id": "28778aa8.ea2c0e",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Magnet",
        "func": "const magnet = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Mi Window and Door Sensor',\n        type  : 'magnet',\n        state : 'ready'\n    }\n};\n\nif (!msg.isNew) delete msg.payload.data.status;\n\nreturn msg.isNew ? [magnet, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1702.0000305175781,
        "y": 248.00000190734863,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    },
    {
        "id": "d54a88ad.fd7be",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Name",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nconst { id, name } = msg.payload;\n\nmsg.payload = name;\nmsg.topic = `${rootTopic}/${deviceId}/${id}/$name`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2089.0000228881836,
        "y": 470,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "fa1b8f62.4fc66",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "State",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nconst { id, state } = msg.payload;\n\nmsg.payload = state;\nmsg.topic = `${rootTopic}/${deviceId}/${id}/$state`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2088.0000228881836,
        "y": 516,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "f15faf5b.5c3928",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Type",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nconst { id, type } = msg.payload;\n\nmsg.payload = type;\nmsg.topic = `${rootTopic}/${deviceId}/${id}/$type`;\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2087.0000228881836,
        "y": 566,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "ed5c20f.84a106",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Sensor",
        "func": "const sensorsInfo = {\n    status : {\n        name     : 'Status',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'string',\n        unit     : '#',\n        format   : '',\n        value    : ''\n    },\n    humidity : {\n        name     : 'Humidity',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'float',\n        unit     : '%',\n        format   : '',\n        value    : ''\n    },\n    temperature : {\n        name     : 'Temperature',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'float',\n        unit     : '°C',\n        format   : '',\n        value    : ''\n    },\n    pressure : {\n        name     : 'Pressure',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'float',\n        unit     : 'kpa',\n        format   : '',\n        value    : ''\n    },\n    plug_status: {\n        name     : 'Status',\n        settable : 'true',\n        retained : 'true',\n        dataType : 'boolean',\n        unit     : '#',\n        format   : '',\n        value    : ''\n    },\n    channel_0: {\n        name     : 'Left switch',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'string',\n        unit     : '#',\n        format   : '',\n        value    : ''\n    },\n    channel_1: {\n        name     : 'Right switch',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'string',\n        unit     : '#',\n        format   : '',\n        value    : ''\n    }\n};\nlet { value, propertyId, sid } = msg.payload;\n\nconst sensor = sensorsInfo[propertyId];\n\nif (!sensor) return;\n\nsensor.id = propertyId.replace(/_/g, '-');\nsensor.nodeId = sid;\nsensor.type = 'sensor';\n\nif (value === 'unknown') value = '';\n\nif (['off','on'].includes(value)) {\n    value = value === 'on' ? 'true' : 'false';\n}\n\nswitch (propertyId) {\n    case 'humidity':\n    case 'temperature':\n        // HARDCODE xiaomi sending 10000 temp on init\n        sensor.value = value === '10000' ? '' : `${(value / 100).toFixed(1)}`;\n        break;\n    case 'pressure':\n        sensor.value = `${(value / 1000).toFixed(1)}`;\n        break;\n    case 'channel_0':\n        if (msg.model === 'remote.b186acn01' || msg.model === '86sw1') sensor.name = 'Switch';\n        sensor.value = value;\n        break;\n    default:\n        sensor.value = value;\n        break;\n}\n\nmsg.payload = sensor;\n\nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 1897.0000228881836,
        "y": 848.0000801086426,
        "wires": [
            [
                "f91d6b25.dc14a8"
            ]
        ]
    },
    {
        "id": "2cab4a60.cbb846",
        "type": "inject",
        "z": "4d7f3e0f.30622",
        "name": "Scan",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "0",
        "x": 103,
        "y": 64,
        "wires": [
            [
                "b274957d.a16458"
            ]
        ]
    },
    {
        "id": "f0e3924c.f1213",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Motion",
        "func": "const motion = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Mi Motion Sensor',\n        type  : 'motion',\n        state : 'ready'\n    }\n};\nreturn msg.isNew ? [motion, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1703.0000305175781,
        "y": 294.00000190734863,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    },
    {
        "id": "39c79359.4992d4",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Switch",
        "func": "const miSwitch = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Switch',\n        type  : 'switch',\n        state : 'ready'\n    }\n};\nreturn msg.isNew ? [miSwitch, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1695.0000305175781,
        "y": 337.00000190734863,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    },
    {
        "id": "30ae827c.4d54be",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Telemetry",
        "func": "const telemetryInfo = {\n    voltage : {\n        id       : 'battery',\n        name     : 'Battery',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'integer',\n        unit     : '%',\n        format   : '',\n        value    : ''\n    },\n    angle : {\n        id       : 'angle',\n        name     : 'Angle',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'integer',\n        unit     : '°',\n        format   : '',\n        value    : ''\n    },\n    time : {\n        id       : 'time',\n        name     : 'Rotation time',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'integer',\n        unit     : 'ms',\n        format   : '',\n        value    : ''\n    },\n    power_consumed : {\n        id       : 'power-consumed',\n        name     : 'Power consumed',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'float',\n        unit     : 'W',\n        format   : '',\n        value    : ''\n    },\n    load_power : {\n        id       : 'load-power',\n        name     : 'Load power',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'float',\n        unit     : 'W',\n        format   : '',\n        value    : ''\n    },\n    inuse : {\n        id       : 'inuse',\n        name     : 'In-use',\n        settable : 'false',\n        retained : 'true',\n        dataType : 'string',\n        unit     : '#',\n        format   : '',\n        value    : ''\n    }\n};\n\nfunction batteryLvl(voltage) {\n    const VOLTAGE_MAX = global.get('VOLTAGE_MAX');\n    const VOLTAGE_MIN = global.get('VOLTAGE_MIN');\n    const val = +voltage;\n    const lvl = ((val - VOLTAGE_MIN) / (VOLTAGE_MAX - VOLTAGE_MIN) * 100).toFixed(0);\n\n    return lvl > 100 ? 100 : lvl;\n}\n\nconst { value, propertyId, sid } = msg.payload;\nconst telemetry = telemetryInfo[propertyId];\n\nif (!telemetry) return null;\n\nswitch (propertyId) {\n    case 'inuse':\n        telemetry.value = value === '1' ? 'true' : 'false';\n        break;\n    case 'voltage':\n        telemetry.value = batteryLvl(value);\n        break;\n    default:\n        telemetry.value = value;\n        break;\n}\n\ntelemetry.nodeId = sid;\ntelemetry.type = 'telemetry';\n\nmsg.payload = telemetry;\n\nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 1896.4998588562012,
        "y": 908.0002431869507,
        "wires": [
            [
                "f91d6b25.dc14a8"
            ]
        ]
    },
    {
        "id": "1c83d267.0d587e",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Property dispatcher",
        "func": "const device = flow.get('device');\nconst deviceId = flow.get('deviceId');\nconst { data, sid, model, cmd } = msg.payload;\n\nconst sensors = {\n    status: 'status',\n    temperature: 'temperature',\n    humidity: 'humidity',\n    pressure: 'pressure',\n    channel_0: 'channel_0',\n    channel_1: 'channel_1',\n    plug_status: 'plug_status'\n};\nconst telemetries = {\n    voltage: 'voltage',\n    rotate: 'rotate',\n    power_consumed: 'power_consumed',\n    load_power: 'load_power',\n    inuse: 'inuse'\n};\nconst options = {\n    rgb: 'rgb'\n};\n\nif (model === 'plug') {\n    if (data.status) {\n        data.plug_status = data.status;\n        delete data.status;\n    }\n    if (data.voltage) delete data.voltage;\n}\nif (data['dual_channel']) {\n    let v;\n    \n    switch (data['dual_channel']) {\n        case 'long_both_click':\n            v = 'long_click';\n            break;\n        case 'both_click':\n            v = 'click';\n            break;\n        case 'double_both_click':\n            v = 'double_click';\n            break;\n        default:\n            break;\n    }   \n\n    if (v) {\n        data['channel_0'] = v;\n        data['channel_1'] = v;\n        delete data['dual_channel'];\n    }\n}\n\nconst sensorPayload = [];\nconst telemetryPayload = [];\nconst optionPayload = [];\nconst validId = Object.assign(sensors, telemetries, options);\n\nObject.keys(data).forEach(id => {\n    if (!validId[id]) return;\n\n    switch (id) {\n        case 'rgb': {\n            const color = data.rgb;\n            const red = 0xff & (color >> 16);\n            const green = 0xff & (color >> 8);\n            const blue = 0xff & color;\n            const brightness = Math.round(0xff & (color >> 24));\n            const isNewOption = !device.options[id] || false;\n            \n            if (isNewOption) device.options[id] = id;\n            \n            if (color > 0) {\n                flow.set('color', { red, green, blue, brightness });\n    \n                optionPayload.push({\n                    payload : {\n                        sid        : sid,\n                        value      : `${red},${green},${blue}`,\n                        propertyId : 'rgb'\n                    },\n                    isNew : isNewOption\n                });\n                optionPayload.push({\n                    payload : {\n                        sid        : sid,\n                        value      : `${brightness}`,\n                        propertyId : 'brightness'\n                    },\n                    isNew : isNewOption\n                });\n            }\n    \n            optionPayload.push({\n                payload : {\n                    sid        : sid,\n                    value      : color > 0 ? 'true' : 'false',\n                    propertyId : 'switcher'\n                },\n                isNew : isNewOption\n            });\n            break;\n        }\n        case 'rotate': {\n            const parsed = data[id].split(',');\n            const isNew = !device.nodes[sid][id] || false;\n            const angle = {\n                sid        : sid,\n                value      : parsed[0] || '',\n                propertyId : 'angle'\n            };\n            const time = {\n                sid        : sid,\n                value      : parsed[1] || '',\n                propertyId : 'time'\n            };\n\n            device.nodes[sid][id] = id;\n            telemetryPayload.push({payload: angle, isNew});\n            telemetryPayload.push({payload: time, isNew});\n\n            break;\n        }\n        default: {\n            const isNew = !device.nodes[sid][id] || false;\n            const payload = {\n                sid        : sid,\n                value      : data[id],\n                propertyId : id\n            };\n        \n            if (sensors[id]) {\n                device.nodes[sid][id] = id;\n                sensorPayload.push({payload, isNew, model});\n            }\n            if (telemetries[id]) {\n                device.nodes[sid][id] = id;\n                telemetryPayload.push({payload, isNew});\n            }\n            break;\n        }\n    }\n});\n\nreturn [ sensorPayload, telemetryPayload, optionPayload ];\n\n\n\n\n\n\n",
        "outputs": 3,
        "noerr": 0,
        "x": 1628.5000267028809,
        "y": 908.000093460083,
        "wires": [
            [
                "ed5c20f.84a106"
            ],
            [
                "30ae827c.4d54be"
            ],
            [
                "d82856bf.a80258"
            ]
        ]
    },
    {
        "id": "f91d6b25.dc14a8",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Prepare topic",
        "func": "const rootTopic = flow.get('rootTopic');\nconst deviceId = flow.get('deviceId');\nconst { id, nodeId, type } = msg.payload;\nconst baseTopic = nodeId ? `${rootTopic}/${deviceId}/${nodeId}` : `${rootTopic}/${deviceId}`;\n\nswitch (type) {\n    case 'sensor':\n        msg.payload.topic = `${baseTopic}/${id}`;\n        break;\n    case 'options':\n    case 'telemetry':\n        msg.payload.topic = `${baseTopic}/$${type}/${id}`;\n        break;\n    default:\n        break;\n}\n\nreturn msg.isNew ? [msg, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 2084.0003204345703,
        "y": 911.0002288818359,
        "wires": [
            [
                "6ca2cadc.9842c4",
                "2a912dc6.df12a2",
                "51889ae.2434764",
                "1b67e5d.7de561a",
                "4239f88d.ebe058",
                "e503594d.34f938"
            ],
            [
                "3011332f.27715c"
            ]
        ]
    },
    {
        "id": "2a912dc6.df12a2",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Settable",
        "func": "const { topic, settable } = msg.payload;\n\nmsg.payload = settable;\nmsg.topic = `${topic}/$settable`;\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2340.0000801086426,
        "y": 806.0000171661377,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "51889ae.2434764",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Retained",
        "func": "const { topic, retained } = msg.payload;\n\nmsg.payload = retained;\nmsg.topic = `${topic}/$retained`;\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2339.0000801086426,
        "y": 856.0000171661377,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "1b67e5d.7de561a",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Data type",
        "func": "const { topic, dataType } = msg.payload;\n\nmsg.payload = dataType;\nmsg.topic = `${topic}/$datatype`;\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2338.0000801086426,
        "y": 904.0000171661377,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "4239f88d.ebe058",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Unit",
        "func": "const { topic, unit } = msg.payload;\n\nmsg.payload = unit;\nmsg.topic = `${topic}/$unit`;\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2330.0000801086426,
        "y": 948.0000171661377,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "e503594d.34f938",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Format",
        "func": "const { topic, format } = msg.payload;\n\nmsg.payload = format;\nmsg.topic = `${topic}/$format`;\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2340.0000801086426,
        "y": 997.0000171661377,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "3011332f.27715c",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Value",
        "func": "const { topic, value } = msg.payload;\n\nmsg.payload = `${value}`;\nmsg.topic = topic;\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2332.000015258789,
        "y": 1090.0000162124634,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "6ca2cadc.9842c4",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Name",
        "func": "const { name, topic } = msg.payload;\n\nmsg.payload = name;\nmsg.topic = `${topic}/$name`;\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 2329.23970413208,
        "y": 756.0103931427002,
        "wires": [
            [
                "60419b23.60033c",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "d82856bf.a80258",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Option",
        "func": "const optionInfo = {\n    rgb : {\n        id       : 'rgb',\n        name     : 'Color',\n        settable : 'true',\n        retained : 'true',\n        dataType : 'color',\n        unit     : '#',\n        format   : 'rgb',\n        value    : ''\n    },\n    brightness : {\n        id       : 'brightness',\n        name     : 'Brightness',\n        settable : 'true',\n        retained : 'true',\n        dataType : 'integer',\n        unit     : '%',\n        format   : '0:100',\n        value    : ''\n    },\n    switcher : {\n        id       : 'switch',\n        name     : 'Switch',\n        settable : 'true',\n        retained : 'true',\n        dataType : 'boolean',\n        unit     : '#',\n        format   : '',\n        value    : ''\n    }\n};\n\nconst { value, propertyId } = msg.payload;\nconst option = optionInfo[propertyId];\n\nif (!option) return null;\n\noption.value = value;\noption.type = 'options';\n\nmsg.payload = option;\n\nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "x": 1888.0173568725586,
        "y": 963.677098274231,
        "wires": [
            [
                "f91d6b25.dc14a8"
            ]
        ]
    },
    {
        "id": "3e886edc.4727b2",
        "type": "mqtt in",
        "z": "4d7f3e0f.30622",
        "name": "Brightness set event",
        "topic": `sweet-home/${process.env.MQTT_USER}/$options/brightness/set`,
        "qos": "2",
        "datatype": "auto",
        "broker": "4bc10a21.a9630c",
        "x": 95.66321563720703,
        "y": 604.9413013458252,
        "wires": [
            [
                "e23f60de.109ab",
                "bd0ec771.3595e8"
            ]
        ]
    },
    {
        "id": "a8fd3624.d7c8b8",
        "type": "mqtt in",
        "z": "4d7f3e0f.30622",
        "name": "Color set event",
        "topic": `sweet-home/${process.env.MQTT_USER}/$options/rgb/set`,
        "qos": "2",
        "datatype": "auto",
        "broker": "4bc10a21.a9630c",
        "x": 86.00000762939453,
        "y": 672.1217041015625,
        "wires": [
            [
                "3564bb02.83c764",
                "bd0ec771.3595e8"
            ]
        ]
    },
    {
        "id": "4bc253f3.e7eddc",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Brightness validation",
        "func": "const { payload, errorPayload } = msg;\nconst brightness = +payload;\n\nif (isNaN(brightness)) return [errorPayload, null];\nif (brightness > 100) return [errorPayload, null];\nif (brightness < 0) return [errorPayload, null];\n\nconst color = flow.get('color');\ncolor.brightness = brightness;\n\nflow.set('color', color);\n\nreturn [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 761.2466278076172,
        "y": 671.4170560836792,
        "wires": [
            [
                "dd0ebe42.11721"
            ],
            [
                "7ed56c6e.457584"
            ]
        ]
    },
    {
        "id": "bc65a793.690198",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Color validation",
        "func": "const { payload, errorPayload } = msg;\nconst parsed = payload.split(',');\n\nif (parsed.length !== 3) return [errorPayload, null];\n\nconst red = +parsed[0];\nconst green = +parsed[1];\nconst blue = +parsed[2];\n\nif (isNaN(red) || isNaN(green) || isNaN(blue)) return [errorPayload, null];\nif ((red > 255) || (green > 255) || (blue > 255)) return [errorPayload, null];\nif ((red < 0) || (green < 0) || (blue < 0)) return [errorPayload, null];\n\nconst color = flow.get('color');\ncolor.red = red;\ncolor.green = green;\ncolor.blue = blue;\n\nflow.set('color', color);\n\nreturn [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 741.2363128662109,
        "y": 720.4241371154785,
        "wires": [
            [
                "dd0ebe42.11721"
            ],
            [
                "7ed56c6e.457584"
            ]
        ]
    },
    {
        "id": "7ed56c6e.457584",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Prepare color",
        "func": "const color = flow.get('color');\nconst prepColor = color.brightness << 24 | (color.red << 16) | (color.green << 8) | color.blue;\n\nmsg.payload = {\n    rgb: prepColor\n};\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 1040,
        "y": 680,
        "wires": [
            [
                "bad93618.102c1"
            ]
        ]
    },
    {
        "id": "8d9939aa.465658",
        "type": "mqtt in",
        "z": "4d7f3e0f.30622",
        "name": "Color switch set event",
        "topic": `sweet-home/${process.env.MQTT_USER}/$options/switch/set`,
        "qos": "2",
        "datatype": "auto",
        "broker": "4bc10a21.a9630c",
        "x": 105,
        "y": 742.2327194213867,
        "wires": [
            [
                "b9a2f09e.89806",
                "bd0ec771.3595e8"
            ]
        ]
    },
    {
        "id": "aa1c8a1c.5b1358",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Prepare before validation",
        "func": "const { topic, payload, type } = msg;\nconst parsedTopic = topic.split('/');\n\n// ignore message for another device\nif (parsedTopic[1] !== flow.get('deviceId')) return;\n\nconst errTopic = flow.get('errorTopic');\nconst reErr = new RegExp(`/set$`, 'g');\nconst prepTopic = topic.replace(reErr, '');\nconst errorPayload = {\n    payload : JSON.stringify({code: \"VALIDATION_ERROR\", message: \"Wrong format\"}),\n    topic   : `${errTopic}/${prepTopic}`\n};\n\nmsg.errorPayload = errorPayload;\n\nswitch (type) {\n    case 'switch':\n        return [msg, null, null];\n    case 'brightness':\n        return [null, msg, null];\n    case 'color':\n        return [null, null, msg];\n    default:\n        break;\n}",
        "outputs": 3,
        "noerr": 0,
        "x": 502.6632537841797,
        "y": 671.080080986023,
        "wires": [
            [
                "2b26c0ec.e67eb"
            ],
            [
                "4bc253f3.e7eddc"
            ],
            [
                "bc65a793.690198"
            ]
        ]
    },
    {
        "id": "2b26c0ec.e67eb",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Color switcher",
        "func": "const val = msg.payload;\n\nif (val === 'true') return [null, msg];\n\nmsg.payload = {\n    rgb: 0\n};\n\nreturn [msg, null];",
        "outputs": 2,
        "noerr": 0,
        "x": 742.6841125488281,
        "y": 627.0871839523315,
        "wires": [
            [
                "bad93618.102c1"
            ],
            [
                "7ed56c6e.457584"
            ]
        ]
    },
    {
        "id": "dd0ebe42.11721",
        "type": "mqtt out",
        "z": "4d7f3e0f.30622",
        "name": "Publish error",
        "topic": "",
        "qos": "",
        "retain": "false",
        "broker": "4bc10a21.a9630c",
        "x": 1019.0173034667969,
        "y": 852.5660629272461,
        "wires": []
    },
    {
        "id": "3564bb02.83c764",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Color",
        "func": "msg.type = 'color';\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 267.6840362548828,
        "y": 672.0798797607422,
        "wires": [
            [
                "aa1c8a1c.5b1358"
            ]
        ]
    },
    {
        "id": "b9a2f09e.89806",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Color switch",
        "func": "msg.type = 'switch';\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 304.6909942626953,
        "y": 742.0903167724609,
        "wires": [
            [
                "aa1c8a1c.5b1358"
            ]
        ]
    },
    {
        "id": "e23f60de.109ab",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Brightness",
        "func": "msg.type = 'brightness';\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 278.6909637451172,
        "y": 605.0833587646484,
        "wires": [
            [
                "aa1c8a1c.5b1358"
            ]
        ]
    },
    {
        "id": "3c4c2b47.70aee4",
        "type": "mqtt in",
        "z": "4d7f3e0f.30622",
        "name": "Device status",
        "topic": `sweet-home/${process.env.MQTT_USER}/$state`,
        "qos": "2",
        "datatype": "auto",
        "broker": "4bc10a21.a9630c",
        "x": 75,
        "y": 541.010440826416,
        "wires": [
            [
                "376c5d40.f03b82",
                "bd0ec771.3595e8"
            ]
        ]
    },
    {
        "id": "376c5d40.f03b82",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Status handler",
        "func": "const { topic, payload } = msg;\nconst device = flow.get('device');\nconst status = flow.get('status');\n\nswitch (payload) {\n    case 'disconnected':\n    case 'lost': {\n        device.nodes = {};\n        device.options = {};\n        flow.set('status', 'disconnected');\n        flow.set('isAttached', false);\n\n        break;\n    }\n    case 'init': {\n        const heartbeat = flow.get(['heartbeatToken', 'heartbeatTopic']);\n        const res = [];\n\n        device.nodes = {};\n        device.options = {};\n        flow.set('isAttached', false);\n\n        return [null, res];\n    }\n    case 'ready': {\n        return [msg];\n    }\n    default:\n        break;\n}",
        "outputs": 2,
        "noerr": 0,
        "x": 700,
        "y": 540,
        "wires": [
            [
                "7ed56c6e.457584"
            ],
            [
                "ea4ea6cc.160378"
            ]
        ]
    },
    {
        "id": "1b29899e.b87ab6",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Heat",
        "func": "const heat = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Mi Temperature and Humidity',\n        type  : 'sensor',\n        state : 'ready'\n    }\n};\nreturn msg.isNew ? [heat, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1694,
        "y": 384,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    },
    {
        "id": "f77606bc.2be4c8",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "HeatV2",
        "func": "const heatV2 = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Temperature and Humidity sensor',\n        type  : 'sensor',\n        state : 'ready'\n    }\n};\nreturn msg.isNew ? [heatV2, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1704,
        "y": 434,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    },
    {
        "id": "ffd0e429.2857a8",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Cube",
        "func": "const cube = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Magic Cube',\n        type  : 'cube-sensor',\n        state : 'ready'\n    }\n};\n\nreturn msg.isNew ? [cube, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1694,
        "y": 485,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    },
    {
        "id": "c068e928.8906a8",
        "type": "debug",
        "z": "4d7f3e0f.30622",
        "name": "DEBUG",
        "active": true,
        "tosidebar": false,
        "console": true,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "x": 2980,
        "y": 460,
        "wires": []
    },
    {
        "id": "75b247ec.91b718",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "PUBLISH DEBUG",
        "func": "return global.get('DEBUG') ? {\n  type: 'PUBLISH',\n  topic: msg.topic,\n  msg: msg.payload\n} : null;",
        "outputs": 1,
        "noerr": 0,
        "x": 2790,
        "y": 460,
        "wires": [
            [
                "c068e928.8906a8"
            ]
        ]
    },
    {
        "id": "be0b3ea5.6e9a6",
        "type": "debug",
        "z": "4d7f3e0f.30622",
        "name": "DEBUG",
        "active": true,
        "tosidebar": false,
        "console": true,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "x": 570,
        "y": 1000,
        "wires": []
    },
    {
        "id": "bd0ec771.3595e8",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "SUBSCRIBE DEBUG",
        "func": "return global.get('DEBUG') ? {\n  type: 'MESSAGE',\n  topic: msg.topic,\n  msg: msg.payload\n} : null;",
        "outputs": 1,
        "noerr": 0,
        "x": 370,
        "y": 1000,
        "wires": [
            [
                "be0b3ea5.6e9a6"
            ]
        ]
    },
    {
        "id": "b7e6ddf3.8d9d3",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Plug",
        "func": "const { payload } = msg;\nconst plug = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Plug',\n        type  : 'plug',\n        state : 'ready'\n    }\n};\n\nif (payload.data.status) {\n    const status = payload.data.status;\n    \n    payload.data['plug_status'] = status;\n    delete payload.data.status;\n}\n\nif (payload.data.voltage) delete payload.data.voltage;\n\nreturn msg.isNew ? [plug, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1692,
        "y": 536,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    },
    {
        "id": "838444ee.e6d898",
        "type": "mqtt in",
        "z": "4d7f3e0f.30622",
        "name": "Plug set event",
        "topic": `sweet-home/${process.env.MQTT_USER}/+/plug-status/set`,
        "qos": "2",
        "datatype": "auto",
        "broker": "4bc10a21.a9630c",
        "x": 75,
        "y": 800,
        "wires": [
            [
                "bd0ec771.3595e8",
                "f24608df.593dd8"
            ]
        ]
    },
    {
        "id": "f24608df.593dd8",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Send command to plug",
        "func": "const { topic, payload } = msg;\nconst parsedTopic = topic.split('/');\nconst plugId = parsedTopic[2];\n\nreturn {\n    sid: plugId,\n    model: 'plug',\n    payload: {\n        'channel_0': payload === 'true' ? 'on' : 'off'\n    }\n};",
        "outputs": 1,
        "noerr": 0,
        "x": 1090,
        "y": 799,
        "wires": [
            [
                "bad93618.102c1"
            ]
        ]
    },
    {
        "id": "7e1f4c62.e00df4",
        "type": "mqtt in",
        "z": "4d7f3e0f.30622",
        "name": "EMQX heartbeat set",
        "topic": `sweet-home/${process.env.MQTT_USER}/$heartbeat/set`,
        "qos": "2",
        "datatype": "auto",
        "broker": "4bc10a21.a9630c",
        "x": 96,
        "y": 489,
        "wires": [
            [
                "bd0ec771.3595e8",
                "fef379cd.8ae4d8"
            ]
        ]
    },
    {
        "id": "fef379cd.8ae4d8",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "EMQX heartbeat handler",
        "func": "const gatewayStatus = flow.get('status');\nconst { payload, topic } = msg;\nconst reSet = new RegExp(`/set$`, 'g');\nconst prepTopic = topic.replace(reSet, '');\n\nflow.set('heartbeatToken', payload);\nflow.set('heartbeatTopic', prepTopic);\n\nif (gatewayStatus === 'connected') {\n    flow.set('heartbeatToken', null);\n    return {\n        topic: prepTopic,\n        payload\n    };\n}\n",
        "outputs": 1,
        "noerr": 0,
        "x": 430,
        "y": 460,
        "wires": [
            [
                "ea4ea6cc.160378",
                "75b247ec.91b718"
            ]
        ]
    },
    {
        "id": "ea4ea6cc.160378",
        "type": "mqtt out",
        "z": "4d7f3e0f.30622",
        "name": "EMQX heartbeat publish",
        "topic": "",
        "qos": "",
        "retain": "false",
        "broker": "4bc10a21.a9630c",
        "x": 790,
        "y": 420,
        "wires": []
    },
    {
        "id": "9aa1c5f0.0c0478",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Single switch",
        "func": "const { payload } = msg;\nconst s_switch = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Xiaomi Wireless Single Wall Switch',\n        type  : 'switch',\n        state : 'ready'\n    }\n};\n\nreturn msg.isNew ? [s_switch, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1712,
        "y": 593,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    },
    {
        "id": "c5b8e976.441f68",
        "type": "function",
        "z": "4d7f3e0f.30622",
        "name": "Dual switch",
        "func": "const { payload } = msg;\nconst d_switch = {\n    payload: {\n        id    : msg.payload.sid,\n        name  : 'Xiaomi Wireless Dual Wall Switch',\n        type  : 'switch',\n        state : 'ready'\n    }\n};\n\nreturn msg.isNew ? [d_switch, msg] : [null, msg];",
        "outputs": 2,
        "noerr": 0,
        "x": 1709,
        "y": 640,
        "wires": [
            [
                "d54a88ad.fd7be",
                "fa1b8f62.4fc66",
                "f15faf5b.5c3928"
            ],
            [
                "1c83d267.0d587e"
            ]
        ]
    }
]