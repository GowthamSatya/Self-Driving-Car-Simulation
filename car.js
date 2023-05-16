// A Single Car Model

class Car {
	/*
    x = x-axis position on road
    y = y-axis position on road
    width = width of car
    height = height of car
    controlType = DUMMY | AI 
      DUMMY - dummy cars with with fixed speed 
      AI - Self Driving Car Leading Using Perceptrons
    
    maxSpeed = maximum speed of car
    color = color of car

    Other parameters like friction,acceleration and angle are defined in the class
  
  */
	constructor(x, y, width, height, controlType, maxSpeed = 3, color = "blue") {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.speed = 0;
		this.acceleration = 0.2;
		this.maxSpeed = maxSpeed;
		this.friction = 0.05;
		this.angle = 0;
		this.damaged = false;

		this.useBrain = controlType == "AI";

		// Add a sensor and assign the neural network to AI Car
		if (controlType != "DUMMY") {
			this.sensor = new Sensor(this);
			this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
		}

		// to manually control the car
		this.controls = new Controls(controlType);

		this.img = new Image();
		this.img.src = "car.png";

		// car canvas with given width and height
		this.mask = document.createElement("canvas");
		this.mask.width = width;
		this.mask.height = height;

		// get the context of the canvas and 2d canvas is rendered
		const maskCtx = this.mask.getContext("2d");

		// draw the car image on canvas at given position and add a color to it
		this.img.onload = () => {
			maskCtx.fillStyle = color;
			maskCtx.rect(0, 0, this.width, this.height);
			maskCtx.fill();

			maskCtx.globalCompositeOperation = "destination-atop";
			maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
		};
	}

	update(roadBorders, traffic) {
		if (this.sensor) {
			this.sensor.update(roadBorders, traffic);
			const offsets = this.sensor.readings.map((s) => {
				if (s) {
					return 1 - s.offset;
				} else return 0;
			});

			const outputs = NeuralNetwork.feedForward(offsets, this.brain);
			console.log(outputs);

			if (this.useBrain) {
				this.controls.forward = outputs[0];
				this.controls.backward = outputs[1];
				this.controls.left = outputs[2];
				this.controls.right = outputs[3];
			}
		}

		if (!this.damaged) {
			this.polygon = this.#createPolygon();
			this.damaged = this.#assessDamage(roadBorders, traffic);
			this.#move();
		}
	}

	// checking if the car is crashed
	#assessDamage(roadBorders, traffic) {
		// if car is crashed with road edges return true
		for (let i = 0; i < roadBorders.length; i++) {
			if (polysIntersect(this.polygon, roadBorders[i])) {
				return true;
			}
		}

		// if the car is crashed with other cars return true
		for (let i = 0; i < traffic.length; i++) {
			if (polysIntersect(this.polygon, traffic[i].polygon)) {
				return true;
			}
		}
		return false;
	}

	#createPolygon() {
		const points = [];
		const rad = Math.hypot(this.width, this.height) / 2;
		const alpha = Math.atan2(this.width, this.height);
		points.push({
			x: this.x - Math.sin(this.angle - alpha) * rad,
			y: this.y - Math.cos(this.angle - alpha) * rad,
		});
		points.push({
			x: this.x - Math.sin(this.angle + alpha) * rad,
			y: this.y - Math.cos(this.angle + alpha) * rad,
		});

		points.push({
			x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
			y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
		});

		points.push({
			x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
			y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
		});
		return points;
	}

	#move() {
		if (this.controls.forward) {
			this.speed += this.acceleration;
		}

		if (this.controls.backward) {
			this.speed -= this.acceleration;
		}

		if (this.speed != 0) {
			const flip = this.speed > 0 ? 1 : -1;

			if (this.controls.left) {
				this.angle += 0.03 * flip;
			}

			if (this.controls.right) {
				this.angle -= 0.03 * flip;
			}
		}
		if (this.speed >= this.maxSpeed) this.speed = this.maxSpeed;
		if (this.speed <= -this.maxSpeed) this.speed = -this.maxSpeed;
		if (this.speed > 0) this.speed -= this.friction;
		if (this.speed < 0) this.speed += this.friction;
		if (Math.abs(this.speed) < this.friction) this.speed = 0;

		this.x -= this.speed * Math.sin(this.angle);
		this.y -= this.speed * Math.cos(this.angle);
	}

	draw(ctx, drawSensor = false) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(-this.angle);
		if (!this.damaged) {
			ctx.drawImage(
				this.mask,
				-this.width / 2,
				-this.height / 2,
				this.width,
				this.height
			);
			ctx.globalCompositeOperation = "multiply";
		}
		ctx.drawImage(
			this.img,
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		);
		ctx.restore();
		if (this.sensor && drawSensor) this.sensor.draw(ctx);
	}
}
