// script.js
var activeTable = 0;
var resultsArray = [];

/* Interactivity                                                              */
/*
* Calculates the busbar resistance and updates the answer element.
*/
function calculate() {
  ans = $$('#answer'); // field that displays the resistance
  let imperialResistivities = {
    copper:10.37,
    aluminum:17,
    gold:14.7,
    silver:9.9,
    tungsten:33,
    nickel:47,
    iron:74,
    constantan:295,
    nichrome:600,
    calorite:720,
    carbon:21000
  }
  let Ωunit_factor = { 'Ω':1, 'mΩ':1000, 'μΩ':1000000 };

  let resistivity=
    imperialResistivities[(document.getElementById('material').value)];
		// 1.72*(10**(-8));
  let length=
    document.getElementById('length').value /
    document.getElementById('u1_value').value;
  let width=
    document.getElementById('width').value *
    document.getElementById('u2_value').value;
    let thickness=
    document.getElementById('thickness').value *
    document.getElementById('u3_value').value;
  let Ωunit =
    document.getElementById('ohm_units').value;
  let temperature = 50;
  let area_across= width * thickness;

console.log(`
	length ${length}
	width ${width}
	thickness ${thickness}
	ohm_units ${Ωunit}
	area_across ${area_across}
	`);
  var busbarResistance = 0;
  if($$('#system').classList.contains('switchL')) {
    // metric
    resistivity *= 0.7854*10**-6 * 6.4519*10**-4 / 0.3048;
	  busbarResistance =
	    resistivity * length / area_across; // * Ωunit_factor[Ωunit];
		$$('#answer_box div:first-of-type').innerHTML=`<u>Resistance</u> at 20°C`
  }else{
    //imperial
    area_across /= (0.7854*(10**(-6))); // convert to circular mils
	  busbarResistance =
	    resistivity * length / area_across; // * Ωunit_factor[Ωunit];
		$$('#answer_box div:first-of-type').innerHTML=`<u>Resistance</u> at 20°C (68°F)`
  }
		console.log(`
	area_across after CM conversion ${area_across}
	resistivity ${resistivity}
		`);

  // busbarResistance =
  //   resistivity * length / area_across; // * Ωunit_factor[Ωunit];
  resultsArray[0] = busbarResistance;
  resultsArray[1] = busbarResistance;

	console.log(`	busbarResistance: ${busbarResistance}`);

	// temperature
	let tempCoeffs = {
    copper:.00393,
    aluminum:.00391,
    gold:.0034,
    silver:.0038,
    tungsten:.005,
    nickel:.006,
    iron:.0055,
    constantan:.000008,
    nichrome:.00044,
    calorite:"?",
    carbon:"?"}
	α_20 = tempCoeffs[$$('#material').value];
	ΔT = temperature-20;
	// ΔT = 20-temperature;
	busbarResistance *= 1 + (α_20 * ΔT)
	console.log(`busbarResistance at ${temperature}°C: ${busbarResistance}
		ΔT: ${ΔT}`);

  formatAll();
	// 20°C
  ans.classList.add('flash');
  setTimeout(function () {
    ans.classList.remove('flash');
  }, 10);

  // updateScene(length, width, thickness);
}

function formatAll() {
  let numFormatables = $('.numFormatable');
  let Ωunit_factor = { 'Ω':1, 'mΩ':1000, 'μΩ':1000000 };

  if ($$('#notationChBox').checked) { // standard notation
		if($$('#ohm_units').value=='Ω') {
			numFormatables.forEach((element, i) => {
				resistance = resultsArray[i] * Ωunit_factor[$$('#ohm_units').value];
				element.innerHTML = resistance.toFixed(6);
			});
		} else {
			numFormatables.forEach((element, i) => {
				resistance = resultsArray[i] * Ωunit_factor[$$('#ohm_units').value];
				element.innerHTML = resistance.toFixed(4);
			});
		}
  } else { // scientific notation
		numFormatables.forEach((element, i) => {
			resistance = resultsArray[i] * Ωunit_factor[$$('#ohm_units').value];
			element.innerHTML = resistance.toExponential(6);
		});
  }

  let tableUnits = $('.tableUnit');
  tableUnits.forEach((element) =>
  { element.innerHTML = $$('#ohm_units').value; });
}

