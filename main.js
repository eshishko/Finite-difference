var xStep = 0.1; // or deltaX
var currentXStep = xStep;
var firstX = 0;
var tStep = 0; //or deltaT
var tju = 0; //tau
var currentTStep = initializeStableTStep(xStep);
var data = new vis.DataSet();

var prevU = [];

function getUOnBeginT(xStep) {
  return Math.sin(Math.PI * xStep);
}

function getUOnPrevX(previousU, k) {
  var u = tju * (previousU[k+1] + previousU[k-1]) + (1 - 2*tju)*previousU[k];

  return u * 1;
}

function initializeStableTStep(deltaX) {
  tStep = (deltaX * deltaX) / 2;
  tStep = parseFloat(tStep).toFixed(5);
  tStep = tStep * 1;
  currentTStep = 0;

  tju = tStep / (deltaX * deltaX);
  tju = tju * 1;

  return currentTStep;
}

function nextXStep(step) {
  step = step * 1 + xStep * 1;

  return parseFloat(step).toFixed(4);
}

function nextTStep(step) {
  step = step * 1 + tStep * 1;

  return parseFloat(step).toFixed(4);
}


function iterate() {
  var prevU = [];

  for (var i = 0; currentTStep <= 1; i++) {
    currentXStep = firstX;
    for (var k = 0; currentXStep <= 1; k++) {
      var prevUI = [];
      if (i == 0) {
        var z = getUOnBeginT(currentXStep);
      } else if (currentXStep == 0 || currentXStep == 1) {
        var z = 0;
      } else {
        var z = getUOnPrevX(prevU[i-1], k);
      }
      printGraphResult(currentXStep, currentTStep, z);

      data.add({
        x: currentXStep,
        y: currentTStep * 1,
        z: z
      });

      if (!prevU[i]) {
        prevU[i] = [];
      }
      if (prevU[i-2]) {
        delete prevU[i-2];
      }
      prevU[i][k] = z;
      currentXStep = nextXStep(currentXStep) * 1;
    }
    currentTStep = nextTStep(currentTStep) * 1;
  }
}

iterate();
console.log(data);



function printGraphResult (x, y, z) {
    var container = document.getElementById('graph-results');
    var span = document.createElement('span');
    z = parseFloat(z).toFixed(8) * 1;
    span.innerHTML = 'x = ' + x + ' y = ' + y + ' z = ' + z + ' <br/>'
    container.appendChild(span);
}



function drawVisualization() {
    // Create and populate a data table.
    

    // specify options
    var options = {
      width:  '600px',
      height: '600px',
      style: 'surface',
      showPerspective: true,
      showGrid: true,
      showShadow: false,
      keepAspectRatio: true,
      verticalRatio: 0.5
    };

    // create a graph3d
    var container = document.getElementById('graph');
    graph3d = new vis.Graph3d(container, data, options);
}

drawVisualization();


function analyticResult() {
    var container = document.getElementById('analitic-result');
    var tStep = 0.05;
    var currentTStep = 0;

    for (var i = 0; currentTStep <= 1; i++) {
      currentXStep = firstX;
      for (var k = 0; currentXStep <= 1; k++) {
        var result = calcAnalytic(currentXStep, currentTStep);
        result = parseFloat(result).toFixed(8) * 1;

        var span = document.createElement('span');
        span.innerHTML = 'x = ' + currentXStep + ' t = ' + currentTStep + ' result = ' + result + ' <br/>'
        container.appendChild(span);

        currentXStep = (currentXStep + xStep);
        currentXStep = parseFloat(currentXStep).toFixed(4) * 1;
      }
      currentTStep = (currentTStep + tStep);
      currentTStep = parseFloat(currentTStep).toFixed(4) * 1;
    }
}

function calcAnalytic(x, t) {
  var expon = - (Math.PI * Math.PI * t);
  var result = Math.pow(Math.E, expon) * Math.sin(Math.PI * x);

  return result * 1;
}

analyticResult();