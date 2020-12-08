'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const loginWrapper = document.querySelector('#login-wrapper');
const userInfo = document.querySelector('#user-info');
const logOut = document.querySelector('#log-out');
const main = document.querySelector('main');
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector('#add-user-form');
const addForm = document.querySelector('#add-cat-form');
const modForm = document.querySelector('#mod-cat-form');
const ul = document.querySelector('ul');
const kuntaList = document.querySelectorAll('#add-kunta');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');
const hakuForm = document.querySelector('#kuvaHaku');
const commentForm = document.querySelector('#kommentti');
const ulKommentti = document.querySelector('#ulKommentti');
const ulKuvaus = document.querySelector('#kuvanKuvaus');
const userCountForm = document.querySelector('#userCountForm');
const mostLiked = document.querySelector('#mostLiked');
const buttonAddPost = document.querySelector('.addPost');
const buttonChangePost = document.querySelector('.changePost');
const addPostModal = document.querySelector('#popup1');
const changePostModal = document.querySelector('#popup2');
const closeMe = document.querySelector('.closeMe');
const closeMe2 = document.querySelector('.closeMe2');


// create cat cards
const createCatCards = (cats) => {
    // clear ul
    ul.innerHTML = '';
    cats.forEach((cat) => {


        // create li with DOM methods
        const img = document.createElement('img');
        img.src = url + '/thumbnails/' + cat.tiedostoNimi;
        img.alt = cat.kuvaID;
        img.classList.add('resp');

        // open large image when clicking image

        img.addEventListener('click', () => {

            modalImage.src = url + '/' + cat.tiedostoNimi;
            imageModal.alt = cat.kuvaID;
            imageModal.classList.toggle('hide');
            const inputs = commentForm.querySelectorAll('input');
            inputs[0].value = '';
            inputs[1].value = cat.kuvaID;
            inputs[2].value = sessionStorage.getItem('loggedUserID');

            //add kuvaus as first comment
            ulKuvaus.innerHTML = '';

            const li = document.createElement('li');
            const h4 = document.createElement('h4');
            h4.innerHTML = cat.ownername;
            const p = document.createElement('p');
            p.innerHTML = `Kuvaus: ${cat.kuvaus}`;
            const hr = document.createElement('hr');
            const br = document.createElement('br');

            li.appendChild(h4);
            li.appendChild(p);
            li.appendChild(hr);
            li.appendChild(br);

            ulKuvaus.appendChild(li);

            //get imagecomments
            getComments();
            try {
                const coords = JSON.parse(cat.coords);
                addMarker(coords);
            } catch (e) {
            }
        });

        const figure = document.createElement('figure').appendChild(img);

        const h2 = document.createElement('h2');
        h2.innerHTML = cat.ownername;

        const likecount = document.createElement('p');
        getlikes(cat.kuvaID).then(x => {

            likecount.innerHTML = `Likes: ${x[0].likecount}`;
        })

        const p4 = document.createElement('p');
        p4.innerHTML = `Paikka: ${cat.kunta}`;
        const p3 = document.createElement('p');
        p3.innerHTML = `Kuvaus: ${cat.kuvaus}`;
        const li = document.createElement('li');
        const hr = document.createElement('hr');
        const like = document.createElement('i');
        like.innerHTML = '<i class="fas fa-thumbs-up"></i>';
        hr.classList.add('stripe-small');
        li.appendChild(h2);
        li.appendChild(figure);
        li.appendChild(p4);
        li.appendChild(p3);
        li.appendChild(likecount);
        li.appendChild(like);

        //if user has liked a picture set button color red

        getlike(cat.kuvaID, sessionStorage.getItem('loggedUserID')).then(x => {
            if(x){
                like.innerHTML = '';
                like.classList.add('fas');
                like.classList.add('fa-thumbs-up');
                like.classList.add('liked-color');
            }
        });


//<i class="far fa-thumbs-up"></i>
        like.addEventListener('click', () => {
            if (like.classList.contains('fa-thumbs-up')) {
                like.classList.remove('fas');
                like.classList.remove('fa-thumbs-up');
                like.classList.remove('liked-color');
                removelike(cat.kuvaID, sessionStorage.getItem('loggedUserID'));
            }else{
                addlike(cat.kuvaID, sessionStorage.getItem('loggedUserID'));
                like.classList.add('fas');
                like.classList.add('tfa-thumbs-up');
                like.classList.add('liked-color');
            }
            getCat();
        });


        // add selected cat's values to modify form
        if (cat.userID == sessionStorage.getItem('loggedUserID')) {
            const modButton = document.createElement('button');
            modButton.innerHTML = 'Muokkaa';
            modButton.classList.add('btn-form');
            modButton.classList.add('btn-mod');
            modButton.addEventListener('click', () => {
                console.log('modifynappi');
                const inputs = modForm.querySelectorAll('input');
                inputs[0].value = cat.kuvaus;
                inputs[1].value = cat.kuvaID;
                //add change-post-modal
                changePostModal.classList.toggle('hide');
            });


            // delete selected cat
            const delButton = document.createElement('button');
            delButton.innerHTML = 'Delete';
            delButton.classList.add('btn-form');
            delButton.classList.add('btn-del');
            delButton.addEventListener('click', async () => {
                if (confirm('Haluatko varmasti poistaa kuvan?')) {
                    const fetchOptions = {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                        },
                    };
                    try {
                        const response = await fetch(url + '/cat/' + cat.kuvaID, fetchOptions);
                        const json = await response.json();
                        console.log('delete response', json);
                        getCat();
                    } catch (e) {
                        console.log(e.message());
                    }
                }
            });

            li.appendChild(modButton);
            li.appendChild(delButton);
        }
        ;


        ul.appendChild(li);
        ul.appendChild(hr);
    });
};


