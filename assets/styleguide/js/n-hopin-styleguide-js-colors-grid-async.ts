import {VariableGroup, Variable} from './_variable-group';
import {copyToClipboard} from './_clipboard';

const namespace = 'n-hopin-styleguide-';
const COLORS_CONTAINER_SELECTOR = `.${namespace}js-colors-grid`;

const SWATCH_GROUP_CLASS = `${namespace}c-swatch-group`;
const SWATCH_CLASS = `${namespace}c-swatch`;
const SWATCH_HEX_CLASS = `${namespace}c-swatch__hex-value`;
const SWATCH_VAR_NAME_CLASS = `${namespace}c-swatch__var-value`;
const SWATCH_HEX_LIGHT_COLOR = `${namespace}c-swatch__hex--light-color`;
const SWATCH_HEX_DARK_COLOR = `${namespace}c-swatch__hex--dark-color`;
const SWATCH_COLOR_CLASS = `${namespace}c-swatch__color`;
const SWATCH_FOOTER_CLASS = `${namespace}c-swatch__footer`;
const SWATCH_NAME_CLASS = `${namespace}c-swatch__name`;
const SWATCH_COPY_CLASS = `${namespace}c-swatch__copytext`;

class ColorPalette extends VariableGroup {
	private white: RGBColor;
	private black: RGBColor;

	constructor() {
		super(COLORS_CONTAINER_SELECTOR);
		this.white = this.hexToRGB('#FFFFFF');
		this.black = this.hexToRGB('#000000');
	}

	renderData(variables: Variable[]): HTMLElement[] {
		const swatchGroup = document.createElement('div');
		swatchGroup.classList.add(SWATCH_GROUP_CLASS);
		for (const v of variables) {
			// Use c.value to get the actual color value
			const hexValue = document.createElement('span');
			hexValue.classList.add(SWATCH_HEX_CLASS);
			hexValue.textContent = v.value;

			const varName = document.createElement('span');
			varName.classList.add(SWATCH_VAR_NAME_CLASS);
			varName.textContent = v.variableName;

			const swatchColor = document.createElement('div');
			swatchColor.classList.add(SWATCH_COLOR_CLASS);
			swatchColor.style.backgroundColor = `var(${v.variableName})`;
			swatchColor.appendChild(varName);
			swatchColor.appendChild(hexValue);

			try {
				const vRGB = this.varRGBColor(swatchColor);
				// const vRGB = this.hexToRGB(v.value);
				const distanceToBlack = this.distance(vRGB, this.black);
				const distanceToWhite = this.distance(vRGB, this.white);

				if (distanceToBlack > distanceToWhite) {
					hexValue.classList.add(SWATCH_HEX_DARK_COLOR);
					varName.classList.add(SWATCH_HEX_DARK_COLOR);
				} else {
					hexValue.classList.add(SWATCH_HEX_LIGHT_COLOR);
					varName.classList.add(SWATCH_HEX_LIGHT_COLOR);
				}
			} catch (err) {
				console.warn(`Failed to check if swatch should have light or dark text: `, err);
			}

			const swatchFooter = document.createElement('div');
			swatchFooter.classList.add(SWATCH_FOOTER_CLASS);

			const colorName = document.createElement('span');
			colorName.classList.add(SWATCH_NAME_CLASS);
			colorName.textContent = v.prettyName;

			const copyText = document.createElement('div');
			copyText.classList.add(SWATCH_COPY_CLASS);
			copyText.textContent = 'Copy';

			swatchFooter.appendChild(colorName);
			swatchFooter.appendChild(copyText);

			const swatch = document.createElement('div');
			swatch.classList.add(SWATCH_CLASS);
			swatch.appendChild(swatchColor);
			swatch.appendChild(swatchFooter);
			swatch.addEventListener('click', (e) => {
				e.preventDefault();
				// TODO: Disable it such that you can't copy
				// multiple times.
				const success = copyToClipboard(v.variableName);
				if (success) {
					copyText.textContent = 'Copied';
					setTimeout(() => {
						copyText.textContent = 'Copy';
					}, 1000);
				}
			});

			swatchGroup.appendChild(swatch);
		}
		return [swatchGroup];
	}

	varRGBColor(swatch: HTMLElement): RGBColor {
		const regex = /rgba?\((\d*),\s*(\d*),\s*(\d*),?\s*\d*\.?\d*\)/;
		const hidden = document.createElement('div');
		hidden.style.display = 'none';
		document.body.appendChild(hidden);
		hidden.appendChild(swatch);

		const rgbString = getComputedStyle(swatch).getPropertyValue("background-color");

		hidden.removeChild(swatch);
		hidden.parentNode.removeChild(hidden);

		const result = regex.exec(rgbString);
		if (!result) {
			throw new Error(`Unable to parse computed style '${rgbString}'`);
		}

		return {
			Red: parseInt(result[1], 16),
			Green: parseInt(result[2], 16),
			Blue: parseInt(result[3], 16),
		}
	}

	hexToRGB(colorValue: string): RGBColor {
		const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
		let result = hexRegex.exec(colorValue.trim());
		if (!result) {
			// Try 3 hex
			const shortHexRegex = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i;
			result = shortHexRegex.exec(colorValue.trim());
			if (!result) {
				const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+).*\)$/i;
				result = rgbRegex.exec(colorValue.trim());
				if (!result) {
					throw new Error(`Unable to parse hex string '${colorValue}'`);
				}
			}
			result[1] = `${result[1]}${result[1]}`;
			result[2] = `${result[2]}${result[2]}`;
			result[3] = `${result[3]}${result[3]}`;
		}
		return {
			Red: parseInt(result[1], 16),
			Green: parseInt(result[2], 16),
			Blue: parseInt(result[3], 16),
		}
	}

	distance(c1: RGBColor, c2: RGBColor): number {
		const d = Math.pow((c1.Red - c2.Red), 2) +
        Math.pow((c1.Green - c2.Green), 2) +
        Math.pow((c1.Blue - c2.Blue), 2);
		return Math.sqrt(d);
	}
}

window.addEventListener('load', function() {
	if (!document.querySelector(COLORS_CONTAINER_SELECTOR)) {
		return
	}

	new ColorPalette().render();
});

interface RGBColor {
    Red: number;
    Green: number;
    Blue: number;
  }