Vue.config.ignoredElements = [
   'a-scene',
   'a-assets',
   'a-sky',
   'a-camera',
   'a-cursor',
   'a-animation',
   'a-entity',
   'a-link',
   'a-marker',
   'a-asset-item'
 ]

Vue.component('arview', {
  props: ['apiurl'],
  template: `<div><a-scene embedded arjs gesture-detector>
  <a-assets>
        <a-asset-item
          id="bowser"
          src="https://cdn.glitch.com/06bd98b4-97ee-4c07-a546-fe39ca205034%2Fbowser.glb"
        >
        </a-asset-item>
      </a-assets>
      <a-entity camera id="camera"></a-entity>
      </a-scene><div id="arview">{{ text }}</div></div>`,
  data: function() {
  	return {
  	    siteclues: {},
  	    text: '',
  	    currentclue: 0,
  	    highestclue: 100
  	}
  },
  mounted() {
  	var clues = document.getElementsByClassName('clue');
  	const siteclues = document.getElementById('siteclues')
  	this.siteclues = JSON.parse(siteclues.innerHTML)
  	const cluenumbs = this.siteclues.map(element=> parseInt(element['order']));
  	this.highestclue = Math.max(...cluenumbs);
  	siteclues.remove();
  	localforage.getItem('progress', function (err, value) {
  		if (!value) {
  			localforage.setItem('progress', 0)
  		}
  	})

    const ascene = document.getElementsByTagName("a-scene")[0];
    const camera = document.getElementById('camera')
    for (var i=0; i<this.siteclues.length; i++){
      const clue = this.siteclues[i];
      const innerelement = this.buildInnerElement(clue);
      if (clue['viewtype'] != 'location'){
        const newelement = document.createElement(`a-${clue['viewtype']}`);
        var itemtype = clue['viewtype'] == 'marker' ? 'pattern' : clue['viewtype'];
        const text = this.setDefaultValues(newelement, clue);
        text.setAttribute('url', clue['marker']);
        text.setAttribute('type', itemtype); 
        text.appendChild(innerelement);
        ascene.insertBefore(text, camera)
        var vue = this;
        text.addEventListener("markerFound", (e)=>{
          var cluenumb = parseInt(e.target.dataset.indexNumber);
          this.currentclue = cluenumb;
          vue.checkClue(e)     
          console.log('marker found')
        })
        text.addEventListener("markerLost", (e)=>{
          vue.text = ''
          console.log('marker lost')
        })
      } else {        
        const element = this.setDefaultValues(innerelement, clue);
        element.setAttribute('gps-entity-place', `latitude: ${clue['latitude']}; longitude: ${clue['longitude']};`)
        ascene.insertBefore(innerelement, camera)
      }
      const testelement = document.createElement('div')
      testelement.innerHTML = `<a-marker
        preset="hiro"
        raycaster="objects: .clickable"
        emitevents="true"
        cursor="fuse: false; rayOrigin: mouse;"
        id="markerA"
      >
        <a-entity
          id="bowser-model"
          gltf-model="#bowser"
          position="0 0 0"
          scale="0.05 0.05 0.05"
          class="clickable"
          gesture-handler
        >
        </a-entity>
      </a-marker>`
      console.log(testelement.firstChild)
      ascene.insertBefore(testelement.firstChild, camera)
    }
  },
  methods: {
    setDefaultValues: function(element, clue) {
       element.setAttribute('emitevents', 'true');
       element.setAttribute('class', 'clues');
       element.setAttribute('data-index-number', clue['order']); 
       return element;
    },
  	checkClue: function() {
  		var vue = this;
  		localforage.getItem('progress', function (err, value) {
  			if (vue.currentclue == vue.highestclue) {
  				vue.text = 'FINISHED'
  			} else if (vue.currentclue > value+1) {
  				alert(`You have skiped clue #${value+1}`)
  			}else {
  				vue.successClue()
  			}
  		})
  	}, 
    handleRotation(event) {
      console.log('handleRotation')
      console.log(event)
      el.object3D.rotation.y +=
        event.detail.positionChange.x * rotationFactor;

      el.object3D.rotation.x +=
        event.detail.positionChange.y * rotationFactor;
    },
  	sendData: function() {
  		alert('sendData')
  	},
    buildInnerElement: function(clue) {  
      let innerelement = `<a-${clue['type']}`
      if (clue['typeurl'] && clue['type'] == 'entity') {
        innerelement += ` gltf-model="${clue['typeurl']}" gesture-handler="minScale: 0.25; maxScale: 10"`
      } else if (clue['typeurl']) {
        innerelement += ` href="${clue['typeurl']}"`
      }
      if (clue['position']) {
        innerelement += `position="${clue['position']}"`
      }
      if (clue['scale']){
        innerelement += `scale="${clue['scale']}"`
      }
      innerelement += `></a-${clue['type']}>`
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = innerelement;
      return tempDiv.firstChild;
    },
  	successClue: function(e) {
  		const html = this.siteclues.filter(element => element['order'] == this.currentclue)[0]
	    this.text = html['message'];
	    localforage.setItem('progress', this.currentclue)
	    if (this.apiurl) {
	    	this.sendData();
	    }
  	}
  }
})

var app = new Vue({
  el: '#app'
})