/* Allows the page to use the range input #system as a switch. */
function unitSwap() {
  let ft_in_select =`
  <option value=1 selected>ft</option>
  <option value=12>in.</option>`;
  let ft_in_select_alt =`
  <option value=12>ft</option>
  <option value=1 selected>in.</option>`;
  let m_cm_select =`
  <option value=1 selected>m</option>
  <option value=100>cm</option>`;
  let cm_mm_select =`
  <option value=0.01 selected>cm</option>
  <option value=0.001>mm</option>`;

  if($$('#system').classList.contains('switchL')) {
    $$("#u1_value").innerHTML = ft_in_select;
    $$("#u2_value").innerHTML = ft_in_select_alt;
    $$("#u3_value").innerHTML = ft_in_select_alt;
  }else{
    $$("#u1_value").innerHTML = m_cm_select;
    $$("#u2_value").innerHTML = cm_mm_select;
    $$("#u3_value").innerHTML = cm_mm_select;
  }
  // switchSwap($$('#system'));
  calculate();
}

// function switchSwap(element) {
//   if(element.classList.contains('switchL')) {
//     element.classList.remove('switchL');
//     element.classList.add('switchR');
//   } else {
//     element.classList.remove('switchR');
//     element.classList.add('switchL');
//   }
//
//   calculate();
// }

function storeInTable(){
  $$("#t_databody").innerHTML +=
  `<tr class="">
    <td class='numFormatable'>${$$('#answer').innerHTML}</td>
    <td class='tableUnit'>${$$('#ohm_units').value}</td>
    <td>${$$('#material').value}</td>
    <td>${$$('#length').value}</td>
    <td>${$$('#width').value}</td>
    <td>${$$('#thickness').value}</td>
  </tr>`;
  resultsArray.push(resultsArray[0]);
  $$('#t_datatable').scrollBy(0,1000);

  if(activeTable == 0) {
    $$('#ttitle').classList.add('enterStageRight');
    $$('#t_datatable').classList.add('enterStageRight');
    activeTable = 1;
  };

  $$('#t_databody tr:last-child').classList.add('enterStageLeftTransition');
}

/* Effectively presses the "display in table" button when Enter is pressed. */
$$('#g_main').addEventListener('keypress', function(event) {
  if(event.key === "Enter") {
    event.preventDefault();
    $$('#b_storetable').click();
  }
});



/* 3D Preview code                                                            */
let scene;

