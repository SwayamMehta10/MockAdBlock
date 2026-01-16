// Short quotes for small ad spaces
const shortQuotes = [
	"No ads here",
	"Ad blocked",
	"Bye bye ad",
	"Nope",
	"Not today",
	"Ad? Nah",
	"Blocked",
	"Nice try",
	"No thanks",
	"Ad yeeted",
	"Sassy",
	"Denied",
	"Next!",
	"Pass",
	"Snark mode",
];

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
		"Your regularly scheduled content will resume after this non-ad",
		"This space intentionally left meaningless",
		"Brought to you by the letter $ and the number 0",
		"Ad rejected: Insufficient vibes",
		"This advertisement has been yeeted",
	],
	dadJoke: [
		"Why don't ads ever wear glasses? Because they're already contacts!",
		"What do you call an ad that doesn't work? A faild.",
		"Why was the ad feeling odd? It was prime-time!",
		"How do ads stay cool? They have ad-vanced air conditioning!",
		"What's an ad's favorite type of music? Ad-vertisements!",
		"Here lies an ad, may it rest in pixels",
		"Why did the ad go to therapy? It had too many impressions",
		"What do you call a sleeping ad? A snooze-letter",
		"Why are ads bad at poker? They always show their hand",
		"What's an ad's favorite dance? The banner shuffle",
	],
	existentialCrisis: [
		"Is this ad real, or are we living in a simulation?",
		"To ad, or not to ad: that is the question",
		"I block, therefore I am",
		"In the grand scheme of the universe, does this ad even matter?",
		"If an ad loads and no one sees it, does it make a sound?",
		"This ad contemplated its purpose and found none",
		"Are we the product, or is the product us?",
		"In infinite scroll, does any ad truly end?",
		"The void stares back, and it's ad-free",
	],
	techHumor: [
		"404: Ad Not Found (You're Welcome)",
		"404: Meaningful content not found",
		"This ad has been compressed to 0 bytes",
		"Ad successfully blocked using AI and blockchain technology",
		"Buffering... Just kidding, it's an ad",
		"This ad is deprecated and no longer supported",
		"Error 418: I'm a teapot, not an ad server",
		"This ad failed the Turing test",
		"git commit -m 'removed ads, added sass'",
		"sudo rm -rf /ads/*",
		"This ad is now running on localhost:nowhere",
	],
	motivational: [
		"You miss 100% of the ads you don't see",
		"Behind every blocked ad is an opportunity for inner peace",
		"The journey of a thousand clicks begins with a single ad block",
		"Be the change you wish to see in the ad world",
		"Believe you can block ads, and you're halfway there",
		"An ad a day keeps the free internet at bay",
		"Today's forecast: 100% chance of no ads",
		"Be the ad blocker you wish to see in the world",
		"Every blocked ad is a small victory for humanity",
		"Keep calm and block ads",
	],
};

let adSelectors = [
	// Core ad patterns - require word boundaries (ad- or -ad- or _ad)
	'[class^="ad-"]',
	'[class*=" ad-"]',
	'[class*="-ad-"]',
	'[class*="_ad_"]',
	'[class*="_ad-"]',
	'[class*="-ad_"]',
	'[id^="ad-"]',
	'[id^="ad_"]',
	'[id*="-ad-"]',
	'[id*="_ad_"]',
	'[id*="_ad-"]',
	'[id*="-ad_"]',

	// Adthrive (common blog ad network)
	'[class*="adthrive"]',
	'[id*="AdThrive"]',

	// Google Ad Manager
	'[class*="google-ad"]',
	'[class*="gpt-ad"]',
	'[id*="google_ads"]',
	'[id*="gpt-ad"]',

	// Google AdSense
	"ins.adsbygoogle",
	"div[data-google-query-id]",
	"div[data-ad-client]",
	"div[data-ad-slot]",

	// Common ad class names
	".advertisement",
	".sponsored",
	".ad-banner",
	".ad-container",
	".ad-wrapper",
	".ad-unit",
	".ad-slot",

	// Iframes with ad sources
	'iframe[src*="ads"]',
	'iframe[src*="doubleclick"]',
	'iframe[src*="googlesyndication"]',

	// Data attribute markers
	"[data-ad]",
	"[data-ad-unit]",
	"[data-ad-slot]",
	"[data-adunit]",
];

let currentMode = "classicSnark";

