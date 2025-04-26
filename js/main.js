let currentSectionInView = null;

document.querySelectorAll("img").forEach((img) => {
	img.loading = "lazy";
});

// THEME TOGGLE ===================

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
	document.documentElement.classList.toggle("dark");
	const isDark = document.documentElement.classList.contains("dark");
	localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
	const saved = localStorage.getItem("theme");
	if (saved === "dark") {
		document.documentElement.classList.add("dark");
		themeToggle.checked = true;
	}
});

// SIDEBAR ANCHORS ==============

document.querySelectorAll("#sidebar a").forEach((link) => {
	link.addEventListener("click", function (e) {
		e.preventDefault();
		let targetId = this.getAttribute("href");
		let targetElement = document.querySelector(targetId);

		if (targetElement) {
			currentSectionInView = targetElement;

			targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	});
});

// document.querySelectorAll("#sidebar a").forEach((link) => {
// 	link.addEventListener("click", function (e) {
// 		e.preventDefault();
// 		let targetId = this.getAttribute("href");
// 		let targetElement = document.querySelector(targetId);

// 		if (targetElement) {
// 			currentSectionInView = targetElement;

// 			const images = Array.from(targetElement.querySelectorAll("img"));

// 			if (images.length === 0) {
// 				targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
// 				return;
// 			}

// 			const imagePromises = images.map((img) => {
// 				return new Promise((resolve, reject) => {
// 					const onComplete = () => resolve();
// 					const onError = () => resolve(); // Важно: не reject, а resolve!

// 					img.addEventListener("load", onComplete);
// 					img.addEventListener("error", onError);

// 					if (img.complete) {
// 						if (img.decode) {
// 							img.decode().then(onComplete, onError);
// 						} else {
// 							onComplete();
// 						}
// 					} else if (img.decode) {
// 						img.decode().then(onComplete, onError).catch(onError);
// 					} else {
// 						// Если decode не поддерживается, просто ждем load/error
// 					}

// 					setTimeout(() => {
// 						reject(new Error("Image load timeout"));
// 					}, 5000);
// 				});
// 			});

// 			Promise.all(imagePromises)
// 				.catch((error) => {
// 					console.warn("Some images failed to load", error);
// 				})
// 				.finally(() => {
// 					requestAnimationFrame(() => {
// 						targetElement.scrollIntoView({
// 							behavior: "smooth",
// 							block: "start",
// 						});
// 					});
// 				});
// 		}
// 	});
// });

// SIDEBAR OPEN ========================


document.addEventListener("DOMContentLoaded", function () {
	const button = document.getElementById("sidebar-toggleButton");
	button.addEventListener("click", () => {
		document.body.classList.toggle("sidebar-hide");
		currentSectionInView.scrollIntoView({ behavior: "smooth", block: "start" });
	});
});

// SIDEBAR DROPDOWN =====================

const dropDownListButtons = document.querySelectorAll(".buttonPlus");

const openSideBarItem = (dropDown) => {
	if (!dropDown) return;

	dropDown.style.height = dropDown.scrollHeight + "px";
	dropDown.classList.add("openDropDown");

	const prev = dropDown.previousElementSibling;
	const button = prev.querySelector(".buttonPlus");
	if (button) button.textContent = "-";
};

const closeSideBarItem = (dropDown) => {
	if (!dropDown) return;

	dropDown.classList.remove("openDropDown");
	dropDown.style.height = "";

	const prev = dropDown.previousElementSibling;
	const button = prev.querySelector(".buttonPlus");
	if (button) button.textContent = "+";
};

dropDownListButtons.forEach((buttonPlus) => {
	buttonPlus.addEventListener("click", (event) => {
		const parent = event.target.closest(".sidebar-item");
		const dropDown = parent.querySelector(".side-bar__sub-topic");
		dropDown.classList.contains("openDropDown")
			? closeSideBarItem(dropDown)
			: openSideBarItem(dropDown);
	});
});

// ==================== SCROLL ====================
const sections = document.querySelectorAll("#content section");
const sidebarItems = document.querySelectorAll("#sidebar li");
const sideBarLogbookDropDown = document.querySelector(
	".side-bar__sub-topic.logbook"
);
const sideBarManagementBoardDropDow = document.querySelector(
	".side-bar__sub-topic.mb-management-board"
);

const mainSidebarList = document.querySelector(".main-sidebar-list");
const firstMainLink = document.querySelector(".first_main_sidebar_link");
const secondMainLink = document.querySelector(".second_main_sidebar_link");
let ticking = false;

window.addEventListener("scroll", () => {
	if (!ticking) {
		window.requestAnimationFrame(() => {
			handleScroll();
			ticking = false;
		});
		ticking = true;
	}
});
const handleScroll = () => {
	let currentSectionId = "";

	for (let i = sections.length - 1; i >= 0; i--) {
		const sectionTop = sections[i].getBoundingClientRect().top;
		if (sectionTop <= window.innerHeight / 2) {
			currentSectionInView = sections[i];
			currentSectionId = sections[i].id;
			break;
		}
	}

	document
		.querySelectorAll(".side-bar__sub-topic.openDropDown")
		.forEach((el) => {
			if (
				el !== sideBarLogbookDropDown ||
				el !== sideBarManagementBoardDropDow
			) {
				closeSideBarItem(el);
			}
		});
	if (currentSectionId === "mb-management-board") {
		openSideBarItem(sideBarManagementBoardDropDow);
	}
	if (currentSectionId === "logbook") {
		openSideBarItem(sideBarLogbookDropDown);
	}

	sidebarItems.forEach((li) => {
		li.classList.remove("active");
		const link = li.querySelector("a");
		if (link.hash === "#" + currentSectionId) {
			const currentDropDown = li.parentElement;

			if (currentDropDown !== mainSidebarList) {
				document
					.querySelectorAll(".side-bar__sub-topic.openDropDown")
					.forEach((el) => {
						if (el !== currentDropDown) {
							closeSideBarItem(el);
						}
					});
				openSideBarItem(currentDropDown);
			}

			firstMainLink.classList.toggle("active", link.hash === "#about");
			secondMainLink.classList.toggle("active", link.hash === "#general-info");

			li.classList.add("active");
		}
	});
};
window.addEventListener("scroll", handleScroll);

// CONTENT NAVIGATION BUTTONS ====================================

const backToStartBtn = document.querySelector(".backToStart-btn");
const getStartHref = document.querySelector("#start");
backToStartBtn.addEventListener("click", () => {
	getStartHref.scrollIntoView({ behavior: "smooth", block: "start" });
});

const previousTopicBtn = document.querySelector(".previous-btn");
previousTopicBtn.addEventListener("click", () => {
	const currentSectionIndex = Array.from(sections).findLastIndex(
		(section) => section.getBoundingClientRect().top <= window.innerHeight / 2
	);

	if (currentSectionIndex > 0) {
		const previousSection = sections[currentSectionIndex - 1];
		previousSection.scrollIntoView({ behavior: "smooth", block: "start" });
	}
});

const nextTopicBtn = document.querySelector(".next-btn");
nextTopicBtn.addEventListener("click", () => {
	const currentSectionIndex = Array.from(sections).findLastIndex(
		(section) => section.getBoundingClientRect().top <= window.innerHeight / 2
	);
	if (currentSectionIndex >= 0 && currentSectionIndex < sections.length - 1) {
		const nextSection = sections[currentSectionIndex + 1];
		nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
	}
});

backToStartBtn.classList.add("disabled");
previousTopicBtn.classList.add("disabled");
window.addEventListener("scroll", () => {
	const currentSectionIndex = Array.from(sections).findLastIndex(
		(section) => section.getBoundingClientRect().top <= window.innerHeight / 2
	);
	if (currentSectionIndex > 0) {
		backToStartBtn.classList.remove("disabled");
		previousTopicBtn.classList.remove("disabled");
	}
	if (currentSectionIndex < 1) {
		backToStartBtn.classList.add("disabled");
		previousTopicBtn.classList.add("disabled");
	}
	if (currentSectionIndex >= sections.length - 1) {
		nextTopicBtn.classList.add("disabled");
	}
	if (currentSectionIndex < sections.length - 1) {
		nextTopicBtn.classList.remove("disabled");
	}
});

// FAQ DROPDOWN ============================ //

const faqListElem = document.querySelector(".faq-list");
const faqItemElems = document.querySelectorAll(".faq-item");

const open = (button, dropDown) => {
	closeAllDrops(button, dropDown);
	dropDown.style.height = dropDown.scrollHeight + "px";
	button.classList.add("active");
	dropDown.classList.add("active");
};

const close = (button, dropDown) => {
	button.classList.remove("active");
	dropDown.classList.remove("active");
	dropDown.style.height = "";
};

const closeAllDrops = (button, dropDown) => {
	faqItemElems.forEach((elem) => {
		if (elem.children[0] !== button && elem.children[1] !== dropDown) {
			close(elem.children[0], elem.children[1]);
		}
	});
};

faqListElem.addEventListener("click", (event) => {
	const target = event.target;
	if (target.classList.contains("faq-item__question")) {
		const parent = target.closest(".faq-item");
		const answer = parent.querySelector(".faq-item__answer");
		answer.classList.contains("active")
			? close(target, answer)
			: open(target, answer);
	}
});

// INITIAL ANIMATIONS ============================ //
const getStartSideBarDropDown = document.querySelector(
	".get-start-sidebar-dropDown"
);
document.addEventListener("DOMContentLoaded", function () {
	setTimeout(() => {
		document.body.classList.toggle("sidebar-hide");
	}, 0);

	setTimeout(() => {
		openSideBarItem(getStartSideBarDropDown);
	}, 600);
});

// !!!!!!!!!!! intersection observer animation

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("in-view");
				entry.target.classList.remove("not-in-view");
			} else {
				entry.target.classList.remove("in-view");
				entry.target.classList.add("not-in-view");
			}
		});
	},
	{
		rootMargin: "0px",
		threshold: [0, 0.1, 1],
	}
);

