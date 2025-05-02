let currentSectionInView = null; // will be used when open or close sidebar, focus on searchbar

// THEME TOGGLE ===================

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
	document.documentElement.classList.toggle("dark");
	localStorage.setItem(
		"theme",
		document.documentElement.classList.contains("dark") ? "dark" : "light"
	);
});

window.addEventListener("DOMContentLoaded", () => {
	const saved = localStorage.getItem("theme");
	if (saved === "dark") {
		document.documentElement.classList.add("dark");
		themeToggle.checked = true;
	}
});

// SIDEBAR ANCHORS

const scrollToSection = (targetElement) => {
	if (targetElement) {
		currentSectionInView = targetElement;
		targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
	}
};

document.querySelector("#sidebar").addEventListener("click", (e) => {
	if (e.target.tagName === "A") {
		e.preventDefault();
		const targetElement = document.querySelector(e.target.getAttribute("href"));
		scrollToSection(targetElement);
	}
});

// SIDEBAR OPEN ========================

document.addEventListener("DOMContentLoaded", function () {
	const button = document.getElementById("sidebar-toggleButton");
	button.addEventListener("click", () => {
		document.body.classList.toggle("sidebar-hide");
		currentSectionInView?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
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

let currentActiveId = null;

const observerScroll = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const sectionId = entry.target.id;

				if (sectionId !== currentActiveId) {
					currentActiveId = sectionId;
					updateSidebar(sectionId);
				}
			}
		});
	},
	{
		root: null, 
		rootMargin: "0px 0px -50% 0px", 
		threshold: 0,
	}
);

sections.forEach((section) => observerScroll.observe(section));

function updateSidebar(currentSectionId) {
	document
		.querySelectorAll(".side-bar__sub-topic.openDropDown")
		.forEach((el) => {
			if (
				el !== sideBarLogbookDropDown &&
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
		const link = li.querySelector("a");
		const isActive = link.hash === "#" + currentSectionId;
		li.classList.toggle("active", isActive);

		if (isActive) {
			const parent = li.parentElement;
			if (parent !== mainSidebarList) {
				document
					.querySelectorAll(".side-bar__sub-topic.openDropDown")
					.forEach((el) => {
						if (el !== parent) closeSideBarItem(el);
					});
				openSideBarItem(parent);
			}
		}
	});

	firstMainLink.classList.toggle("active", currentSectionId === "about");
	secondMainLink.classList.toggle(
		"active",
		currentSectionId === "general-info"
	);
}


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

const navigationBtnSwitcher = () => {
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
};

window.addEventListener("scroll", navigationBtnSwitcher);
window.addEventListener("DOMContentLoaded", navigationBtnSwitcher);

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

// !!!!!!!!!!! intersection observer for animation
const getStartSideBarDropDown = document.querySelector(
	".get-start-sidebar-dropDown"
);
const openSideBarButtonWrapper = document.querySelector(
	".sidebar-toggleButton-wrapper"
);
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
	 #search-container,
	 #content section h2,
	 #content section h3,
	 #content h4,
	 #about .logo, 
	 #content section p,
	 #content section ul,
	 #content section ol,
	 #content section .info::before,
	 #content section .note::before,
	 #content section .info,
	 #content section .note,
	 #content strong,
	 #content img
	 `
);
tags.forEach((tag) => {
	observer.observe(tag);
});

// ********************************************************

// SEARCH FUNCTIONALITY ====================

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResultsDiv = document.getElementById("search-results");
const searchResultsDivWrapper = document.querySelector(
	".search-results-wrapper"
);
const closeSearchResultsBtn = document.querySelector(
	".search-results-close-btn"
);

searchInput.addEventListener("focus", () => {
	document.body.classList.add("sidebar-hide");
	currentSectionInView?.scrollIntoView({
		behavior: "smooth",
		block: "start",
	});
});

const findTextInSections = (searchText) => {
	const results = [];
	document.querySelectorAll("#content section").forEach((section) => {
		if (section.textContent.toLowerCase().includes(searchText.toLowerCase())) {
			const sectionId = section.id;
			const sectionTitle =
				section.querySelector("h2, h3")?.textContent || `Section: ${sectionId}`;
			const sectionText = getClosestText(section, searchText);
			results.push({ id: sectionId, title: sectionTitle, text: sectionText });
		}
	});
	return results;
};

const getClosestText = (section, searchText) => {
	if (!section) return "";
	const p = section.querySelector("p");
	if (!p) return "";
	if (p) {
		let text = p.textContent.trim();

		if (text.length > 200) {
			const index = text.toLowerCase().indexOf(searchText.toLowerCase());
			if (index > 100) {
				text = "..." + text.substring(index - 100, index + 100) + "...";
			} else {
				text = text.substring(0, 200) + "...";
			}
		}
		return text;
	}
	return "";
};

const displayResults = (results) => {
	searchResultsDiv.innerHTML = "";

	searchResultsDivWrapper.style.display = "block";
	if (results.length === 0) {
		searchResultsDiv.innerHTML = "<p>No results found.</p>";
		return;
	}
	const resultsHTML = results
		.map(
			(result) => `
        <div class="search-result-item">
            <a href="#${result.id}">${result.title}</a>
            <p class="search-result-text">${result.text}</p>
        </div>
    `
		)
		.join("");
	searchResultsDiv.innerHTML = resultsHTML;
};

const closeSearchResults = () => {
	searchResultsDiv.innerHTML = "";
	searchResultsDivWrapper.style.display = "none";
	searchInput.value = "";
};

const handleSearch = () => {
	const searchText = searchInput.value;
	if (searchText.trim() !== "") {
		const results = findTextInSections(searchText);
		displayResults(results);
		searchResultsDiv.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", function (e) {
				e.preventDefault();
				let targetId = this.getAttribute("href");
				let targetElement = document.querySelector(targetId);
				scrollToSection(targetElement);
				setTimeout(() => {
					closeSearchResults();
				}, 800);
			});
		});
	} else {
		searchResultsDiv.innerHTML = "<p>Please enter a search term.</p>";
	}
};

searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		handleSearch();
	}
});
closeSearchResultsBtn.addEventListener("click", closeSearchResults);