/* loaders */
// const textureL = new THREE.TextureLoader().load('textures/LengthLabel.png');
/*
Initializes the scene.
*/
// function init() {
//   /* create scene */
//   scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xffffff);
//   // scene.background = new THREE.Color(0xdddddd);
//
//   // renderer
//   rendWidth = 1100;
//   rendHeight = 150;
//   renderer = new THREE.WebGLRenderer({
//     antialias:true,
//     canvas: document.querySelector('#bar_preview')
//   });
//   renderer.setSize( rendWidth , rendHeight );
//   document.getElementById("g_main").appendChild(renderer.domElement);
//
//   /* orthographic camera */
//   camRatio = 70
//   let cam_width = rendWidth / camRatio;
//   let cam_height = rendHeight / camRatio;
//   camera = new THREE.OrthographicCamera(
//     cam_width/-2, cam_width/2,
//     cam_height/2, cam_height/-2,
//     0.1, 1000
//   )
//   camera.position.set(7.2,1.3,5)
//   /* sheer matrix to turnan orthographic camera into an  an oblique camera */
//   var alpha = Math.PI / 6; // or Math.PI / 4
//   var Syx = 0,
//   Szx = -0.5*Math.cos( alpha ),
//   Sxy = 0,
//   Szy = -0.5*Math.sin( alpha ),
//   Sxz = 0,
//   Syz = 0;
//   var matrix = new THREE.Matrix4();
//   matrix.set(
//     1,    Syx,  Szx,  0,
//     Sxy,  1,    Szy,  0,
//     Sxz,  Syz,  1,    0,
//     0,    0,    0,    1  );
//   camera.projectionMatrix.multiply(matrix);
//
//   /* 3-side lights */
//   let yzLight = new THREE.PointLight(0x00aeef, 1);
//   yzLight.position.set(13,0,0);
//   let xzLight = new THREE.PointLight(0x52cbf5, 1);
//   xzLight.position.set(0,13,0);
//   let xyLight = new THREE.PointLight(0x007cab, 1);
//   xyLight.position.set(0,0,13);+
//   scene.add(yzLight, xzLight, xyLight);
//
//
//   /* bar material and geometry */
//   let bar_geometry = new THREE.BoxGeometry( 1, 1, 1 );
//   let bar_material = new THREE.MeshPhongMaterial();
//   bar = new THREE.Mesh( bar_geometry, bar_material );
//   scene.add(bar);
//
//
//   /* Grids
//   const lengthGrid = new THREE.GridHelper( 12, 12 );
//   lengthGrid.rotation.x = 90/180*Math.PI;
//   const widthGrid = lengthGrid;
//   widthGrid.rotation.y = 90/180*Math.PI;
//   scene.add( widthGrid );
// */
//
// /* brackets to label dimensions */
// // let bracketBaseMaterial = new THREE.MeshPhongMaterial();
// let bracketBaseMaterial = new THREE.MeshBasicMaterial( {color: 0x007cab} );
// let bracketBaseGeometry = new THREE.BoxGeometry( 1, .1, .01 );
// let bracketEndGeometry = new THREE.BoxGeometry( .1, .3, .01 );
//
// // length bracket
// bracketLengthBase = new THREE.Mesh( bracketBaseGeometry, bracketBaseMaterial );
// bracketLengthStationaryEnd = new THREE.Mesh( bracketEndGeometry, bracketBaseMaterial );
// bracketLengthMeasuredEnd = new THREE.Mesh( bracketEndGeometry, bracketBaseMaterial );
// scene.add(bracketLengthBase , bracketLengthStationaryEnd,
//   bracketLengthMeasuredEnd);
//
// bracketLengthStationaryEnd.position.y = -.2;
// bracketLengthStationaryEnd.position.x = .05;
// bracketLengthMeasuredEnd.position.y = -.2;
//
// bracketLengthBase.position.y = -.3;
// // bracketLengthBase.position.x = 1.5;
//
// // width bracket
// bracketWidthBase = bracketLengthBase.clone();
// bracketWidthStationaryEnd = bracketLengthStationaryEnd.clone();
// bracketWidthMeasuredEnd = bracketLengthMeasuredEnd.clone();
// scene.add(bracketWidthBase , bracketWidthStationaryEnd,
//   bracketWidthMeasuredEnd);
// bracketWidthBase.rotation.set(90/180*Math.PI, 0, 90/180*Math.PI);
// bracketWidthMeasuredEnd.rotation.set(90/180*Math.PI, 0, 90/180*Math.PI);
// bracketWidthStationaryEnd.rotation.set(90/180*Math.PI, 0, 90/180*Math.PI);
// bracketWidthBase.position.x = -.3;
// bracketWidthMeasuredEnd.position.x = -.2;
// bracketWidthStationaryEnd.position.x = -.2;
//
// // thickness bracket
// bracketThicknessBase = bracketLengthBase.clone();
// bracketThicknessStationaryEnd = bracketLengthStationaryEnd.clone();
// bracketThicknessMeasuredEnd = bracketLengthMeasuredEnd.clone();
// scene.add(bracketThicknessBase , bracketThicknessStationaryEnd,
//   bracketThicknessMeasuredEnd);
// bracketThicknessBase.rotation.z = 90/180*Math.PI;
// bracketThicknessMeasuredEnd.rotation.z = 90/180*Math.PI;
// bracketThicknessStationaryEnd.rotation.z = 90/180*Math.PI;
// bracketThicknessBase.position.x = -.3;
// bracketThicknessMeasuredEnd.position.x = -.2;
// bracketThicknessStationaryEnd.position.x = -.2;
// bracketThicknessStationaryEnd.position.y = .05;
//
//
//   /* Text Labels */
//   const fontL = new THREE.FontLoader();
//   fontL.load(
//     // 'gentilis_bold.typeface.json',
//     'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/gentilis_bold.typeface.json',
//     function ( font ) {
//       lengthGeo = new THREE.TextGeometry( 'Length',
//       { font: font, size: .35, height: 0, } );
//       widthGeo = new THREE.TextGeometry( 'Width',
//       { font: font, size: .35, height: 0, } );
//       thicknessGeo = new THREE.TextGeometry( 'Thickness',
//       { font: font, size: .35, height: 0, } );
//       let textMaterial = new THREE.MeshBasicMaterial({ color: 0x007cab });
//       lengthLabel = new THREE.Mesh( lengthGeo, textMaterial );
//       widthLabel = new THREE.Mesh( widthGeo, textMaterial );
//       thicknessLabel = new THREE.Mesh( thicknessGeo, textMaterial );
//
//       scene.add(lengthLabel, widthLabel, thicknessLabel);
//       lengthLabel.position.set(0,-.9,0);
//       lengthLabel.rotation.set(-0/180*Math.PI,0,0);
//       widthLabel.position.set(-1.9,1,0);
//       widthLabel.rotation.set(0/180*Math.PI, 0/180*Math.PI, 0/180*Math.PI);
//       thicknessLabel.position.set(-2.1,.7,1);
//       thicknessLabel.rotation.set(-0/180*Math.PI,0,0);
//
//       renderer.render(scene, camera); // render must be called inside of .load
//       // to ensure that it is called after the loader has loaded.
//
// 			// bar.scale.set(12, 1.5, .35);
//
// 			setTimeout(function () {
// 				updateScene(12, 1.5, .35);
// 			}, 2000);
//
//     }
//   );
//
//   /* cam debug
//   document.getElementById('camx').value = camera.rotation.x*180/Math.PI;
//   document.getElementById('camy').value = camera.rotation.y*180/Math.PI;
//   document.getElementById('camz').value = camera.rotation.z*180/Math.PI;
//
//   document.getElementById('camXText').innerHTML = camera.rotation.x*180/Math.PI;
//   document.getElementById('camYText').innerHTML = camera.rotation.y*180/Math.PI;
//   document.getElementById('camZText').innerHTML = camera.rotation.z*180/Math.PI;
//   */
//   // animate();
// }


