    class GraphDrawer {
    constructor(canvas , step = 30) {
        this.step = step;
        this.usedGraphs = new Set();
        this.boundingClientRect = canvas.getBoundingClientRect();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.HEIGHT_OF_CANVAS = canvas.height;
        this.canvas.height = this.boundingClientRect.height * devicePixelRatio; // for hi-dpi monitors
        this.WIDTH_OF_CANVAS = canvas.width;
        this.canvas.width = this.boundingClientRect.width * devicePixelRatio; // for hi-dpi monitors 
        this.ctx.scale(devicePixelRatio , devicePixelRatio);
        this.canvas.style.width = this.boundingClientRect.width +"px";
        this.canvas.style.height = this.boundingClientRect.height +"px";

    }

    setStep(step) {
        this.step = step;
    }

    drawMainAxis(colorOfMainAxis , lineWidth) {
        this.ctx.strokeStyle = colorOfMainAxis;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.WIDTH_OF_CANVAS/2 , 0);
        this.ctx.lineTo(this.WIDTH_OF_CANVAS/2 , this.HEIGHT_OF_CANVAS);
        this.ctx.moveTo(0 , this.HEIGHT_OF_CANVAS/2);
        this.ctx.lineTo(this.WIDTH_OF_CANVAS , this.HEIGHT_OF_CANVAS/2);
        this.ctx.stroke();
        for (let y = this.HEIGHT_OF_CANVAS/2 + this.step; y <= this.HEIGHT_OF_CANVAS; y += this.step) { // cros section
            this.ctx.fillText(-(y-this.HEIGHT_OF_CANVAS/2)/this.step ,this.WIDTH_OF_CANVAS/2 , y );
            this.ctx.fillText((y-this.HEIGHT_OF_CANVAS/2)/this.step ,this.WIDTH_OF_CANVAS/2 , this.HEIGHT_OF_CANVAS - y );
        }  
        for (let x = this.WIDTH_OF_CANVAS/2; x <= this.WIDTH_OF_CANVAS; x += this.step) {
            this.ctx.fillText((x -this.WIDTH_OF_CANVAS/2)/this.step ,x ,this.HEIGHT_OF_CANVAS/2  );
            this.ctx.fillText(-(x -this.WIDTH_OF_CANVAS/2)/this.step ,this.WIDTH_OF_CANVAS-x ,this.HEIGHT_OF_CANVAS/2  );
        }  
    }

    drawGrid(gridColor ,  scaleX , scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        let strokeStyleBuf = this.ctx.strokeStyle;
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = "1";
        this.ctx.beginPath();
        for (let x = this.WIDTH_OF_CANVAS/2; x <= this.WIDTH_OF_CANVAS; x += this.scaleX) {
            this.ctx.moveTo(x , 0);
            this.ctx.lineTo(x , this.HEIGHT_OF_CANVAS);
            this.ctx.moveTo(this.WIDTH_OF_CANVAS - x  ,  0);
            this.ctx.lineTo(this.WIDTH_OF_CANVAS - x , this.HEIGHT_OF_CANVAS);
        }
        for (let y = this.HEIGHT_OF_CANVAS/2; y <= this.HEIGHT_OF_CANVAS; y += this.scaleY) {
            this.ctx.moveTo(0 , y);
            this.ctx.lineTo(this.WIDTH_OF_CANVAS , y);
            this.ctx.moveTo(0 , this.WIDTH_OF_CANVAS - y );
            this.ctx.lineTo(this.WIDTH_OF_CANVAS , this.WIDTH_OF_CANVAS - y);
        }  
        this.ctx.stroke();
        this.ctx.strokeStyle = strokeStyleBuf;
    }

    addEquation(equation , colorOfGraph) {
        this.usedGraphs.add([equation , colorOfGraph]);
    }

    drawGraphic(graphEquation , colorOfGraph = "blue") {
        this.ctx.globalAlpha = 0.3;
        let previousColor = this.ctx.fillStyle;
        this.ctx.fillStyle = colorOfGraph;
        for (let y = 0; y < this.HEIGHT_OF_CANVAS; y += 0.5) {
            for (let x = 0; x < this.WIDTH_OF_CANVAS; x += 0.5) {
                if (graphEquation((x - this.WIDTH_OF_CANVAS/2) ,  (-y + this.HEIGHT_OF_CANVAS/2 )))
                    this.ctx.fillRect(x , y , 1 , 1);
            }
        }
        this.ctx.fillStyle = previousColor;
        this.ctx.globalAlpha = 1;
    }

    drawAllAddedEquations() {
        this.usedGraphs.forEach((eq) => {
            this.drawGraphic(eq[0] , eq[1]);
        });
    }

    getGraphEquations() {
        return new Set(this.usedGraphs);
    }

    clearCanvas() {
        this.ctx.clearRect(0 , 0 , this.canvas.width , this.canvas.height);
    }

    clearEquations() {
        this.usedGraphs.clear();
    }

    getCursorCoordinates(xCli , yCli) { // return coordinates in Decarte Coords
        let boundRect = this.canvas.getBoundingClientRect();
        const x = xCli - boundRect.left  - this.WIDTH_OF_CANVAS/2;
        const y = -(yCli - boundRect.top) + this.HEIGHT_OF_CANVAS/2;
        return [x , y];
    }

    drawCircle(xCli , yCli , radius , color) {  // takes literal pixel coord 
        let boundRect = this.canvas.getBoundingClientRect();
        let previousColor = this.ctx.fillStyle;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(xCli - boundRect.left , yCli - boundRect.top, radius, 0, Math.PI * 2); //  offset to centrize circle 
        this.ctx.fill();
        this.ctx.fillStyle = previousColor;
    }
}

