import * as g from '../../js/graphics.js';
import rough from 'roughjs';


import { useEffect, useRef } from "react";


export default function DrawSlides({ canvases }) {
    useEffect(() => {
    canvases.forEach((ref, i) => {
        const canvas = ref.current;
        if (!canvas) return;
        const rc = rough.canvas(canvas);
        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.translate(2,2);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        let scale = 30;
        let partStyle = {roughness: 0.5, hachureGap: 1.5};
        let partBoxStyle = {roughness: 0.5, hachureGap: 15, hachureAngle : 45};
        let partBoxStyle2 = {roughness: 0.5, hachureGap: 5, hachureAngle : 45};
        switch (i) {
            case 0 : { // littlewood-1
                let pts = g.scale(g.partToCoords([5,2,2,1,1]),scale);
                rc.polygon(pts, {...partStyle, fill: "darkseagreen"});
                }
                break;
            case 1 : { // littlewood-2
                let ptcore = g.offset(g.partToCoords([1]),[0,0]);
                let pt0 = g.offset(g.partToCoords([2,1]),[2,0]);
                let pt1 = g.offset(g.partToCoords([1,1]),[6,0]);
                ptcore = g.scale(ptcore, scale);
                pt0 = g.scale(pt0, scale);
                pt1 = g.scale(pt1, scale);
                rc.polygon(ptcore, {...partStyle, fill: "lightcoral"});
                rc.polygon(pt0, {...partStyle,  fill: "mediumorchid"});
                rc.polygon(pt1, {...partStyle,  fill: "slateblue"});
                }
                break;
            case 2: { // ex-partial
                let pts = g.partToCoords([4,3,1,1,1]);
                let b1 = g.offset(g.partToCoords([2]),[1,1]);
                let b2 = g.offset(g.partToCoords([1,1]),[0,3]);
                pts = g.scale(pts, scale);
                b1 = g.scale(b1, scale);
                b2 = g.scale(b2,scale);
                rc.polygon(pts, {...partStyle, fill: "darkseagreen"});
                rc.polygon(b1, {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(b2, {...partBoxStyle, fill: "mediumorchid"});
                rc.line(0,0,5*scale,0);
                rc.line(0,0,0,6*scale);
                };
                break;
            case 3: { // ex-filled
                let pts = g.partToCoords([4,3,1,1,1]);
                let b0 = g.scale(g.partToCoords([2]),scale);
                let b1 = g.scale(g.partToCoords([1,1]),scale);
                pts = g.scale(pts, scale);
                rc.polygon(pts, {...partStyle, fill: "darkseagreen"});
                
                rc.polygon(b0, {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[2*scale,0]), {...partBoxStyle, fill: "mediumorchid"});
                rc.polygon(g.offset(b0,[scale,scale]), {...partBoxStyle, fill: "slateblue"});
                rc.polygon(g.offset(b1,[0,scale]), {...partBoxStyle, fill: "mediumorchid"});
                rc.polygon(g.offset(b1,[0,3*scale]), {...partBoxStyle, fill: "lightcoral"});
                rc.line(0,0,5*scale,0);
                rc.line(0,0,0,6*scale);
                };
                break;
            case 4: { //n=2
                let b0 = g.scale(g.partToCoords([2]),scale);
                let b1 = g.scale(g.offset(g.partToCoords([1,1]),[3,0]),scale);

                rc.polygon(b0, {...partStyle, fill: "darkseagreen"});
                rc.polygon(b1, {...partStyle, fill: "darkseagreen"});

                rc.polygon(b0, {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(b1, {...partBoxStyle, fill: "lightcoral"});
                };
                break;
            case 5: {//n=4
                let p1 = g.scale(g.partToCoords([4]),scale);
                let p2 = g.scale(g.offset(g.partToCoords([3,1]),[0,2]),scale);
                let p3 = g.scale(g.offset(g.partToCoords([2,2]),[5,0]),scale);

                let b0 = g.scale(g.partToCoords([2]),scale);
                let b1 = g.scale(g.partToCoords([1,1]),scale);
                
                rc.polygon(p1, {...partStyle, fill: "darkseagreen"});
                rc.polygon(p2, {...partStyle, fill: "darkseagreen"});
                rc.polygon(p3, {...partStyle, fill: "darkseagreen"});
                //p1
                rc.polygon(b0, {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[2*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                //p2
                rc.polygon(g.offset(b0,[scale,2*scale]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b1,[0,2*scale]), {...partBoxStyle, fill: "lightcoral"});
                //p3
                rc.polygon(g.offset(b0,[5*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[5*scale,scale]), {...partBoxStyle, fill: "lightcoral"});

                };
                break;
            case 6: {//n=6, excluding 3,2,1
                let p1 = g.scale(g.partToCoords([6]),scale);
                let p2 = g.scale(g.offset(g.partToCoords([5,1]), [7,0]),scale);

                let p3 = g.scale(g.offset(g.partToCoords([4,2]), [0,3]),scale);
                let p4 = g.scale(g.offset(g.partToCoords([3,3]), [8,3]),scale);

                let p5 = g.scale(g.offset(g.partToCoords([4,1,1]),[13,0]),scale);

                let b0 = g.scale(g.partToCoords([2]),scale);
                let b1 = g.scale(g.partToCoords([1,1]),scale);
                
                rc.polygon(p1, {...partStyle, fill: "darkseagreen"});
                rc.polygon(p2, {...partStyle, fill: "darkseagreen"});
                rc.polygon(p3, {...partStyle, fill: "darkseagreen"});
                rc.polygon(p4, {...partStyle, fill: "darkseagreen"});
                rc.polygon(p5, {...partStyle, fill: "darkseagreen"});

                //p1
                rc.polygon(b0, {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[2*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[4*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                //p2
                rc.polygon(g.offset(b1,[7*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[8*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[10*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                //p3
                rc.polygon(g.offset(b0,[0,3*scale]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[2*scale,3*scale]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[0,4*scale]), {...partBoxStyle, fill: "lightcoral"});
                //p4
                rc.polygon(g.offset(b0,[8*scale,3*scale]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[8*scale,4*scale]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b1,[10*scale,3*scale]), {...partBoxStyle, fill: "lightcoral"});
                //p5
                rc.polygon(g.offset(b1,[13*scale,scale]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[13*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                rc.polygon(g.offset(b0,[15*scale,0]), {...partBoxStyle, fill: "lightcoral"});
                
                }
                break;
            case 7: {//n=6 3,2,1
                rc.polygon(g.scale(g.partToCoords([3,2,1]),scale), {...partStyle, fill: "lightcoral"});
                }
                break;
            case 8: {//n=6,28
                rc.polygon(g.scale(g.partToCoords([3,2,1]),scale), {...partStyle, fill: "lightcoral"});
                rc.polygon(g.scale(g.offset(g.partToCoords([5,4,3,2,1]),[4,0]),scale), {...partStyle, fill: "lightcoral"});
                }
                break;
            case 9 : {// fail-overlay
                rc.polygon(g.scale(g.partToCoords([5,4,4,2,1]),scale), {...partStyle, fill: "darkseagreen"});
                rc.polygon(g.scale(g.partToCoords([3,2,1]),scale), {...partStyle, hachureAngle : 45, hachureGap: 5, fill: "lightcoral"})
                };
                break;
            case 10 : {// ex chess overlay
                rc.polygon(g.scale(g.partToCoords([5,4,4,2,1]),scale), {...partStyle, fill: "darkseagreen"});
                let b = g.scale(g.partToCoords([1]),scale);
                rc.polygon(g.offset(b,[scale,0]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b,[0,scale]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b,[3*scale,0]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b,[2*scale,scale]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b,[scale,2*scale]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b,[0,3*scale]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b,[3*scale,2*scale]), {...partBoxStyle2, fill: "lightcoral"});
                };
                break;
            
            case 11 : {// domino chess overlay
                let b0 = g.scale(g.partToCoords([2]),scale);
                let b1 = g.scale(g.partToCoords([1,1]),scale);
                let b = g.scale(g.partToCoords([1]),scale);
                rc.polygon(b0, {...partStyle, fill: "darkseagreen"});
                rc.polygon(g.offset(b0,[0,2*scale]), {...partStyle, fill: "darkseagreen"});
                rc.polygon(g.offset(b1,[3*scale,0]), {...partStyle, fill: "darkseagreen"});
                rc.polygon(g.offset(b1,[5*scale,0]), {...partStyle, fill: "darkseagreen"});

                rc.polygon(g.offset(b,[scale,0]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b,[0,2*scale]), {...partBoxStyle2, fill: "lightcoral"});

                rc.polygon(g.offset(b,[3*scale,0]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b,[5*scale,scale]), {...partBoxStyle2, fill: "lightcoral"});
                };
                break;
            case 12 : { //border chess overlay [8,6,5,5,3,1,1,1]
                scale = 25;
                rc.polygon(g.scale(g.partToCoords([8,6,5,5,3,1,1,1]),scale), {...partStyle, fill: "darkseagreen"});
                rc.polygon(g.scale(g.partToCoords([6,5,4,3,1]),scale), {...partStyle, fill: "white"});
                rc.polygon(g.offset(g.scale(g.partToCoords([2]),scale),[3*scale,3*scale]), {...partBoxStyle2, fill: "lightcoral"});
                // let b = g.scale(g.partToCoords([1]),scale);
                };
                break;
            case 13 : { // partition example
                rc.polygon(g.scale(g.partToCoords([5,3,1,1]),scale), {...partStyle, fill: "darkseagreen"});
                };
                break;
            case 14 : { // examples of t-rim hooks
                scale = 20;
                rc.polygon(g.scale(g.partToCoords([8,7,5,3,2]),scale), {...partStyle, fill: "darkseagreen"});
                rc.polygon(g.scale([[2,2],[5,2],[5,3],[3,3],[3,4],[2,4],[2,5],[1,5],[1,3],[2,3],[2,2]],scale), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.scale([[6,0],[8,0],[8,1],[7,1],[7,2],[6,2],[6,0]],scale), {...partBoxStyle2, fill: "mediumorchid"})
                };
                break;
            case 15 : { // nonexamples of t-rim hooks
                scale = 20;
                rc.polygon(g.scale(g.partToCoords([8,7,5,3,2]),scale), {...partStyle, fill: "darkseagreen"});
                rc.polygon(g.scale([[0,3],[3,3],[3,4],[2,4],[2,5],[0,5],[0,3]],scale), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.scale([[6,0],[7,0],[7,2],[5,2],[5,1],[6,1],[6,0]],scale), {...partBoxStyle2, fill: "mediumorchid"})
                };
                break;
            case 16 : {
                rc.polygon(g.scale(g.partToCoords([10,5,5,2,2]),scale), {...partStyle, fill: "darkseagreen"});
                let b0 = g.scale(g.partToCoords([3]),scale);
                let b1 = g.scale(g.partToCoords([2,1]),scale);
                let b2 = g.scale([[1,0],[2,0],[2,2],[0,2],[0,1],[1,1],[1,0]],scale); //[2,1] inverted

                rc.polygon(g.offset(b0,[7*scale,0]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b2,[3*scale,scale]), {...partBoxStyle2, fill: "lightcoral"});
                rc.polygon(g.offset(b2,[0,3*scale]), {...partBoxStyle2, fill: "lightcoral"});

                rc.polygon(g.offset(b0,[4*scale,0]), {...partBoxStyle2, fill: "slateblue"});
                rc.polygon(g.offset(b1,[2*scale,scale]), {...partBoxStyle2, fill: "slateblue"});

                rc.polygon(g.offset(b1,[0,2*scale]), {...partBoxStyle2, fill: "mediumorchid"});
                };
                break;
        }
        ctx.restore();
    });
}, []);

    return null;

}