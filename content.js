const adModes = {
	classicSnark: [
		"Ad? In THIS economy?",
		"This space reserved for your disappointment",
		"Advertisers hate this one weird trick!",
		"Congratulations! You've found an ad!",
		"This could've been meaningful content",
		"Ad space for rent: Inquire within your conscience",
		"This ad is brought to you by your dwindling attention span",
		"Plot twist: It's another advertisement!",
		"Imagine content here (advertisers couldn't)",
		"Sponsored by your willingness to be interrupted",
	],
	dadJoke: [
		"Why don't ads ever wear glasses? Because they're already contacts!",
		"What do you call an ad that doesn't work? A faild.",
		"Why was the ad feeling odd? It was prime-time!",
		"How do ads stay cool? They have ad-vanced air conditioning!",
		"What's an ad's favorite type of music? Ad-vertisements!",
		"Here lies an ad, may it rest in pixels",
	],
	existentialCrisis: [
		"Is this ad real, or are we living in a simulation?",
		"To ad, or not to ad: that is the question",
		"I block, therefore I am",
		"In the grand scheme of the universe, does this ad even matter?",
		"If an ad loads and no one sees it, does it make a sound?",
	],
	techHumor: [
		"404: Ad Not Found (You're Welcome)",
		"404: Meaningful content not found",
		"This ad has been compressed to 0 bytes",
		"Ad successfully blocked using AI and blockchain technology",
		"Buffering... Just kidding, it's an ad",
		"This ad is deprecated and no longer supported",
	],
	motivational: [
		"You miss 100% of the ads you don't see",
		"Behind every blocked ad is an opportunity for inner peace",
		"The journey of a thousand clicks begins with a single ad block",
		"Be the change you wish to see in the ad world",
		"Believe you can block ads, and you're halfway there",
		"An ad a day keeps the free internet at bay",
	],
};

let adSelectors = [
	'[class*="ad-" i]',
	'[class*="-ad" i]',
	'[class*="_ad" i]',
	'[id*="ad-" i]',
	'[id*="-ad" i]',
	'[id*="_ad" i]',
	'iframe[src*="ads"]',
	"ins.adsbygoogle",
	"div.ad-container",
	"div[data-ad-target]",
	"div[data-ad-unit]",
];

let currentMode = "classicSnark";

function replaceAds() {
	adSelectors.forEach((selector) => {
		document.querySelectorAll(selector).forEach((ad) => {
			if (
				isVisible(ad) &&
				!isSuspicious(ad) &&
				isNotEmpty(ad) &&
				!isContentElement(ad)
			) {
				const snark = createSnarkElement();
				randomizeReplacement(ad, snark);
			}
		});
	});
}

function isVisible(element) {
	return (
		!!element.offsetParent &&
		window.getComputedStyle(element).visibility !== "hidden"
	);
}

function isSuspicious(element) {
	const style = window.getComputedStyle(element);
	return (
		style.opacity === "0" ||
		style.position === "absolute" ||
		element.offsetWidth < 5
	);
}

function isNotEmpty(element) {
	// Check if the element has children or non-whitespace text
	return element.children.length > 0 || element.textContent.trim() !== "";
}

function isContentElement(element) {
	// Check for specific classes or attributes indicating actual content
	const contentClasses = [
		"container__link",
		"container__headline",
		"container__text",
		"image__container",
		"interactive-video__container",
	];

	return contentClasses.some((className) =>
		element.classList.contains(className)
	);
}