// create comments ul


const createCommentUl = (comments) => {
    ulKommentti.innerHTML = '';
    comments.forEach((comment) => {

        const li = document.createElement('li');
        const h4 = document.createElement('h4');
        h4.innerHTML = comment.nimi;
        const p = document.createElement('p');
        p.innerHTML = comment.kommenttiText;
        const br = document.createElement('br');

        li.appendChild(h4);
        li.appendChild(p);
        li.appendChild(br);
        li.appendChild(br);

        ulKommentti.appendChild(li);

    });


};

// open add-post-modal
buttonAddPost.addEventListener('click', () => {
    addPostModal.classList.toggle('hide');
        });

buttonChangePost.addEventListener('click', () => {
    changePostModal.classList.toggle('hide');
        });

// open add-post-modal
closeMe.addEventListener('click', () => {
        addPostModal.classList.toggle('hide');
        });

// open change-post-modal
closeMe2.addEventListener('click', () => {
        changePostModal.classList.toggle('hide');  
        });

// close image-modal
close.addEventListener('click', (evt) => {
    evt.preventDefault();
    imageModal.classList.toggle('hide');
});

// close modals with escape
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
        console.log('esc pressed');
        if (!imageModal.classList.contains('hide')) {
            imageModal.classList.toggle('hide');
        } else if (!addPostModal.classList.contains('hide')) {
            addPostModal.classList.toggle('hide');
        } else if (!changePostModal.classList.contains('hide')) {
            changePostModal.classList.toggle('hide');
        }
    }
});

// hae kuvia käyttäjänimellä
hakuForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const owner = document.getElementById('hakuSana').value;
    console.log(owner);

    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/cat/' + owner, options);
        const cats = await response.json();

        if (cats.length >= 1) {
            createCatCards(cats);
        } else {
            alert('Haulla ei löytynyt yhtään tulosta');
        }
    } catch (e) {
        console.log(e.message);
    }
});


const getCat = async () => {
    //Set addcat form hidden input value to userID
    const inputs = addForm.querySelectorAll('input');
    inputs[2].value = sessionStorage.getItem('loggedUserID');
    inputs[3].value = sessionStorage.getItem('loggedUser');

    userInfo.innerHTML = `${sessionStorage.getItem('loggedUser')}`;
    console.log('getCat token ', sessionStorage.getItem('token'));
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/cat', options);
        const cats = await response.json();
        console.log(cats);
        createCatCards(cats);
    } catch (e) {
        console.log(e.message);
    }
};


// create kunta options to <select>
const createKuntaOptions = (kunnat) => {
    kuntaList.forEach((list) => {
        // clear user list
        list.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.innerHTML = 'Kuvan sijainti';
        option.classList.add('light-border');
        option.disabled;
        option.selected;
        list.appendChild(option);
        kunnat.forEach((kunta) => {
            // create options with DOM methods
            const option = document.createElement('option');
            option.value = kunta.Kuntanumero;
            option.innerHTML = kunta.Kunta;
            option.classList.add('light-border');
            list.appendChild(option);
        });
    });
};

