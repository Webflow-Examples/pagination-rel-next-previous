# pagination-rel-next-previous

Add rel previous/next link to Webflow sites using pagination

Clone an example from Made in Webflow:

https://webflow.com/made-in-webflow/website/pagination-and-rel-next-previous

## The problem

[Google's documentation on rel previous/next](https://developers.google.com/search/blog/2011/09/pagination-with-relnext-and-relprev#implementing-rel=next-and-rel=prev)

Something that a Webflow customer may run into if they're using pagination on a CMS list is a duplicate pages error in Google's Search Console. Webflow uses URL parameters to handle pagination. For example, if I had a paginated CMS list in Webflow on my blog page (site.webflow.io/blog), when I hit the next button to get page two my URL will be site.webflow.io/blog?3f5c39bb_page=2. It's the same URL, only we have that URL param added at the end.

What Google looks for on pages like this to prevent being flagged as duplicates is having rel next/previous links added to the head of the document. This doesn't exist natively inside of Webflow, but we can fis this with some custom code on our page.

## The solution

### Setting classes and attributes in the Webflow Designer

Inside of your Webflow project, head on over to your paginated list and give your pagination buttons the same class. In this example we're using `pagination-button`. While you're there, you need to add some custom attributes to these buttons.

Select the `Next` button and click on the settings panel or press `d` on your keyboard. Scroll down to the Custom attributes section and click the plus button to add a new attribute.

For the name, we'll use `data-rel` and for the value we'll add `next`. Now click through to the second page in your list in the Designer so that the previous button is visible. We'll follow the same pattern here and add a new attribute here as well with the name `data-rel` and the value will be `previous`.

That's it for Webflow settings, now we can move onto the custom code.

### Custom code

Now in the `Before </body>` code section in page settings add the following code:

```html
<script>
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
</script>
```

This code is also available in this repo in the file `script.js`. Let's look at the code and break it down.

First, we're setting a variable that includes all of our pagination buttons:

```js
const paginationButtons = document.querySelectorAll(".pagination-button");
```

Then, we have a function to create our links that has two parameters:

1. type - this will be previous or next and gets pulled from our data attribute on the pagination button
2. href - the link to the next or previous page that comes from our paggination button

The function looks like this:

```js
function createRel(type, href) {
  // create the link element
  const link = document.createElement("link");
  // set the href for the link as the same on the button
  link.href = href;
  // set the type from the custom attribute on our button
  link.rel = type;
  // append it to the head on the page
  document.head.appendChild(link);
}
```

Then, when the page loads, we're running this function for each button:

```js
window.onload = (event) => {
  paginationButtons.forEach((button) => {
    createRel(button.dataset.rel, button.href);
  });
};
```

Now once we publish we'll have rel previous/next links available. You can double check in the [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) tool from Google to verify their crawler will see these dynamically created links.

## Optional, keep the list in view and focused

We've seen some awesome solutions to this in the community. Big shouts to Forrest Oliphant for this solution using pjax:

https://discourse.webflow.com/t/seamless-pagination-with-pjax/75284

But, for us, this solution won't work because since it's replacing content in the frame, it's not changing the head of the document. We could add some additional code here to implement this solution, but instead we have an addtional option using the `scrollIntoView` method.

First, we're adding some new Global variables that we'll comment here in this snippet:

```js
// the section that contains your paginated list
const paginationSection = document.querySelector("#pagination");
// getting the parameters for the page
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// creating a new regular expression that will look for Webflow's pagination parameters
const newExpression = new RegExp("([a-f0-9]{8})_page");
```

Then we add an if statement to the work happening when the page loads to check and see if pagination is happening. It looks like this:

```js
// if Webflow pagination is in our params
if (newExpression.test(urlParams)) {
  //scroll to our paginated section
  paginationSection.scrollIntoView({ block: "start" });
  // lets think about accessibility
  // set the tabindex of the section to -1
  // lets focus this paginated section for screeen readers
  paginationSection.setAttribute("tabindex", "-1");
  paginationSection.focus();
}
```
