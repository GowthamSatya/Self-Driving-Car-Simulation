// Controls class to move every car maunally or automatically

class Controls {
	constructor(type) {
		this.forward = false;
		this.backward = false;
		this.left = false;
		this.right = false;

		switch (type) {
			// KEYS - For manual control
			case "KEYS":
				this.#addKeyboardListeners();
				break;
			// DUMMY - use by dummy cars as they move only front
			case "DUMMY":
				this.forward = true;
				break;
		}
	}

	// adding keyboard event listeners
	#addKeyboardListeners() {
		document.onkeydown = (e) => {
			switch (e.key) {
				case "ArrowLeft":
					this.left = true;
					break;
				case "ArrowUp":
					this.forward = true;
					break;
				case "ArrowRight":
					this.right = true;
					break;
				case "ArrowDown":
					this.backward = true;
					break;
			}
		};

		document.onkeyup = (e) => {
			switch (e.key) {
				case "ArrowLeft":
					this.left = false;
					break;
				case "ArrowUp":
					this.forward = false;
					break;
				case "ArrowRight":
					this.right = false;
					break;
				case "ArrowDown":
					this.backward = false;
					break;
			}
		};
	}
}
