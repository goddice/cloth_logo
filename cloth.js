/**
 * Created by CelongLiu on 9/20/2016.
 */
////////////////////////////////
////////////////////////////////

var left_world;
var right_world;

left_world = new VerletJS(700, 700, document.getElementById("left_canvas"));
var left_triangle = new left_world.Composite();
right_world = new VerletJS(700, 700, document.getElementById("right_canvas"));
var right_triangle = new right_world.Composite();
right_world.gravity = new Vec2(-0.4, 0);
var left_segs = 15;
var right_segs = 15;

// canvas
var background_canvas = document.getElementById("background_canvas");
var left_canvas = document.getElementById("left_canvas");
var right_canvas = document.getElementById("right_canvas");
//
var time_passing = 10000;
//
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function inLeft(x, y) {
    var left_startX = 150;
    var left_startY = 230;
    var left_size = 280;
    var left_width = left_size;
    var left_height = left_size;

    if (x >= left_startX && y >= left_startY && (x + y) <= (left_startX + left_startY + left_size))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function inRight(x, y) {
    var right_size = 300;
    var right_width = right_size;
    var right_height = right_size;
    var right_startX = 470;
    var right_startY = 470;

    if (x <= right_startX && y <= right_startY && (x + y) >= (right_startX + right_startY - right_size))
    {
        return true;
    }
    else
    {
        return false;
    }
}
background_canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(background_canvas, evt);
    var posX = mousePos.x;
    var posY = mousePos.y;
    if (inLeft(posX, posY))
    {
        background_canvas.style.cursor = "url('cursors/choppinchleft.png'), default";
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 1;
        left_canvas.style.zIndex = 2;
    }
    else if (inRight(posX, posY))
    {
        background_canvas.style.cursor = "url('cursors/choppinchright.png'), default";
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 2;
        left_canvas.style.zIndex = 1;
    }
    else
    {
        background_canvas.style.cursor = "url('cursors/choppointer.png'), default";
    }
});
right_canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(right_canvas, evt);
    var posX = mousePos.x;
    var posY = mousePos.y;
    if (inLeft(posX, posY))
    {
        right_canvas.style.cursor = "url('cursors/choppinchleft.png'), default";
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 1;
        left_canvas.style.zIndex = 2;
    }
    else if (inRight(posX, posY))
    {
        right_canvas.style.cursor = "url('cursors/choppinchright.png'), default";
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 2;
        left_canvas.style.zIndex = 1;
    }
    else
    {
        right_canvas.style.cursor = "url('cursors/choppointer.png'), default";
    }
});
left_canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(left_canvas, evt);
    var posX = mousePos.x;
    var posY = mousePos.y;
    if (inLeft(posX, posY))
    {
        left_canvas.style.cursor = "url('cursors/choppinchleft.png'), default";
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 1;
        left_canvas.style.zIndex = 2;
    }
    else if (inRight(posX, posY))
    {
        left_canvas.style.cursor = "url('cursors/choppinchright.png'), default";
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 2;
        left_canvas.style.zIndex = 1;
    }
    else
    {
        left_canvas.style.cursor = "url('cursors/choppointer.png'), default";
    }
});
background_canvas.onmousedown = function (evt) {
    var mousePos = getMousePos(background_canvas, evt);
    var posX = mousePos.x;
    var posY = mousePos.y;
    if (inLeft(posX, posY))
    {
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 1;
        left_canvas.style.zIndex = 2;
    }
    if (inRight(posX, posY))
    {
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 2;
        left_canvas.style.zIndex = 1;
    }
};
left_canvas.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(left_canvas, evt);
    var posX = mousePos.x;
    var posY = mousePos.y;
    if (inLeft(posX, posY))
    {
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 1;
        left_canvas.style.zIndex = 2;
    }
    if (inRight(posX, posY))
    {
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 2;
        left_canvas.style.zIndex = 1;
    }
});
right_canvas.addEventListener('mousedown', function(evt) {
    var mousePos = getMousePos(right_canvas, evt);
    var posX = mousePos.x;
    var posY = mousePos.y;
    if (inLeft(posX, posY))
    {
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 1;
        left_canvas.style.zIndex = 2;
    }
    if (inRight(posX, posY))
    {
        background_canvas.style.zIndex = 0;
        right_canvas.style.zIndex = 2;
        left_canvas.style.zIndex = 1;
    }
});

