import { useEffect, useRef, createRef } from "react";

import * as g from '../../js/graphics.js';
import rough from 'roughjs';

export default function Grapher({canvasRef, items, roughlvl}) {
    useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    let roughval = 12.5*roughlvl*roughlvl;
    ctx.save();
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.translate(5,5);
    
    let scale = 30;
    let partStyle = {fill: "darkseagreen", roughness: roughval, hachureGap: 1.5};
    // let partBoxStyle = {roughness: roughval, hachureGap: 15, hachureAngle : 45};
    // let partBoxStyle2 = {roughness: roughval, hachureGap: 5, hachureAngle : 45};

    function helper(pts,e) {
        return g.offset(g.rotate(pts,e.rotation/180 * Math.PI, [0,0], scale*e.scale),e.translation.map(x => x * scale));
    }

    for (let e of items) {
        if (e.type == "Part") {
            let pts = helper(g.partToCoords(e.data.part),e);
            // { ...partStyle, ...e.data.style, ...(e.data.color ? { fill: e.data.color } : {}) });
            rc.polygon(pts, {...partStyle, ...e.options, ...(e.color ? {fill: e.color} : {})});
            console.log(e.options);
        }
        if (e.type == "Skew") {
            let pt_grps = g.skewPartToCoords(e.data.part, e.data.skew);
            pt_grps = pt_grps.map(x => helper(x,e));
            for (let pts of pt_grps) {
                rc.polygon(pts, {...partStyle, ...e.options, ...(e.color ? {fill: e.color} : {})});
                console.log(e.options);

            }
        }
        if (e.type == "Path") {
            let pts = helper(e.data.points,e);
            rc.linearPath(pts, {stroke: "black", ...e.options, ...(e.color ? {stroke: e.color} : {})});
            console.log(e.options);

        }
    }
    // let pts = g.scale(g.partToCoords([5,2,2,1,1]),scale);
    // rc.polygon(pts, {...partStyle, fill: "darkseagreen"});
    ctx.restore();
    }, [items,roughlvl]);
    return null;

}