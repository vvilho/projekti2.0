"use strict";
const url = "http://localhost:3000"; // change url when uploading to server

// select existing html elements
const loginWrapper = document.querySelector("#login-wrapper");
const userInfo = document.querySelector("#user-info");
const logOut = document.querySelector("#log-out");
const main = document.querySelector("main");
const loginForm = document.querySelector("#login-form");
const addUserForm = document.querySelector("#add-user-form");
const addForm = document.querySelector("#add-cat-form");
const modForm = document.querySelector("#mod-cat-form");
const ul = document.querySelector("ul");
const userLists = document.querySelectorAll(".add-owner");
const imageModal = document.querySelector("#image-modal");
const modalImage = document.querySelector("#image-modal img");
const close = document.querySelector("#image-modal a");

// create cat cards
const createCatCards = (cats) => {
  // clear ul
  ul.innerHTML = "";
  cats.forEach((cat) => {
    // create li with DOM methods
    const img = document.createElement("img");
    img.src = url + "/thumbnails/" + cat.tiedostoNimi;
    img.alt = cat.kuvaID;
    img.classList.add("resp");

    // open large image when clicking image
    img.addEventListener("click", () => {
      modalImage.src = url + "/" + cat.tiedostoNimi;
      imageModal.alt = cat.kuvaID;
      imageModal.classList.toggle("hide");
      try {
        const coords = JSON.parse(cat.coords);
        // console.log(coords);
        addMarker(coords);
      } catch (e) {}
    });

    const figure = document.createElement("figure").appendChild(img);

    const h2 = document.createElement("h2");
    h2.innerHTML = cat.ownername;

    const p3 = document.createElement("p");
    p3.innerHTML = `Kuvaus: ${cat.kuvaus}`;
    // add selected cat's values to modify form
    const modButton = document.createElement("button");
    modButton.innerHTML = "Modify";
    modButton.classList.add("btn-form");
    modButton.classList.add("btn-mod");
    modButton.addEventListener("click", () => {
      const inputs = modForm.querySelectorAll("input");
      inputs[0].value = cat.kuvaus;
      inputs[1].value = cat.kuvaID;

      //modForm.querySelector('select').value = cat.ownername;
    });

    // delete selected cat
    const delButton = document.createElement("button");
    delButton.innerHTML = "Delete";
    delButton.classList.add("btn-form");
    delButton.classList.add("btn-del");
    delButton.addEventListener("click", async () => {
      const fetchOptions = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      };
      try {
        const response = await fetch(url + "/cat/" + cat.kuvaID, fetchOptions);
        const json = await response.json();
        console.log("delete response", json);
        getCat();
      } catch (e) {
        console.log(e.message());
      }
    });

    const li = document.createElement("li");
    const hr = document.createElement("hr");
    hr.classList.add("stripe-small");

    li.appendChild(h2);
    li.appendChild(figure);
    li.appendChild(p3);

    li.appendChild(modButton);
    li.appendChild(delButton);

    ul.appendChild(li);
    ul.appendChild(hr);
  });
};

// close modal
close.addEventListener("click", (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle("hide");
});

// AJAX call

const getCat = async () => {
  //Set addcat form hidden input value to userID
  const inputs = addForm.querySelectorAll("input");
  inputs[2].value = sessionStorage.getItem("loggedUserID");

  userInfo.innerHTML = `${sessionStorage.getItem("loggedUser")}`;
  console.log("getCat token ", sessionStorage.getItem("token"));
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/cat", options);
    const cats = await response.json();
    createCatCards(cats);
  } catch (e) {
    console.log(e.message);
  }
};

// submit add cat form
addForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  console.log("toimii");
  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: fd,
  };
  const response = await fetch(url + "/cat", fetchOptions);
  const json = await response.json();
  console.log("add response", json);
  getCat();
});

// submit modify form
modForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modForm);
  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  };

  console.log(fetchOptions);
  const response = await fetch(url + "/cat", fetchOptions);
  const json = await response.json();
  console.log("modify response", json);
  getCat();
});

// login
loginForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + "/auth/login", fetchOptions);
  const json = await response.json();
  console.log("login response", json);
  if (!json.user) {
    alert(json.message);
  } else {
    // save token
    sessionStorage.setItem("token", json.token);
    sessionStorage.setItem("loggedUser", json.user.nimi);
    sessionStorage.setItem("loggedUserID", json.user.userID);

    console.log("loggedUser", sessionStorage.getItem("loggedUser"));

    // show/hide forms + cats
    loginWrapper.style.display = "none";
    logOut.style.display = "block";
    main.style.display = "block";
    userInfo.innerHTML = `${json.user.nimi}`;
    getCat();
  }
});

// logout
logOut.addEventListener("click", async (evt) => {
  evt.preventDefault();
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/auth/logout", options);
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loggedUserID");

    alert(
      "You have logged out from user: " + sessionStorage.getItem("loggedUser")
    );
    // show/hide forms + cats
    loginWrapper.style.display = "flex";
    logOut.style.display = "none";
    main.style.display = "none";

    sessionStorage.removeItem("loggedUser");
  } catch (e) {
    console.log(e.message);
  }
});

// submit register form
addUserForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  //Check if passwords matches selectors
  const salasana = document.getElementById("salasana").value;
  const toistaSalasana = document.getElementById("toistaSalasana").value;

  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  //Check if passwords matches if statment
  if (salasana == toistaSalasana) {
    const response = await fetch(url + "/auth/register", fetchOptions);
    const json = await response.json();
    console.log("user add response", json);
    // save token
    sessionStorage.setItem("token", json.token);
    sessionStorage.setItem("loggedUser", json.user.nimi);
    sessionStorage.setItem("loggedUserID", json.user.userID);

    console.log("loggedUser", sessionStorage.getItem("loggedUser"));
    // show/hide forms + cats
    loginWrapper.style.display = "none";
    logOut.style.display = "block";
    main.style.display = "block";
    userInfo.innerHTML = `${json.user.nimi}`;
    getCat();
  } else {
    document.querySelector(".log").innerHTML = '<span class="log-style">Salasanat eivät täsmä</span>'

    console.log("salasanat eivät täsmä");
  }
});

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
if (sessionStorage.getItem("token")) {
  loginWrapper.style.display = "none";
  logOut.style.display = "block";
  main.style.display = "block";
  getCat();
}