const tags = document.querySelectorAll(
	`
	#content section h2,
	 #content section h3,
	 #content h4,
	 #about #logo, 
	 #content section p,
	 #content section ul,
	  #content section ol,
	  #content section .info,
	  #content section .note,
	  #content strong
	 `
);
tags.forEach((tag) => {
	observer.observe(tag);
});

// !   IMG RESPONSIVE SKELETON

// const images = document.querySelectorAll(".img-wrapper");

// images.forEach((wrapper) => {
// 	const img = wrapper.querySelector("img");
// 	const width = img.width;
// 	const height = img.height;

// 	// Устанавливаем размеры для aspect-ratio в родительском элементе
// 	wrapper.style.setProperty("--width", width);
// 	wrapper.style.setProperty("--height", height);

// 	// Обработчик события загрузки для lazy-загружаемых изображений
// 	img.addEventListener("load", () => {
// 		img.classList.add("loaded"); // Добавляем класс loaded для отображения картинки
// 		const skeleton = wrapper.querySelector(".img-skeleton");
// 		skeleton.style.display = "none"; // Скрываем скелетон
// 	});

// 	// Обработчик ошибки загрузки изображения (если нужно)
// 	img.addEventListener("error", () => {
// 		console.error("Ошибка загрузки изображения");
// 		// Можно скрыть скелетон или показать сообщение об ошибке
// 	});
// });
// ================================================================
const imgWrappers = document.querySelectorAll("#content .img-wrapper");

