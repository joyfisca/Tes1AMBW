var cardDetail = document.getElementById('detail_card');
var title = document.title

function createdetail(data){
    document.title = data.nama
    console.log(data.nama)

    let newContent = `
    <header>
        <h1> ${data.nama}</h1>
    </header>
    
    <section>
    ${data.detail}
    </section>    `;
    cardDetail.innerHTML+= newContent;
}

function cleardetail() {
    cardDetail.innerHTML = '';
  
  }
function updateUI(data) {
    cleardetail();

    // Mendapatkan ID dari parameter URL
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('id');

    // Memanggil fungsi createdetail dengan ID yang ditemukan
    createdetail(data[cardId]);
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
