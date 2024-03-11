var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var cardArea = document.getElementById('workout_card');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

// shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
  }
}

function clearCards() {
  cardArea.innerHTML = '';

}

function createCard(data) {
  console.log(data);
  let newContent = `
    <div class="col p-2">
    <a href="/detail.html/?id=${data.id}">
        <div class="card mx-auto" >
                <img src="${data.image}" class="card-img black-image" alt="pushup">
                <div class="card-img-overlay d-flex align-items-center justify-content-center">
                <h5 class="card-title text-center fw-bolder text-white">${data.nama}</h5>
                </div>
        </div>
        </a>
    </div>`;
cardArea.innerHTML+= newContent;
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://tes1ambw-82bbe-default-rtdb.asia-southeast1.firebasedatabase.app/Kartu.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    clearAllData('Kartu')
          .then(function () {
            return data;
          })
          .then(function (data) {
            for (var key in data) {
              writeData('Kartu', data[key])
            }
          });
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('Kartu')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}
