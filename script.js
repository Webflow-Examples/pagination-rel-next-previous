const paginationButtons = document.querySelectorAll(".pagination-button");

window.onload = (event) => {
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
