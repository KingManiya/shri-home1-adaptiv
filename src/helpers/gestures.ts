let points = [];

function getXY(p1, p2) {
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
    }
}

export function getPointStart(p) {
    return {
        x: p.startX,
        y: p.startY,
    }
}

export function getPointEnd(p) {
    return {
        x: p.x,
        y: p.y,
    }
}

export function getDistance(p1, p2) {
    let {x, y} = getXY(p1, p2);

    return Math.sqrt(x * x + y * y);
}

export function getAngle(p1, p2) {
    let {x, y} = getXY(p1, p2);

    return Math.atan2(y, x) * 180 / Math.PI;
}

export function getRotation(start, end) {
    return getAngle(end[0], end[1]) + getAngle(start[0], start[1]);
}

export function getScale(start, end) {
    return getDistance(end[0], end[1]) / getDistance(start[0], start[1]);
}

// function getCenterStart() {
//     let points = getPoints();
//     if (points.length === 1) {
//         return getPointStart(points[0]);
//     } else {
//         let point1 = getPointStart(points[0]);
//         let point2 = getPointStart(points[1]);
//         return {
//             x: (point1.x + point2.x) / 2,
//             y: (point1.y + point2.y) / 2,
//         }
//     }
// }

function getCenterEnd() {
    let points = getPoints();
    if (points.length === 1) {
        return getPointEnd(points[0]);
    } else {
        let point1 = getPointEnd(points[0]);
        let point2 = getPointEnd(points[1]);
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2,
        }
    }
}

export function registerPoint(event) {
    let point = {
        id: event.pointerId,
        startX: Math.round(event.x),
        startY: Math.round(event.y),
        x: Math.round(event.x),
        y: Math.round(event.y),
    };

    points[point.id] = point;
    resetMulti();
}

export function deletePoint(event) {
    delete points[event.pointerId];
    resetMulti();
}

export function changePoint(event) {
    let point = points[event.pointerId];
    if (point) {
        point.x = Math.round(event.x);
        point.y = Math.round(event.y);
        onChange();
    }
}

export function getPoints() {
    return Object.values(points);
}

let events = {
    rotate: null,
    scale: null,
    scaleStart: null,
    move: null,
};

export function registerRotate(callback) {
    events.rotate = callback;
}

export function registerScale(callback, callback2) {
    events.scale = callback;
    events.scaleStart = callback2;
}

export function registerMove(callback) {
    events.move = callback;
}


function onChange() {
    let points = getPoints();
    if (events.move) checkMove();

    //Если пальцев два
    if (points.length === 2) {
        let point1 = points[0];
        let point2 = points[1];
        let start = [getPointStart(point1), getPointStart(point2)];
        let end = [getPointEnd(point1), getPointEnd(point2)];

        if (events.rotate) checkRotation(start, end);
        if (events.scale) checkScale(start, end);
    }
}

//Для отключения дерганья, при повторном использовании
function resetMulti() {
    rotationPrev = null;
    scalePrev = null;
    movePrev = null;
}

let rotationPrev = null;

function checkRotation(start, end) {
    let rotation = getRotation(start, end);

    if (rotationPrev === null) {
        rotationPrev = rotation;
    }

    //Угол изменения вращения от последнего учтеного состояния
    let speed = rotation - rotationPrev;

    //Положительньный угол изменения
    let deg = Math.abs(speed);

    //Изменение угла должно быть больше 1 градуса, для откидывания дрожания
    if (deg > 1) {
        //Сохраняем последнее учтенное состояние
        rotationPrev = rotation;

        //Удаляем переход градусов
        //Вызываем событие вращения
        if (deg <= 180) events.rotate(speed);
    }
}

let scalePrev = null;

function checkScale(start, end) {
    let scale = getScale(start, end);

    if (scalePrev === null) {
        scalePrev = scale;
        events.scaleStart();
    }
    let speed = getScale(start, end);


    events.scale(speed);
}

let movePrev = null;

function checkMove() {
    let end = getCenterEnd();

    if (movePrev === null) {
        movePrev = end;
    }

    let {x, y} = getXY(movePrev, end);

    movePrev = end;

    events.move(x, y);
}