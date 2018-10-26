let container = document.getElementsByClassName('container')[0];
let n = 1;
let i = 1;
let likes = 1;
let disLikes = 1;
let showListClick = 0;
let img;
let info;
let a;
let text = document.createTextNode("");
let link = document.createTextNode("");
let map;
mapboxgl.accessToken = 'pk.eyJ1IjoiYXJuZWRsbSIsImEiOiJjam5qMGVicmswaXlnM3F0ZGkxbm1lZGVyIn0.HjeTPd9BEQ3Qf2JFLUHSqA';

class Person {
    constructor(id, name, age, place, url){
        this.id = id;
        this.name = name;
        this.age = age;
        this.place = place;
        this.url = url;
    }
}

function fetchAPI(i){
    fetch('https://randomuser.me/api/')
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            addDataToLocalStorage(data.results[0], i);
        })
        .catch(function(error){
            console.error('Fail:', error);
        });
}
function start(){
    for(i=1;i<11;i++){
        fetchAPI(i);
    }
    
}
function showDataFromLocalStorage(profil){
    let x = localStorage.getItem(profil);
    x = JSON.parse(x); 
    return x;
}
function addDataToLocalStorage(profil, key){
    let person = new Person(profil.login.uuid, profil.name.first, profil.dob.age, profil.location.coordinates, profil.picture.medium);
    console.log(person);
    person = JSON.stringify(person);
    localStorage.setItem(key, person);
    if(localStorage.getItem(10) != null){
        addData(n);
        addImage(n);
        i=1;
    }
}
function addData(){
    let lati1 = showDataFromLocalStorage(n).place.latitude;
    let longi1 = showDataFromLocalStorage(n).place.longitude;
    let lati2 = sessionStorage.getItem('position')[0];
    let longi2 = sessionStorage.getItem('position')[1];
    console.log(n);
    text.nodeValue = "";
    text.nodeValue = showDataFromLocalStorage(n).name + ', ' + showDataFromLocalStorage(n).age;
    link.nodeValue = "";
    link.nodeValue = calculateDistance(lati1,longi1,lati2,longi2) + ' km';
    a.appendChild(link);
    info.appendChild(text)
}
function addImage(){
    img.src = showDataFromLocalStorage(n).url;
}
function checkArray(){
    if(n==10){
        checkProfil();
        start();

        n=0;
    }
}
function rememberLike(){
    let like = localStorage.getItem(n);
    localStorage.setItem('like' + likes, like);
    likes++;
}
function rememberDisLike(){
    let disLike = localStorage.getItem(n);
    localStorage.setItem('dislike' + disLikes, disLike);
    disLikes++;
}
function checkProfil(){
    for(let i=0; i<localStorage.length;i++){
        let profilLike = showDataFromLocalStorage('like' + i);
        let profil = showDataFromLocalStorage(i);
        console.log(localStorage.length);
        if(profilLike !== null && profil !== null){
            console.log('not empty');
            if(profil.id == profilLike.id){
                console.log('deleted' + profil.name);
                localStorage.removeItem(n);
            }
        }
        
    }
}
function makeList(){
    let ul = document.createElement('UL');
        ul.className = 'list';
        container.appendChild(ul);
        img.src = '';

    for(let i=0; i<localStorage.length;i++){
        let profil = showDataFromLocalStorage('like' + i);
        let dislike = showDataFromLocalStorage('dislike' + i);
        if(profil !== null){
            let li = document.createElement('LI');
            let name = document.createTextNode(profil.name + ', like');
            li.appendChild(name);
            li.addEventListener("click", function(){
                li.className = "select";
            })
            ul.appendChild(li);
            
        }
        if(dislike !== null){
            let li = document.createElement('LI');
            let name2 = document.createTextNode(dislike.name + ', dislike');
            li.appendChild(name2);
        
            ul.appendChild(li);
        }
               
    }
    
}
function makeLayOut(){
    let h1 = document.createElement('H1');
    let title = document.createTextNode('Tinder');
    h1.appendChild(title);
    container.appendChild(h1);

    img = document.createElement('IMG');
    img.src = 'load.gif';
    container.appendChild(img);

    data = document.createElement('DIV');
    data.className = "info";
    container.appendChild(data);

    info = document.createElement('P');
    data.appendChild(info);

    a = document.createElement('A');
    a.href = "#";
    data.appendChild(a);
    a.addEventListener("click", function(){
        showMap();
    })

    let dislike = document.createElement('button');
    dislike.className = 'dislike'
    container.appendChild(dislike);
    dislike.addEventListener("click", function(){
        checkArray();
        n++;
        addData();
        addImage();
        rememberDisLike();
        hideMap();
    });

    let showList = document.createElement('button');
    showList.className = 'showList';
    container.appendChild(showList);
    showList.addEventListener("click", function(){
        hideMap();
        if(showListClick==0){
            showListClick++;
            dislike.disabled = true;
            like.disabled = true;
            makeList();
        }
        else if(showListClick>1){
            showListClick==0;
            dislike.disabled = false;
            like.disabled = false;
            ul.className = "list disableList"
        }
    });
    let like = document.createElement('button');
    like.className = 'like';
    container.appendChild(like);
    like.addEventListener("click", function(){
        checkArray();
        n++;
        addData();
        addImage();
        hideMap();
        rememberLike();
    });

}
function getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(function(position){
        saveCurrentPosition(position.coords.latitude, position.coords.longitude);
    })
}
function saveCurrentPosition(lati,longi){
    let position = [lati, longi];
    sessionStorage.setItem('position', position);
}
function calculateDistance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return Math.round(dist);
}
function showMap(){
    
    map = new mapboxgl.Map({
        container: 'map', // HTML container id
        style: 'mapbox://styles/mapbox/streets-v9', // style URL
        center: [showDataFromLocalStorage(n).place.longitude, showDataFromLocalStorage(n).place.latitude], // starting position as [lng, lat]
        zoom: 10
      });
    let nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-right');
    map.className = "";
}
function hideMap(){
    map.style.display = "none";
}
localStorage.clear();
makeLayOut();
start();
getCurrentPosition();


