/*
    Wall Drawing #797 (1995)

    The first drafter has a black marker and makes an irregular horizontal line near the top of the wall. Then the second drafter tries to copy it (without touching it) using a red marker. The third drafter does the same, using a yellow marker. The fourth drafter does the same using a blue marker. Then the second drafter followed by the third and fourth copies the last line drawn until the bottom of the wall is reached.
  */

// Configure drawing
var COLORS = ['#4A90E2', '#D0021B', '#F8E71C'],
  NUM_COLORS = COLORS.length,
  LINE_PADDING = 4,
  LINE_THICKNESS = 6;

function drawLine(lastLine, lineId, width) {
  var line;

  if (lastLine === undefined) {
    line = new Path([new Point(0, 0), new Point(width, 0)]);
    line.strokeColor = '#000000';
    bumpPath(line, 72);
    //line.reduce();
    //line.simplify();
    line.smooth();
  } else {
    line = lastLine.clone();
    line.strokeColor = COLORS[lineId % NUM_COLORS];
    //line.smooth();
    line.reduce();
  }

  //line.reduce();

  line.strokeWidth = LINE_THICKNESS;
  //line.selected = true;
  return line;
}

// The instruction calls for not-straight lines,
// so we add some variation to them there.

function bumpPath(path, numBumps) {
  var j = -1,
    bumpPoint,
    handlePoint,
    furthestX = 0,
    segmentLength = path.length / numBumps;

  while (++j < numBumps) {
    // Path actually gets longer as we add bumps...
    segmentLength = path.length / numBumps;

    // Choose a random point along this segment.
    bumpPoint = path.getLocationAt(
      furthestX + segmentLength * Point.random().x
    );
    bumpPoint.point.y += Point.random().y * randomNegative() * 24;

    // Handles define the bezier curve for the line.
    // Makes them appear a little more hand drawn.
    handlePoint = Point.random() * 3;
    path.insert(j + 1, new Segment(bumpPoint.point, handlePoint, handlePoint));
    furthestX =
      furthestX > bumpPoint.point.x
        ? furthestX + segmentLength
        : bumpPoint.point.x + segmentLength;
  }

  return path;
}

function randomNegative() {
  return Point.random().x > 0.5 ? -1 : 1;
}

function onResize() {
  if (
    __lastWidth === view.viewSize.width &&
    __lastHeight === view.viewSize.height
  ) {
    // No need to redraw because size hasn't changed.
    return;
  }

  //Wipe layer
  project.activeLayer.removeChildren();

  draw();
}

function draw() {
  console.time('Drawing #797 in');

  var viewWidth = view.viewSize.width,
    viewHeight = view.viewSize.height,
    lineHeight = LINE_THICKNESS + LINE_PADDING,
    numLines = viewHeight / lineHeight,
    line,
    lastLine;
  (lineId = 0), (i = -1);

  while (++i < numLines) {
    line = drawLine(lastLine, lineId++, viewWidth);
    line.position.y = i * lineHeight;
    line.position.x = 0 + viewWidth / 2;
    lastLine = line;
  }

  console.timeEnd('Drawing #797 in');

  __lastWidth = viewWidth;
  __lastHeight = viewHeight;
}

draw();
