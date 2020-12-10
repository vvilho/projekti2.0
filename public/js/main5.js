'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const loginWrapper = document.querySelector('#login-wrapper');
const userInfo = document.querySelector('#user-info');
const logOut = document.querySelector('#log-out');
const main = document.querySelector('main');
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector('#add-user-form');
const addForm = document.querySelector('#add-kuva-form');
const modForm = document.querySelector('#mod-kuva-form');
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







// create kuva cards
const createKuvaCards = (kuvas) => {
    // clear ul
    ul.innerHTML = '';
    kuvas.reverse().forEach((kuva) => {


        // create li with DOM methods
        const img = document.createElement('img');
        img.src = url + '/thumbnails/' + kuva.tiedostoNimi;
        img.alt = kuva.kuvaID;
        img.classList.add('resp');
        img.title = "Klikkaa nähdäksesi kommentit";

        // open large image when clicking image

        img.addEventListener('click', () => {

            modalImage.src = url + '/' + kuva.tiedostoNimi;
            imageModal.alt = kuva.kuvaID;
            imageModal.classList.toggle('hide');
            document.body.classList.add("stop-scrolling");
            const inputs = commentForm.querySelectorAll('input');
            inputs[0].value = '';
            inputs[1].value = kuva.kuvaID;


            //add kuvaus as first comment
            ulKuvaus.innerHTML = '';

            const li = document.createElement('li');
            const h4 = document.createElement('h4');
            h4.innerHTML = kuva.ownername;
            const p = document.createElement('p');
            p.innerHTML = kuva.kuvaus;

            li.appendChild(h4);
            li.appendChild(p);

            ulKuvaus.appendChild(li);

            //get imagecomments
            getComments();

        });
        const likecount = document.createElement('p');
        const commentcount = document.createElement('p');


        const figure = document.createElement('figure').appendChild(img);

        const h2 = document.createElement('h2');
        h2.innerHTML = kuva.ownername;

        getlikes(kuva.kuvaID).then(x => {

            likecount.innerHTML = x[0].likecount;
        });

        getcommentmaara(kuva.kuvaID).then(x => {

            commentcount.innerHTML = x[0].maara;
        });


        const p4 = document.createElement('p');
        const p3 = document.createElement('p');
        const li = document.createElement('li');
        const hr = document.createElement('hr');
        const like = document.createElement('i');
        const comment = document.createElement('i');
        const location = document.createElement('i');
        const div = document.createElement('div');
        const div2 = document.createElement('div');

        like.classList.add('fas');
        like.classList.add('fa-thumbs-up');
        comment.classList.add('fas');
        comment.classList.add('fa-comment-alt');
        location.classList.add('far');
        location.classList.add('fa-map-marker-alt');
        div.classList.add('flex-me');
        hr.classList.add('stripe-small');
        li.classList.add('list-container');
        div2.classList.add('flex-me');

        li.appendChild(div2);
        div2.appendChild(location);
        p4.innerHTML = kuva.kunta;
        div2.appendChild(p4);
        li.appendChild(h2);
        li.appendChild(figure);
        p3.innerHTML = kuva.kuvaus;
        li.appendChild(p3);
        li.appendChild(div);
        div.appendChild(like);
        div.appendChild(likecount);
        div.appendChild(comment);
        div.appendChild(commentcount);

        comment.addEventListener('click', () => {

            modalImage.src = url + '/' + kuva.tiedostoNimi;
            imageModal.alt = kuva.kuvaID;
            imageModal.classList.toggle('hide');
            document.body.classList.add("stop-scrolling");
            const inputs = commentForm.querySelectorAll('input');
            inputs[0].value = '';
            inputs[1].value = kuva.kuvaID;


            //add kuvaus as first comment
            ulKuvaus.innerHTML = '';

            const li = document.createElement('li');
            const h4 = document.createElement('h4');
            h4.innerHTML = kuva.ownername;
            const p = document.createElement('p');
            p.innerHTML = `Kuvaus: ${kuva.kuvaus}`;

            li.appendChild(h4);
            li.appendChild(p);

            ulKuvaus.appendChild(li);

            //get imagecomments
            getComments();

        });

        //if user has liked a picture set thumbsup color yellow

        getlike(kuva.kuvaID).then(x => {
            if (x) {
                //like.innerHTML = '';

                like.classList.toggle('liked-color');
            }
        });


        like.addEventListener('click', async () => {
            if (like.classList.contains('liked-color')) {
                //remove like from photo and update database
                await removelike(kuva.kuvaID);

                like.classList.toggle('liked-color');
                await getlikes(kuva.kuvaID).then(x => {

                    likecount.innerHTML = x[0].likecount;
                });

            } else {
                //add like to photo and update database
                await addlike(kuva.kuvaID);

                like.classList.toggle('liked-color');
                await getlikes(kuva.kuvaID).then(x => {

                    likecount.innerHTML = x[0].likecount;
                });
            }


        });


        // add selected kuva's values to modify form
        if (kuva.userID == sessionStorage.getItem('loggedUserID')) {
            const modButton = document.createElement('button');
            modButton.innerHTML = 'Muokkaa';
            modButton.classList.add('label-button');
            modButton.classList.add('btn-mod');
            modButton.title = "muokkaa kuvausta";
            modButton.addEventListener('click', () => {
                console.log('modifynappi');
                const inputs = modForm.querySelectorAll('input');
                inputs[0].value = kuva.kuvaus;
                inputs[1].value = kuva.kuvaID;

                //add change-post-modal
                changePostModal.classList.toggle('hide');
                document.body.classList.add("stop-scrolling");
            });


            // delete selected kuva
            const delButton = document.createElement('button');
            delButton.innerHTML = 'Poista';
            delButton.classList.add('label-button');
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
                        const response = await fetch(url + '/kuva/' + kuva.kuvaID, fetchOptions);
                        const json = await response.json();
                        console.log('Kuva poistettu');
                        getKuva();
                    } catch (e) {
                        console.log(e.message());
                    }
                }
            });
            const div3 = document.createElement('div');
            const div1 = document.createElement('div');
            div3.classList.add('container-list-item');
            li.appendChild(div3);
            div3.appendChild(div2);
            div2.appendChild(location);
            p4.innerHTML = kuva.kunta;
            div2.appendChild(p4);
            div3.appendChild(div1);
            div1.appendChild(modButton);
            div1.appendChild(delButton);
            li.appendChild(h2);
            li.appendChild(figure);
            li.appendChild(p3);
            li.appendChild(div);
            div.appendChild(like);
            div.appendChild(likecount);
            div.appendChild(comment);
            div.appendChild(commentcount);


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
    document.body.classList.add("stop-scrolling");
});

