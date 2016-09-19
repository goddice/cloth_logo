function lerp(a, b, p) {
    return (b-a)*p + a;
}

function sq(x) {
    return x * x;
}

function lengthP(a, b) {
    return Math.sqrt(sq(a.x - b.x) + sq(a.y - b.y));
}
function rasterizeTriangle(ctx, img, v1, v2, v3, mirror) {
    var fv1 = {
        x: 0,
        y: 0,
        u: 0,
        v: 0
    };
    fv1.x = v1.x;
    fv1.y = v1.y;
    fv1.u = v1.u;
    fv1.v = v1.v;
    ctx.save();
    // Clip to draw only the triangle
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.clip();
    // compute mirror point and flip texture coordinates for lower-right triangle
    if (mirror) {
        fv1.x = fv1.x + (v3.x - v1.x) + (v2.x - v1.x);
        fv1.y = fv1.y + (v3.y - v1.y) + (v2.y - v1.y);
        fv1.u = v3.u;
        fv1.v = v2.v;
    }
    //
    var angleX = Math.atan2(v2.y - fv1.y, v2.x - fv1.x);
    var angleY = Math.atan2(v3.y - fv1.y, v3.x - fv1.x);
    var scaleX = lengthP(fv1, v2);
    var scaleY = lengthP(fv1, v3);
    var cos = Math.cos;
    var sin = Math.sin;
    // ----------------------------------------
    //     Transforms
    // ----------------------------------------
    // projection matrix (world relative to center => screen)
    var transfMatrix = [];
    transfMatrix[0] = cos(angleX) * scaleX;
    transfMatrix[1] = sin(angleX) * scaleX;
    transfMatrix[2] = cos(angleY) * scaleY;
    transfMatrix[3] = sin(angleY) * scaleY;
    transfMatrix[4] = fv1.x;
    transfMatrix[5] = fv1.y;
    ctx.setTransform.apply(ctx, transfMatrix);
    // !! draw !!
    ctx.drawImage(img, fv1.u, fv1.v, v2.u - fv1.u, v3.v - fv1.v,
        0, 0, 1, 1);
    //
    ctx.restore();
}


window.onload = function() {
    var canvas = document.getElementById("scratch");
    var img = document.getElementById("logo");

    // canvas dimensions
    var width = parseInt(canvas.style.width);
    var height = parseInt(canvas.style.height);

    // retina
    var dpr = window.devicePixelRatio || 1;
    canvas.width = width*dpr;
    canvas.height = height*dpr;
    canvas.getContext("2d").scale(dpr, dpr);

    // simulation
    var sim = new VerletJS(width, height, canvas);
    sim.gravity = new Vec2(0.0, 5);
    sim.friction = 0.9;
    sim.highlightColor = 'rgba(0, 0, 0, 0)'; //"#4f545c";

    // entities
    var min = Math.min(width,height)*0.5;
    var segments = 20;
    var cloth = sim.cloth(new Vec2(width/2,height/3), min, min, segments, 1, 5.9);

    cloth.drawConstraints = function(ctx, composite) {
        var deltaW = img.width / (segments - 1);
        var deltaH = img.height / (segments - 1);

        var x,y;
        for (y = 0; y < segments - 1; y++) {
            for (x = 0; x < segments - 1; x++) {

                var i1 = y * segments + x;
                var i2 = (y + 1) * segments + x + 1;

                var v1 = {
                    x: cloth.particles[i1].pos.x,
                    y: cloth.particles[i1].pos.y,
                    u: x * deltaW,
                    v: y * deltaH
                };
                var v2 = {
                    x: cloth.particles[i1 + 1].pos.x,
                    y: cloth.particles[i1 + 1].pos.y,
                    u: (x + 1) * deltaW,
                    v: y * deltaH
                };
                var v3 = {
                    x: cloth.particles[i2 - 1].pos.x,
                    y: cloth.particles[i2 - 1].pos.y,
                    u: x * deltaW,
                    v: (y + 1) * deltaH
                };
                var v4 = {
                    x: cloth.particles[i2].pos.x,
                    y: cloth.particles[i2].pos.y,
                    u: (x + 1) * deltaW,
                    v: (y + 1) * deltaH
                };


                rasterizeTriangle(ctx, img, v1, v2, v3, false);
                rasterizeTriangle(ctx, img, v4, v2, v3, true);
                //ctx.beginPath();
//
                //var i1 = (y-1)*segments+x-1;
                //var i2 = (y)*segments+x;
//
                //ctx.moveTo(cloth.particles[i1].pos.x, cloth.particles[i1].pos.y);
                //ctx.lineTo(cloth.particles[i1+1].pos.x, cloth.particles[i1+1].pos.y);
//
                //ctx.lineTo(cloth.particles[i2].pos.x, cloth.particles[i2].pos.y);
                //ctx.lineTo(cloth.particles[i2-1].pos.x, cloth.particles[i2-1].pos.y);
//
                //var off = cloth.particles[i2].pos.x - cloth.particles[i1].pos.x;
                //off += cloth.particles[i2].pos.y - cloth.particles[i1].pos.y;
                //off *= 0.25;
//
                //var coef = Math.round((Math.abs(off)/stride)*255);
                //if (coef > 255)
                //    coef = 255;
//
                //ctx.fillStyle = "rgba(" + coef + ",0," + (255-coef)+ "," +lerp(0.25,1,coef/255.0)+")";
//
                //ctx.fill();


                //ctx.drawImage(img, (x-1)*stride, (y-1)*stride, stride, stride, (x-1)*stride, (y-1)*stride, stride, stride);
            }
        }

        var c;
        for (c in composite.constraints) {
            if (composite.constraints[c] instanceof PinConstraint) {
                var point = composite.constraints[c];
                ctx.beginPath();
                ctx.arc(point.pos.x, point.pos.y, 1.2, 0, 2*Math.PI);
                ctx.fillStyle = "rgba(255,0,0,0)";
                ctx.fill();
            }
        }
    }

    cloth.drawParticles = function(ctx, composite) {
        // do nothing for particles
    }

    // animation loop
    var legIndex = 0;
    var loop = function() {
        sim.frame(16);
        sim.draw();
        requestAnimFrame(loop);
    };

    loop();
};