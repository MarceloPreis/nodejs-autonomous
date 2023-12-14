var oracledb = require('oracledb');
const express = require('express');
const secrets = require("oci-secrets");
const common = require("oci-common");
const dotenv = require('dotenv');

const provider = new common.ConfigFileAuthenticationDetailsProvider('./.oci/config');
const client = new secrets.SecretsClient({ authenticationDetailsProvider: provider });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-origin", "*")
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

dotenv.config();

async function run(sql, options) {
    let connection;
    const dbPass = await getPass()

    try {

        let binds, result;

        connection = await oracledb.getConnection({
            user: process.env.sql_user,
            password: dbPass,
            connectString: process.env.sql_connectString
        });

        binds = {};
        options = options || {};
        result = await connection.execute(sql, binds, options);
        return result

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function getPass() {
    const vaultId = process.env.vaultId;
    const secretName = process.env.secretName;
    const secretId = process.env.secretId;

    const response = await client.getSecretBundle({ secretName: secretName, vaultId: vaultId, secretId: secretId });
    const pw = response.secretBundle.secretBundleContent.content;
    let buff = Buffer.from(pw, 'base64');
    let pwDecoded = buff.toString('ascii');
    return pwDecoded
};

app.get('/list', async (req, res) => {
    const results = await run('SELECT * FROM PERSONS')
    return res.json({ success: true, results: results });
});

app.post('/create', async (req, res) => {
    const form = req.body
    const sql = `INSERT INTO ADMIN.PERSONS (id, name) VALUES (${form.id}, '${form.name}')`
    console.log(sql)

    const options = {
        autoCommit: true,
        bindDefs: [
            { type: oracledb.NUMBER },
            { type: oracledb.STRING, maxSize: 20 }
        ]
    };

    const results = await run(sql, options)
    return res.json({ success: true, results: {} });
});

app.delete('/delete:id', async (req, res) => {
    console.log(req)
});

const porta = 5000;
// Inicia o servidor
app.listen(porta, () => {
    console.log(`Servidor iniciado na porta ${porta}`);
});