var cat = document.getElementById('cat'),
    body = document.getElementsByTagName("body")[0]
    rip = document.getElementById('spin'),
    rot = 0,
    dRot = 0.5,
    deg = 0,
    x = 0,
    y = 0,
    dx = 0,
    dy = 0,
    xFlipped = 0,
    yFlipped = 0,
    currInterval = null; 

// Let it rip screen variables
var rip2 = document.getElementById('makeitspin'),
    pBar = document.getElementById('bar'),
    pBarDiv = document.getElementById('pBarDiv'),
    ripvis = false,
    ripInterval = null,
    color = "white",
    width = 0,
    threshold = 15;

var numClicks = 0,
    clicksReq = Math.ceil(threshold / dRot);

var bodyRect = body.getBoundingClientRect();
var hitBoundaries = function(catRect, bodyRect) {
    // Returns two booleans indicating whether or not the x and y boundaries have been hit.
    hitXBounadry = (catRect.right > bodyRect.right - 15) || (catRect.left < bodyRect.left + 15)
    //TODO: figure out why top bounding rect is -100, for now just use 0 instead of bodyRect.top
    hitYBoundary = (catRect.bottom > bodyRect.bottom - 15) || (catRect.top < 0 + 15) 
    return [hitXBounadry, hitYBoundary]
}

cat.onclick = function() {
    rot = rot + dRot;
    numClicks += 1;

    // Show progress bar after first click/
    if (!pBarDiv.style.visibility) {
        pBarDiv.style.visibility = "visible";
    }
    // Split up if statements so progress bar completes correctlty.
    if (rot <= threshold)  {
        var perc = numClicks / clicksReq * 100;
        pBar.style.width = perc + "%";
    }
    if (rot >= threshold) {
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

    // Despite having the verb 'set', setInterval does not replace
    // the old interval. So clear it first or else the cat will
    // get too dizzy.
    clearInterval(currInterval);
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

        // If the cat gif hits a boundary, then change direction.
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
    pBarDiv.style.visibility = "hidden";

    // Give each user a truly `U N I Q U E` experience by
    // moving the cat in a random direction and speed each time.
    dx = getRandomSpeed();
    dy = getRandomSpeed();
}