const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initialize an empty array to hold multiple boxes
let boxCentre = [];
let boxTopPortion = [];
let boxBottomPortion = [];
let boxLeadingPosition = [];
let boxFollowingPosition = [];

let direction = 'right'; // Direction of movement, default is right
let moveInterval = null; // Store the interval reference for movement
let triggerPosition = canvas.width/2;
let QualityCOntrolOn = false

//createBox(canvas.width - canvas.width, canvas.height / 2, 100, 100, 0, '#C4A77D');
// Box factory function to create new boxes
function createBox(x, y, width, height, angle, color) {
        return {
            x,
            y,
            width,
            height,
            angle,
            color,
            initialWidth: width, // Store the initial width for reference
            initialHeight: height, // Store the initial height for reference
        };
}

// Draw all boxes in the boxes array
function drawBoxes() {

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

    boxCentre.forEach(box => {
        ctx.save(); // Save the current context state

        ctx.translate(box.x, box.y); // Move to box's position

        // Draw the box based on its shape and transformation
        ctx.fillStyle = box.color;
        ctx.fillRect(-box.width / 2, -box.height / 2, box.width, box.height);

        ctx.restore(); // Restore context to the saved state
    });
}

// Move all boxes based on the direction
function moveBoxes() {
    boxCentre.forEach(box => {
        if (direction === 'right') {
            box.x += 3; // Move to the right
        } else if (direction === 'left') {
            box.x -= 3; // Move to the left
        }
        alterShapeBasedOnPosition(box); // Alter shape as it moves
    });
    checkBoxBounds(); // Check if any box is out of bounds
    drawBoxes(); // Redraw boxes after moving
}

// Alter the box shape based on its position
function alterShapeBasedOnPosition(box) {
    // Change the box's shape as it moves across the canvas
    if (direction == "right"){
        if (box.x > triggerPosition) {
            // Flatten the box horizontally
            box.width = box.initialWidth;
            box.height = box.initialHeight;
            box.color = checkQualityControlStatus(box);
        }
    }else{

        if (box.x < triggerPosition) {
            // Flatten the box horizontally
            box.width = box.initialWidth;
            box.height = box.initialHeight;
            box.color = checkQualityControlStatus(box);
        }
    }
}

function checkQualityControlStatus(box){
    return QualityCOntrolOn ? inferQuality(box) : box.color;
}

function inferQuality(box){
    if (box.color !== 'red' ){
        return 'red'
    }else{
        return box.color
    }
}

function changeQualityControlState(){
    if (QualityCOntrolOn){
        QualityCOntrolOn = false;
    }else{
        QualityCOntrolOn = true;
    }
}

// Check if any box is out of bounds, and delete it if so
function checkBoxBounds() {
    boxCentre = boxCentre.filter(box => {
        return box.x + box.width / 2 > 0 && box.x - box.width / 2 < canvas.width;
    });
}

// Function to create a new box and add it to the array
function createNewBox() {
    if (direction == 'right'){


        switch (boxType){
            case "4_Corner":
                //createBox(x, y, width, height, angle, color)
                boxMiddle = createBox(canvas.width - canvas.width, canvas.height / 2, canvas.height/3, canvas.height/3, 0, '#C4A77D');
                boxTopPortion = createBox(  canvas.width - canvas.width,    //x position
                                            canvas.height / 2,              //y position
                                            canvas.height/3,                //width
                                            canvas.height/3,                //height
                                            0,                              //rotation
                                            '#C4A77D');                     //color

                boxBottomPortion = createBox();
                boxLeadingPosition = createBox();
                boxFollowingPosition = createBox();

            case "3_Point":
                //createBox(x, y, width, height, angle, color)
                boxMiddle = createBox();
                boxTopPortion = createBox();
                boxBottomPortion = createBox();
                boxLeadingPosition = createBox();
        }

    } else{
        boxMiddle = createBox(canvas.width, canvas.height / 2, canvas.height/3, canvas.height/3, 0, '#C4A77D');
    }
    boxCentre.push(boxMiddle);
    drawBoxes();
}

// Change direction of movement
function changeDirection(newDirection) {
    direction = newDirection; // Set the new direction
    clearInterval(moveInterval); // Clear any existing movement interval
    moveInterval = setInterval(moveBoxes, 16); // Start moving boxes in the new direction
}

// Start moving the boxes automatically to the right when the page loads
moveInterval = setInterval(moveBoxes, 16); // 60 FPS = 1000ms/60 ≈ 16ms per frame

// Initial call to draw the canvas
drawBoxes();