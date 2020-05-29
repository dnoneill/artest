---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: null
---
<script src="https://aframe.io/releases/1.0.0/aframe.min.js"></script>
<!-- we import arjs version without NFT but with marker + location based support -->
<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
<body style="margin : 0px; overflow: hidden;">
    <a-scene embedded arjs>
    {% for item in site.data %}
    <a-marker url="{{item.marker}}">
        <a-entity
        position="0 -1 0"
        scale="0.05 0.05 0.05"
        gltf-model="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"
        ></a-entity>
    {% endfor %}
    </a-marker>
    <a-entity camera></a-entity>
    </a-scene>
</body>