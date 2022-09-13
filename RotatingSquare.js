/**
 * @file
 *
 * Summary.
 *
 * Vertices are scaled by an amount that varies by
 * frame, and this value is passed to the draw function.
 *
 * @author Stephanie Orazem
 * @since 12/09/2022
 * @see https://orion.lcg.ufrj.br/cs336/examples/example123/content/GL_example3a.html
 */

 "use strict";

 /**
  * Raw data for some point positions -
  * this will be a square, consisting of two triangles.
  * <p>We provide two values per vertex for the x and y coordinates
  * (z will be zero by default).</p>
  * @type {Float32Array}
  */
 var vertices = new Float32Array([
     -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
 ]);
 
 /**
  * Number of points (vertices).
  * @type {Number}
  */
 var numPoints = vertices.length / 2;
 
 // A few global variables...
 
 /**
  * Canvas width.
  * @type {Number}
  */
 var w;
 
 /**
  * Canvas height.
  * @type {Number}
  */
 var h;

 /**
  * Current fixed edge index
  * @type {Number}
  */
 var edge = 0;

/**
 * Index for each edge
 * @type {Number}
 */
const indexCoord = {
    'r': 0, 
    'g': 1, 
    'b': 2, 
    'w': 3
};

/**
 * Event listener for pressed key
 */
document.addEventListener("keydown", (e) => {
    if (e.key === 'r' ||
        e.key === 'g' ||
        e.key === 'b' ||
        e.key === 'w') {
        edge = indexCoord[e.key];
    }
});
 
 /**
  * Maps a point in world coordinates to viewport coordinates.<br>
  * - [-n,n] x [-n,n] -> [-w,w] x [h,-h]
  * <p>Note that the Y axix points downwards.</p>
  * @param {Number} x point x coordinate.
  * @param {Number} y point y coordinate.
  * @param {Number} n window size.
  * @returns {Array<Number>} transformed point.
  */
 function mapToViewport(x, y, n = 5) {
     return [((x + n / 2) * w) / n, ((-y + n / 2) * h) / n];
 }
 
 /**
  * Returns the coordinates of the vertex at index i.
  * @param {Number} i vertex index.
  * @returns {Array<Number>} vertex coordinates.
  */
 function getVertex(i) {
     let j = (i % numPoints) * 2;
     return [vertices[j], vertices[j + 1]];
 }
 
 /**
  * Code to actually render our geometry.
  * @param {CanvasRenderingContext2D} ctx canvas context.
  * @param {Number} scale scale factor.
  * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
  */
 function draw(ctx, rotation) {
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.rect(0, 0, w, h);
    ctx.fill();

    ctx.beginPath();
    let matrix = new DOMMatrix();
    let points = [];

    for (let i = 0; i < numPoints; i++) {
        let [x, y] = mapToViewport(...getVertex(i));
        let point = new DOMPoint(x,y);
        points.push(point);

        if (i == edge) var m = matrix.translate(w-x, h-y, 0).rotate(rotation).translate(x-w, y-h, 0);

    }

    for (let i = 0; i < numPoints; i++) {
        let pointRotated = points[i].matrixTransform(m);
        if (i == 0) ctx.moveTo(pointRotated.x, pointRotated.y);
        else ctx.lineTo(pointRotated.x, pointRotated.y);
     }
     ctx.closePath();
 
     // the fill color
     ctx.fillStyle = "rgba(0, 204, 204, 1)";
     ctx.fill();
 }
 
 /**
  * <p>Entry point when page is loaded.</p>
  *
  * Basically this function does setup that "should" only have to be done once,<br>
  * while draw() does things that have to be repeated each time the canvas is
  * redrawn.
  */
 function mainEntrance() {
     // retrieve <canvas> element
     var canvasElement = document.querySelector("#theCanvas");
     var ctx = canvasElement.getContext("2d");
 
     w = canvasElement.width;
     h = canvasElement.height;
 
     /**
      * A closure to set up an animation loop in which the
      * scale grows by "increment" each frame.
      * @global
      * @function
      */
     var runanimation = (() => {
         var rotation = 0;
 
         return () => {
            draw(ctx, rotation);
            rotation -= 2;
            if (rotation < -360) {
                rotation = 0;
            }
             
             // request that the browser calls runanimation() again "as soon as it can"
             requestAnimationFrame(runanimation);
         };
     })();
 
     // draw!
     runanimation();
 }