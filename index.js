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
  template: `<div><a-scene embedded arjs gesture-detector>
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
        let text = document.createElement(`a-${clue['viewtype']}`);
        var itemtype = clue['viewtype'] == 'marker' ? 'pattern' : clue['viewtype'];
        text.setAttribute('data-index-number', clue['order']); 
        text.setAttribute('url', clue['marker']);
        text.setAttribute('class', 'clues'); 
        text.setAttribute('type', itemtype); 
        text.appendChild(innerelement);
        ascene.insertBefore(text, camera)
        var vue = this;
        text.addEventListener("markerFound", (e)=>{
          var cluenumb = parseInt(e.target.dataset.indexNumber);
          this.currentclue = cluenumb;
          vue.checkClue(e)     
        })
        text.addEventListener("markerLost", (e)=>{
          vue.text = ''
        })
      } else {        
        innerelement.setAttribute('class', 'clues');
        innerelement.setAttribute('data-index-number', clue['order']); 
        innerelement.setAttribute('gps-entity-place', `latitude: ${clue['latitude']}; longitude: ${clue['longitude']};`)
        ascene.insertBefore(innerelement, camera)
      }
      this.gestures();
    }
  },
  methods: {
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
    gestures: function() {
      console.log('gestures')
      var vue = this;
      document.getElementsByTagName('a-scene')[0].addEventListener("onefingermove", vue.handleRotation);
      console.log('after gestures')
    },
    handleRotation(event) {
      console.log('handleRotation')
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
