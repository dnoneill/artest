---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: null
---
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.js" integrity="sha256-3NP4l3uenVxIZ0vLGnUjjObImjaJltaSzAHaGUr+yDA=" crossorigin="anonymous"></script>

<script src="https://aframe.io/releases/1.0.0/aframe.min.js"></script>
<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>

<script src="arjs-gestures/gesture-detector.js"></script>
<script src="arjs-gestures/gesture-handler.js"></script>

<body style="margin : 0px; overflow: hidden;">
	<script id="siteclues">
		{{site.data.arclues | jsonify}}
	</script>
	<div id="app">
	<arview apiurl="{{site.apiurl}}"></arview>
	</div>
    <script src="index.js"></script>
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