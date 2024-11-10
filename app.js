const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initialize a dynamic array to hold box parts
let boxParts = [];

let boxBase = 0;

let direction = 'right'; // Direction of movement, default is right
let moveInterval = null; // Store the interval reference for movement
let triggerPosition = canvas.width / 2;
let QualityCOntrolOn = false;
let boxType = "4_Corner";

let canvasWidthModifier = 200;

// Box factory function to create new box parts
function createBoxPart(x, y, width, height, angle, color, verticalMorph, horizontalMorph) {
    return {
        x,
        y,
        width,
        height,
        angle,
        color,
        verticalMorph,
        horizontalMorph
    };
}

// Function to draw all the box parts
function drawBoxParts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
    
    // Loop through and draw all parts
    boxParts.forEach(box => {
        drawPart(box); // Draw each part
        alterPosition(box); // Move the part
        box.horizontalMorph ? alterHorizontalShapeBasedOnPosition(box) : null; // Alter shape as it moves
        box.verticalMorph ? alterVerticalShapeBasedOnPosition(box)  : null;

        if (!checkBoxBounds(box)) {
            removeBoxFromArray(box); // Remove the box part if it's out of bounds
        }
    });
}

// Helper function to draw a single box part
function drawPart(box) {
    ctx.save(); // Save the current context state
    ctx.translate(box.x, box.y); // Move to the box's position

    // Draw the box based on its shape and transformation
    ctx.fillStyle = box.color;
    ctx.fillRect(-box.width / 2, -box.height / 2, box.width, box.height);
    
    ctx.restore(); // Restore context to the saved state
}

// Move box parts based on the direction
function alterPosition(box) {
    if (direction === 'right') {
        box.x += 3; // Move to the right
    } else if (direction === 'left') {
        box.x -= 3; // Move to the left
    }
}

// Alter the box shape based on its position
function alterVerticalShapeBasedOnPosition(box) {
    if (direction === "right"){

        if(box.x > triggerPosition){
            box.width = boxBase;
            box.color = checkQualityControlStatus(box);
        }
    }else{
        if(box.x < triggerPosition){
            box.width = boxBase;
            box.color = checkQualityControlStatus(box);
        }
    };

};

// Alter the box shape based on its position
function alterHorizontalShapeBasedOnPosition(box) {
    if (direction === "right"){
        box.x > triggerPosition + triggerPosition/2 ? box.height = 0 : box.height = box.height;
    }else{
        box.x < triggerPosition - triggerPosition/2 ? box.height = 0 : box.height = box.height;
    };
};

// Check the Quality Control status of the box
function checkQualityControlStatus(box) {
    return QualityCOntrolOn ? inferQuality(box) : box.color;
}

// Infer quality based on color
function inferQuality(box) {
    return box.color !== 'red' ? 'red' : box.color;
}

// Change the Quality Control state
function changeQualityControlState() {
    QualityCOntrolOn = !QualityCOntrolOn;
}

// Check if a box part is out of bounds and return true/false
function checkBoxBounds(box) {
    return box.x + box.width / 2 > -(canvasWidthModifier) && box.x - box.width / 2 < canvas.width + canvasWidthModifier;
}

// Remove a box part from the dynamic array
function removeBoxFromArray(box) {
    boxParts = boxParts.filter(b => b !== box);
}

// Function to create a new box and add it to the array
function createNewBox() {
    switch (boxType) {
        case "4_Corner":
            
            let boxMiddle = createBoxPart(
                direction === "right" ? canvas.width - canvas.width : canvas.width,
                canvas.height / 2,
                canvas.height / 3,
                canvas.height / 3,
                0,
                '#C4A77D',
                false,
                false
            );
//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxTopFlap = createBoxPart(
                boxMiddle.x,
                canvas.height / 3.5,
                boxMiddle.width + boxMiddle.width*0.66,
                boxMiddle.height / 4,
                0,
                '#C4A77D',
                true,
                false
            );

            let boxBottomFlap = createBoxPart(
                boxMiddle.x,
                canvas.height - canvas.height / 3.5,
                boxMiddle.width + boxMiddle.width*0.66 ,
                boxMiddle.height / 4,
                0,
                '#C4A77D',
                true,
                false
            );
            //x-position, y-position, width, height, angle, color
            let boxLeadingFlap = createBoxPart(
                boxMiddle.x + boxMiddle.width*0.68,
                canvas.height/2,
                boxMiddle.width * 0.3,
                boxMiddle.height,
                0,
                '#C4A77D',
                false,
                true
            );

            //x-position, y-position, width, height, angle, color
            let boxFollowingFlap = createBoxPart(
                boxMiddle.x - boxMiddle.width*0.68,
                canvas.height/2,
                boxMiddle.width * 0.3,
                boxMiddle.height,
                0,
                '#C4A77D',
                false,
                true
            );
            // Add parts to the dynamic array
            boxParts.push(boxMiddle);
            boxParts.push(boxTopFlap);
            boxParts.push(boxBottomFlap);
            boxParts.push(boxLeadingFlap);
            boxParts.push(boxFollowingFlap);

            boxBase = boxMiddle.width;

            // Initial drawing
            drawBoxParts();
            break;

        case "3_Point":
            // Logic for 3-point box type can go here
            break;
    }
}

// Toggle the direction of movement
function changeDirection(newDirection) {
    direction = newDirection;
    if (moveInterval) {
        clearInterval(moveInterval); // Clear the current movement interval
    }
    moveInterval = setInterval(drawBoxParts, 16); // Restart with new direction
}

// Start moving the boxes automatically to the right when the page loads
moveInterval = setInterval(drawBoxParts, 16); // 60 FPS = 1000ms/60 ≈ 16ms per frame