const results_table = document.getElementById("results_table").getElementsByTagName("tbody");
const buttonRadius = (document.getElementById("radius_form_button"));
const buttonCoords = document.getElementById("coord_form_button");
const errMsg = document.getElementById("err_msg");
const canvasFront = document.getElementById("canvas_front");
const canvasBack = document.getElementById("canvas_back");
const clearTableButton = document.getElementById("clear_table_button");
const graphDrawerBack = new GraphDrawer(canvasBack);
const graphDrawerFront = new GraphDrawer(canvasFront);
let step = 30;
let radius;
graphDrawerBack.drawGrid("grey" , step , step);
graphDrawerBack.drawMainAxis("black" , 1)


buttonCoords.addEventListener("click" , () => {
 
    
    let radiusInput = parseFloat(document.getElementById('R_text_coord').value);
    radius = 0;
    radius = radiusInput;
    
    
    if (validateData(radius , 2 , 5) !== "ok") {
        errMsg.innerHTML = "Radius " + validateData(radius , 2 , 5);
        return;
    } else {
        errMsg.innerHTML = "";
    }

    graphDrawerBack.clearCanvas();
    graphDrawerBack.clearEquations();
    graphDrawerBack.drawGrid("grey" , step , step);
    graphDrawerBack.addEquation((x , y ) => {
        return (y > x - radius*step  && x >= 0 && y <= 0);
    } , "blue");
    graphDrawerBack.addEquation((x , y) => {
        return ((y**2 + x**2 <= (radius*step)**2) && y  <= 0 && x <= 0);
    } , "blue");
    graphDrawerBack.addEquation((x , y) => {
        return (x >= 0 && x <= radius*step && y <= radius*step && y >= 0);
    } , "blue");

    graphDrawerBack.drawAllAddedEquations();
    graphDrawerBack.drawMainAxis();
})

clearTableButton.addEventListener("click" , () => {
    results_table[0].innerHTML = "";
    window.localStorage.clear();
})

window.onload=function(){
    results_table[0].innerHTML = window.localStorage.getItem("table");
    console.log(window.localStorage.getItem("table"));
};

window.onbeforeunload = function(e) {
    window.localStorage.setItem("table" , results_table[0].innerHTML);
  };

buttonCoords.addEventListener("click" ,() =>{
    // if(isNaN(radius)){
    //     errMsg.innerHTML = "You should initialize radius!"
    //     return;
    // } else {
    //     errMsg.innerHTML = "";
    // }

    let yCoordText;
    let xCoordText;
    try {
         yCoordText = parseFloat(document.getElementById("Y_text_coord").value);
         xCoordText = parseFloat(document.getElementById("X_text_coord").value);
    } catch (error) {

        console.error(error);
    }
    
    if(validateData(yCoordText , -5 , 3) !== "ok") {
        errMsg.innerHTML = "Y coordinate " + validateData(yCoordText , -4.99999 , 2.999999);
        return;
    } else if (validateData(xCoordText ,  -2.99999999 , 2.9999999) !== "ok") {
        errMsg.innerHTML = "X coordinate " + validateData(xCoordText , -2.99999999 , 2.9999999);
        return;
    } else  if (validateData(radius , 2 , 5) !== "ok") {
        errMsg.innerHTML = "Radius " + validateData(radius , 2 , 5);
        return;
    }else {
        errMsg.innerHTML = "";
    }

    sendRequest("POST" , "server.php" , {
        "x" : xCoordText , 
        "y" : yCoordText ,
        "R" : radius
    }).then(data => {(results_table[0].innerHTML+= data); errMsg.innerHTML = ""})
    .catch(err => errMsg.innerHTML = err);
});

canvasFront.addEventListener("click" , (event) => {
    if(isNaN(radius)){
        errMsg.innerHTML = "You should initialize radius!"
        return;
    } else {
        errMsg.innerHTML = "";
    }
    
    graphDrawerFront.clearCanvas();
    graphDrawerFront.drawCircle(event.clientX , event.clientY , 2, "black");
    console.log(event.clientX + " " + event.clientY);
    let decarteCoords = graphDrawerBack.getCursorCoordinates(event.clientX , event.clientY);
    sendRequest("POST" , "server.php" , {
        "x" : decarteCoords[0]/step , 
        "y" : decarteCoords[1]/step ,
        "R" : radius
    }).then(data => {(results_table[0].innerHTML+= data); errMsg.innerHTML = ""})
    .catch(err => errMsg.innerHTML = err);
 
});

function sendRequest(method , url , body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = "text";
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject("Error: " + xhr.statusText);
            }
        };
        xhr.onerror = () => {
            reject("Network Error");
        };
        xhr.send(JSON.stringify(body));
    });
} 

function validateData(val , rangeL , rangeR) {

    if (val == null) {
        return "Can't be null!";
    }
    if (isNaN(val)) {
        return "Should be numeric!";
    }
    if (rangeL > val || val > rangeR){
        return "Is not in range!";
    }
    return "ok";
}
  


