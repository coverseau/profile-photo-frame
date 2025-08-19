const ppfTemplates = {
	'#IAmNotMisinformation': [
		'IAmNotMisinformation.svg',
		'IAmNotMisinformationVI.svg'
	],
	'#PurpleOut': [
		'PurpleOut-1.png',
		'PurpleOut-2.png',
		'PurpleOut-3.png',
		'PurpleOut-4.png',
		'PurpleOut-5.png',
		'PurpleOut-6.png'
	],
	'#CanWeTalkAboutIt': [
		'CanWeTalkAboutIt-1.svg',
		//'CanWeTalkAboutIt-2.svg',
		'CanWeTalkAboutIt-3.svg',
		//'CanWeTalkAboutIt-4.svg', //sq
		//'CanWeTalkAboutIt-5.svg', //sq
		//'CanWeTalkAboutIt-6.svg',
		//'CanWeTalkAboutIt-7.svg', //sq
		'IStandWithYou.svg'
	]/*,
	'#BelieveUs': [
		'BelieveUs-1.svg',
		'BelieveUs-2.svg',
		'BelieveUs-3.svg',
		'BelieveUs-4.svg',
		'BelieveUs-5.svg',
		'BelieveUs-6.svg',
		'BelieveUs-7.svg',
		'BelieveUs-8.svg',
		'BelieveUs-9.svg',
		'BelieveUs-10.svg',
		'BelieveUs-11.svg',
		'BelieveUs-12.svg',
		'BelieveUs-13.svg',
		'BelieveUs-14.svg',
		'BelieveUs-15.svg',
		'BelieveUs-16.svg',
		'BelieveUs-17.svg',
		'BelieveUs-18.svg'
		'BelieveUs-19.png'
	]*/
};
const ppfOriginalImage = new Image();
const ppfCsize = 200;
const ppfDsize = 300;
const ppfEsize = 800;
const ppfCropColour = '#dc143c';
const ppfSelectorColour = '#ff7f50';
const ppfMutedColourTrans = '#708090cc';
const ppfBorderColour = '#696969';

if (window.addEventListener) {
	window.addEventListener('load', ppf_prepareAll);
} else {
	window.attachEvent('onload', ppf_prepareAll)
}

function ppf_prepareAll() {
	ppf_prepareCrop();
	ppf_preparePhotoLoad();
	ppf_prepareTemplateSelect();
	ppf_prepareCircle();
	ppf_prepareDownloadButton();
}

function ppf_prepareCrop() {
	const ppf_originalPhotoCropForm = document.getElementById('ppf_originalPhotoCropForm');
	ppf_originalPhotoCropForm.addEventListener('submit', event => { event.preventDefault(); event.stopPropagation(); });
	document.getElementById('ppf_originalPhotoCropSize').oninput = () => {
		ppf_cropAndDraw();
	}
	document.getElementById('ppf_originalPhotoCropSize').onchange = () => {
		ppf_cropAndDraw();
		ppf_doOverlay();
	}
	document.getElementById('ppf_originalPhotoCropOffsetX').oninput = () => {
		ppf_cropAndDraw();
	}
	document.getElementById('ppf_originalPhotoCropOffsetX').onchange = () => {
		ppf_cropAndDraw();
		ppf_doOverlay();
	}
	document.getElementById('ppf_originalPhotoCropOffsetY').oninput = () => {
		ppf_cropAndDraw();
	}
	document.getElementById('ppf_originalPhotoCropOffsetY').onchange = () => {
		ppf_cropAndDraw();
		ppf_doOverlay();
	}
}