function replaceAds() {
	// Skip on Google search pages to avoid false positives
	const hostname = window.location.hostname;
	if (hostname.includes("google.") && window.location.pathname.startsWith("/search")) {
		return;
	}

	adSelectors.forEach((selector) => {
		try {
			document.querySelectorAll(selector).forEach((ad) => {
				if (
					isVisible(ad) &&
					!isSuspicious(ad) &&
					isNotEmpty(ad) &&
					!isContentElement(ad)
				) {
					// Check if ad is small (height < 100px or width < 200px)
					const isSmall = ad.offsetHeight < 100 || ad.offsetWidth < 200;
					const snark = createSnarkElement(isSmall);
					randomizeReplacement(ad, snark);
				}
			});
		} catch (e) {
			// Invalid selector - skip
		}
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
	const classList = element.className?.toLowerCase() || "";
	const elementId = element.id?.toLowerCase() || "";

	// If element has ad-related identifiers, it's NOT content (even if it has other patterns)
	const adIndicators = ["adthrive", "google-ad", "gpt-ad", "adsense", "ad-slot", "ad-unit", "ad-container", "sponsored"];
	if (adIndicators.some((ad) => classList.includes(ad) || elementId.includes(ad))) {
		return false;
	}

	// Check for specific classes indicating actual content (not ads)
	const contentPatterns = [
		"container__link", "container__headline", "container__text",
		"image__container", "interactive-video__container",
		"navbar", "navigation", "menu",
		"comment", "reply", "respond", "author", "profile", "avatar",
		"product-title", "product-name",
	];

	// Check element itself
	if (contentPatterns.some((pattern) => classList.includes(pattern) || elementId.includes(pattern))) {
		return true;
	}

	// Check if element is inside a comments section
	let parent = element.parentElement;
	while (parent) {
		const parentClass = parent.className?.toLowerCase() || "";
		const parentId = parent.id?.toLowerCase() || "";
		if (parentClass.includes("comment") || parentId.includes("comment") ||
		    parentClass.includes("respond") || parentId.includes("respond")) {
			return true;
		}
		parent = parent.parentElement;
	}

	return false;
}

function createSnarkElement(isSmall = false) {
	const snark = document.createElement("div");
	snark.className = "ad-snark";

	// Lavender-themed color palette for variety
	const colors = ["#b794f6", "#ffde59", "#98ff98", "#ff9ecd"];
	const bgColor = colors[Math.floor(Math.random() * colors.length)];

	// Add snarky message - use short quotes for small ads
	const message = document.createElement("p");
	if (isSmall) {
		message.textContent = shortQuotes[Math.floor(Math.random() * shortQuotes.length)];
	} else {
		message.textContent = getContextSpecificMessage();
	}
	Object.assign(message.style, {
		margin: "0",
		fontSize: isSmall ? "9px" : "12px",
		fontWeight: "bold",
		textTransform: "uppercase",
		letterSpacing: isSmall ? "0.5px" : "1px",
		color: "#1a1a1a",
		lineHeight: "1.2",
	});

	// Style the parent container - Neubrutalism lavender theme
	Object.assign(snark.style, {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		border: isSmall ? "2px solid #1a1a1a" : "4px solid #1a1a1a",
		padding: isSmall ? "4px" : "8px",
		textAlign: "center",
		fontFamily: "'Arial Black', 'Helvetica Bold', sans-serif",
		fontWeight: "bold",
		overflow: "hidden",
		boxSizing: "border-box",
		position: "relative",
		backgroundColor: bgColor,
		boxShadow: isSmall ? "3px 3px 0px #1a1a1a" : "6px 6px 0px #1a1a1a",
	});

	snark.appendChild(message);

	// Only add GIF if not a small ad
	if (!isSmall) {
		message.style.marginBottom = "6px";
		const gif = document.createElement("img");
		var gifNum = Math.floor(Math.random() * 30) + 1;
		gif.src = chrome.runtime.getURL(`assets/gif${gifNum}.gif`);
		Object.assign(gif.style, {
			maxWidth: "80%",
			maxHeight: "60%",
			width: "auto",
			height: "auto",
			objectFit: "contain",
			border: "3px solid #1a1a1a",
			boxShadow: "4px 4px 0px #1a1a1a",
			backgroundColor: "#faf5ff",
		});
		snark.appendChild(gif);
	}

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
		// For larger containers, adjust GIF size to prevent overflow
		const gif = snark.querySelector("img");
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
