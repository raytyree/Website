class Collision {
    //The types of components we are expecting
    static componentNames = [
      "Rectangle",
      "Circle",
      "Point"
    ]
    /**
     * 
     * @param {GameObject} one The first game object
     * @param {GameObject} two The second game object
     * @returns True if the game objects are in collision. False otherwise
     */
    static handle(one, two) {
      //Figure out the kind of collision we are resolving
      let typeOne = "None";
      let typeTwo = "None";
      let componentOne;
      let componentTwo;
  
      for (let name of Collision.componentNames) {
        componentOne = one.getComponent(name);
        if (componentOne) {
          typeOne = name;
          break;
        }
      }
      if (typeOne == "None") {
        return;
      }
  
      for (let name of Collision.componentNames) {
        componentTwo = two.getComponent(name);
        if (componentTwo) {
          typeTwo = name;
          break;
        }
      }
      if (typeTwo == "None") {
        return;
      }
  
      //Based on the types, call the appropriate function
      
      if (typeOne == "Point" && typeTwo == "Point") {
        return false;
      }
      if (typeOne == "Point" && typeTwo == "Circle") {
        return Collision.handlePointCircle(componentOne, componentTwo);
      }
      if (typeOne == "Point" && typeTwo == "Rectangle") {
        return Collision.handlePointRect(componentOne, componentTwo);
      }
      if (typeOne == "Circle" && typeTwo == "Point") {
        //Flip the arguments
        return Collision.handlePointCircle(componentTwo, componentOne);
      }
      if (typeOne == "Circle" && typeTwo == "Circle") {
        return Collision.handleCircleCircle(componentOne, componentTwo);
      }
      if (typeOne == "Circle" && typeTwo == "Rectangle") {
        return Collision.handleCircleRect(componentOne, componentTwo);
      }
      if (typeOne == "Rectangle" && typeTwo == "Point") {
        //Flip the arguments
        return Collision.handlePointRect(componentTwo, componentOne);
      }
      if (typeOne == "Rectangle" && typeTwo == "Circle") {
        //Flip the arguments
        return Collision.handleCircleRect(componentTwo, componentOne);
      }
      if (typeOne == "Rectangle" && typeTwo == "Rectangle") {
        return Collision.handleRectRect(componentOne, componentTwo);
      }
    }
    static handlePointCircle(one, two) {
      let distance = Math.sqrt((one.transform.x - two.transform.x) ** 2 + (one.transform.y - two.transform.y) ** 2)
      return distance <= two.transform.sx;
    }
    static handlePointRect(one, two) {
      let x = one.transform.x;
      let y = one.transform.y;
      let left = two.transform.x - two.transform.sx / 2;
      let right = two.transform.x + two.transform.sx / 2;
      let bottom = two.transform.y - two.transform.sy / 2;
      let top = two.transform.y + two.transform.sy / 2;
  
      return x > left && x < right && y > bottom && y < top;
    }
    static handleCircleCircle(one, two) {
      let distance = Math.sqrt((one.transform.x - two.transform.x) ** 2 + (one.transform.y - two.transform.y) ** 2)
      return distance <= one.transform.sx + two.transform.sx;
    }
    static handleCircleRect(one, two) {
  
      let lineBetweenCenters = { AB: null, C: null, distance:0 };
      let centerCircle = new Vector2(one.transform.x, one.transform.y);
      let centerRectangle = new Vector2(two.transform.x, two.transform.y);
      lineBetweenCenters.AB = centerCircle.minus(centerRectangle).normalize();
    
      lineBetweenCenters.C = -lineBetweenCenters.AB.dot(centerCircle)
      lineBetweenCenters.distance = centerCircle.minus(centerRectangle).length();
  
      let r1 = centerCircle.add(lineBetweenCenters.AB.scale(one.transform.sx))
      let r2 = centerCircle.add(lineBetweenCenters.AB.scale(-one.transform.sx))
  
      let corner1 = new Vector2(two.transform.sx/2, two.transform.sy/2);
      let corner2 = new Vector2(-two.transform.sx/2, two.transform.sy/2);
      let corner3 = new Vector2(-two.transform.sx/2, -two.transform.sy/2);
      let corner4 = new Vector2(two.transform.sx/2, -two.transform.sy/2);
  
      let dot1 = corner1.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
      let dot2 = corner2.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
      let dot3 = corner3.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
      let dot4 = corner4.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
      let dots = [dot1,dot2, dot3, dot4];
      let rs = [one.transform.sx, -one.transform.sx];
      for(let dot of dots){
        if(dot < one.transform.sx)
        return true
      }
      return false;
    }
    static handleRectRect(one, two) {
      let left1 = one.transform.x - one.transform.sx / 2;
      let right1 = one.transform.x + one.transform.sx / 2;
      let bottom1 = one.transform.y - one.transform.sy / 2
      let top1 = one.transform.y + one.transform.sy / 2
  
      let left2 = two.transform.x - two.transform.sx / 2;
      let right2 = two.transform.x + two.transform.sx / 2;
      let bottom2 = two.transform.y - two.transform.sy / 2
      let top2 = two.transform.y + two.transform.sy / 2
  
      return !(left1 > right2 || left2 > right1
        || right1 < left2 || right2 < left1
        || bottom1 > top2 || bottom2 > top1
        || top1 < bottom2 || top2 < bottom1)
  
    }
  }