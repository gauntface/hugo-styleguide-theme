export function copyToClipboard(txt: string): boolean {
	const hiddenElement = document.createElement('div');
	hiddenElement.textContent = txt;
	document.body.appendChild(hiddenElement);

	const range = document.createRange();
	range.selectNode(hiddenElement);

	window.getSelection().empty()
	window.getSelection().addRange(range);

	let success = false;
	try {
		// Now that we've selected the anchor text, execute the copy command
		success = document.execCommand('copy');
	} catch(err) {
		console.log('Error thrown when copying text: ', err);
	}

	// Remove the selections
	window.getSelection().removeRange(range);
	document.body.removeChild(hiddenElement);

	return success;
}