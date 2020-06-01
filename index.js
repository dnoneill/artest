Vue.component('arview', {
  props: ['apiurl'],
  template: '<div id="arview">{{ text }}</div>',
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
   	for (var i=0; i<clues.length; i++){
   		const anchorRef = clues[i];
   		const arview = document.getElementById('arview')
   		var vue = this;
	    anchorRef.addEventListener("markerFound", (e)=>{
	      var cluenumb = parseInt(e.target.dataset.indexNumber);
	      this.currentclue = cluenumb;
	      vue.checkClue(e)     
	    })
	    anchorRef.addEventListener("markerLost", (e)=>{
	      vue.text = ''
	    })
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
  	sendData: function() {
  		alert('sendData')
  	},
  	successClue: function(e) {
  		const html = this.siteclues.filter(element => element['order'] == this.currentclue)[0]
	    this.text = html['message'];
	    localforage.setItem('progress', this.currentclue)
	    console.log(this.apiurl)
	    if (this.apiurl) {
	    	this.sendData();
	    }
  	}
  }
})

var app = new Vue({
  el: '#app'
})
