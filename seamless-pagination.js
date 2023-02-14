const containerSelector = "#seamless-replace";

$(document).pjax(".w-pagination-wrapper a", containerSelector, {
  container: containerSelector,
  fragment: containerSelector,
  scrollTo: false,
  timeout: 2500,
});

// If you're using Webflow's IX2, you'll need to re-initialize it after pjax
$(document).on("pjax:end", function () {
  Webflow.require("ix2").init();
});
