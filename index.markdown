---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: null
---
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.js" integrity="sha256-3NP4l3uenVxIZ0vLGnUjjObImjaJltaSzAHaGUr+yDA=" crossorigin="anonymous"></script>

<script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@1c2407b26c61958baa93967b5412487cd94b290b/dist/aframe-master.min.js"></script>

<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>

<script src="arjs-gestures/gesture-detector.js"></script>
<script src="arjs-gestures/gesture-handler.js"></script>

<body style="margin : 0px; overflow: hidden;">
	<script id="siteclues">
		{{site.data.arclues | jsonify}}
	</script>
	<div id="app">
	<arview apiurl="{{site.apiurl}}" completetext="{{site.completetext}}"></arview>
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

  .arjs-loader {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arjs-loader div {
    text-align: center;
    font-size: 1.25em;
    color: white;
  }
</style>