function ppf_preparePhotoLoad() {
	const selectPhotoFile = document.getElementById('ppf_selectOriginalPhoto');
	document.getElementById('ppf_originalPhotoDisplay').onclick = () => {
		selectPhotoFile.click();
	}
	document.getElementById('ppf_selectPhoto').onclick = () => {
		selectPhotoFile.click();
	}
	selectPhotoFile.onchange = () => {
		const originalPhotoDisplay = document.getElementById('ppf_originalPhotoDisplay');
		const context = originalPhotoDisplay.getContext('2d');
		
		// clear any existing images
		context.clearRect(0, 0, originalPhotoDisplay.width, originalPhotoDisplay.height);
		originalPhotoDisplay.setAttribute('data-photo', '');
		
		// load new image
		let cWidth = ppfCsize, cHeight = ppfCsize;
		if (selectPhotoFile.files && selectPhotoFile.files.length && selectPhotoFile.files[0]) {
			const photoFile = selectPhotoFile.files[0];
			originalPhotoDisplay.style.backgroundImage = 'none';
			originalPhotoDisplay.style.opacity = 1.0;
			window.URL.revokeObjectURL(ppfOriginalImage.src);
			ppfOriginalImage.src = window.URL.createObjectURL(photoFile);
			ppfOriginalImage.onload = () => {
				document.getElementById('ppf_originalPhotoCropSize').value = 1;
				document.getElementById('ppf_originalPhotoCropOffsetX').value = 0;
				document.getElementById('ppf_originalPhotoCropOffsetY').value = 0;
				ppf_cropAndDraw(photoFile.name);
				ppf_doOverlay();
			};
		} else {
			originalPhotoDisplay.width = cWidth;
			originalPhotoDisplay.height = cHeight;
			originalPhotoDisplay.style.backgroundImage = 'url(\'' + ppfProfilePhotoFrameScript.pluginDirUrl + '/templates/placeholder.svg\')';
			originalPhotoDisplay.style.opacity = 0.25;
		}
	}
}

function ppf_prepareCircle() {
	document.getElementById('ppf_showCircle').onchange = () => {
		ppf_doOverlay();
	};
}

function ppf_cropAndDraw(photoFileName = '') {
	let cWidth = ppfCsize, cHeight = ppfCsize;
	if (ppfOriginalImage.src) {
		let size = document.getElementById('ppf_originalPhotoCropSize').value;
		document.getElementById('ppf_originalPhotoCropSizeDisplay').innerText = Math.round(100 * size);
		let offsetX = document.getElementById('ppf_originalPhotoCropOffsetX').value;
		document.getElementById('ppf_originalPhotoCropOffsetXDisplay').innerText = Math.round(100 * offsetX);
		let offsetY = document.getElementById('ppf_originalPhotoCropOffsetY').value;
		document.getElementById('ppf_originalPhotoCropOffsetYDisplay').innerText = Math.round(100 * offsetY);
		
		const originalPhotoDisplay = document.getElementById('ppf_originalPhotoDisplay');
		const context = originalPhotoDisplay.getContext('2d');
		if (ppfOriginalImage.naturalWidth != 0 && ppfOriginalImage.naturalWidth != ppfOriginalImage.naturalHeight) {
			const ratio = Math.min(ppfOriginalImage.naturalWidth, ppfOriginalImage.naturalHeight) / Math.max(ppfOriginalImage.naturalWidth, ppfOriginalImage.naturalHeight);
			if (ppfOriginalImage.naturalWidth > ppfOriginalImage.naturalHeight) {
				cHeight = Math.round(cHeight * ratio);
				originalPhotoDisplay.height = cHeight;
			} else if (ppfOriginalImage.naturalWidth < ppfOriginalImage.naturalHeight) {
				cWidth = Math.round(cWidth * ratio);
				originalPhotoDisplay.width = cWidth;
			}
		}
		size = Math.round(Math.min(cHeight, cWidth) * size);
		offsetX = Math.round(cWidth * offsetX);
		if (offsetX + size > cWidth) {
			offsetX = cWidth - size;
		}
		offsetY = Math.round(cHeight * offsetY);
		if (offsetY + size > cHeight) {
			offsetY = cHeight - size;
		}
		context.drawImage(ppfOriginalImage, 0, 0, cWidth, cHeight);
		context.lineWidth = 0;
		context.fillStyle = ppfMutedColourTrans;
		context.fillRect(0, 0, cWidth, offsetY);
		context.fillRect(0, offsetY, offsetX, size);
		context.fillRect(offsetX + size, offsetY, cWidth - size - offsetX, size);
		context.fillRect(0, offsetY + size, cWidth, cHeight - size - offsetY);
		context.lineWidth = 2;
		context.strokeStyle = ppfCropColour;
		context.strokeRect(offsetX, offsetY, size, size);
		if (!!photoFileName && photoFileName.length) {
			originalPhotoDisplay.setAttribute('data-photo', photoFileName);
		}
	}
}

