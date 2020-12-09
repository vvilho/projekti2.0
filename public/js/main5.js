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
const buttonAddPost = document.querySelector('.addPost');
const buttonChangePost = document.querySelector('.changePost');
const addPostModal = document.querySelector('#popup1');
const changePostModal = document.querySelector('#popup2');
const closeMe = document.querySelector('.closeMe');
const closeMe2 = document.querySelector('.closeMe2');
const userCountForm = document.querySelector('#userCountForm');
const mostLiked = document.querySelector('#mostLiked');
const userCountNumero = document.querySelector('#userCountNumero');
const mostLikedNumero = document.querySelector('#mostLikedNumero');



// create cat cards
const createCatCards = (cats) => {
    // clear ul
    ul.innerHTML = '';
    cats.reverse().forEach((cat) => {


        // create li with DOM methods
        const img = document.createElement('img');
        img.src = url + '/thumbnails/' + cat.tiedostoNimi;
        img.alt = cat.kuvaID;
        img.classList.add('resp');
        img.title = "Klikkaa nähdäksesi kommentit";

        // open large image when clicking image

        img.addEventListener('click', () => {

            modalImage.src = url + '/' + cat.tiedostoNimi;
            imageModal.alt = cat.kuvaID;
            imageModal.classList.toggle('hide');
            const inputs = commentForm.querySelectorAll('input');
            inputs[0].value = '';
            inputs[1].value = cat.kuvaID;


            //add kuvaus as first comment
            ulKuvaus.innerHTML = '';

            const li = document.createElement('li');
            const h4 = document.createElement('h4');
            h4.innerHTML = cat.ownername;
            const p = document.createElement('p');
            p.innerHTML = `Kuvaus: ${cat.kuvaus}`;

            li.appendChild(h4);
            li.appendChild(p);

            ulKuvaus.appendChild(li);

            //get imagecomments
            getComments();
            try {
                const coords = JSON.parse(cat.coords);
                addMarker(coords);
            } catch (e) {
            }
        });
        const likecount = document.createElement('p');
        const commentcount = document.createElement('p');


        const figure = document.createElement('figure').appendChild(img);

        const h2 = document.createElement('h2');
        h2.innerHTML = cat.ownername;

        getlikes(cat.kuvaID).then(x => {

            likecount.innerHTML = `Tykkäyksiä: ${x[0].likecount}`;
        });

        getcommentmaara(cat.kuvaID).then(x => {

            commentcount.innerHTML = `Kommentteja: ${x[0].maara}`;
        });


        const p4 = document.createElement('p');
        p4.innerHTML = `Paikka: ${cat.kunta}`;
        const p3 = document.createElement('p');
        p3.innerHTML = `Kuvaus: ${cat.kuvaus}`;
        const li = document.createElement('li');
        const hr = document.createElement('hr');
        const like = document.createElement('i');
        like.classList.add('fas');
        like.classList.add('fa-thumbs-up')
        hr.classList.add('stripe-small');
        li.appendChild(h2);
        li.appendChild(figure);
        li.appendChild(p4);
        li.appendChild(p3);
        li.appendChild(likecount);
        li.appendChild(commentcount);
        li.appendChild(like);

        //if user has liked a picture set thumbsup color yellow

        getlike(cat.kuvaID).then(x => {
            if (x) {
                //like.innerHTML = '';

                like.classList.toggle('liked-color');
            }
        });


        like.addEventListener('click', async () => {
            if (like.classList.contains('liked-color')) {
                //remove like from photo and update database
                await removelike(cat.kuvaID);

                like.classList.toggle('liked-color');
                await getlikes(cat.kuvaID).then(x => {

                    likecount.innerHTML = `Tykkäyksiä: ${x[0].likecount}`;
                });

            } else {
                //add like to photo and update database
                await addlike(cat.kuvaID);

                like.classList.toggle('liked-color');
                await getlikes(cat.kuvaID).then(x => {

                    likecount.innerHTML = `Tykkäyksiä: ${x[0].likecount}`;
                });
            }


        });


        // add selected cat's values to modify form
        if (cat.userID == sessionStorage.getItem('loggedUserID')) {
            const modButton = document.createElement('button');
            modButton.innerHTML = 'Muokkaa';
            modButton.classList.add('btn-form');
            modButton.classList.add('btn-mod');
            modButton.title = "muokkaa kuvausta";
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
            delButton.innerHTML = 'Poista';
            delButton.classList.add('btn-form');
            delButton.classList.add('btn-del');
            delButton.title = "poista kuva";
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
                        console.log('Kuva poistettu');
                        getCat();
                    } catch (e) {
                        console.log(e.message());
                    }
                }
            });
            li.appendChild(h2);
            li.appendChild(figure);
            li.appendChild(p4);
            li.appendChild(p3);
            li.appendChild(likecount);
            li.appendChild(commentcount);
            li.appendChild(like);
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
    if (comments.length == 0) {
        ulKommentti.innerHTML = 'Ei kommentteja vielä';
    } else {
        ulKommentti.innerHTML = '';
        comments.forEach((comment) => {

            const li = document.createElement('li');
            const h4 = document.createElement('h4');
            h4.innerHTML = comment.nimi;
            const p = document.createElement('p');
            p.innerHTML = comment.kommenttiText;
            const hr = document.createElement('hr')
            hr.classList.add('stripe-dashed');

            li.appendChild(h4);
            li.appendChild(p);
            li.appendChild(hr);

            ulKommentti.appendChild(li);

        });
    }


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
    if (e.key === 'Escape') {
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
    const inputs = hakuForm.querySelectorAll('input');
    inputs[0].value = '';

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
})