imgWrappers.forEach((el) => {
	const img = el.firstElementChild;
	const skeleton = el.lastElementChild;

	// const width = img.getAttribute("width");
	// const height = img.getAttribute("height");

	// skeleton.style.aspectRatio = `${width} / ${height}`;
	// skeleton.style.maxWidth = `${width}px`;

	// img.addEventListener("load", () => {
	// 	skeleton.style.display = "none";
	// });

	// img.addEventListener("error", () => {
	// 	console.error(`error during loading of ${img.src}`);
	// 	img.style.display = "none";
	// });

	const aspectWidth = parseInt(el.dataset.aspectWidth);
	const aspectHeight = parseInt(el.dataset.aspectHeight);
	const parentWidth = el.offsetWidth;
	console.log(parentWidth);
	if (aspectWidth && aspectHeight) {
		// const aspectRatio = aspectWidth / aspectHeight;
		skeleton.style.maxWidth = `${aspectWidth}px`;
		skeleton.style.maxHeight = `${aspectHeight}px`;
	} else {
		console.warn(
			`Атрибути data-aspect-width або data-aspect-height не знайдено для контейнера:`
		);
	}
});

// document.addEventListener("DOMContentLoaded", () => {
// 	const imageContainers = document.querySelectorAll(".image-container");

// 	imageContainers.forEach((container) => {
// 		const skeleton = container.querySelector(".skeleton");
// 		const aspectWidth = parseInt(container.dataset.aspectWidth);
// 		const aspectHeight = parseInt(container.dataset.aspectHeight);

// 		if (aspectWidth && aspectHeight) {
// 			const aspectRatio = aspectWidth / aspectHeight;
// 			skeleton.style.paddingBottom = `${(1 / aspectRatio) * 100}%`;
// 			skeleton.style.position = "relative";
// 		} else {
// 			console.warn(
// 				`Атрибути data-aspect-width або data-aspect-height не знайдено для контейнера:`,
// 				container
// 			);
// 		}

// 		const img = container.querySelector(".lazy-image");
// 		img.addEventListener("load", () => {
// 			img.classList.add("loaded");
// 		});
// 	});
// });
