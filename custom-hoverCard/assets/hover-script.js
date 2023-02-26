// set height & width for container
const hover__card_dimension = {
  width: 400,
  height: 200,
};

const hover__card_dimension_top_to_top = {
  width: 250,
  height: 250,
};

// we only record the X axis offset because the Y axis offset will be determined by the position of the Link element
let offSetLeft = 0;

// So we know whether the user is hovering over a different 1ink, on the same link again.
let hoverID = "";

// Capture position when hover over link
let storeOffSetLeft = 0;
let storeOffSetTop = 0;

let cursorPastHalfway = false;

let mouseOverCardContainer = false;
let mouseOverLink = false;
let setTimeoutCounter;

let halfWindowWidth = window.innerWidth / 2;
let halfWindowHeight = window.innerHeight / 2;

let cursorPastHalfwayHeight = false;

let hover__card__Container = "hover__card-container";

window.addEventListener("mousemove", (event) => {
  // See if cursor is half way past the middle of the screen or not

  if (event.x > halfWindowWidth) {
    cursorPastHalfway = true;
    offSetLeft = event.x - 240;
  } else {
    cursorPastHalfway = false;
    offSetLeft = event.x - 35;
  }

  if (event.y > halfWindowHeight) {
    cursorPastHalfwayHeight = true;
    storeOffSetTop = event.y;
  } else {
    cursorPastHalfwayHeight = false;
  }
});

// Get the position of the link that is being hovered over
function getYCoordinateOfLink(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    bottom: rect.bottom,
  };
}

function RemoverContainerWhenNotOverLinkAndContainer() {
  let cardContainer = document.querySelector(`.${hover__card__Container}`);

  if (!mouseOverLink && !mouseOverCardContainer) {
    mouseOutOfContainer(cardContainer);
  }
}

// select all of the links
document.querySelectorAll(".hover__target").forEach((tags) => {
  // Trigger event when cursor hovers over any link element
  tags.addEventListener("mouseover", (event) => {
    if (!setTimeoutCounter) {
      setTimeoutCounter = setTimeout(() => {
        mouseOverLink = true;
        //work out offset Y value

        if (cursorPastHalfwayHeight) {
          storeOffSetTop -= 25; //does not need to change most of the time
        } else {
          storeOffSetTop = getYCoordinateOfLink(event.target).top;
          storeOffSetTop += 38; //does not need to change most of the time
        }

        storeOffSetLeft = offSetLeft;

        let cardContainer = document.querySelector(`.${hover__card__Container}`);

        let newHoverID = event.target.getAttribute("data-hover-id");
        let newHoverGroup = event.target.getAttribute("data-hover-group");
        //Make sure there are no Boolean bugs
        if (cardContainer === null) {
          mouseOverCardContainer = false;
        }

        //If they want to view a card and none are currently rendered
        if (!mouseOverCardContainer) {
          getData(newHoverID, newHoverGroup);
        } else if (newHoverID !== hoverID && cardContainer !== null) {
          //If they have quickly switched to view another card
          cardContainer.remove();
          getData(newHoverID, newHoverGroup);
        }

        hoverID = newHoverID;

        setTimeoutCounter = null;
      }, 500);
    }
  });

  tags.addEventListener("mouseout", () => {
    if (setTimeoutCounter) {
      clearTimeout(setTimeoutCounter);
      setTimeoutCounter = null;
    } else {
      mouseOverLink = false;

      setTimeout(() => {
        RemoverContainerWhenNotOverLinkAndContainer();
      }, 300);
    }
  });
});

//Hovered out of mouse container
function mouseOutOfContainer(cardContainer) {
  // 50 milliseconds delay to allow user to transition between card and link
  setTimeout(() => {
    mouseOverCardContainer = false;
    if (!mouseOverCardContainer && cardContainer !== null) {
      //Play close animation then delete
      cardContainer.style.animation = "cardContainerOut 300ms forwards";
      setTimeout(() => {
        cardContainer.remove();
      }, 300);
    }
  }, 50);
}

function mouseInContainer(cardContainer) {
  mouseOverCardContainer = true;
}

//Render data in the form of a Card Container
function renderData(renderData) {
  let cardContainer = document.createElement("div");

  cardContainer.setAttribute("class", `${hover__card__Container}`);
  cardContainer.innerHTML = `${renderData}`;

  let container_width, container_height;

  const classCheck = renderData.indexOf("hover__card-inner top-to-top");
  if (classCheck == -1) {
    // do something if 'top-to-top' class exist.
    container_width = hover__card_dimension.width;
    container_height = hover__card_dimension.height;
  } else {
    // do something if 'top-to-top' class does not exist.
    container_width = hover__card_dimension_top_to_top.width;
    container_height = hover__card_dimension_top_to_top.height;
  }
  // console.log(container_width + "px", container_height + "px");

  const r = document.querySelector(":root");
  r.style.setProperty("--hover__card-width", container_width + "px");
  r.style.setProperty("--hover__card-height", container_height + "px");

  //Solve error of it not being horizontally aligned properly
  if (cursorPastHalfway) {
    // storeOffSetLeft -= 160;
    if (classCheck == -1) {
      storeOffSetLeft -= container_width - 278; // => width of the container div - magic no
    } else {
      storeOffSetLeft -= container_width - 272; // => width of the container div - magic no
    }
  }

  //Solve error of it not being vertically aligned properly
  if (cursorPastHalfwayHeight) {
    storeOffSetTop -= container_height; // => height of the container div
  }

  //Move element into correct position
  cardContainer.style.top = storeOffSetTop + "px";
  cardContainer.style.left = storeOffSetLeft + "px";
  //Add Event Listener
  cardContainer.setAttribute("onmouseleave", "mouseOutOfContainer(this)");
  cardContainer.setAttribute("onmouseover", "mouseInContainer(this)");
  document.querySelector("body").prepend(cardContainer);

  let arrow__arrow = document.querySelector(".popover-arrow__arrow");
  if (cursorPastHalfway && !cursorPastHalfwayHeight) {
    arrow__arrow.classList.add("popover-arrow__arrow--tr");
    // console.log("top right");
  } else if (cursorPastHalfway && cursorPastHalfwayHeight) {
    arrow__arrow.classList.add("popover-arrow__arrow--br");
    // console.log("bottom right");
  } else if (!cursorPastHalfway && cursorPastHalfwayHeight) {
    arrow__arrow.classList.add("popover-arrow__arrow--bl");
    // console.log("bottom left");
  } else if (!cursorPastHalfway && !cursorPastHalfwayHeight) {
    arrow__arrow.classList.add("popover-arrow__arrow--tl");
    // console.log("top left");
  }
}

//Get Data for corresponding link being hovered over
function getData(newHoverID, newHoverGroup) {
  // Creating Our XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Making our connection
  xhr.open("GET", `card.php?hover-id=${newHoverID}&hover-group=${newHoverGroup}`, true);

  // function execute after request is successful
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let returnData = this.responseText;
      if (returnData) renderData(returnData);
    }
  };
  // Sending our request
  xhr.send();
}
