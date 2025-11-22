
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

function pathLabel(ctx,path,scale) { //assumes path goes from bottom left to upper right
    let prev = path[0];
    for (let i = 1; i < path.length; i++) {
        let cur = path[i];
        if (prev[0] == cur[0]) { //vertical segment
            for (let j = cur[1]; j < prev[1]; j += scale) {//canvas coords, bottom left has higher y val
                ctx.fillText("0",prev[0]+.1*scale,j+.7*scale);
            }
        }
        else {
            for (let j = prev[0]; j < cur[0]; j+= scale) {
                ctx.fillText("1",j+.5*scale,prev[1]+.4*scale);
            }
        }
        prev = path[i];
    }
    return;
}

function pathLabel2(ctx,path,colors,scale) { //alternates between different colors
    let colori = 0;
    let prev = path[0];
    for (let i = 1; i < path.length; i++) {
        let cur = path[i];
        if (prev[0] == cur[0]) { //vertical segment
            for (let j = prev[1]-scale; j >= cur[1]; j -= scale) {//canvas coords, bottom left has higher y val
                ctx.fillStyle = colors[colori];
                colori = (colori + 1) % colors.length;
                ctx.fillText("0",prev[0]+.1*scale,j+.7*scale);
            }
        }
        else {
            for (let j = prev[0]; j < cur[0]; j+= scale) {
                ctx.fillStyle = colors[colori];
                colori = (colori + 1) % colors.length;
                ctx.fillText("1",j+.5*scale,prev[1]+.4*scale);
            }
        }
        prev = path[i];
    }
    return;
}
// function ltext(ctx,x,y,scale) {
//     ctx.fillText("0",x+.2*scale,y+.5*scale);
// }

// function btext(ctx,str,x,y,scale) {
//     ctx.fillText("1",x+.5*scale,y+.2*scale);
// }

export {partToCoords, scale, rotate, offset, bbox, bboxCenter, pathLabel, pathLabel2};
