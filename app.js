const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initialize a dynamic array to hold box parts
let boxParts = [];

let boxBase = 0;

let direction = 'right'; // Direction of movement, default is right
let moveInterval = null; // Store the interval reference for movement
let triggerPosition = canvas.width / 2;
let QualityCOntrolOn = false;
let boxType = "3_Point";

let canvasWidthModifier = 200;

function changeBoxType(){

    switch(boxType){
        case "3_Point": if (boxType === "3_Point"){
            boxType = "4_Corner";
            break;
        }
        case "4_Corner": if (boxType === "4_Corner"){
            boxType = "6_Point";
            break;
        }
        case "6_Point": if (boxType === "6_Point"){
            boxType = "3_Point"
            break;
        }
    }
}

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
        box.verticalMorph ? alterVerticalShapeBasedOnPositionFinalFold(box) : null;

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
        if(box.x > triggerPosition - triggerPosition/3){
            box.width = boxBase;
            box.color = checkQualityControlStatus(box);
        }
    }else{
        if(box.x < triggerPosition + triggerPosition/3){
            box.width = boxBase;
            box.color = checkQualityControlStatus(box);
        }
    };
};

// Alter the box shape based on its position
function alterVerticalShapeBasedOnPositionFinalFold(box) {
    if (direction === "right"){
        if(box.x > triggerPosition + triggerPosition/2  ){
            box.width = 0;
        }
    }else{
        if(box.x < triggerPosition - triggerPosition/2 ){
            box.width = 0;
        }
    };
};

// Alter the box shape based on its position
function alterHorizontalShapeBasedOnPosition(box) {
    if (direction === "right"){
        box.x > triggerPosition ? box.height = 0 : box.height = box.height;
    }else{
        box.x < triggerPosition ? box.height = 0 : box.height = box.height;
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
            
            let boxMiddle_4Corner = createBoxPart(
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
            let boxTopFlap_4Corner = createBoxPart(
                boxMiddle_4Corner.x,
                canvas.height / 3.5,
                boxMiddle_4Corner.width + boxMiddle_4Corner.width*0.66,
                boxMiddle_4Corner.height / 4,
                0,
                '#C4A77D',
                true,
                false
            );

            let boxBottomFlap_4Corner = createBoxPart(
                boxMiddle_4Corner.x,
                canvas.height - canvas.height / 3.5,
                boxMiddle_4Corner.width + boxMiddle_4Corner.width*0.66 ,
                boxMiddle_4Corner.height / 4,
                0,
                '#C4A77D',
                true,
                false
            );
//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxLeadingFlap_4Corner = createBoxPart(
                boxMiddle_4Corner.x + boxMiddle_4Corner.width*0.68,
                canvas.height/2,
                boxMiddle_4Corner.width * 0.3,
                boxMiddle_4Corner.height,
                0,
                '#C4A77D',
                false,
                true
            );

//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxFollowingFlap_4Corner = createBoxPart(
                boxMiddle_4Corner.x - boxMiddle_4Corner.width*0.68,
                canvas.height/2,
                boxMiddle_4Corner.width * 0.3,
                boxMiddle_4Corner.height,
                0,
                '#C4A77D',
                false,
                true
            );

            // Add parts to the dynamic array
            boxParts.push(boxMiddle_4Corner);
            boxParts.push(boxTopFlap_4Corner);
            boxParts.push(boxBottomFlap_4Corner);
            boxParts.push(boxLeadingFlap_4Corner);
            boxParts.push(boxFollowingFlap_4Corner);

            boxBase = boxMiddle_4Corner.width;
            // Initial drawing
            drawBoxParts();
            break;

        case "3_Point":

//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxMiddle_3Point = createBoxPart(
                direction === "right" ? canvas.width - canvas.width : canvas.width,
                canvas.height / 2,
                canvas.height / 4,
                canvas.height / 4,
                0,
                '#C4A77D',
                false,
                false
            );

//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxTopFlap_3Point = createBoxPart(
                boxMiddle_3Point.x,
                canvas.height / 3.7,
                canvas.height / 4,
                canvas.height / 5,
                0,
                '#C4A77D',
                true,
                false
            );

//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxBottomFlap_3Point = createBoxPart(
                boxMiddle_3Point.x,
                canvas.height - canvas.height / 3.48,
                canvas.height / 4,
                canvas.height / 6,
                0,
                '#C4A77D',
                true,
                false
            );

