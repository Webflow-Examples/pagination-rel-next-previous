const paginationButtons = document.querySelectorAll(".pagination-button");
const paginationSection = document.querySelector("#pagination");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const newExpression = new RegExp("([a-f0-9]{8})_page");

window.onload = (event) => {
  if (newExpression.test(urlParams)) {
    paginationSection.scrollIntoView({ block: "start" });
    paginationSection.setAttribute("tabindex", "-1");
    paginationSection.focus();
  }
  paginationButtons.forEach((button) => {
    createRel(button.dataset.rel, button.href);
  });
};

function createRel(type, href) {
  const link = document.createElement("link");
  link.href = href;
  link.rel = type;
  document.head.appendChild(link);
}
