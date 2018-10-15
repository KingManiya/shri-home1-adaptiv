const fs = require('fs');
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);

function getDataEventsFromFile() {
    return readFileAsync(__dirname + '/../../data/events.json')
        .then(data => JSON.parse(data));
}

function getDataCamsFromFile() {
    return readFileAsync(__dirname + '/../../data/cams.json')
        .then(data => JSON.parse(data));
}

function getEvents(type, offset, limit) {
    return new Promise((resolve, reject) => {

        getDataEventsFromFile().then(data => {
            const events = data.events;

            let result = events;

            if (type) {
                //Типы из запроса
                const requestTypes = type.split(':');

                //Типы которые есть в событиях
                let availableTypes = new Set();
                events.forEach(event => availableTypes.add(event.type));

                //Поиск типов, которые не доступны в данных
                const errorTypes = requestTypes.filter(type => !availableTypes.has(type));
                if (errorTypes.length) {
                    reject({
                        status: 400,
                        message: `<h1>Types not found:${errorTypes.join()}</h1>`,
                    });
                }

                //Фильтруем на запрошенные типы
                result = events.filter(event => requestTypes.includes(event.type));
            }

            //Фильтруем на ограничения
            if (offset || limit) {
                const from = offset ? offset - 1 : 0;
                const count = limit ? from + limit : result.length;
                result = result.slice(from, count);
            }

            resolve({events: result});
        });


    });
}

module.exports.getEvents = getEvents;
module.exports.getDataCamsFromFile = getDataCamsFromFile;