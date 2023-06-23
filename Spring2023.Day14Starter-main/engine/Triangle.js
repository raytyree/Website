class Triangle extends Component{
   name = "Triangle" 
   fillStyle
   strokeStyle
   lineWidth

   constructor(fillStyle = "white", strokeStyle = "transparent", lineWidth = 1){
    super()
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle
    this.lineWidth = lineWidth

   }
   draw(ctx){
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.lineWidth = this.lineWidth

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
   }
}