Vue.config.ignoredElements = [
   'a-scene',
   'a-assets',
   'a-sky',
   'a-camera',
   'a-cursor',
   'a-animation',
   'a-entity',
   'a-link'
 ]

Vue.component('arview', {
  props: ['apiurl'],
  template: `<div><a-scene embedded arjs>
      <a-entity camera id="camera"></a-entity>
      </a-scene><div id="arview">{{ text }}</div></div>`,
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
        let text = document.createElement(`a-${clue['viewtype']}`);
        var itemtype = clue['viewtype'] == 'marker' ? 'pattern' : clue['viewtype'];
        text.setAttribute('data-index-number', clue['order']); 
        text.setAttribute('url', clue['marker']);
        text.setAttribute('class', 'clues'); 
        text.setAttribute('type', itemtype); 
        text.setAttribute('registerevents', '')
        text.appendChild(innerelement);
        ascene.insertBefore(text, camera)
        
      } else {        
        innerelement.setAttribute('class', 'clues');
        innerelement.setAttribute('data-index-number', clue['order']); 
        innerelement.setAttribute('gps-entity-place', `latitude: ${clue['latitude']}; longitude: ${clue['longitude']};`)
        ascene.insertBefore(innerelement, camera)
      }
    }
  },
  methods: {
    markers: function() {
      var vue = this;
      AFRAME.registerComponent('registerevents', {
        init: function () {
          var marker = this.el;

          marker.setAttribute('emitevents', 'true');

          marker.addEventListener('markerFound', function() {
            const cluenumb = parseInt(marker.dataset.indexNumber);
            const currentclue = vue.siteclues.filter(element => element['order'] == cluenumb)[0]
            console.log(currentclue)
            vue.currentclue = currentclue;
            vue.checkClue();
            console.log('markerFound', cluenumb);
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
  			if (vue.currentclue['order'] == vue.highestclue) {
  				vue.text = 'FINISHED'
  			} else if (vue.currentclue['order'] > value+1) {
  				alert(`You have skiped clue #${value+1}`)
  			}else {
  				vue.successClue()
  			}
  		})
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
      }
      if (clue['scale']){
        innerelement += `scale="${clue['scale']}"`
      }
      innerelement += `></a-${clue['type']}>`
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = innerelement;
      return tempDiv.firstChild;
    },
  	successClue: function() {
	    this.text = this.currentclue['message'];
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
