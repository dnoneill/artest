---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: null
---
<script src="https://aframe.io/releases/1.0.0/aframe.min.js"></script>
<!-- we import arjs version without NFT but with marker + location based support -->
<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
<body style="margin : 0px; overflow: hidden;">
	<div id="arview"></div>
    <a-scene embedded arjs>
    {% for item in site.data.arclues %}
    	{% if item.viewtype == 'marker' %}
	    	{% assign tag = 'a-marker' %}
	    	{% assign tagtype = 'pattern' %}
    	{% elsif item.viewtype == 'image' %}
	    	{% assign tag = 'a-nft' %}
	    	{% assign tagtype = 'nft' %}
    	{% endif %}
	    <{{tag}} url="{{item.marker}}" type="{{tagtype}}" class="clue" data-index-number="{{item.order}}">
	    	{% if item.type == 'entity' %}
		        <a-entity
		        position="0 -1 0"
		        scale="0.05 0.05 0.05"
		        gltf-model="{{item.typeurl}}"
		        ></a-entity>
	        {% endif %}
	    </{{tag}}>
    {% endfor %}
    <a-entity camera></a-entity>
    </a-scene>

    
</body>

<style>
	#arview {
		z-index: 2000;
		top:50%;
		background: white;
		color: black;
		right: 50%;
		position: absolute;
	}
</style>
<script>
    var clues = document.getElementsByClassName('clue');
    const siteclues = {{site.data.arclues | jsonify}}
    console.log(siteclues)
    console.log(clues)
   	for (var i=0; i<clues.length; i++){
   		const anchorRef = clues[i];
   		const arview = document.getElementById('arview')
	    anchorRef.addEventListener("markerFound", (e)=>{
	      var cluenumb = e.target.dataset.indexNumber;
	      const html = siteclues.filter(element => element['order'] == cluenumb)[0]
	      arview.innerHTML = html['message'];
	      
	      console.log(html);
	    })
	    anchorRef.addEventListener("markerLost", (e)=>{
	      arview.innerHTML = ""
	    })
   	 }
   	</script>