/**
 * The Component class.
 * Components are where the majority of the game code goes.
 * This class should be treated as though it were abstract.
 * (You should extend this class instead of calling `new Component()`.)
 */
class Component{
  /** The name of the component */
  name = this.constructor.name
  /** 
   * The game object that acts holds this component 
   * To assure that this is set properly, 
   * always add components to game objects by using the
   * addComponent function.
   * */
  parent

  /**
   * Used by the engine to call start if it hasn't been called.
   * You should never have to alter this value directly
   */
  started = false

  /**
   * Array of components that listen for events from this component
   */
  listeners = []

  /**
   * Add a component as a listener to this component.
   * The listener component should have a function called
   * handleUpdate(component, eventName)
   * 
   * @param {Component} listener The component that will listen for events
   */
  addListener(listener){
    this.listeners.push(listener);
  }

  /**
   * Call handleUpdate on all the listeners
   * A reference to this component and an event name
   * will be passed to each listener
   * @param {String} eventName The name of the event that has triggered
   */
  updateListeners(eventName){
    for(let listener of this.listeners){
      if(listener.handleUpdate){
        listener.handleUpdate(this, eventName)
      }
    }
  }



  /**
   * To emulate the API of unity, tranform is a read-only property
   * that retrieves the the transform component on the parent
   * game object
   */
  get transform(){
      return this.parent.components[0]
  }
  //Since we do not have "set transform(newTransform)" 
  //transform is read-only
}

window.Component = Component;
