const adDomains = [
	"doubleclick.net",
	"googleads.com",
	"adsafeprotected.com",
	"adnxs.com",
	"amazon-adsystem.com",
	"taboola.com",
];

chrome.declarativeNetRequest.updateDynamicRules({
	removeRuleIds: adDomains.map((_, index) => index + 1),
	addRules: adDomains.map((domain, index) => ({
		id: index + 1,
		priority: 1,
		action: { type: "block" },
		condition: {
			urlFilter: `||${domain}`,
			resourceTypes: ["main_frame", "sub_frame", "image", "script"],
		},
	})),
});

async function updateAdPatterns() {
	try {
		const response = await fetch(
			"https://easylist.to/easylist/easylist.txt"
		);
		const filterList = await response.text();

		// Get element hiding selectors (## prefix) - these are what ad blockers use
		const elementFilters = filterList
			.split("\n")
			.filter((line) => line.startsWith("##") && !line.includes(":"))
			.map((line) => line.replace("##", ""))
			.filter((selector) => {
				// Filter out complex selectors that might cause errors
				if (selector.includes(">") || selector.includes("+")) return false;
				if (selector.includes(":-") || selector.includes(":has")) return false;
				// Keep simple class, id, and attribute selectors
				return selector.startsWith(".") ||
				       selector.startsWith("#") ||
				       selector.startsWith("[");
			})
			.slice(0, 500); // Use more selectors

		chrome.storage.local.set({ adSelectors: elementFilters });
	} catch (error) {
		console.error("Error updating filters:", error);
	}
}

chrome.alarms.create("filterUpdate", { periodInMinutes: 10080 });
chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === "filterUpdate") {
		updateAdPatterns();
	}
});

chrome.runtime.onInstalled.addListener(updateAdPatterns);
