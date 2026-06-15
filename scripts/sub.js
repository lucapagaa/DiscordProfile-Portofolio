function copyToClipboard() {
	var text = document.getElementById("textToCopy").innerText;
	var textArea = document.createElement("textarea");
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand("copy");
	document.body.removeChild(textArea);
	var textElement = document.getElementById("textToCopy");
	textElement.classList.add("clicked");
	textElement.setAttribute("aria-label", "Copied!");
	setTimeout(() => {
		textElement.classList.remove("clicked");
		textElement.setAttribute("aria-label", "Click to copy!");
	}, 2000);
}

var card = document.querySelector(".profile-border");

card.addEventListener("mousemove", function (e) {
	var rect = card.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	var centerX = rect.width / 2;
	var centerY = rect.height / 2;
	var rotateX = ((y - centerY) / centerY) * -10;
	var rotateY = ((x - centerX) / centerX) * 10;
	card.style.transform = "perspective(600px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.02)";
});

card.addEventListener("mouseleave", function () {
	card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
});

document.addEventListener("keydown", function (e) {
	if (e.ctrlKey && ["a", "c", "s", "u", "p"].includes(e.key.toLowerCase()) || e.key === "F12") {
		e.preventDefault();
	}
});

document.addEventListener("contextmenu", function (e) {
	e.preventDefault();
});
