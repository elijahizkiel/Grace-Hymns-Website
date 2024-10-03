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

function createMediaControls(media){
    //add media controllers to the audio player section
    let mediaControls = document.createElement('div');
    mediaControls.innerHTML=`<span class="material-symbols-outlined prev-btn">skip_previous</span>
        <span class="material-symbols-outlined player-play-btn">pause_circle</span> 
        <span class="material-symbols-outlined next-btn">skip_next</span>`;
            
    mediaControls.querySelector('.player-play-btn').addEventListener("click",(event)=>{
        if(media.paused){
            media.play();
            event.target.textContent = 'pause_circle';
            playButton = mediaCard.querySelector('.play-btn')
            playButton.textContent = 'pause_circle';
        }else{
            media.pause();
            event.target.textContent ='play_circle';

            for(playButton in mediaCard.querySelectorAll('.play-btn')){
                playButton.textContent = 'play_circle';
                console.log(playButton);
            }
        }
    });
    
    mediaControls.querySelector('.next-btn').addEventListener('click', () =>{
        // if(playList.length > 1 && playList.indexOf(audio) < playList.length - 2){
            // audio = currentPlayList[currentPlayList.indexOf(audio)++];
        // }else{
            // audio.replaceWith()
        // }
    })

    mediaControls.querySelector('.prev-btn').addEventListener('click',() => {
        if(playList.length > 1 && playList.indexOf(media) > 1){
            media.replaceWith(playList[playList.indexOf(media)--]);
        }
    });

    return mediaControls;
}

