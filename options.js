// Saves options to chrome.storage
function saveOptions() {
	const mode = document.getElementById("mode").value;
	chrome.storage.local.set({ mode: mode }, () => {
		// Update status to let user know options were saved.
		const status = document.getElementById("status");
		status.textContent = "Options saved.";
		setTimeout(() => {
			status.textContent = "";
		}, 750);
	});
}

// Restores select box state using the preferences stored in chrome.storage.
function restoreOptions() {
	chrome.storage.local.get("mode", (items) => {
		document.getElementById("mode").value = items.mode || "classicSnark";
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("mode").addEventListener("change", saveOptions);