const getCat = async () => {


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
        option.value = '0';
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
    } catch (e) {
        console.log(e.message);
    }
};


// submit add kuva form


addForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const fd = new FormData(addForm);


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
    //clear inputs
    const inputs = addForm.querySelectorAll('input');
    inputs[0].value = '';
    inputs[1].value = '';

    const select = addForm.querySelector('select');
    select.value = '0';

    //exit
    addPostModal.classList.toggle('hide');
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

const addlike = async (kuvaID) => {


    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
            kuvaID: kuvaID,

        })

    };

    const response = await fetch(url + '/like', fetchOptions);
    const json = await response.json();

    console.log('Addlike response', json);

};
//remove like

const removelike = async (kuvaID) => {


    const fetchOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
            kuvaID: kuvaID,

        })

    };

    const response = await fetch(url + '/like', fetchOptions);
    const json = await response.json();

    console.log('Deletelike response', json);

};


// get like

const getlike = async (kuvaID) => {


    const fetchOptions = {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },

    };

    const response = await fetch(url + '/like/tykkaa/' + kuvaID, fetchOptions);
    const json = await response.json();
    //check if user has liked the image

    if (json.length > 0) {
        return await json.length;
    }


};
//get likes / likecount

const getlikes = async (kuvaID) => {


    const fetchOptions = {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },

    };

    const response = await fetch(url + '/like/' + kuvaID, fetchOptions);
    const json = await response.json();


    return json;


};

//get comments / commentcount

const getcommentmaara = async (kuvaID) => {


    const fetchOptions = {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },

    };

    const response = await fetch(url + '/comment/maara/' + kuvaID, fetchOptions);
    const json = await response.json();


    return json;


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
        mostLiked.style.display = 'block';
        userCountForm.style.display = 'block';
        userInfo.innerHTML = `${json.user.nimi}`;
        getCat();
        getKunta();
        getUserCount();
        getMostlikedUser();
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
        mostLiked.style.display = 'none';
        userCountForm.style.display = 'none';

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
        mostLiked.style.display = 'block';
        userCountForm.style.display = 'block';
        userInfo.innerHTML = `${json.user.nimi}`;
        getCat();
        getKunta();
        getUserCount();
        getMostlikedUser();
    } else {
        document.querySelector(".log").innerHTML = '<span class="log-style">Salasanat eivät täsmä</span>'

        console.log("salasanat eivät täsmä");
    }
});

const getMostlikedUser = async () => {

    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/like/most', options);
        const mostlikes = await response.json();
        createMostLikedUser(mostlikes);
    } catch (e) {
        console.log(e.message);
    }

};
const createMostLikedUser = async (mostlikes) => {
    //show user that has most likes
    mostLikedNumero.innerHTML = '';
    mostLikedNumero.innerHTML = mostlikes[0].nimi;

};


const createUserCount = async (count) => {
    //set the number of users to header
    userCountNumero.innerHTML = '';
    userCountNumero.innerHTML = count[0].maara;
};


const getUserCount = async () => {

    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };

        const response = await fetch(url + '/user/count', options);
        const count = await response.json();
        createUserCount(count);
    } catch (e) {
        console.log(e.message);
    }
};


//scroll-up code
//Get the button:


// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Check if users token is valid. Keep logged in.

const tokenCheck = async (token) => {

    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        const response = await fetch(url + '/cat/tokencheck', options);
        const json = await response.json();
        console.log(json);
        return json;
    } catch (e) {
        console.log("Unauthorized access! Token is invalid");
        console.log('vaara token');
        loginWrapper.style.display = 'block';
        logOut.style.display = 'none';
        main.style.display = 'none';
        mostLiked.style.display = 'none';
        userCountForm.style.display = 'none';

    }


};

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users

const tokenOK = tokenCheck(sessionStorage.getItem('token'));



if (tokenOK) {
    loginWrapper.style.display = 'none';
    logOut.style.display = 'block';
    main.style.display = 'block';
    mostLiked.style.display = 'block';
    userCountForm.style.display = 'block';
    getCat();
    getKunta();
    getUserCount();
    getMostlikedUser();
    console.log('Page updated');
};


//loppu