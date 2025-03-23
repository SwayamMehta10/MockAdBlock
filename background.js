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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.type === "adRequest") {
		// Handle ad request (if needed)
	}
});

async function updateAdPatterns() {
	try {
		const response = await fetch(
			"https://easylist.to/easylist/easylist.txt"
		);
		const filterList = await response.text();
		const elementFilters = filterList
			.split("\n")
			.filter((line) => line.startsWith("##"))
			.map((line) => line.replace("##", ""));

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