//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxLeadingFlap_01_3Point = createBoxPart(
                direction === "right" ? boxMiddle_3Point.x + boxMiddle_3Point.width*0.82 : boxMiddle_3Point.x - boxMiddle_3Point.width*0.82,
                boxMiddle_3Point.y,
                boxMiddle_3Point.width * 0.6,
                boxMiddle_3Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxLeadingFlap_02_3Point = createBoxPart(
                direction === "right" ? boxMiddle_3Point.x + boxMiddle_3Point.width*0.82 : boxMiddle_3Point.x - boxMiddle_3Point.width*0.82,
                boxTopFlap_3Point.y,
                boxTopFlap_3Point.width * 0.6,
                boxTopFlap_3Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

//              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxLeadingFlap_03_3Point = createBoxPart(
                direction === "right" ? boxMiddle_3Point.x + boxMiddle_3Point.width*0.82 : boxMiddle_3Point.x - boxMiddle_3Point.width*0.82,
                boxBottomFlap_3Point.y,
                boxBottomFlap_3Point.width * 0.6,
                boxBottomFlap_3Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

            // Add parts to the dynamic array
            boxParts.push(boxMiddle_3Point);
            boxParts.push(boxTopFlap_3Point);
            boxParts.push(boxBottomFlap_3Point);
            boxParts.push(boxLeadingFlap_01_3Point);
            boxParts.push(boxLeadingFlap_02_3Point);
            boxParts.push(boxLeadingFlap_03_3Point);

            
            boxBase = boxMiddle_3Point.width;
            // Initial drawing
            drawBoxParts();
            // Logic for 3-point box type can go here
            break;

        case "6_Point":

            //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxMiddle_6Point = createBoxPart(
                direction === "right" ? canvas.width - canvas.width : canvas.width,
                canvas.height / 2,
                canvas.height / 4,
                canvas.height / 4,
                0,
                '#C4A77D',
                false,
                false
            );

    //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxTopFlap_6Point = createBoxPart(
                boxMiddle_6Point.x,
                canvas.height / 3.7,
                canvas.height / 4,
                canvas.height / 5,
                0,
                '#C4A77D',
                true,
                false
            );

    //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxBottomFlap_6Point = createBoxPart(
                boxMiddle_6Point.x,
                canvas.height - canvas.height / 3.48,
                canvas.height / 4,
                canvas.height / 6,
                0,
                '#C4A77D',
                true,
                false
            );

    //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxLeadingFlap_01_6Point = createBoxPart(
                direction === "right" ? boxMiddle_6Point.x + boxMiddle_6Point.width*0.82 : boxMiddle_6Point.x - boxMiddle_6Point.width*0.82,
                boxMiddle_6Point.y,
                boxMiddle_6Point.width * 0.6,
                boxMiddle_6Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

    //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxLeadingFlap_02_6Point = createBoxPart(
                direction === "right" ? boxMiddle_6Point.x + boxMiddle_6Point.width*0.82 : boxMiddle_6Point.x - boxMiddle_6Point.width*0.82,
                boxTopFlap_6Point.y,
                boxTopFlap_6Point.width * 0.6,
                boxTopFlap_6Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

    //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxLeadingFlap_03_6Point = createBoxPart(
                direction === "right" ? boxMiddle_6Point.x + boxMiddle_6Point.width*0.82 : boxMiddle_6Point.x - boxMiddle_6Point.width*0.82,
                boxBottomFlap_6Point.y,
                boxBottomFlap_6Point.width * 0.6,
                boxBottomFlap_6Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

            //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxFollowingFlap_01_6Point = createBoxPart(
                direction === "right" ? boxMiddle_6Point.x - boxMiddle_6Point.width*0.82 : boxMiddle_6Point.x + boxMiddle_6Point.width*0.82,
                boxMiddle_6Point.y,
                boxMiddle_6Point.width * 0.6,
                boxMiddle_6Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

    //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxFollowingFlap_02_6Point = createBoxPart(
                direction === "right" ? boxMiddle_6Point.x - boxMiddle_6Point.width*0.82 : boxMiddle_6Point.x + boxMiddle_6Point.width*0.82,
                boxTopFlap_6Point.y,
                boxTopFlap_6Point.width * 0.6,
                boxTopFlap_6Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

    //              x, y, width, height, angle, color, verticalMorph, horizontalMorph
            let boxFollowingFlap_03_6Point = createBoxPart(
                direction === "right" ? boxMiddle_6Point.x - boxMiddle_6Point.width*0.82 : boxMiddle_6Point.x + boxMiddle_6Point.width*0.82,
                boxBottomFlap_6Point.y,
                boxBottomFlap_6Point.width * 0.6,
                boxBottomFlap_6Point.height,
                0,
                '#C4A77D',
                false,
                true
            );

            // Add parts to the dynamic array
            boxParts.push(boxMiddle_6Point);
            boxParts.push(boxTopFlap_6Point);
            boxParts.push(boxBottomFlap_6Point);
            boxParts.push(boxLeadingFlap_01_6Point);
            boxParts.push(boxLeadingFlap_02_6Point);
            boxParts.push(boxLeadingFlap_03_6Point);
            boxParts.push(boxFollowingFlap_01_6Point);
            boxParts.push(boxFollowingFlap_02_6Point);
            boxParts.push(boxFollowingFlap_03_6Point);

            
            boxBase = boxMiddle_6Point.width;
            // Initial drawing
            drawBoxParts();
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