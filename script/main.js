$(function () {
	$('.showScreen0').click(function () { showScreen(0) })
	$('.showScreen1').click(function () { showScreen(1) })
	$('.showScreen2').click(function () { showScreen(2) })
	$(window).resize(function () {
		if (redraw) redraw();
	})

	var redraw = false;

	function showScreen(index) {
		for (var i = 0; i < 3; i++) $('#screen'+i).toggle(index == i);
		if (index == 0) {
			exitFullscreen();
			redraw = false;
		}
		if (index == 1) {
			startFullscreen();
			drawCanvas1();
			redraw = drawCanvas1;
		}
		if (index == 2) {
			startFullscreen();
			drawCanvas2();
			redraw = drawCanvas2;
		}
	}

	function drawCanvas1() {
		var canvas = initCanvas(1);

		$('.size').text(canvas.width+'x'+canvas.height);
		var ctx = canvas.context;
		var pattern = ctx.createPattern(imgChess, 'repeat')

		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.strokeStyle = '#FFF';
		ctx.lineWidth = 1;
		ctx.strokeRect(0,0,canvas.width, canvas.height);

		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)/2, 0, 2 * Math.PI);
		ctx.stroke();
	}

	function drawCanvas2() {
		var gamma = 1;
		var canvas = initCanvas(2);

		var ctx = canvas.context;

		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var yOffset = 280;
		var blockHeight = Math.round((canvas.height-yOffset)/4);
		
		ctx.strokeStyle = '#666';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(canvas.width/2, yOffset);
		ctx.lineTo(canvas.width/2, canvas.height-blockHeight);
		ctx.stroke();

		drawColorBand(0, 255,   0,   0);
		drawColorBand(1,   0, 255,   0);
		drawColorBand(2,   0,   0, 255);
		drawColorBand(3, 255, 255, 255);

		function drawColorBand(index, r, g, b) {
			var pattern = [1,9,3,11,13,5,15,7,4,12,2,10,16,8,14,6];
			var y0 = yOffset + index*blockHeight;
			var x0 = blockHeight;
			var width = canvas.width-2*blockHeight;

			var img = ctx.getImageData(x0, y0, width, blockHeight);
			var data = img.data;

			for (var y = 0; y <= blockHeight/2; y++) {
				var band = Math.floor(4*y/blockHeight);
				switch (band) {
					case 0:
						for (var x = 0; x < width; x++) {
							var c = Math.floor(17*x/width)/17;
							c = Math.pow(c, gamma);
							drawPixel(x, y, c*r, c*g, c*b);
						}
					break;
					case 1:
						for (var x = 0; x < width; x++) {
							var c = Math.floor(17*x/width);
							var i = (x%4) + (y%4)*4;
							c = (c >= pattern[i]) ? 1 : 0;
							drawPixel(x, y, c*r, c*g, c*b);
						}
					break;
				}
			}

			ctx.putImageData(img, x0, y0);

			function drawPixel(x,y,r,g,b) {
				var i = (x + y*width)*4;
				data[i+0] = r;
				data[i+1] = g;
				data[i+2] = b;
			}
		}
	}

	function initCanvas(index) {
		var wrapper = $('#wrapper');
		var width  = window.innerWidth;
		var height = window.innerHeight;
		var canvas = $('#canvas'+index);
		canvas.attr('width',  width);
		canvas.attr('height', height);

		return {
			width: width,
			height: height,
			canvas: canvas,
			context: canvas.get(0).getContext('2d')
		}
	}

	function startFullscreen() {
		if (isFullscreen()) return;
		var elem = document.documentElement;
		var req = elem.requestFullScreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen || elem.msRequestFullScreen;
		req.call(elem);
	}

	function exitFullscreen() {
		if (!isFullscreen()) return;
		if (document.exitFullScreen) return document.exitFullScreen();
		if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
		if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
		if (document.msExitFullScreen) return document.msExitFullScreen();
	}

	function isFullscreen() {
		return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
	}

	var imgChess = new Image();
	imgChess.src = 'data:image/gif;base64,R0lGODlhAgACAIAAAAAAAP///yH5BAAAAAAALAAAAAACAAIAAAIDRAIFADs=';
	//imgChess.src = 'data:image/gif;base64,R0lGODlhAgACAIAAAAAAAFVVVSH5BAAAAAAALAAAAAACAAIAAAIDRAIFADs=';
})