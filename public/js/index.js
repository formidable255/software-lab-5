
function onAddPress(){
    var show = document.getElementsByTagName("div")[3].getAttribute("id")
    if(show == 'artist-input'){
        document.getElementsByTagName("div")[3].setAttribute("id", 'artist-input-hide')
    } else {
        document.getElementsByTagName("div")[3].setAttribute("id", 'artist-input')
    }
    document.getElementById("search").value="";
}

var storedArtist = [];

function add(artistName, artistAbout, artistUrl, addToStorage=true){
    var name, about, url;

    if(artistName == null) {
        name = document.getElementById('name').value;
        about = document.getElementById('about').value;
        url = document.getElementById('url').value;
    } else {
        name = artistName;
        about = artistAbout;
        url = artistUrl;
    }
     
    
    if(name=='', about=='', url==''){
        return 0;
    }
    var newArtistRow = document.createElement('div');
    newArtistRow.className="row justify-content-center";
    
    var artistCol = document.createElement('div');
    artistCol.className="col-md-4 col-md-offset-4 artist";
    artistCol.id="artist";

    var artistImg = document.createElement('img');
    artistImg.className = "img";
    var artistDescription = document.createElement('div');
    artistDescription.className = "desc";

    var deleteButton = document.createElement('button');
    var buttonVal = document.createTextNode('Delete');
    deleteButton.appendChild(buttonVal);
    deleteButton.className = "delete-button";
    deleteButton.id = name;
    deleteButton.onclick = function(e) {
        e.path[2].parentElement.removeChild(e.path[2]);
        storedArtist = storedArtist.filter((artist) => {
            return artist.name != this.id
        })
        // localStorage.setItem("storedArtist", JSON.stringify(storedArtist));
        addArtists(JSON.stringify(storedArtist))
    }

    var artistName = document.createElement('h3')
    var school= document.createElement('p')

    var nameVal = document.createTextNode(name); 
    artistName.appendChild(nameVal);  
    artistName.className = "name"

    var aboutVal = document.createTextNode(about);
    school.appendChild(aboutVal);
    school.className="name"

    artistImg.src = url;
    artistDescription.append(artistName, aboutVal)

    newArtistRow.appendChild(artistCol).append(artistImg,artistDescription, deleteButton);
    var currentDiv = document.getElementById("artist-insert"); 
    currentDiv.append(newArtistRow);

    document.getElementById('name').value ='';
    document.getElementById('about').value='';
    document.getElementById('url').value='';

    if(addToStorage){
        storedArtist.push({name:name, about:about, url:url})
        // localStorage.setItem("storedArtist", JSON.stringify(storedArtist));

        addArtists(JSON.stringify(storedArtist))
        getArtists().then(res => res.json()).then(res => storedArtist = JSON.parse(res))
        onAddPress();    
    }

}

function addArtists(data){
    return fetch('http://localhost:3000/add', {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
function getArtists(){
    return fetch('http://localhost:3000/get')
}

function search(){
    name = document.getElementById("search").value;
    // var artist = localStorage.getItem("storedArtist");
    var artist = storedArtist;
    if(artist.length != 0 && name==""){
        clearArtist()
        artist.map(ar => {
            add(ar.name, ar.about, ar.url, false)
        })
    } else {
        if(artist.length != 0){
            clearArtist()
            artist.map(ar => {
                if(ar.name.includes(name)){
                    add(ar.name, ar.about, ar.url, false)
                }
            })
        } 
    }
    document.getElementById("search").value="";
    
}

function clearArtist(){
    var artistInsert = document.getElementById("artist-insert"); 
    while(artistInsert.firstChild){
        artistInsert.removeChild(artistInsert.firstChild)
    }
}

window.onload = function() {
    // storedArtist = JSON.parse(this.localStorage.getItem("storedArtist")) || [];
    getArtists().then(res => res.json()).then(res => {
        if(res.length == 0){
            storedArtist = [];
        } else {
            storedArtist = JSON.parse(res) || [];
        }
        
        search()
    })
}