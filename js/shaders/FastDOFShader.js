/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

THREE.FastDOFShader = {

	uniforms: {

		"cameraNear": { value: .1 },
		"cameraFar": { value: 100.0 },
		"tDiffuse": { value: null },
		"tDepth": { value: null },
		"v":        { value: 1.0 / 512.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float cameraNear;",
		"uniform float cameraFar;",
		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tDepth;",
		"uniform float v;",

		"varying vec2 vUv;",

		"float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {",
		"	return ( viewZ + near ) / ( near - far ); }",


		"float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {",
		" return (( near + viewZ ) * far ) / (( far - near ) * viewZ );",
		"}",
		"float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {",
		"	return ( near * far ) / ( ( far - near ) * invClipZ - far );",
		"}",

		"float readDepth (sampler2D depthSampler, vec2 coord) {",
		"		float fragCoordZ = texture2D(depthSampler, coord).x;",
		"		float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );",
		"		return viewZToPerspectiveDepth( viewZ, cameraNear, cameraFar );",
		"	}",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",
			"float depth = texture2D(tDepth, vUv).x;",
			"depth *= pow(depth, 32.0);",
			"depth = abs( depth * 2.0 - 1.0);",
			"float vV = v * depth;",
			"float h = vV;",

			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * vV ) ) * 0.051;",
			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * vV ) ) * 0.0918;",
			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * vV ) ) * 0.12245;",
			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * vV ) ) * 0.1531;",
			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * vV ) ) * 0.1531;",
			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * vV ) ) * 0.12245;",
			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * vV ) ) * 0.0918;",
			// "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * vV ) ) * 0.051;",

			"sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;",

			"gl_FragColor = sum;",
			// "gl_FragColor = vec4( vec3(depth) , 1.0);",

		"}"

	].join( "\n" )

};
