const CONTAINER_SELECTOR = '.n-hopin-styleguide-js-typography';
const ORIG_TEXT_ATTRIB = 'n-hopin-styleguide-typograhy_orig_text';
const DETAILS_CLASS_SELECTOR = 'n-hopin-styleguide-js-font-details';

class Typography {
	container: HTMLElement;
	canvas1: HTMLCanvasElement;
	canvas2: HTMLCanvasElement

	constructor() {
		this.container = document.querySelector(CONTAINER_SELECTOR) as HTMLElement;
		this.canvas1 = this.createCanvas();
		this.canvas2 = this.createCanvas();

		document.body.appendChild(this.canvas1);
		document.body.appendChild(this.canvas2);
	}

	createCanvas(): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.width = 100;
		canvas.height = 100;
		canvas.style.display = 'none';
		canvas.style.visibility = 'hidden';
		return canvas;
	}

	updateTypeInfo() {
		for (const e of this.container.children) {
			let elementToCheck = e;
			if (e.childElementCount > 0) {
				elementToCheck = e.children[0];
			}

			const eStyles = window.getComputedStyle(elementToCheck);
			const currentFont = this.getCurrentFont(eStyles.fontFamily);
            
			// TODO Find out which font is actually in use
			const detailText = `: ${currentFont} ${eStyles.fontWeight}, ${eStyles.fontSize}`;

			if (elementToCheck === e) {
				let origText = elementToCheck.getAttribute(ORIG_TEXT_ATTRIB);
				if (!origText) {
					origText = elementToCheck.textContent;
					elementToCheck.setAttribute(ORIG_TEXT_ATTRIB, origText);
					elementToCheck.textContent = `${origText}${detailText}`
				}
			} else {
				let span = e.querySelector(`.${DETAILS_CLASS_SELECTOR}`);
				if (!span) {
					span = document.createElement('span');
					span.classList.add(DETAILS_CLASS_SELECTOR);
					e.appendChild(span);
				}
				span.textContent = detailText;
			}
		}
	}

	getCurrentFont(fontFamily: string) {
		const individualFonts = fontFamily.split(",").map((f) => f.trim());
		for (const f of individualFonts) {
			if (this.isfontUsed(f)) {
				return f;
			}
		}
		return '<Browser Default>';
	}

	isfontUsed(f: string) {
		const imgData1 = this.printText(this.canvas1, "Test.", [f, "serif"]);
		const imgData2 = this.printText(this.canvas2, "Test.", [f, "sans-serif"]);

		return this.isImgDataMatching(imgData1, imgData2);
	}

	isImgDataMatching(data1: ImageData, data2: ImageData): boolean {
		if (data1.data.length != data2.data.length) {
			return false;
		}

		for (let i = 0; i < data1.data.length; i++) {
			if (data1.data[i] != data2.data[i]) {
				return false;
			}
		}

		return true;
	}

	printText(canvas: HTMLCanvasElement, text: string, fonts: string[]): ImageData {
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.font = `40px ${fonts.join(", ")}`;
		ctx.textAlign = "center"; 
		ctx.fillText(text, 50, 50);

		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	}
}

window.addEventListener('load', () => {
	if (!document.querySelector(CONTAINER_SELECTOR)) {
		return
	}

	const t = new Typography();
	t.updateTypeInfo();
	setInterval(() => {
		t.updateTypeInfo();
	}, 1000);
});