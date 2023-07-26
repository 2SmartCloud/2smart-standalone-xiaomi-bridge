const fs = require('fs');
const flowConfig = require('./../etc/flows_config');
const flowCreds = require('./../etc/flows_cred');
const { SECURE } = process.env;

if (SECURE === 'on' || SECURE === 'true') {
    const { id } = flowConfig.find(({ type }) => type === 'tls-config');

    try {
        flowCreds[id] = {
            certdata : fs.readFileSync(`${__dirname}/../etc/certs/server-cert.pem`, { encoding: 'utf8' })
        };
    } catch (e) {
        throw new Error(`Cert file not found in ${e.path}`);
    }        
}

fs.writeFileSync(`${__dirname}/../flows.json`, JSON.stringify(flowConfig));
fs.writeFileSync(`${__dirname}/../flows_cred.json`, JSON.stringify(flowCreds));
