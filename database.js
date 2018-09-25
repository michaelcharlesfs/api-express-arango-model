let arangojs = require('arangojs');
let collectionsConfig = require('./collections-config');

const host = 'http://localhost:8529';
const username = 'root';
const password = '';
const databaseName = 'mydatabase';
const db = new arangojs.Database({url: host});

async function verifyCollectionExists (collectionName) {
    return await db.collection(collectionName).exists();
}

async function verifyDatabaseExists () {
    return await db.exists();
}

async function startCollections () {
    let response = true;
    for (let collectionName of collectionsConfig) {
        await verifyCollectionExists(collectionName.name)
        .then(async (result) => {
            if (result) {
                console.log(`Collection ${collectionName.name} founded...`);
            } else {
                console.log(`Initializating collection ${collectionName.name}`);
                if (collectionName.type === 1) {
                    let collection = db.collection(collectionName.name);
                    await collection.create();
                } else if (collectionName.type === 2) {
                    let collection = db.edgeCollection(collectionName.name);
                    await collection.create();
                }
                console.log(`Collection ${collectionName.name} created`);
            }
        })
        .catch((error) => {
            if (error.statusCode === 401) {
                console.log(`startCollections: User or password invalid!`);
            } else if (error.code === 'ECONNREFUSED') { 
                console.log(`startDatabase: Cannot connect to host ${host}!`);
            } else if (error.code === 'ETIMEDOUT') { 
                console.log(`startDatabase: Timeout connect to host ${host}!`);
            } else {
                console.log(error);
            }
            response = false;
        });
    }
    return response;
}

async function startDatabase() {
    let response = true;
    db.useDatabase(databaseName);
    await verifyDatabaseExists()
    .then(async (result) => {
        if (result) {
            console.log(`Database ${databaseName} founded...`);
        } else {
            console.error(`Database not found...`);
            response = false;
        }
    })
    .catch((error) => {
        if (error.statusCode === 401) {
            console.log(`startDatabase: User or password invalid!`);
        } else if (error.code === 'ECONNREFUSED') { 
            console.log(`startDatabase: Cannot connect to host ${host}!`);
        } else if (error.code === 'ETIMEDOUT') { 
            console.log(`startDatabase: Timeout connect to host ${host}!`);
        } else {
            console.log(error);
        }
        response = false;
    });
    return response;
}

async function startSystem() {
    let response = true;
    await startDatabase()
        .then((result) => {
            if (result) { 
                console.log('Database ready!');
            } else {
                console.log('Database not started!');
                response = false;
            }
        }).catch((error) => {
            console.log(error)
        });
    if (response) {
        await startCollections()
            .then((result) => {
                if (result) {
                    console.log('Collections ready!');
                } else {
                    console.log('Collections not started!');
                    response = false;
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    return response;
};

(async function() {
    db.useBasicAuth(username, password);
    await startSystem().then((result) => {
        if (result) {
            console.log('System already. Have a fun!');
        } else {
            console.log('System not started. Something wrong!');
        }
    }).catch((error) => {
        console.log(error);
    });
})();

module.exports = db;