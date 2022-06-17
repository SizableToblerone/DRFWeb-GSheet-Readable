// jacobSwitch.js

/**
 * Creates an HTML element for a binary switch. To be used in conjunction with
 * the "jacobStyle.css" stylesheet.
 * @param {string} id Id attribute of the HTML element.
 * @param {string} left Text for the left-side label.
 * @param {string} right Text for the left-side label.
 * @param {string} width Width of the html element, including CSS units.
 * @param {string} onclick Function called when switch is flipped.
 * @return {string} The assembled string, to be assigned to an innerHTML value.
 */
function createJacobSwitch(id='MISSING', left='left', right='right',
width='6.6rem', onclick='') {
	console.log('jacob!');
  return `
	<input type="checkbox" class="switchChBox" id="${id}ChBox"
	style="--switchWidth: ${width}">
  <div class="switchContainer" style="--switchWidth: ${width}">
    <label class="l_left">${left}</label>
    <label class="switchSlide"></label>
    <label class="l_right">${right}</label>
  </div>
	`;
}

/**
* Scans the document for JacobSwitches, and parses them appropriately.
* @param {string} scanClass The CSS class to query with $().
* @return {number} The number of elements found bearing the given class.
*/
function initJacobSwitches(scanClass='toJacobSwitch') {
	switches = $(`.${scanClass}`);
	// console.log(switches);
	while (switches.length > 0) {
		element = switches.pop()
		// console.log(element);
		params = element.innerHTML.split(", ");
		// console.log(params);
		element.innerHTML = createJacobSwitch(element.id, params[0], params[1],
			params[2], params[3], params[4]);
		element.classList.remove('toJacobSwitch');
		element.classList.add('JacobSwitch');
	}

	return switches.length;
}
// initJacobSwitches();
