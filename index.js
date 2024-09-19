class Music extends Audio {
    constructor(title, performer, author, type){
        super( "./audios/amharic/"+title+".mp3");
        this.title = title;
        this.performer = performer;
        this.author = author;
        this.type = type;
    }
}
class Video extends HTMLMediaElement{
    constructor(title, performer, author, type){
        super();
        this.title = title;
        this.performer = performer;
        this.author = author;
        this.type = type;
    }
}

function populateMediaCard(media){
    mediaCard = document.createElement('div');
    mediaCard.classList.add('media-card');

    mediaCardInfo = document.createElement('div');
    mediaCardInfo.classList.add("media-card-info");
    
    thumbnail = document.createElement('img');
    thumbnail.classList.add("media-card-thumbnail");
    thumbnail.setAttribute("src", "./images/grace.jpg");
    
    title = document.createElement('p');
    title.classList.add("media-card-title");
    title.textContent = media.title;
    
    playBtn = document.createElement("span");
    playBtn.classList= "play-btn material-symbols-outlined";
    playBtn.textContent = "play_circle";
    playBtn.addEventListener('click',media.play);

    author = document.createElement('p');
    author.classList.add('media-author');
    author.textContent = (media.author != "" || media.author == undefined)? media.author: "Unknown";

    performer = document.createElement('p');
    performer.classList.add("media-performer");
    performer.textContent = (media.performer != "")?media.performer: "unknown";

    mediaCardInfo.appendChild(title);
    mediaCardInfo.appendChild(author);
    mediaCardInfo.appendChild(performer);

    mediaCard.appendChild(thumbnail);
    mediaCard.appendChild(playBtn);
    mediaCard.appendChild(mediaCardInfo);
    
    article = document.querySelector('.sample-'+media.type+'s-container');
    article.appendChild(mediaCard);
}
async function populateSamples(){
    const request = new Request("/JSON/Media.json");
    const response = await fetch(request);
    const media = await response.json();
    var musics = [];
    var videos = [];
    for (i = 0; i < 25; i++){
        medium = media[i];
        if(medium.type === "audio"){
            const audio = new Music(medium.title, medium.performer, medium.author, medium.type);
            musics.push(audio);
        }else if(medium.type === "video"){
            const video = new Video(medium.title, medium.performer, medium.author. medium.type);
            videos.push(video);
        }
    }
    var i = 0;
    while(i < 10 && i < videos.length && videos.length>0){
        populateMediaCard(videos[i]);
        i++;
    }
    i=0;
    while(i < 10 && i < musics.length && musics.length>0){
        populateMediaCard(musics[i]);
        i++;
    }
}
populateSamples();
