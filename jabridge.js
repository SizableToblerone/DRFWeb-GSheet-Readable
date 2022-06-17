// jabridge.js
/*
Script intended to "abridge" certain repetitive operations.
*/


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

/**
* Returns a single item popped from the collection. Clumsy? Replace with
* querySelector()?
* @param {string} query Text to pass to querySelectorAll.
* @return {collection} An ElementCollection containing the results of the query.
*/
function $$(query) {
  if(typeof query === 'string' || query instanceof String) {
    const elements = new ElementCollection(...document.querySelectorAll(query));
    return elements.pop();
  } else {
    return new ElementCollection(query);
  }
}

/**
* Function to be triggered from HTML (i.e. with "onclick") that adds a class to
* an element to trigger an animation, then removes it.
* @param {string} element Text for the left-side label.
* @param {string} animaClass Text for the left-side label.
*/
function animaTrigger(element, animaClass) {

}