////////////////////////////////
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

// constraint
var left_extractPoint = function (x, y) {
    let index = y * left_segs - y * (y - 1) / 2 + x;
    return left_triangle.particles[index];
};

var right_extractPoint = function (x, y) {
    let index = y * right_segs - y * (y - 1) / 2 + x;
    return right_triangle.particles[index];
};

function initializeWorld() {
    // background
    {
        var background = document.getElementById("background");
        var background_ctx = background_canvas.getContext("2d");
        background_ctx.drawImage(background, 150, 150);
    }
    // left world
    {
        var left_img = document.getElementById("left");
        var left_size = 280;
        var left_width = left_size;
        var left_height = left_size;
        var left_interval = left_size / (left_segs - 1);
        var left_startX = 150;
        var left_startY = 230;


        // geometry
        for (var j = 0; j < left_segs; j++)
        {
            for (var i = 0; i < left_segs - j; i++)
            {
                let p = new Vec2(left_startX + i * left_interval, left_startY + j * left_interval);
                left_triangle.particles.push(new Particle(p));
                if (j === 0)
                {
                    left_triangle.pin(i, p);
                }
            }
        }

        for (var j = 0; j < left_segs - 1; j++)
        {
            for (var i = 0; i < left_segs - j; i++)
            {
                if (i === left_segs - j - 1)
                {
                    left_triangle.constraints.push(new DistanceConstraint(left_extractPoint(j, i), left_extractPoint(j + 1, i - 1), 2));
                }
                else
                {
                    left_triangle.constraints.push(new DistanceConstraint(left_extractPoint(j, i), left_extractPoint(j, i + 1), 2));
                    left_triangle.constraints.push(new DistanceConstraint(left_extractPoint(j, i), left_extractPoint(j + 1, i), 2));
                }
            }
        }

        left_triangle.drawConstraints = function(ctx, composite) {
            let deltaW = left_width / (left_segs - 1);
            let deltaH = left_height / (left_segs - 1);

            let x,y;
            for (y = 0; y < left_segs - 1; y++) {
                for (x = 0; x < left_segs - y - 1; x++) {


                    var v1 = {
                        x: left_extractPoint(x, y).pos.x,
                        y: left_extractPoint(x, y).pos.y,
                        u: x * deltaW,
                        v: y * deltaH
                    };
                    var v2 = {
                        x: left_extractPoint(x + 1, y).pos.x,
                        y: left_extractPoint(x + 1, y).pos.y,
                        u: (x + 1) * deltaW,
                        v: y * deltaH
                    };
                    var v3 = {
                        x: left_extractPoint(x, y + 1).pos.x,
                        y: left_extractPoint(x, y + 1).pos.y,
                        u: x * deltaW,
                        v: (y + 1) * deltaH
                    };

                    if (x < left_segs - y - 2)
                    {
                        var v4 = {
                            x: left_extractPoint(x + 1, y + 1).pos.x,
                            y: left_extractPoint(x + 1, y + 1).pos.y,
                            u: (x + 1) * deltaW,
                            v: (y + 1) * deltaH
                        };
                    }

                    rasterizeTriangle(ctx, left_img, v1, v2, v3, false);
                    if (x < left_segs - y - 2)
                    {
                        rasterizeTriangle(ctx, left_img, v4, v2, v3, true);
                    }
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
        };

        left_triangle.drawParticles = function(ctx, composite) {
            // do nothing for particles
        };

        left_world.composites.push(left_triangle);
        left_world.gravity = new Vec2(-0.2, 0.4);
        left_world.highlightColor = 'rgba(0, 0, 0, 0)';
    }

    // right world
    {
        var right_img = document.getElementById("right");
        var right_size = 300;
        var right_width = right_size;
        var right_height = right_size;
        var right_interval = right_size / (right_segs - 1);
        var right_startX = 470;
        var right_startY = 470;

        // geometry
        for (var j = 0; j < right_segs; j++)
        {
            for (var i = 0; i < right_segs - j; i++)
            {
                let p = new Vec2(right_startX - i * right_interval, right_startY - j * right_interval);
                right_triangle.particles.push(new Particle(p));
                if (i === 0)
                {
                    right_triangle.pin(j, p);
                }
            }
        }
        // constraint
        for (var j = 0; j < right_segs - 1; j++)
        {
            for (var i = 0; i < right_segs - j; i++)
            {
                if (i === right_segs - j - 1)
                {
                    right_triangle.constraints.push(new DistanceConstraint(right_extractPoint(j, i), right_extractPoint(j + 1, i - 1), 1));
                }
                else
                {
                    right_triangle.constraints.push(new DistanceConstraint(right_extractPoint(j, i), right_extractPoint(j, i + 1), 1));
                    right_triangle.constraints.push(new DistanceConstraint(right_extractPoint(j, i), right_extractPoint(j + 1, i), 1));
                }
            }
        }

        right_triangle.drawConstraints = function(ctx, composite) {
            let deltaW = right_width / (right_segs - 1);
            let deltaH = right_height / (right_segs - 1);

            let x,y;
            for (y = 0; y < right_segs - 1; y++) {
                for (x = 0; x < right_segs - y - 1; x++) {


                    var v1 = {
                        x: right_extractPoint(x, y).pos.x,
                        y: right_extractPoint(x, y).pos.y,
                        u: x * deltaW,
                        v: y * deltaH
                    };
                    var v2 = {
                        x: right_extractPoint(x + 1, y).pos.x,
                        y: right_extractPoint(x + 1, y).pos.y,
                        u: (x + 1) * deltaW,
                        v: y * deltaH
                    };
                    var v3 = {
                        x: right_extractPoint(x, y + 1).pos.x,
                        y: right_extractPoint(x, y + 1).pos.y,
                        u: x * deltaW,
                        v: (y + 1) * deltaH
                    };

                    if (x < right_segs - y - 2)
                    {
                        var v4 = {
                            x: right_extractPoint(x + 1, y + 1).pos.x,
                            y: right_extractPoint(x + 1, y + 1).pos.y,
                            u: (x + 1) * deltaW,
                            v: (y + 1) * deltaH
                        };
                    }

                    rasterizeTriangle(ctx, right_img, v1, v2, v3, false);
                    if (x < right_segs - y - 2)
                    {
                        rasterizeTriangle(ctx, right_img, v4, v2, v3, true);
                    }
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
        };

        right_triangle.drawParticles = function(ctx, composite) {
            // do nothing for particles
        };

        right_world.composites.push(right_triangle);
        right_world.highlightColor = 'rgba(0, 0, 0, 0)';
    }
}

var restorWorld = function ()
{
    var left_size = 280;
    var left_segs = 10;
    var left_interval = left_size / (left_segs - 1);
    var left_startX = 150;
    var left_startY = 230;


    // geometry
    for (var j = 0; j < left_segs; j++)
    {
        for (var i = 0; i < left_segs - j; i++)
        {
            let p = left_extractPoint(i, j);
            p = new Vec2(left_startX + i * left_interval, left_startY + j * left_interval);
        }
    }


    var right_size = 300;
    var right_interval = right_size / (right_segs - 1);
    var right_startX = 470;
    var right_startY = 470;

    // geometry
    for (var j = 0; j < right_segs; j++)
    {
        for (var i = 0; i < right_segs - j; i++)
        {
            let p = right_extractPoint(i, j);
            p.x = right_startX - i * right_interval;
            p.y = right_startY - j * right_interval;
            //p = new Vec2(right_startX - i * right_interval, right_startY - j * right_interval);
        }
    }
};

var fps = 32; // the frame rate of the world

function renderWorld() {
    //
    if (time_passing > 500)
    {
        restorWorld();
    }
    else {
        time_passing += 1;
    }
    right_world.frame(16);
    right_world.draw();
    left_world.frame(16);
    left_world.draw();
    setTimeout(renderWorld, 1000 / fps);
}

window.addEventListener("load", function() {
    //

    // left dot
    var left_dot = document.getElementById("left_dot");
    left_dot_ctx = left_dot.getContext("2d");
    var centerX = left_dot.width / 2;
    var centerY = left_dot.height / 2;
    var radius = 15;

    left_dot_ctx.beginPath();
    left_dot_ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    left_dot_ctx.fillStyle = 'black';
    left_dot_ctx.fill();

    left_dot.addEventListener("mousemove", function(ev) {
        var mousePos = getMousePos(left_dot, ev);
        if (lengthP(mousePos, new Vec2(centerX, centerY)) <= radius)
        {
            left_dot.style.cursor = "url('cursors/choppeace.png'), default";
            var gradient = left_dot_ctx.createRadialGradient(centerX,centerY,0.1,centerX,centerY,radius);
            gradient.addColorStop(0, "#F8D675");
            gradient.addColorStop(0.25, "#EE652E");
            gradient.addColorStop(0.5, "#E63641");
            gradient.addColorStop(0.75, "#B01387");
            gradient.addColorStop(1, "#6424CD");
            left_dot_ctx.fillStyle = gradient;
            left_dot_ctx.fill();
        }
    });

    left_dot.addEventListener("mouseout", function(ev){
        left_dot_ctx.fillStyle = 'black';
        left_dot_ctx.fill();
    });

    left_dot.addEventListener("click", function(ev) {
        var mousePos = getMousePos(left_dot, ev);
        if (lengthP(mousePos, new Vec2(centerX, centerY)) <= radius)
        {
            var win = window.open("https://www.instagram.com/chop__wood/");
            win.focus();
        }
    });

    // mid dot
    var mid_dot = document.getElementById("mid_dot");
    mid_dot_ctx = mid_dot.getContext("2d");
    var centerX = mid_dot.width / 2;
    var centerY = mid_dot.height / 2;
    var radius = 15;

    mid_dot_ctx.beginPath();
    mid_dot_ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    mid_dot_ctx.fillStyle = 'black';
    mid_dot_ctx.fill();

    mid_dot.addEventListener("mousemove", function(ev) {
        var mousePos = getMousePos(mid_dot, ev);
        if (lengthP(mousePos, new Vec2(centerX, centerY)) <= radius)
        {
            mid_dot.style.cursor = "url('cursors/chopfb.png'), default";
            mid_dot_ctx.fillStyle = '#3b5998';
            mid_dot_ctx.fill();
        }
    });

    mid_dot.addEventListener("mouseout", function(ev){
            mid_dot_ctx.fillStyle = 'black';
            mid_dot_ctx.fill();
    });

    mid_dot.addEventListener("click", function(ev) {
        var mousePos = getMousePos(mid_dot, ev);
        if (lengthP(mousePos, new Vec2(centerX, centerY)) <= radius)
        {
            var win = window.open("http://www.facebook.com/chopwooddottv");
            win.focus();
        }
    });

    // right dot
    var right_dot = document.getElementById("right_dot");
    right_dot_ctx = right_dot.getContext("2d");
    var centerX = right_dot.width / 2;
    var centerY = right_dot.height / 2;
    var radius = 15;

    right_dot_ctx.beginPath();
    right_dot_ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    right_dot_ctx.fillStyle = 'black';
    right_dot_ctx.fill();

    right_dot.addEventListener("mousemove", function(ev) {
        var mousePos = getMousePos(right_dot, ev);
        if (lengthP(mousePos, new Vec2(centerX, centerY)) <= radius)
        {
            right_dot.style.cursor = "url('cursors/choppeace.png'), default";
            right_dot_ctx.fillStyle = "#00ffb6";
            right_dot_ctx.fill();
        }
    });

    right_dot.addEventListener("mouseout", function(ev){
        right_dot_ctx.fillStyle = 'black';
        right_dot_ctx.fill();
    });

    right_dot.addEventListener("click", function(ev) {
        var mousePos = getMousePos(right_dot, ev);
        if (lengthP(mousePos, new Vec2(centerX, centerY)) <= radius)
        {
            var win = window.open("http://erikau.li");
            win.focus();
        }
    });
    //

    var address = document.getElementById("address");
    address.addEventListener('mousemove', function (evt) {
        address.style.cursor = "url('cursors/chopmaps.png'), default";
        address.style.color = "yellow";
        address.style.textDecoration = "line-through";
    });
    address.addEventListener('mouseout', function (evt) {
        address.style.color = "white";
        address.style.textDecoration = "";
    });


    var email = document.getElementById("email");
    email.addEventListener('mousemove', function (evt) {
        email.style.cursor = "url('cursors/chopshake.png'), default";
        email.style.color = "yellow";
        email.style.textDecoration = "line-through";
    });
    email.addEventListener('mouseout', function (evt) {
        email.style.color = "white";
        email.style.textDecoration = "";
    });


    //
    initializeWorld();
    renderWorld();
});