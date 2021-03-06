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
   'a-asset-item',
   'a-box',
   'a-nft'
 ]

Vue.component('arview', {
  props: ['apiurl', 'completetext'],
  template: `<div>
      <div class="arjs-loader">
        <div>Loading, please wait...</div>
      </div>
      <a-scene embedded arjs="sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960;" gesture-detector>
        <a-entity camera id="camera"></a-entity>
      </a-scene>
      <div id="arview">{{ text }}</div>
      </div>`,
  data: function() {
  	return {
  	    siteclues: {},
  	    text: '',
  	    currentclue: {},
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
    this.markers();
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
        console.log(text)
        text.setAttribute('type', itemtype); 
        text.setAttribute('registerevents', '');
        text.setAttribute("smooth", "true");
        text.setAttribute("smoothCount", "10");
        text.setAttribute("smoothTolerance", ".01");
        text.setAttribute("smoothThreshold", "5");
        text.appendChild(innerelement);
        ascene.insertBefore(text, camera)
      } else {        
        const element = this.setDefaultValues(innerelement, clue);
        element.setAttribute('gps-entity-place', `latitude: ${clue['latitude']}; longitude: ${clue['longitude']};`)
        ascene.insertBefore(innerelement, camera)
      }
    }
  },
  methods: {
    setDefaultValues: function(element, clue) {
       element.setAttribute('emitevents', 'true');
       element.setAttribute('class', 'clues');
       element.setAttribute('data-index-number', clue['order']); 
       element.setAttribute('gesture-handler', '');
       return element;
    },
    getCurrentClue: function(marker) {
      const cluenumb = marker.parentElement.dataset && marker.parentElement.dataset.indexNumber ? marker.parentElement.dataset.indexNumber : marker.dataset.indexNumber;
      console.log(cluenumb);
      const currentclue = this.siteclues.filter(element => element['order'] == cluenumb)[0];
      return currentclue;
    },
    markers: function() {
      var vue = this;
      AFRAME.registerComponent('clickhandler', {
        init: function() {
          var marker = this.el;
          console.log(marker)
          this.el.addEventListener('click', () => {
            vue.currentclue = vue.getCurrentClue(marker);
            alert(vue.currentclue['message'])
          });
      }});
      AFRAME.registerComponent('registerevents', {
        init: function () {
          var marker = this.el;
          console.log(marker)
          // marker.setAttribute('emitevents', 'true');

          marker.addEventListener('markerFound', function() {
            vue.currentclue = vue.getCurrentClue(marker);
            vue.checkClue();
            console.log('markerFound');
          });

          marker.addEventListener('markerLost', function() {
            console.log('markerLost');
            vue.text = '';
            vue.currentclue = {};
          });
        }
      });
    },
  	checkClue: function() {
  		var vue = this;
  		localforage.getItem('progress', function (err, value) {
  		  if (vue.currentclue['order'] && vue.currentclue['order'] > value+1) {
  				alert(`You have skiped clue #${value+1}`)
  			} else {
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
        innerelement += ` gltf-model="${clue['typeurl']}"`
      } else if (clue['typeurl']) {
        innerelement += ` href="${clue['typeurl']}"`
      }
      if (clue['position']) {
        innerelement += `position="${clue['position']}"`
      } else {
        innerelement += `position="0 0 0"`
      }
      if (clue['scale']){
        innerelement += `scale="${clue['scale']}"`
      } else {
        innerelement += `scale="0.05 0.05 0.05"`
      }
      innerelement += ` clickhandler></a-${clue['type']}>`
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = innerelement;
      return tempDiv.firstChild;
    },
  	successClue: function() {
	    this.text = this.currentclue['message'];
      if (this.currentclue['order'] == this.highestclue) {
        this.text += ' ' + this.completetext;
      }
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
