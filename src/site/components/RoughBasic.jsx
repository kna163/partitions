import rough from 'roughjs';
import { useEffect, useRef } from "react";

export default function RoughBasic() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");

    // clear + draw once
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rc.polygon([[5,5],[55,5],[55,15],[25,15],[25,35],[15,35],[15,55],[5,55],[5,5]], {roughness: 0.5, hachureGap: 1.5, fill: "darkseagreen"});
    rc.polygon([[40,30],[46,38],[38,44],[32,36],[40,30]], {roughness: 0.5, hachureGap: 1.5, fill: "lightcoral"})
    rc.polygon([[30,50],[40,50],[40,70],[30,70],[30,50]],  {roughness: 0.5, hachureGap: 1.5, fill: "mediumorchid"})
    rc.polygon([[50,30],[70,30],[70,40],[60,40],[60,50],[50,50],[50,30]], {roughness: 0.5, hachureGap: .8, fill: "slateblue"});
    // rc.rectangle(50, 50, 200, 100, { fill: "lightblue" });
    // rc.circle(150, 150, 80, { roughness: 2, stroke: "red" });

  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={80}
    //   style={}
    />
  );
}