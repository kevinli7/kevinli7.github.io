var cat = document.getElementById('cat'),
    body = document.getElementsByTagName("body")[0]
    rip = document.getElementById('rip'),
    rot = 0,
    deg = 0,
    x = 0,
    y = 0,
    dx = 0,
    dy = 0,
    xFlipped = 0,
    yFlipped = 0,
    currInterval = null; 

// Let it rip screen variables
var rip2 = document.getElementById('letitrip'),
    ripvis = false,
    ripInterval = null,
    color = "white";

var bodyRect = body.getBoundingClientRect();
var hitBoundaries = function(catRect, bodyRect) {
    changeX = (catRect.right > bodyRect.right - 15) || (catRect.left < bodyRect.left + 15)
    changeY = (catRect.bottom > bodyRect.bottom - 15) || (catRect.top < bodyRect.top + 15)
    return [changeX, changeY]
}

cat.onclick = function() {
    rot = rot + 0.5;
    if (currInterval != null) {
      clearInterval(currInterval);
    } 
    if (rot > 10) {
        if (!ripvis) {
            ripvis = true;
            rip2.style.visibility = "visible";
            ripInterval = setInterval(
                function() {
                    rip2.style.color = color
                    if (color == "white") {
                        color = "red"
                    } else {
                        color = "white"
                    }
                },
                500);
        }
    }
    currInterval = setInterval(
      function() {
        // Rotation
        deg = (deg + rot) % 360;
        cat.style.transform = "rotate(" + deg + "deg)";

        // Translation
        x += dx;
        y += dy;
        cat.style.right = x + "px";
        cat.style.top = y + "px";
        bHit = hitBoundaries(cat.getBoundingClientRect(), bodyRect);
        if (bHit[0] && xFlipped == 0) {
          dx = -1 * dx;
          xFlipped = 50;
        }
        if (bHit[1] && yFlipped == 0) {
          dy = -1 * dy;
          yFlipped = 50;
        }
        xFlipped = Math.max(0, xFlipped - 1);
        yFlipped = Math.max(0, yFlipped - 1);
      }, 
      10);
};

var getRandomSpeed = function() {
    v = Math.floor(Math.random() * 5) + 5;
    return v * (1 - 2 * (Math.random() > 0.5));
}

rip.onclick = function() {
    clearInterval(ripInterval);
    rip2.style.visibility = "hidden";
    dx = getRandomSpeed();
    dy = getRandomSpeed();
}