function ppf_prepareTemplateSelect() {
	let nTemplates = 0;
	Object.keys(ppfTemplates).forEach(templateCategory => {
		nTemplates += ppfTemplates[templateCategory].length
	});
	const heading = document.getElementById('ppf_templateList_heading');
	heading.innerText = heading.innerText + ' (' + nTemplates + ' to choose from)';
	const listParentContainer = document.getElementById('ppf_templateList');
	Object.keys(ppfTemplates).forEach(templateHeading => {
		const templates = ppfTemplates[templateHeading];
		const templateCategoryHeading = document.createElement('h3');
		templateCategoryHeading.innerText = templateHeading;
		listParentContainer.appendChild(templateCategoryHeading);
		const templateList = document.createElement('ul');
		templateList.className = 'ppf_templateList';
		templates.forEach(template => {
			const listItem = document.createElement('li');
			listItem.id = 'ppf_template_' + template;
			listItem.setAttribute('data-template', template);
			listItem.setAttribute('data-selected', 'false');
			listItem.onmouseover = () => {
				listItem.style.outlineStyle = 'solid';
			};
			listItem.onmouseout = () => {
				listItem.style.outlineStyle = 'none';
			};
			listItem.onclick = () => {
				listItem.style.outlineColor = ppfSelectorColour;
				Object.keys(ppfTemplates).forEach(templateHeading2 => {
					const templates2 = ppfTemplates[templateHeading2];
					templates2.forEach(template2 => {
						const template2el = document.getElementById('ppf_template_' + template2);
						template2el.setAttribute('data-selected', 'false');
						template2el.style.borderColor = ppfBorderColour;
						template2el.style.boxShadow = 'none';
					});
				});
				listItem.setAttribute('data-selected', 'true');
				listItem.style.borderColor = ppfSelectorColour;
				listItem.style.boxShadow = '4px 4px 4px ' + ppfSelectorColour;
				ppf_doOverlay();
			};
			const imageItem = document.createElement('img');
			imageItem.src = ppfProfilePhotoFrameScript.pluginDirUrl + '/templates/' + template;
			imageItem.alt = template;
			listItem.appendChild(imageItem);
			templateList.appendChild(listItem);
		});
		listParentContainer.appendChild(templateList);
	});
}

