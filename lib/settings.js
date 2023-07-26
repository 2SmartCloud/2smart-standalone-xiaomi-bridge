module.exports = {
    uiPort: 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 1000,
    flowFile: 'flows.json',
    disableEditor: process.env.NODE_ENV === 'production' || false,
    functionGlobalContext: {
        VOLTAGE_MIN: 2800,
        VOLTAGE_MAX: 3300,
        SENSOR_DEFAULT_VALUES: {
            magnet: {
                voltage: '',
                status: ''
            },
            motion: {
                voltage: '',
                status: ''
            },
            sensor_switch : {
                voltage: '',
                status: ''
            },
            switch: {
                voltage: '',
                status: ''
            },
            sensor_ht: {
                voltage: '',
                temperature: '',
                humidity: ''
            },
            weather: {
                voltage: '',
                temperature: '',
                humidity: '',
                pressure: ''
            },
            'weather.v1': {
                voltage: '',
                temperature: '',
                humidity: '',
                pressure: ''
            },
            'sensor_cube.aqgl01': {
                voltage: '',
                status: '',
                rotate: ''
            },
            cube: {
                voltage: '',
                status: '',
                rotate: ''
            },
            sensor_cube: {
                voltage: '',
                status: '',
                rotate: ''
            },
            plug: {
                plug_status: ''
            },
            '86sw1': {
                channel_0: '',
                voltage: ''
            }, // Wireless one button
            'remote.b186acn01': {
                channel_0: '',
                voltage: ''
            }, // Wireless one button
            '86sw2': {
                channel_0: '',
                channel_1: '',
                voltage: ''
            }, // Wireless one button
            'remote.b286acn01': {
                channel_0: '',
                channel_1: '',
                voltage: ''
            }, // Wireless one button
        },
        DEBUG: process.env.DEBUG === 'on' || false
    },
    exportGlobalContextKeys: false,
    logging: {
        console: {
            level: 'info',
            metrics: false,
            audit: false
        }
    },
    editorTheme: {
        projects: {
            enabled: false
        }
    },
    credentialSecret: false
}