// get kunta to form options
const getKunta = async () => {
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/kunta', options);
        const kunnat = await response.json();
        createKuntaOptions(kunnat);
    }
    catch (e) {
        console.log(e.message);
    }
};


// submit add kuva form


addForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const fd = new FormData(addForm);
    const inputs = addForm.querySelectorAll('input');
    inputs[0].value = '';
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: fd,
    };

    const response = await fetch(url + '/cat', fetchOptions);
    const json = await response.json();
    console.log('add response', json);
    getCat();
    alert('Uusi kuva lisätty! :)');
});

const getComments = async () => {

    const kuvaID = document.getElementById('commentKuvaID').value;

    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/comment/' + kuvaID, options);
        const comments = await response.json();
        createCommentUl(comments);
    } catch (e) {
        console.log(e.message);
    }
};

//add like

const addlike = async (kuvaID, userID) => {



    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
            kuvaID: kuvaID,
            userID: userID
        })

    };

    const response = await fetch(url + '/like', fetchOptions);
    const json = await response.json();

    console.log('Addlike response', json);

};
//remove like

const removelike = async (kuvaID, userID) => {



    const fetchOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
            kuvaID: kuvaID,
            userID: userID
        })

    };

    const response = await fetch(url + '/like', fetchOptions);
    const json = await response.json();

    console.log('Deletelike response', json);

};



// get like

const getlike = async (kuvaID, userID) => {


    const fetchOptions = {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },

    };

    const response = await fetch(url + '/like/'+kuvaID+'/'+userID, fetchOptions);
    const json = await response.json();
    //check if user has liked the image

    if(json.length > 0){
        return await json.length;
    }


};
//get likes

const getlikes = async (kuvaID) => {


    const fetchOptions = {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },

    };

    const response = await fetch(url + '/like/'+kuvaID, fetchOptions);
    const json = await response.json();
    //check if user has liked the image

    return json;


};

const getUserCount = async () => {

    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/user/' , options);
        const count = await response.json();
        createUserCount(count);
    } catch (e) {
        console.log(e.message);
    }
};
const createUserCount = async (count) => {

    getUserCount(count);
    const p = document.createElement('p');
    p.innerHTML = 'määrä',count.user;
    userCountForm.appendChild(p);
};


const getMostlikedUser = async () => {

    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/like/' , options);
        const mostliked = await response.json();
    } catch (e) {
        console.log(e.message);
    }
    const p  = document.createElement('p');
    p.innerHTML = mostliked.like;
    MostLiked.appendChild(p);
};


//submit comment

commentForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(commentForm);
    const inputs = commentForm.querySelectorAll('input');
    inputs[0].value = '';
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url + '/comment', fetchOptions);
    const json = await response.json();


    console.log('newComment response', json);
    getComments();
});


// submit modify form
modForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(modForm);
    const inputs = modForm.querySelectorAll('input');
    inputs[0].value = '';
    const fetchOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url + '/cat', fetchOptions);
    const json = await response.json();
    console.log('modifyKuvaus response', json);
    getCat();
});

// login
loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(loginForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url + '/auth/login', fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    if (!json.user) {
        alert(json.message);
    } else {
        // save token
        sessionStorage.setItem('token', json.token);
        sessionStorage.setItem('loggedUser', json.user.nimi);
        sessionStorage.setItem('loggedUserID', json.user.userID);

        console.log('loggedUser', sessionStorage.getItem('loggedUser'));

        // show/hide forms + cats
        loginWrapper.style.display = 'none';
        logOut.style.display = 'block';
        main.style.display = 'block';
        userInfo.innerHTML = `${json.user.nimi}`;
        getCat();
        getKunta();
    }
});

// logout
logOut.addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/auth/logout', options);
        const json = await response.json();
        console.log(json);
        // remove token
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('loggedUserID');


        alert('Olet kirjautunut ulos: ' + sessionStorage.getItem('loggedUser'));
        // show/hide forms + cats
        loginWrapper.style.display = 'flex';
        logOut.style.display = 'none';
        main.style.display = 'none';

        sessionStorage.removeItem('loggedUser');

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
        getKunta();
    } else {
        document.querySelector(".log").innerHTML = '<span class="log-style">Salasanat eivät täsmä</span>'

        console.log("salasanat eivät täsmä");
    }
});


//scroll-up code
//Get the button:
const mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
if (sessionStorage.getItem('token')) {
    loginWrapper.style.display = 'none';
    logOut.style.display = 'block';
    main.style.display = 'block';
    getCat();
    getKunta();
    console.log('toiniii');
}