function ppf_doOverlay() {
	const newPhotoDisplay = document.getElementById('ppf_newPhotoDisplay');
	const context = newPhotoDisplay.getContext('2d');
	context.clearRect(0, 0, newPhotoDisplay.width, newPhotoDisplay.height);
	context.restore();
	const downloadButton = document.getElementById('ppf_downloadPhoto');
	
	const originalPhotoDisplay = document.getElementById('ppf_originalPhotoDisplay');
	let goAhead = '';
	if (originalPhotoDisplay.getAttribute('data-photo').length) {
		const listParents = document.getElementsByClassName('ppf_templateList');
		for (var i = 0; i<listParents.length; i++) {
			const listParent = listParents.item(i);
			listParent.childNodes.forEach(listItem => {
				if (listItem.getAttribute('data-selected') == 'true') {
					goAhead = listItem.getAttribute('data-template');
				}
			});
		}
	}
	if (goAhead.length) {
		const cSize = ppfDsize;
		const cWidth = ppfOriginalImage.naturalWidth, cHeight = ppfOriginalImage.naturalHeight;
		let size = document.getElementById('ppf_originalPhotoCropSize').value;
		document.getElementById('ppf_originalPhotoCropSizeDisplay').innerText = Math.round(100 * size);
		let offsetX = document.getElementById('ppf_originalPhotoCropOffsetX').value;
		document.getElementById('ppf_originalPhotoCropOffsetXDisplay').innerText = Math.round(100 * offsetX);
		let offsetY = document.getElementById('ppf_originalPhotoCropOffsetY').value;
		document.getElementById('ppf_originalPhotoCropOffsetYDisplay').innerText = Math.round(100 * offsetY);
		size = Math.round(Math.min(cHeight, cWidth) * size);
		offsetX = Math.round(cWidth * offsetX);
		if (offsetX + size > cWidth) {
			offsetX = cWidth - size;
		}
		offsetY = Math.round(cHeight * offsetY);
		if (offsetY + size > cHeight) {
			offsetY = cHeight - size;
		}
		if (document.getElementById('ppf_showCircle').checked) {
			context.save();
			context.beginPath();
			context.arc(0.5 * cSize, 0.5 * cSize, 0.5 * cSize, 0, 2 * Math.PI, false);
			context.fillStyle = 'white';
			context.fill();
			context.strokeStyle = 'black';
			context.strokeWidth = '2px';
			context.stroke();
			context.clip();
		}
		context.drawImage(ppfOriginalImage, offsetX, offsetY, size, size, 0, 0, cSize, cSize);
		const overlayImage = new Image();
		overlayImage.src = ppfProfilePhotoFrameScript.pluginDirUrl + '/templates/' + goAhead;
		overlayImage.onload = () => {
			context.drawImage(overlayImage, 0, 0, cSize, cSize);
			downloadButton.style.display = 'inline';
			
		};
	}
}

function ppf_prepareDownloadButton() {
	document.getElementById('ppf_downloadPhoto').onclick = () => {
		const newPhotoDownload = document.getElementById('ppf_newPhotoDownload');
		const context = newPhotoDownload.getContext('2d');
		context.clearRect(0, 0, newPhotoDownload.width, newPhotoDownload.height);
		const originalPhotoDisplay = document.getElementById('ppf_originalPhotoDisplay');
		let goAhead = '';
		if (originalPhotoDisplay.getAttribute('data-photo').length) {
			const listParents = document.getElementsByClassName('ppf_templateList');
			for (var i = 0; i<listParents.length; i++) {
				const listParent = listParents.item(i);
				listParent.childNodes.forEach(listItem => {
					if (listItem.getAttribute('data-selected') == 'true') {
						goAhead = listItem.getAttribute('data-template');
					}
				});
			}
		}
		if (goAhead.length) {
			const cWidth = ppfOriginalImage.naturalWidth, cHeight = ppfOriginalImage.naturalHeight;
			let size = document.getElementById('ppf_originalPhotoCropSize').value;
			document.getElementById('ppf_originalPhotoCropSizeDisplay').innerText = Math.round(100 * size);
			let offsetX = document.getElementById('ppf_originalPhotoCropOffsetX').value;
			document.getElementById('ppf_originalPhotoCropOffsetXDisplay').innerText = Math.round(100 * offsetX);
			let offsetY = document.getElementById('ppf_originalPhotoCropOffsetY').value;
			document.getElementById('ppf_originalPhotoCropOffsetYDisplay').innerText = Math.round(100 * offsetY);
			size = Math.round(Math.min(cHeight, cWidth) * size);
			offsetX = Math.round(cWidth * offsetX);
			if (offsetX + size > cWidth) {
				offsetX = cWidth - size;
			}
			offsetY = Math.round(cHeight * offsetY);
			if (offsetY + size > cHeight) {
				offsetY = cHeight - size;
			}
			newPhotoDownload.width = size;
			newPhotoDownload.height = size;
			const overlayImage = new Image();
			overlayImage.src = ppfProfilePhotoFrameScript.pluginDirUrl + '/templates/' + goAhead;
			overlayImage.onload = () => {
				context.drawImage(ppfOriginalImage, offsetX, offsetY, size, size, 0, 0, size, size);
				context.drawImage(overlayImage, 0, 0, size, size);
				const link = document.createElement('a');
				link.download = 'new profile photo.jpg';
				link.href = context.canvas.toDataURL('image/jpeg');
				link.click();
				link.remove();
			};
		}
	};
}
