import fs from 'fs';
import {promisify} from 'util';
const readFileAsync = promisify(fs.readFile);

interface IEvent {
    type: string;
}

interface IData {
    events: IEvent[];
}

function getDataEventsFromFile() {
    return readFileAsync(__dirname + '/../../data/events.json')
        .then((data: Buffer) => JSON.parse(data.toString()));
}

export function getDataCamsFromFile() {
    return readFileAsync(__dirname + '/../../data/cams.json')
        .then((data: Buffer) => JSON.parse(data.toString()));
}

export function getEvents(type: string, offset: number, limit: number) {
    return new Promise((resolve, reject) => {

        getDataEventsFromFile().then((data: IData) => {
            const events = data.events;

            let result = events;

            if (type) {
                // Типы из запроса
                const requestTypes = type.split(':');

                // Типы которые есть в событиях
                const availableTypes = new Set();
                events.forEach(event => availableTypes.add(event.type));

                // Поиск типов, которые не доступны в данных
                const errorTypes = requestTypes.filter((requestType: string) => !availableTypes.has(requestType));
                if (errorTypes.length) {
                    reject({
                        status: 400,
                        message: `<h1>Types not found:${errorTypes.join()}</h1>`,
                    });
                }

                // Фильтруем на запрошенные типы
                result = events.filter(event => requestTypes.includes(event.type));
            }

            // Фильтруем на ограничения
            if (offset || limit) {
                const from = offset ? offset - 1 : 0;
                const count = limit ? from + limit : result.length;
                result = result.slice(from, count);
            }

            resolve({events: result});
        });

    });
}