// close change-post-modal
buttonChangePost.addEventListener('click', () => {
    changePostModal.classList.toggle('hide');
    document.body.classList.remove("stop-scrolling");
});

// close add-post-modal
closeMe.addEventListener('click', (evt) => {
    evt.preventDefault();
    addPostModal.classList.toggle('hide');
    document.body.classList.remove("stop-scrolling");
});

// close change-post-modal
closeMe2.addEventListener('click', (evt) => {
    evt.preventDefault();
    changePostModal.classList.toggle('hide');
    document.body.classList.remove("stop-scrolling");
});

// close image-modal
close.addEventListener('click', (evt) => {
    evt.preventDefault();
    imageModal.classList.toggle('hide');
    document.body.classList.remove("stop-scrolling");
});

// close modals with escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!imageModal.classList.contains('hide')) {
            imageModal.classList.toggle('hide');
            document.body.classList.remove("stop-scrolling");
        } else if (!addPostModal.classList.contains('hide')) {
            addPostModal.classList.toggle('hide');
            document.body.classList.remove("stop-scrolling");
        } else if (!changePostModal.classList.contains('hide')) {
            changePostModal.classList.toggle('hide');
            document.body.classList.remove("stop-scrolling");
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
        const response = await fetch(url + '/kuva/' + owner, options);
        const kuvas = await response.json();

        if (kuvas.length >= 1) {
            createKuvaCards(kuvas);
        } else {
            alert('Haulla ei löytynyt yhtään tulosta');
        }
    } catch (e) {
        console.log(e.message);
    }
})


