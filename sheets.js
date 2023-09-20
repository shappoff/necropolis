const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const {
    applicationID, adminAPIKey, index_name
} = process.env;

const algoliasearch = require("algoliasearch");

const client = algoliasearch(`${applicationID}`, `${adminAPIKey}`);
const index = client.initIndex(`${index_name}`);


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

const spreadsheetId = '1nEPgrLrlCATZ2ZKQKNXv2KyOoCI5qzH_g-vCpEcBwlA';
const range = 'Лист1';

async function listMajors(auth) {

    const sheets = google.sheets({version: 'v4', auth});
    const res = await sheets.spreadsheets.values.get({spreadsheetId, range});
    const rows = res.data.values;
    if (!rows || rows.length === 0) {
        console.log('No data found.');
    }
    let sheetsListDataProm = [];

    rows.forEach((row, rowIndex) => {
        const [nmb, np, raion, oblast, surname, bornsurname, name, patronymic, born, died, note, relationship] = row;
        const fio = `${surname} ${bornsurname && bornsurname.length > 1 ? `(${bornsurname})` : ''} ${name} ${patronymic}`
        sheetsListDataProm.push({
            nmb, np, raion, oblast, bornsurname, surname, name, patronymic, born, died, note, relationship, fio
        });

    });
    return await Promise.all(sheetsListDataProm);
}

authorize().then(listMajors).then(async (result) => {
    await index.clearObjects();
    await index.saveObjects(result, {autoGenerateObjectIDIfNotExist: true})
        .then(({objectIDs}) => {
            console.log('objectIDs', objectIDs.length);
            console.log('result', result.length);
        }).catch((e) => console.log('catch-2', e));

}).catch((e) => console.log('catch-3', e));