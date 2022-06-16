// jabridge.js
class ElementCollection extends Array {

}

/*
* Returns an ElementCollection containing each item retrieived with
* querySelectorAll.
*/
function $(param) {
  if(typeof param === 'string' || param instanceof String) {
    return new ElementCollection(...document.querySelectorAll(param));
  } else {
    return new ElementCollection(param);
  }
}

/*
* Returns a single item popped from the collection. Clumsy?
*/
function $$(param) {
  if(typeof param === 'string' || param instanceof String) {
    const elements = new ElementCollection(...document.querySelectorAll(param));
    return elements.pop();
  } else {
    return new ElementCollection(param);
  }
}

/*
* Function to be triggered from HTML (i.e. with "onclick") that adds a class to
* an element to trigger an animation, then removes it.
*/
function animaTrigger(element, animaClass) {

}
