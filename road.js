// A Road Model

class Road {
	/*
        x = position of road in car canvas
        width = width of road
        laneCount = number of lanes in the road
    */
	constructor(x, width, laneCount = 4) {
		this.x = x;
		this.width = width;
		this.laneCount = laneCount;

		this.left = x - width / 2;
		this.right = x + width / 2;

		const infinity = 1000000;
		// borders of top and bottom are not present
		this.top = -infinity;
		this.bottom = infinity;

		const topLeft = { x: this.left, y: this.top };
		const topRight = { x: this.right, y: this.top };
		const bottomLeft = { x: this.left, y: this.bottom };
		const bottomRight = { x: this.right, y: this.bottom };

		// defining the road border to check collision
		this.borders = [
			[topLeft, bottomLeft],
			[topRight, bottomRight],
		];
	}

	// get the center poisiton of lane to start the car
	getLaneCenter(laneIdx) {
		const laneWidth = this.width / this.laneCount;
		return (
			this.left +
			laneWidth / 2 +
			Math.min(laneIdx, this.laneCount - 1) * laneWidth
		);
	}

	draw(ctx) {
		for (let i = 1; i <= this.laneCount - 1; i++) {
			const x = lerp(this.left, this.right, i / this.laneCount); // linear interpolation Calculate the x-coordinate of the point on the line at the given y-coordinate.

			// to draw the dashed lines
			ctx.setLineDash([40, 40]);
			ctx.strokeStyle = "white";
			ctx.lineWidth = 5;

			// start the drawing
			ctx.beginPath();
			// start point
			ctx.moveTo(x, this.top);
			// line is drawn until this end point
			ctx.lineTo(x, this.bottom);
			ctx.stroke();
		}
		ctx.setLineDash([]);

		// for the road end borders
		this.borders.forEach((border) => {
			ctx.strokeStyle = "yellow";
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(border[0].x, border[0].y);
			ctx.lineTo(border[1].x, border[1].y);
			ctx.stroke();
		});
	}
}