/*
Recursive loop that animates the scene, currently rotating a mesh.
*/
// function animate() {
//   requestAnimationFrame( animate );
//   // camgroup.rotation.y += 0.001;
//   textMesh.rotation.y += 0.1;
//   renderer.render(scene, camera);
// }

/*
* Updates the 3d preview scene with the entered values; called by calculate().
*/
function updateScene(length, width, thickness) {
  if($$('#system').classList.contains('switchL')) { // metric conversion
    length /= 0.0254;
    width /= 0.0254;
    thickness /= 0.0254;
  };

  bar.scale.set(length, thickness, width);
  bar.position.x = length / 2;
  bar.position.y = thickness / 2;
  bar.position.z = width /-2;

  /* updates bracket indicators. */
  bracketLengthMeasuredEnd.position.x = length*1 - .05; //*1 is to cast to int.
  bracketLengthBase.position.x = length / 2;
  bracketLengthBase.scale.x = length;

  bracketWidthBase.position.y = bar.position.y*2;
  bracketWidthStationaryEnd.position.y = bar.position.y*2;
  bracketWidthMeasuredEnd.position.y = bar.position.y*2;
  bracketWidthBase.position.z = -width / 2;
  bracketWidthMeasuredEnd.position.z = -width*1 + .05; //*1 is to cast to int.
  bracketWidthBase.scale.x = width;
  widthLabel.position.z = -width;
  widthLabel.position.y = thickness;

  bracketThicknessBase.position.y = thickness*1/2-.05;
  bracketThicknessMeasuredEnd.position.y = thickness*1-.1;
  bracketThicknessBase.scale.x = thickness*1-.1;
  thicknessLabel.position.y = thickness*1-.1;


  renderer.render(scene, camera);
}

/*
debugging. rotates camera w/ values from sliders.
*/
function camspin() {
  xrotation = document.getElementById('camx').value;
  yrotation = document.getElementById('camy').value;
  zrotation = document.getElementById('camz').value;
  // yrotation = 0;
  // zrotation = 0;

  document.getElementById('camXText').innerHTML = xrotation;
  document.getElementById('camYText').innerHTML = yrotation;
  document.getElementById('camZText').innerHTML = zrotation;

  camera.rotation.set(
    xrotation/180*Math.PI,
    yrotation/180*Math.PI,
    zrotation/180*Math.PI
  );
  // camera.rotation.x = xrotation/180*Math.PI;
  renderer.render(scene, camera);
}
// init();
// $$('#system').innerHTML =
// createJacobSwitch('system', 'Imperial', 'Metric', '6.6rem');
setTimeout(function () {
	unitSwap();
	initJacobSwitches();
}, 500);
// updateScene(12, 1.5, .35);