function createSnarkElement() {
	const snark = document.createElement("div");
	snark.className = "ad-snark";
	// Add snarky message
	const message = document.createElement("p");
	message.textContent = getContextSpecificMessage();
	message.style.margin = "0"; // Remove extra spacing
	message.style.marginBottom = "4px"; // Add spacing between text and GIF
	message.style.fontSize = "smaller"; // Make text smaller to fit better

	// Add GIF
	const gif = document.createElement("img");

	var gifNum = [Math.floor(Math.random() * 30) + 1];
	gif.src = chrome.runtime.getURL(`assets/gif${gifNum}.gif`);
	gif.style.maxWidth = "80%";
	gif.style.maxHeight = "60%"; // More restrictive height
	gif.style.width = "auto";
	gif.style.height = "auto";
	gif.style.objectFit = "contain";

	// Style the parent container
	Object.assign(snark.style, {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		border: "2px dashed #ff0000",
		padding: "6px", // Smaller padding
		textAlign: "center",
		fontStyle: "italic",
		overflow: "hidden",
		boxSizing: "border-box",
		position: "relative", // Ensure positioning context
		// We'll set width/height in randomizeReplacement
	});

	// Append message and GIF to snark element
	snark.appendChild(message);
	snark.appendChild(gif);

	return snark;
}

function randomizeReplacement(element, snark) {
	// Get both computed style and offset dimensions to ensure accuracy
	const computedStyle = window.getComputedStyle(element);

	// Capture the exact dimensions, including any minimum dimensions
	const originalWidth = Math.max(
		element.offsetWidth,
		parseInt(computedStyle.minWidth) || 0
	);
	const originalHeight = Math.max(
		element.offsetHeight,
		parseInt(computedStyle.minHeight) || 0
	);

	// Ensure our container doesn't shrink
	snark.style.minWidth = originalWidth + "px";
	snark.style.minHeight = originalHeight + "px";

	// Apply original dimensions explicitly, accounting for box-sizing
	snark.style.width = originalWidth + "px";
	snark.style.height = originalHeight + "px";

	// Force the dimensions to be respected
	snark.style.boxSizing = "border-box";

	// Adjust the content to fit properly without changing container size
	if (originalHeight < 100) {
		snark.style.fontSize = "10px";
		const message = snark.querySelector("p");
		const gif = snark.querySelector("img");
		if (message) {
			message.style.marginBottom = "2px";
			message.style.fontSize = "10px";
		}
		if (gif) {
			gif.style.maxHeight = "50%";
			gif.style.maxWidth = "70%";
		}
	} else {
		// For larger containers, ensure content fits inside
		const message = snark.querySelector("p");
		const gif = snark.querySelector("img");

		// Adjust GIF size based on container height to prevent overflow
		if (gif) {
			gif.style.maxHeight = Math.min(60, originalHeight * 0.6) + "%";
			gif.style.maxWidth = "80%";
		}
	}

	if (Math.random() > 0.5) {
		element.replaceWith(snark);
	} else {
		element.parentNode.insertBefore(snark, element);
		element.style.display = "none";
	}
}

function getContextSpecificMessage() {
	const hostname = window.location.hostname;
	if (hostname.includes("news")) return "Breaking News: This is an ad!";
	if (hostname.includes("social"))
		return "Advertised content (because friends don't pay friends)";
	return adModes[currentMode][
		Math.floor(Math.random() * adModes[currentMode].length)
	];
}

let replacementTimeout;
function debouncedReplace() {
	clearTimeout(replacementTimeout);
	replacementTimeout = setTimeout(replaceAds, 60000);
}

// Initial execution
replaceAds();

// Watch for dynamic content
const observer = new MutationObserver(debouncedReplace);
observer.observe(document.body, {
	childList: true,
	subtree: true,
	attributes: true,
});

// Periodic rescan
setInterval(replaceAds, 5000);

// Update adSelectors from storage
chrome.storage.local.get(["adSelectors", "mode"], (result) => {
	if (result.adSelectors) {
		adSelectors = adSelectors.concat(result.adSelectors);
	}
	if (result.mode) {
		currentMode = result.mode;
	}
});

// Listen for mode changes
chrome.storage.onChanged.addListener((changes, namespace) => {
	if (namespace === "local" && changes.mode) {
		currentMode = changes.mode.newValue;
	}
});
