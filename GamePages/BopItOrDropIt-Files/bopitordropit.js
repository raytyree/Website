//The code for our example game
let score = 0
class ScoreComponent extends Component{
  name = "ScoreComponent"
  start(){
    this.addListener(this)
    score = 0
  }
  update(){
    if(SceneManager.currentSceneIndex == 0){
      console.log("Made it here")
      this.parent.destroy()
    }
  }
  handleUpdate(component, eventName){
    if(eventName == "Correct"){
      console.log("idotio")
      score++
    }
    //console.log(SceneManager.currentSceneIndex)

  }
  draw(){
    this.parent.getComponent("Text").string = "Score: " + score
  }
}
class StartComponent extends Component{
  name = "StarterComponent"
  start(){
    this.timer = 10
  }
  update(){
    if(keysDown[" "]){
      console.log("HERERER")
      SceneManager.changeScene(1)
    }
  }
}
class EndComponent extends Component{
  name = "StarterComponent"
  start(){
    GameObject.getObjectByName("ScoreGameObject").getComponent("ScoreComponent").transform.x = -10
    GameObject.getObjectByName("ScoreGameObject").getComponent("ScoreComponent").transform.y = 0
  }
  update(){
    if(keysDown[" "]){
      console.log("HERERER")
      SceneManager.changeScene(0)
    }
  }
}
class StateComponent extends Component{
  start(){
    this.state = 0
    this.addListener(GameObject.getObjectByName("TimeGameObject").getComponent("TimeComponent"))
  }
  handleUpdate(component, eventName){
    if(eventName == "TimeUp"){
      this.state = 2
      SceneManager.changeScene(this.state)
    }
  }
}
class TimeComponent extends Component{
  start(){
    this.time = 10*60
    this.addListener(GameObject.getObjectByName("StateGameObject").getComponent("StateComponent"))
  }
  update(){
    this.time--
    if(this.time <= 0){
      this.updateListeners("TimeUp")
      //console.log(this.time)
    }

    
  }
}
class IndicatorComponent extends Component{
  start(){
    this.addListener(GameObject.getObjectByName("ScoreGameObject").getComponent("ScoreComponent"))
    this.inputList = ["z","ArrowLeft","ArrowRight","ArrowDown","ArrowUp"]
    this.currentInput = 0
    this.currentValue = this.inputList[0]
    // this.isOpposite =     this.isOpposite = Math.floor(Math.random()*2) == 0
    // this.reverseFlag = this.isOpposite
    this.isOpposite = true
    this.reverseFlag = true
    this.color = "blue"
  }
  update(){

    //console.log(this.isOpposite)
    if(this.isOpposite && this.reverseFlag){
      this.color = "red"
      this.reverseFlag = false
      switch(this.currentInput){
        case 1:
          //console.log("MADE IT")
          this.currentInput = 2
          break;
        case 2:
          //console.log("MADE IT")
          this.currentInput = 1
          break;
        case 3:
          //console.log("MADE IT")
          this.currentInput = 4
          break;
        case 4:
          //console.log("MADE IT")
          this.currentInput = 3
          break;

        default :
          this.color = "blue"
          break;
      }
    }
    if(keysDown[this.inputList[this.currentInput]]){
      this.currentInput = Math.floor(Math.random() * this.inputList.length)
      this.currentValue = this.inputList[this.currentInput]
      this.updateListeners("Correct")
      this.isOpposite = Math.floor(Math.random()*2) == 0
      this.color = "blue"
      this.reverseFlag = this.isOpposite
    }
    //console.log(this.currentInput)
  }
  handleUpdate(component, eventName){
  }
  draw(){
    this.parent.getComponent("Text").string = this.currentValue
    this.parent.getComponent("Text").fillStyle = this.color
  }
}
class StarterScene extends Scene{
  constructor(){
    super("dodgerblue")
  }
  start(){
    this.addGameObject(
      new GameObject("StarterGameObject")
        .addComponent(new StartComponent())
    )
  }
}
class MainScene extends Scene {
  constructor(){
    super("white")
  }
  start() {
    this.addGameObject(
      new GameObject("ScoreGameObject")
        .addComponent(new ScoreComponent())
        .addComponent(new Text("Score: ", "black", "5px Impact")),
      new Vector2(-50,-23)
    ).doNotDestroyOnLoad()
    this.addGameObject(
      new GameObject("IndicatorGameObject")
      .addComponent(new IndicatorComponent())
        .addComponent(new Text("", "", "5px Impact")),
      new Vector2(0, 0)
    )
    this.addGameObject(
      new GameObject("TimeGameObject")
        .addComponent(new TimeComponent()),
        new Vector2(0,0)
    )
    this.addGameObject(
      new GameObject("StateGameObject")
        .addComponent(new StateComponent())
    )
  }
}
class EndGameScene extends Scene{
  constructor(){
    super("red")
  
  }
  start(){
    this.addGameObject(
      new GameObject("EndGameObject")
      .addComponent(new EndComponent())
    )
  }
}

//export the main scene so the .html file can run the game.
let starterScene = new StarterScene()
let exampleScene = new MainScene()
let endGameScene = new EndGameScene()
window.allScenes = [starterScene, exampleScene, endGameScene]
window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);