function createMediaCard(media){
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
    
    //creating and configuring play button
    playBtn = document.createElement("span");
    playBtn.classList= "play-btn material-symbols-outlined";
    playBtn.textContent = "play_circle";
    playBtn.addEventListener('click', async (event)=>{
        if(media.type == 'audio'){
            if(event.target.textContent == "play_circle"){
                //changing play btn to pause btn
                event.target.textContent = "pause_circle";

                // create and configure audio element
                let audio = document.createElement('audio');
                audio.src = "./audios/amharic/" + media.title + ".mp3";
                audio.preload = "auto";
                audio.controls = true;
                audio.autoplay = true;
                
                if(document.getElementById("audio-tab").classList.contains('active')){
                    let playingAudioThumbnail = thumbnail;
                    let audioPlayingSection = document.querySelector('.audio-playing-section');

                    // changing the cards into list item format
                    let mediaCards = document.getElementsByClassName('media-card');
                    for (card of mediaCards){
                        card.classList.add('media-card-as-list');
                    }
                    
                    // configuring media infos
                    let mediaInfo = document.createElement('div');
                    mediaInfo.innerHTML = `<p> ${media.title}</p> <p> ${media.performer}</p>`;
                    
                    // creating lyrics containing DOM element
                    let lyrics = document.createElement('p');
                    lyrics.textContent = (media.lyrics == undefined || media.lyrics == '' 
                        || media.lyrics == null)?"No lyrics": media.lyrics; 

                    // setting width of media list section to one-third of the window
                    document.querySelector('.audio-list-section').style.width = '30%';

                    // adding lyrics to the lyrics section
                    let audioLyricsSection = document.querySelector(".audio-lyrics-section");
                    audioLyricsSection.hasChildNodes?
                        audioLyricsSection.replaceChildren(lyrics):
                        audioLyricsSection.append(lyrics);
                    
                    // adding components to the player section
                    audioPlayingSection.hasChildNodes?
                        audioPlayingSection.replaceChildren(playingAudioThumbnail, mediaInfo, audio, audioControls): 
                        audioPlayingSection.append(playingAudioThumbnail, mediaInfo, audio, audioControls);
                }else {
                    highlightActiveTab(document.getElementById('audio-tab'));
                    
                    let audioTab = await createAudioTab();
                    let audioPlayingSection = audioTab.querySelector('.audio-playing-section');

                    document.querySelector('main').replaceWith(audioTab);

                    // changing media cards to list item format 
                    let mediaCards = document.getElementsByClassName('media-card');
                    for (card of mediaCards){
                        card.classList.add('media-card-as-list');
                    }

                    let playingAudioThumbnail = thumbnail;
                    playingAudioThumbnail.classList = 'playing-audio-thumbnail';
    
                    // creating lyrics containing DOM element
                    let lyrics = document.createElement('div');
                    lyrics.textContent = (media.lyrics == undefined || media.lyrics == null 
                        || media.lyrics == '')? "No lyrics": media.lyrics;

                    let audioControls = createMediaControls(audio);
                    
                    // configuring media info 
                    let mediaInfo = document.createElement('div');
                    mediaInfo.innerHTML = `<p> ${media.title}</p> <p> ${media.performer}</p>`;
                                    
                    // get elements from the DOM
                    let audioListSection = document.querySelector('.audio-list-section');
                    audioListSection.style.width = '30%';
                    
                    // adding lyrics to the window
                    let audioLyricsSection = document.querySelector('.audio-lyrics-section');                
                    audioLyricsSection.hasChildNodes?
                        audioLyricsSection.replaceChildren(lyrics):
                        audioLyricsSection.append(lyrics);
                    
                    // configuring player section
                    audioPlayingSection.hasChildNodes?
                        audioPlayingSection.replaceChildren(playingAudioThumbnail, mediaInfo, audio, audioControls): 
                        audioPlayingSection.append(playingAudioThumbnail, mediaInfo, audio, audioControls);
                }
            }else{
                event.target.textContent = "play_circle";
                audio.pause();
                console.log(event.target);
            }
        }
    });

    author = document.createElement('p');
    author.classList.add('media-author');
    author.textContent = (media.author != "" && media.author != undefined)? media.author: "Unknown";

    performer = document.createElement('p');
    performer.classList.add("media-performer");
    performer.textContent = (media.performer != "")?media.performer: "unknown";

    mediaCardInfo.appendChild(title);
    mediaCardInfo.appendChild(author);
    mediaCardInfo.appendChild(performer);

    mediaCard.appendChild(thumbnail);
    mediaCard.appendChild(playBtn);
    mediaCard.appendChild(mediaCardInfo);

    return mediaCard;
}
async function getMediaInfo() {
    const request = new Request("/JSON/Media.json");
    const response = await fetch(request);
    const media = await response.json();
    return media;
}
async function populateSamples(){
    let media = await getMediaInfo();
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
    let sampleVideoContainer = document.querySelector('.sample-videos-container');
    let sampleAudioContainer = document.querySelector(".sample-audios-container");
    
    while(i < 10 && i < videos.length && videos.length>0){
        mediumCard = createMediaCard(videos[i]);
        sampleVideoContainer.appendChild(mediumCard);
        i++;
    }
    
    i=0;
    
    while(i < 10 && i < musics.length && musics.length>0){
        const mediumCard = createMediaCard(musics[i]);
        sampleAudioContainer.appendChild(mediumCard);
        i++;
    }
}
async function createAudioTab(){
    let mainAudioTab = document.createElement('main');
    let audioListSection = document.createElement('section');
    let audioPlayingSection = document.createElement('section');
    let audioLyricsSection = document.createElement('section');
    let media = await getMediaInfo();

    mainAudioTab.className = "flex-container";
    audioListSection.className ="audio-list-section flex-container";
    audioPlayingSection.classList.add('audio-playing-section');
    audioLyricsSection.classList.add('audio-lyrics-section');

    for await(medium of media){
        if (medium.type === 'audio'){
            let mediaCard = createMediaCard(medium);
            audioListSection.appendChild(mediaCard);
        }
    }
    
    mainAudioTab.appendChild(audioListSection);
    mainAudioTab.appendChild(audioPlayingSection);
    mainAudioTab.appendChild(audioLyricsSection);

    return mainAudioTab;
}

async function populateAudioTab(){
    let main = document.querySelector('main');//lookup the DOM element <main> and assign
    let newMain = await createAudioTab();//create new <main> element for Audio tab
    
    main.replaceWith(newMain);
}

function highlightActiveTab(event){
    let tabs = document.querySelectorAll('.tabs');
    
    //remove active mark from current active tab
    for(const tab of tabs){
        tab.classList.remove('active');
    } 

    //marks current tab as active
    event.classList.add('active');
}
populateSamples();

var audioTab = document.getElementById("audio-tab");
audioTab.addEventListener('click',(evt) => {
    let tab = evt.target;
    highlightActiveTab(tab);
    populateAudioTab();
});