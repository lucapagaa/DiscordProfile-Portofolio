const userID = "1008822333366091839";
const elements = {
	statusBox: document.querySelector(".status"),
	statusImage: document.getElementById("status-image"),
	displayName: document.querySelector(".display-name"),
	username: document.querySelector(".username"),
	customStatus: document.querySelector(".custom-status"),
	customStatusText: document.querySelector(".custom-status-text"),
	customStatusEmoji: document.getElementById("custom-status-emoji"),
	avatarImage: document.getElementById("avatar-image"),
	bannerImage: document.getElementById("banner-image"),
	avatarDecoration: document.querySelector(".avatar-decoration"),
	aboutMe: document.querySelector(".about-me"),
};
function startWebSocket() {
	const ws = new WebSocket("wss://api.lanyard.rest/socket");
	ws.onopen = () => {
		ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userID } }));
	};
	ws.onmessage = (event) => {
		const { t, d } = JSON.parse(event.data);
		if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
			updateStatus(d);
		}
	};
	ws.onerror = (error) => {
		console.error("WebSocket error:", error);
		ws.close();
	};
	ws.onclose = () => {
		console.log("WebSocket closed, reconnecting...");
		setTimeout(startWebSocket, 1000);
	};
}
function updateStatus(lanyardData) {
	const { discord_status, activities, discord_user, kv } = lanyardData;
	elements.displayName.innerHTML = discord_user.display_name;
	elements.username.innerHTML = discord_user.username;

	const avatar = discord_user.avatar;
	const isAnimated = avatar?.startsWith("a_");
	elements.avatarImage.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${avatar}.${isAnimated ? "gif" : "webp"}?size=256`;

	const decoration = discord_user.avatar_decoration_data;
	if (decoration?.asset) {
		elements.avatarDecoration.src = `https://cdn.discordapp.com/avatar-decoration-presets/${decoration.asset}.png?size=256&quality=lossless`;
	}

	if (discord_user.banner) {
		const bannerAnim = discord_user.banner.startsWith("a_");
		elements.bannerImage.src = `https://cdn.discordapp.com/banners/${discord_user.id}/${discord_user.banner}.${bannerAnim ? "gif" : "webp"}?size=600`;
	}

	if (kv?.about_me) {
		elements.aboutMe.innerHTML = kv.about_me;
	}
	let imagePath;
	let label;
	switch (discord_status) {
		case "online":
			imagePath = "./public/status/online.svg";
			label = "Online";
			break;
		case "idle":
			imagePath = "./public/status/idle.svg";
			label = "Idle / AFK";
			break;
		case "dnd":
			imagePath = "./public/status/dnd.svg";
			label = "Do Not Disturb";
			break;
		case "offline":
			imagePath = "./public/status/offline.svg";
			label = "Offline";
			break;
		default:
			imagePath = "./public/status/offline.svg";
			label = "Unknown";
			break;
	}
	const isStreaming = activities.some(
		(activity) =>
			activity.type === 1 &&
			(activity.url.includes("twitch.tv") ||
				activity.url.includes("youtube.com"))
	);
	if (isStreaming) {
		imagePath = "./public/status/streaming.svg";
		label = "Streaming";
	}
	elements.statusImage.src = imagePath;
	elements.statusBox.setAttribute("aria-label", label);
	if (activities[0]?.state) {
		elements.customStatusText.innerHTML = activities[0].state;
	} else {
		elements.customStatusText.innerHTML = "Not doing anything!";
	}
	const emoji = activities[0]?.emoji;
	if (emoji?.id) {
		elements.customStatusEmoji.src = `https://cdn.discordapp.com/emojis/${emoji.id}?format=webp&size=24&quality=lossless`;
	} else if (emoji?.name) {
		elements.customStatusEmoji.src = "./public/icons/poppy.png";
	} else {
		elements.customStatusEmoji.style.display = "none";
	}
	if (!activities[0]?.state && !emoji) {
		elements.customStatus.style.display = "none";
	} else {
		elements.customStatus.style.display = "flex";
	}
}
startWebSocket();
