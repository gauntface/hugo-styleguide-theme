export function friendlyName(varName: string): string {
	const parts = varName.split(/_|-/g);
	const words: string[] = [];
	for (const p of parts) {
		if (p == '') {
			continue;
		}

		words.push(p.charAt(0).toUpperCase()  + p.slice(1).toLowerCase());
	}
	return words.join(' ');
}

export function friendlyNameFromURL(urlString: string): string {
	const filenameWithExt = urlString.substring(urlString.lastIndexOf('/')+1);
	const filename = filenameWithExt.substring(0, filenameWithExt.lastIndexOf('.'));
	return friendlyName(filename);
}