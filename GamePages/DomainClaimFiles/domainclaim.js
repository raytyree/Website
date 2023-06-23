let outcome
class Collision {
    static handleCircleRect(one, two) {

        let lineBetweenCenters = { AB: null, C: null, distance: 0 };
        let centerCircle = new Vector2(one.transform.x, one.transform.y);
        let centerRectangle = new Vector2(two.transform.x, two.transform.y);
        lineBetweenCenters.AB = centerCircle.minus(centerRectangle).normalize();
        let tempA = lineBetweenCenters.AB.x;
        let tempB = lineBetweenCenters.AB.y;
        lineBetweenCenters.AB.x = tempB;
        lineBetweenCenters.AB.y = -tempA;

        lineBetweenCenters.C = -lineBetweenCenters.AB.dot(centerCircle)
        lineBetweenCenters.distance = centerCircle.minus(centerRectangle).length();

        let r1 = centerCircle.add(lineBetweenCenters.AB.scale(one.transform.sx))
        let r2 = centerCircle.add(lineBetweenCenters.AB.scale(-one.transform.sx))

        let corner1 = new Vector2(two.transform.sx / 2, two.transform.sy / 2);
        let corner2 = new Vector2(-two.transform.sx / 2, two.transform.sy / 2);
        let corner3 = new Vector2(-two.transform.sx / 2, -two.transform.sy / 2);
        let corner4 = new Vector2(two.transform.sx / 2, -two.transform.sy / 2);

        let dot1 = corner1.dot(lineBetweenCenters.AB) + lineBetweenCenters.distance
        let dot2 = corner2.dot(lineBetweenCenters.AB) + lineBetweenCenters.distance
        let dot3 = corner3.dot(lineBetweenCenters.AB) + lineBetweenCenters.distance
        let dot4 = corner4.dot(lineBetweenCenters.AB) + lineBetweenCenters.distance
        let dots = [dot1, dot2, dot3, dot4];
        let rs = [one.transform.sx, -one.transform.sx];
        for (let dot of dots) {
            if (dot < one.transform.sx)
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
class PlayerComponent extends Component {
    name = "PlayerComponent"
    start() {
        this.health = 100
        this.transform.sx = 2
        this.cooldown = 0
        this.speed = 1

        this.addListener(GameObject.getObjectByName("PlayerHealthGameObject").getComponent("PlayerHealthComponent"))

    }
    update() {
        Camera.main.transform.x = this.transform.x
        Camera.main.transform.y = this.transform.y
        this.bounds = GameObject.getObjectByName("WallsGameObject").getComponent("WallsComponent")
        console.log(this.bounds.transform.sx)
        
        if (keysDown["ArrowRight"]) {
            this.transform.x += this.speed
        }
        if (keysDown["ArrowLeft"]) {
            this.transform.x -= this.speed
        }
        if (keysDown["ArrowDown"]) {
            this.transform.y += this.speed
        }
        if (keysDown["ArrowUp"]) {
            this.transform.y -= this.speed
        }
        if (keysDown[" "]) {
            // this.speed = 10
            //this.speed = 1
        }
        if (keysDown["t"]) {
            //console.log("in")
            this.updateListeners("Hit")
        }
        if (keysDown["z"] && this.cooldown <= 0) {
            this.cooldown = 6
            GameObject.instantiate(new GameObject("BulletGameObject")
                .addComponent(new BulletComponent())
                .addComponent(new Rectangle("white"))),
                new Vector2(-1111, 0)
        }
        if (this.cooldown >= 0) {
            //console.log(this.cooldown)
            this.cooldown--
        }
    }
}
class EnemyComponent extends Component {
    start() {
        this.transform.sx = 20
        this.transform.sy = 20
        this.transform.y = -40
        this.cooldown = 0
        //console.log("MADE IT HERE")
        this.addListener(GameObject.getObjectByName("EnemyHealthGameObject").getComponent("EnemyHealthComponent"))

    }
    update() {
        if (Math.floor(Math.random() * 8) == 0 && this.cooldown <= 0) {
            this.cooldown = 8

            GameObject.instantiate(new GameObject("EnemyBulletGameObject")
                .addComponent(new EnemyBulletComponent())
                .addComponent(new EnemyBulletComponent())
                .addComponent(new Rectangle("red"))),
                new Vector2(-1111, 0)
        }
        if (this.cooldown >= 0) {
            //console.log(this.cooldown)
            this.cooldown--
        }
    }

}

// class EnemyBulletGameObject extends GameObject{ 
//     name = "EnemyBulletGameObject"
//     start(){
//         //this.addListener(GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent"))
//         this.addComponent(new EnemyBulletComponent())
//         this.addComponent(new Rectangle("red"))


//     }
//     update(){
//         //this.addComponent(new EnemyBulletComponent())

//     }

// }
class PlayerGameObject extends GameObject {
    name = "PlayerGameObject"
    start() {
        this.firing = false
        this.addComponent(new PlayerComponent())
        this.addComponent(new Circle("blue", "lightblue"))
    }
    update() {

    }
}
class BulletComponent extends Component {
    name = "BulletComponent"
    start() {
        //console.log("born")
        this.addListener(GameObject.getObjectByName("EnemyHealthGameObject").getComponent("EnemyHealthComponent"))
        this.speed = 1
        this.time = 60
        this.velocity = 1
        this.isActive = true
        this.transform.x = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent").transform.x
        this.transform.y = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent").transform.y
    }
    update() {

        if (this.isActive) {
            this.rect1 = GameObject.getObjectByName("EnemyGameObject").getComponent("EnemyComponent")
            //console.log("THIS IS WHERE")
            if (Collision.handleRectRect(this.rect1, this)) {
                //console.log("WOOOOO")
                this.updateListeners("EnemyHit")
                this.parent.destroy()
            }
            this.time--
            this.transform.y -= this.speed * this.velocity
        }
        else {
            //console.log("Gone")
        }
        if (this.time <= 0) {
            this.parent.destroy()
        }
    }
    handleUpdate(component, eventName) {
        if (eventName == "Fire") {
            //console.log("TIME")
            this.time = 10
        }
    }
}
class EnemyBulletComponent extends Component {
    name = "EnemyBulletComponent"
    start() {
        this.transform.sx = 1.5
        this.transform.sy = 1.5
        //console.log("born")
        this.addListener(GameObject.getObjectByName("PlayerHealthGameObject").getComponent("PlayerHealthComponent"))
        this.transform.y = 10000
        this.speed = 0.5
        this.time = 180
        this.velocity = 1
        this.isActive = true
        //this.transform.x = GameObject.getObjectByName("EnemyGameObject").getComponent("EnemyComponent").transform.x
        this.transform.x = Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1)
        this.transform.y = GameObject.getObjectByName("EnemyGameObject").getComponent("EnemyComponent").transform.y
    }
    update() {

        //console.log(this.time)
        //console.log(this.isActive)
        this.rect1 = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent")
        //console.log(this.rect1.transform.x)

        if (this.isActive) {
            if (Collision.handleRectRect(this.rect1, this)) {
                //console.log("WOOOOO")
                this.parent.destroy()
                this.updateListeners("PlayerHit")
            }
            this.time--
            this.transform.y += this.speed * this.velocity
        }
        else {
            //console.log("Gone")
        }
        if (this.time <= 0) {
            this.parent.destroy()
        }
    }
    handleUpdate(component, eventName) {
        if (eventName == "Fire") {
           // console.log("TIME")
            this.time = 10
        }
    }
}
class PlayerHealthComponent extends Component {
    name = "PlayerHealthComponent"
    start() {
        this.health = 100
        this.maxHealth = 100
        this.transform.y = 55
        this.transform.sx = this.transform.sx = 100*(this.health/this.maxHealth)
        this.transform.sy = 5
        this.transform.x = this.transform.sx / 2
    }
    update() {
        this.transform.sx = this.health
        if (this.health <= 0) {
            outcome = "Lost"
            SceneManager.changeScene(2)
            //console.log("Dead")
        }

        // if(this.health < this.maxHealth*0.25){
        //     console.log(this.parent.getComponent("Rectangle").transform)
        // }
    }
    handleUpdate(component, eventName) {
        if (eventName == "Hit") {
            //console.log("Banf")
            this.health -= 1
        }
        if (eventName == "PlayerHit") {
            //console.log("Banf")
            this.health -= 5
        }
    }
}
class OutcomeControllerComponent extends Component {
    start() {
        this.transform.x = -20
    }
    update() {

    }
    handleUpdate(eventName, component) {
        if (eventName == "Win") {
            SceneManager.changeScene(2)
        }
    }
}
class EnemyHealthComponent extends Component {
    name = "EnemyHealthComponent"
    start() {
        this.addListener(this)
        this.addListener(GameObject.getObjectByName("OutcomeControllerGameObject").getComponent("OutcomeControllerComponent"))
        this.health = 1000
        this.maxHealth = 1000
        this.transform.y = 0
        this.transform.sx = 100*(this.health/this.maxHealth)
        this.transform.sy = 5
        this.transform.x = this.transform.sx / 2
    }
    update() {
        this.transform.sx = this.health
        console.log((this.health/this.maxHealth))
        //(this.health)
        this.transform.sx = 100*(this.health/this.maxHealth)
        if (this.health <= 0) {
            this.updateListeners("Win")
            outcome = "Win"
            //console.log("Dead")
        }
        // if(this.health < this.maxHealth*0.25){
        //     console.log(this.parent.getComponent("Rectangle").transform)
        // }
    }
    handleUpdate(component, eventName) {
        if (eventName == "Hit") {
            //console.log("Banf")
            this.health -= 1
        }
        if (eventName == "EnemyHit") {
            //console.log("Banf")
            this.health -= 10
        }
        if (eventName == "Win") {
            //console.log("Win")
            SceneManager.changeScene(2)
        }
    }
}
class WallsComponent extends Component{
    start(){
        this.transform.sx = 40
        this.transform.sy = 40
        this.rect1 = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent")
    }
}
class LeftWallComponent extends Component{
    start(){
        this.transform.sx = 40
        this.transform.sy = 40
        this.transform.x = -40
    }
    update(){
        this.rect1 = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent")
        if(Collision.handleRectRect(this.rect1, this)){
            GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent").transform.x=-18
        }
    }
}
class RightWallComponent extends Component{
    start(){
        this.transform.sx = 40
        this.transform.sy = 40
        this.transform.x = 40
        
    }
    update(){
        this.rect1 = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent")
        if(Collision.handleRectRect(this.rect1, this)){
            GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent").transform.x=18
        }
    }
}
class BottomWallComponent extends Component{
    start(){
        this.transform.sx = 40
        this.transform.sy = 40
        this.transform.y = 40
        
    }
    update(){
        this.rect1 = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent")
        if(Collision.handleRectRect(this.rect1, this)){
            GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent").transform.y=17
        }
    }
}
class TopWallComponent extends Component{
    start(){
        this.transform.sx = 40
        this.transform.sy = 40
        this.transform.y = -40
    }
    update(){
        this.rect1 = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent")
        if(Collision.handleRectRect(this.rect1, this)){
            GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent").transform.y= -18
        }
    }
}
class BoundaryGameObject extends GameObject{
    start(){

    }
}
class CollisionHandlerComponent extends Component {
    name = "CollisionHandlerComponent"
    start() {

        this.addListener(GameObject.getObjectByName("PlayerHealthGameObject").getComponent("PlayerHealthComponent"))
    }
    update() {
        this.rect2 = GameObject.getObjectByName("EnemyGameObject").getComponent("EnemyComponent")

        this.rect1 = GameObject.getObjectByName("PlayerGameObject").getComponent("PlayerComponent")
        if (Collision.handleRectRect(this.rect2, this.rect1)) {
            //console.log("Success")
            //this.updateListeners("PlayerHit")
        }
    }
    handleUpdate(component, eventName) {
        if (eventName == "Left") {

        }
        if (eventName == "Right") {

        }
        if (eventName == "Up") {

        }
        if (eventName == "Down") {

        }
    }
    draw() {

    }
}

class DebugComponent extends Component {
    start() {
        this.objects = 0
    }
    update() {
        this.objects = SceneManager.getActiveScene().gameObjects.length
        //console.log("Objects: " + this.objects)
    }
    draw() {
        this.parent.getComponent("Text").string = this.objects
    }
}
class StartControllerComponent extends Component {
    start() {
    }
    update() {
        if (keysDown[" "]) {
            SceneManager.changeScene(1)
        }
    }
    draw() {

    }
}
class EndControllerComponent extends Component {
    start() {
    }
    update() {
        if (keysDown[" "]) {
            SceneManager.changeScene(1)
        }
    }
    draw() {

    }
}
class MineControllerComponent extends Component {
    start() {
        this.respawnTimer = 8
        //console.log(this.respawnTimer)
    }
    update() {
        if (this.respawnTimer <= 0) {
            //console.log(this.respawnTimer)
            GameObject.instantiate(new GameObject("MineGameObject")
                .addComponent(new MineComponent()))
                .addComponent(new Rectangle("green")),
                new Vector2(0,0)
        } else {
            this.respawnTimer--
        }
        if(this.respawnTimer <= 0){
            this.respawnTimer = 8
        }
    }
}
class MineComponent extends Component {
    start() {
        this.transform.sy = 5
        this.transform.sx = 5
        // this.transform.x = Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1)
        // this.transform.y = Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1)
        this.transform.x = 0
        this.transform.y = 0
    }
    update() {

    }
}
class StartScene extends Scene {
    constructor() {
        super("white")
    }
    start() {
        this.addGameObject(
            new GameObject("StartGameObject")
                .addComponent(new StartControllerComponent())
        )
        this.addGameObject(
            new GameObject("InfoTextGameObject")
                .addComponent(new Text("Press space to start", "black", "5px Impact")),
            new Vector2(-21, 0)
        )
    }
}
class MainScene extends Scene {
    constructor() {
        super("black")
    }
    start() {
        this.addGameObject(
            new GameObject("OutcomeControllerGameObject")
                .addComponent(new OutcomeControllerComponent())
        )
        this.addGameObject(
            new GameObject("CollisionGameObject")
                .addComponent(new CollisionHandlerComponent()),
            new Vector2(0, 0)
        )
        // this.addGameObject(
        //     new GameObject("MineControllerObject")
        //         .addComponent(new MineControllerComponent(),
        //         new Vector2(0,0))
                
        //)
            this.addGameObject(
                new GameObject("WallsGameObject")
                .addComponent(new WallsComponent())
                .addComponent(new Rectangle("black", "white"))
            )
            this.addGameObject(
                new GameObject("LeftWallGameObject")
                .addComponent(new LeftWallComponent())
                //.addComponent(new Rectangle())
            )
            this.addGameObject(
                new GameObject("RightWallGameObject")
                .addComponent(new RightWallComponent())
                //.addComponent(new Rectangle())
            )
            this.addGameObject(
                new GameObject("TopWallGameObject")
                .addComponent(new TopWallComponent())
                //.addComponent(new Rectangle())
            )
            this.addGameObject(
                new GameObject("BottomWallGameObject")
                .addComponent(new BottomWallComponent())
                //.addComponent(new Rectangle())
            )
        this.addGameObject(
            new GameObject("EnemyGameObject")
                .addComponent(new EnemyComponent())
                .addComponent(new Rectangle("red")),
            new Vector2(0, 0)
        )
        this.addGameObject(
            new GameObject("EnemyHelperGameObject")
                .addComponent(new EnemyComponent()),
                //.addComponent(new Rectangle("red")),
            new Vector2(0, 0)
        )
        this.addGameObject(
            new GameObject("EnemyHelper2GameObject")
                .addComponent(new EnemyComponent()),
                //.addComponent(new Rectangle("red")),
            new Vector2(0, 0)
        )
        this.addGameObject(
            new PlayerGameObject(),
            new Vector2(0, 0)
        )




        // this.addGameObject(
        //     new GameObject("PlayerGameObject")
        //     .addComponent(new PlayerComponent())
        //     .addComponent(new Circle("blue"))
        //     .addComponent(new BulletComp onent())
        //     .addComponent(new Circle("white")),
        //     new Vector2(0,0)
        // )

        this.addGameObject(
            new GameObject("WallsGameObject")
                .addComponent(new WallsComponent())
                .addComponent(new Rectangle("transparent", "white", .5)),
            new Vector2(0, 0)
        )
        this.addGameObject(
            new GameObject("PlayerHealthGameObject")
                .addComponent(new PlayerHealthComponent())
                .addComponent(new GUIRectangle("blue")),
            new Vector2(0, 0)
        )
        this.addGameObject(
            new GameObject("EnemyHealthGameObject")
                .addComponent(new EnemyHealthComponent())
                .addComponent(new GUIRectangle("red")),
            new Vector2(0, 0)
        )
    }
}
class EndScene extends Scene {
    constructor() {
        super("black")
    }
    start() {
        this.addGameObject(
            new GameObject("PlayAgainTextGameObject")
            .addComponent(new OutcomeControllerComponent())
                .addComponent(new Text("You "+outcome+" Play Again?", "white", "5px Impact"),
                    new Vector2(-70, 0))
        )
        this.addGameObject(
            new GameObject("EndControllerGameObject")
                .addComponent(new EndControllerComponent()))

    }
}
let startScene = new StartScene()
let mainScene = new MainScene()
let endScene = new EndScene()
window.allScenes = [startScene, mainScene, endScene]
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);