const getKuva = async () => {


    userInfo.innerHTML = `${sessionStorage.getItem('loggedUser')}`;
    console.log('getKuva token ', sessionStorage.getItem('token'));
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/kuva', options);
        const kuvas = await response.json();
        createKuvaCards(kuvas);
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

    const response = await fetch(url + '/kuva', fetchOptions);
    const json = await response.json();
    console.log('add response', json);
    getKuva();
    alert('Uusi kuva lisätty! :)');
    //clear inputs
    const inputs = addForm.querySelectorAll('input');
    inputs[0].value = '';
    inputs[1].value = '';

    const select = addForm.querySelector('select');
    select.value = '0';

    //exit
    addPostModal.classList.toggle('hide');
    document.body.classList.remove("stop-scrolling");
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

    const response = await fetch(url + '/kuva', fetchOptions);
    const json = await response.json();
    console.log('modifyKuvaus response', json);
    getKuva();
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

        // show/hide forms + kuvas
        loginWrapper.style.display = 'none';
        logOut.style.display = 'block';
        main.style.display = 'block';
        mostLiked.style.display = 'block';
        userCountForm.style.display = 'block';
        userInfo.innerHTML = `${json.user.nimi}`;
        getKuva();
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
        // show/hide forms + kuvas
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
        try {
            const response = await fetch(url + "/auth/register", fetchOptions);
            const status = response.status;
            console.log(status);
            if (status == 400) {
                alert('Sähköposti on varattu');
                location.reload();
            }else{
                alert('Käyttäjä lisätty onnistuneesti');
                location.reload();
            }






        }catch(e) {

            console.log(e);

        }
    } else {
        alert('Salasanat eivät täsmää');


        document.getElementById("salasana").value = '';
        document.getElementById("toistaSalasana").value = '';


        console.log("salasanat eivät täsmää");
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
        console.log(mostlikes);
    } catch (e) {
        console.log(e.message);
    }

};
const createMostLikedUser = async (mostlikes) => {
    //show user that has most likes
    mostLikedNumero.innerHTML = '';
    if (mostlikes[0].omistaja == []) {
        mostLikedNumero.innerHTML = 'ei tykkäyksiä';
    } else {
        mostLikedNumero.innerHTML = mostlikes[0].omistaja;
    }
    console.log(mostlikes[0].omistaja);

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


const countAllUsers = document.getElementById("userCountForm");
const likedUser = document.getElementById("mostLiked");
//Change "Lisää kuva" -> "+"
const mediaQuery = matchMedia("screen and (max-width: 900px)");
let plussa = document.getElementById("plussa");

mediaQuery.addListener(() => {
    if (mediaQuery.matches) {
        document.getElementById("plussa").innerHTML = "+";       
        countAllUsers.classList.add('hide');
        likedUser.classList.add('hide');
    } else {
        document.getElementById("plussa").innerHTML = "Lisää&nbsp;kuva";
        countAllUsers.classList.remove('hide');
    }
});
mediaQuery.media; // "screen and (max-width: 900px)"


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
        const response = await fetch(url + '/kuva/tokencheck', options);
        const json = await response.json();
        return json;
    } catch (e) {
        console.log("Unauthorized access! Token is invalid");

        loginWrapper.style.display = 'block';
        logOut.style.display = 'none';
        main.style.display = 'none';
        mostLiked.style.display = 'none';
        userCountForm.style.display = 'none';

    }


};
// when input is selected if it has title then show span with the title
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

window.addEventListener("load",() => {
    document.querySelectorAll("input").forEach(inp => {
        let span = document.createElement('span');
        span.innerHTML = inp.getAttribute("title");
        insertAfter(span, inp);
    })
})

// when app starts, check if token exists and hide login form, show logout button and main content, get kuvas and users

const tokenOK = tokenCheck(sessionStorage.getItem('token'));


if (tokenOK) {
    loginWrapper.style.display = 'none';
    logOut.style.display = 'block';
    main.style.display = 'block';
    mostLiked.style.display = 'block';
    userCountForm.style.display = 'block';
    getKuva();
    getKunta();
    getUserCount();
    getMostlikedUser();
    console.log('Page updated');
}
;


//loppu