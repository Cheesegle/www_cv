//auto resize canvas
let canvas = document.getElementById('canvasOne');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

5555

//new WorldWind instance on canvasOne
let wwd = new WorldWind.WorldWindow("canvasOne");

//low res fallback layer
wwd.addLayer(new WorldWind.BMNGOneImageLayer());

//high res layer
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

//compass layer
wwd.addLayer(new WorldWind.CompassLayer());

//coordinates display layer
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));

//view controls layer
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

//placemark layer
let placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);

//new highlight controller
var highlightController = new WorldWind.HighlightController(wwd);


//placemark class
class Placemark {
  constructor(lon, lat, z, color, placemarkLabel, imageSource, offsetX, modal) {
    let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

    //placemark position
    let position = new WorldWind.Position(lon, lat, z);

    this.placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

    //image offset
    placemarkAttributes.imageOffset = new WorldWind.Offset(
      WorldWind.OFFSET_FRACTION, offsetX,
      WorldWind.OFFSET_FRACTION, 0.0);

    //highlight attributes
    let highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    this.placemark.highlightAttributes = highlightAttributes;
    highlightAttributes.imageScale = 1.2;

    //label color
    placemarkAttributes.labelAttributes.color = WorldWind.Color[color];

    //label offset
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
      WorldWind.OFFSET_FRACTION, 0.5,
      WorldWind.OFFSET_FRACTION, 1.0);

    //placemark image
    placemarkAttributes.imageSource = imageSource;

    //placemark label
    this.placemark.label = `${placemarkLabel}\n` +
      "Lat " + this.placemark.position.latitude.toPrecision(4).toString() + "\n" +
      "Lon " + this.placemark.position.longitude.toPrecision(5).toString();
    this.placemark.alwaysOnTop = true;
    this.placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

    //placemark modal user property
    if (modal) {
      this.placemark.userProperties.clickModal = modal;
    }
    placemarkLayer.addRenderable(this.placemark);
  }
  toggle() {
    //placemarks toggle
    if (this.placemark.enabled) {
      this.placemark.enabled = false;
    } else {
      this.placemark.enabled = true;
    }
  }
}

//placemarks array
let placemarks = [];


//add placemarks
placemarks.push(new Placemark(36.091919, -115.294617, 100, "YELLOW", "Las Vegas Home", "images/clickbait.png", 1, "LASVEGAS"));

placemarks.push(new Placemark(41.452040, -74.438760, 100, "GREEN", "Northern Academy", "images/plain-red.png", 0.3, "NORTHERN"));

//is modal open?
let modalOpen = false;

//on placemark click open modal
window.addEventListener('click', event => {
  //get mouse x and y
  var x = event.clientX,
    y = event.clientY;

  //get highlighted placemarks
  var placeList = wwd.pick(wwd.canvasCoordinates(x, y));

  //find placemarks with clickModal user property
  //also make sure to not repoen modal if modal is already open
  if (placeList.objects.length > 0 && modalOpen === false) {
    for (var i = 0; i < placeList.objects.length; i++) {
      if (placeList.objects[i]?.userObject?.userProperties?.clickModal) {
        modalOpen = true;
        //make modal visible
        let clickModal = placeList.objects[i].userObject.userProperties.clickModal;
        document.getElementById(clickModal).style.display = 'block';
      }
    }
  }
})

//modal close
let closeElements = document.getElementsByClassName('close');

let closeModal = function() {
  let modalElements = document.getElementsByClassName('modal');
  for (let i = 0; i < modalElements.length; i++) {
    modalElements[i].style.display = 'none';
  }
  //timeout to make modalOpen false after click events trigger
  setTimeout(() => {
    modalOpen = false;
  });
};

for (let i = 0; i < closeElements.length; i++) {
  closeElements[i].addEventListener('click', closeModal, false);
}
for (let i = 0; i < closeElements.length; i++) {
  closeElements[i].addEventListener('click', closeModal, false);
}


//placemarks toggle button
function placemarkToggle() {
  placemarks.forEach(placemark => {
    placemark.toggle();
  })
}
