
function partToCoords(part) {
    let i = 0;
    let coords = [[0,0]];
    for (const row of part) {
        coords.push([row, i]);
        i++;
        coords.push([row, i]);
    }
    coords.push([0, i]);
    coords.push([0,0]);
    return coords;
}

function bbox(pts) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of pts) {
        minX = Math.min(minX, p[0]);
        maxX = Math.max(maxX, p[0]);
        minY = Math.min(minY, p[1]);
        maxY = Math.max(maxY, p[1]);
    }
    return [minX,minY,maxX,maxY];
}

function bboxCenter(pts) {
    const bds = bbox(pts);
    return [(bds[0]+bds[2])/2, (bds[1]+bds[3])/2];
}

function scale(pts, scale) {
    return pts.map((p) => [p[0]*scale, p[1]*scale]);
}

function rotate(pts, angle, ref=[0,0], scale=1) {
    return pts.map((p) => [(p[0]-ref[0]) * scale, (p[1]-ref[1]) * scale]).map(
        (p) => [p[0]*Math.cos(angle) - p[1]*Math.sin(angle), p[0]*Math.sin(angle) + p[1]*Math.cos(angle)]
    ).map((p) => [p[0]+ref[0],p[1]+ref[1]]);
}

function offset(pts, vec) {
    return pts.map((p) => [p[0]+vec[0], p[1]+vec[1]]);
}

export {partToCoords, scale, rotate, offset, bbox, bboxCenter};
