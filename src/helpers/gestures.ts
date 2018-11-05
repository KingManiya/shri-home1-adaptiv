interface IPointEvent {
    x: number;
    y: number;
    id: number;
    startX: number;
    startY: number;
}

interface IPoint {
    x: number;
    y: number;
}

const allPoints: { [propName: number]: IPointEvent } = {};

function getXY(p1: IPoint, p2: IPoint) {
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
    };
}

export function getPointStart(p: IPointEvent): IPoint {
    return {
        x: p.startX,
        y: p.startY,
    };
}

export function getPointEnd(p: IPointEvent): IPoint {
    return {
        x: p.x,
        y: p.y,
    };
}

export function getDistance(p1: IPoint, p2: IPoint) {
    const {x, y} = getXY(p1, p2);

    return Math.sqrt(x * x + y * y);
}

export function getAngle(p1: IPoint, p2: IPoint) {
    const {x, y} = getXY(p1, p2);

    return Math.atan2(y, x) * 180 / Math.PI;
}

export function getRotation(start: IPoint[], end: IPoint[]): number {
    return getAngle(end[0], end[1]) + getAngle(start[0], start[1]);
}

export function getScale(start: IPoint[], end: IPoint[]) {
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

function getCenterEnd(): IPoint {
    const points = getPoints();
    if (points.length === 1) {
        return getPointEnd(points[0]);
    } else {
        const point1 = getPointEnd(points[0]);
        const point2 = getPointEnd(points[1]);
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2,
        };
    }
}

export function registerPoint(event: PointerEvent) {
    const point = {
        id: event.pointerId,
        startX: Math.round(event.x),
        startY: Math.round(event.y),
        x: Math.round(event.x),
        y: Math.round(event.y),
    };

    allPoints[point.id] = point;
    resetMulti();
}

export function deletePoint(event: PointerEvent) {
    delete allPoints[event.pointerId];
    resetMulti();
}

export function changePoint(event: PointerEvent) {
    const point = allPoints[event.pointerId];
    if (point) {
        point.x = Math.round(event.x);
        point.y = Math.round(event.y);
        onChange();
    }
}

export function getPoints() {
    return Object.values(allPoints);
}

interface IEvents {
    onRotate: ((speed: number) => void) | null;
    onScale: ((speed: number) => void) | null;
    onScaleStart: (() => void) | null;
    onMove: ((x: number, y: number) => void) | null;
}

const events: IEvents = {
    onRotate: null,
    onScale: null,
    onScaleStart: null,
    onMove: null,
};

export function registerRotate(onRotate: (speed: number) => void) {
    events.onRotate = onRotate;
}

export function registerScale(onScale: (speed: number) => void, onScaleStart: () => void) {
    events.onScale = onScale;
    events.onScaleStart = onScaleStart;
}

export function registerMove(onMove: (x: number, y: number) => void) {
    events.onMove = onMove;
}

function onChange() {
    const points = getPoints();
    if (events.onMove) {
        checkMove(events.onMove);
    }

    // Если пальцев два
    if (points.length === 2) {
        const point1 = points[0];
        const point2 = points[1];
        const start = [getPointStart(point1), getPointStart(point2)];
        const end = [getPointEnd(point1), getPointEnd(point2)];

        if (events.onRotate) {
            checkRotation(start, end, events.onRotate);
        }
        if (events.onScale && events.onScaleStart) {
            checkScale(start, end, events.onScale, events.onScaleStart);
        }
    }
}

// Для отключения дерганья, при повторном использовании
function resetMulti() {
    rotationPrev = null;
    scalePrev = null;
    movePrev = null;
}

let rotationPrev: number | null = null;

function checkRotation(start: IPoint[], end: IPoint[], onRotate: ((speed: number) => void)) {
    const rotation = getRotation(start, end);

    if (rotationPrev === null) {
        rotationPrev = rotation;
    }

    // Угол изменения вращения от последнего учтеного состояния
    const speed = rotation - rotationPrev;

    // Положительньный угол изменения
    const deg = Math.abs(speed);

    // Изменение угла должно быть больше 1 градуса, для откидывания дрожания
    if (deg > 1) {
        // Сохраняем последнее учтенное состояние
        rotationPrev = rotation;

        // Удаляем переход градусов
        // Вызываем событие вращения
        if (deg <= 180) {
            onRotate(speed);
        }
    }
}

let scalePrev: number | null = null;

function checkScale(start: IPoint[], end: IPoint[], onScale: (speed: number) => void, onScaleStart: () => void) {
    const scale = getScale(start, end);

    if (scalePrev === null) {
        scalePrev = scale;
        onScaleStart();
    }
    const speed = getScale(start, end);

    onScale(speed);
}

let movePrev: IPoint | null = null;

function checkMove(onMove: (x: number, y: number) => void) {
    const end = getCenterEnd();

    if (movePrev === null) {
        movePrev = end;
    }

    const {x, y} = getXY(movePrev, end);

    movePrev = end;

    onMove(x, y);
}