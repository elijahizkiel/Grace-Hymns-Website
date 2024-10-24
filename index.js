class Music extends Audio {
    constructor(title, performer, author, type, lang){
        super( "./audios/amharic/"+title+".mp3");
        this.title = title;
        this.performer = performer;
        this.author = author;
        this.type = type;
        this.lang = lang;
    }
}
class Video extends HTMLVideoElement{
    constructor(title, performer, author, type, lang){
        super();
        this.title = title;
        this.performer = performer;
        this.author = author;
        this.type = type;
        this.lang = lang;
    }
}
customElements.define('video-player', Video, {extends: 'video'});
var playList = [];
let theme = 'light';
function createMediaControls(media, mediaCard){
    //add media controllers to the audio player section
    let mediaControls = document.createElement('div');
    mediaControls.className = 'media-controls';
    mediaControls.innerHTML=` <div class="control-btns">
        <span class="material-symbols-outlined control-btn prev-btn">skip_previous</span>
        <span class="material-symbols-outlined control-btn player-play-btn">pause_circle</span> 
        <span class="material-symbols-outlined control-btn next-btn">skip_next</span>
        <span class="material-symbols-outlined control-btn volume-mute">volume_up</span>
        <span class="control-btn volume-up">+</span>
        <span class="control-btn volume-indicator"></span>
        <span class="control-btn volume-down">-</span>
        </div>`;
    let volumeIndicator = mediaControls.querySelector('.volume-indicator');
    volumeIndicator.textContent = Math.floor(media.volume * 100) + '%';
    let time = document.createElement('p');
    time.classList = 'progress-time';
    // progress container
    let progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    //  progress indicator
    let progress = document.createElement('div');
    progress.className = 'progress-bar';

    // listening to media progress changes size of progress-bar
    media.addEventListener('timeupdate', () => {
            progressTimeMin = Math.floor(media.currentTime/60);
            progressTimeSec = Math.floor(media.currentTime - (progressTimeMin*60))
            progressTime = String(progressTimeMin).padStart(2,'0') + ':' + String(progressTimeSec).padStart(2,'0');
            totalDurationMinute = Math.floor(media.duration/60); 
            totalDurationSec = Math.floor(media.duration - (totalDurationMinute * 60));
            totalDuration = String(totalDurationMinute).padStart(2, '0') + ':' + String(totalDurationSec).padStart(2,'0');
            time.textContent = `${progressTime}/${totalDuration}`;
            progress.style.width =((media.currentTime / media.duration) * 100)+ '%';
    });

    playerPlayBTN = mediaControls.querySelector('.control-btns').querySelector('.player-play-btn');
    playerPlayBTN.textContent = media.paused? 'play_circle': 'pause_circle';
    media.addEventListener('pause', () => {
            mediaCard.querySelector('.play-btn').textContent = 'play_circle';
            playerPlayBTN.textContent = 'play_circle';
    })

    media.addEventListener('play', () => {
        mediaCard.querySelector('.play-btn').textContent = 'pause_circle';
        playerPlayBTN.textContent = 'pause_circle';
    })

    playerPlayBTN.addEventListener("click", (event) => {
            if(media.paused){
                media.play();
                event.target.textContent = 'pause_circle';
                mediaCard.querySelector('.play-btn').textContent = 'pause_circle';
            }else{
                media.pause();
                event.target.textContent ='play_circle';

                for(playButton in mediaCard.querySelectorAll('.play-btn')){
                    playButton.textContent = 'play_circle';
                }
            }
    });
    
    mediaControls.querySelector('.volume-up').addEventListener('click', () => {
        if(media.volume < 1) {media.volume = ((media.volume * 10) + 0.5)/10;}
        volumeIndicator.textContent = Math.floor(media.volume * 100) + '%';
    });

    mediaControls.querySelector('.volume-down').addEventListener('click', () => {
        if(media.volume >= 0) {media.volume = ((media.volume * 10) - 0.5)/10;}
        volumeIndicator.textContent = Math.floor(media.volume * 100) + '%';
    });

    progressContainer.append(progress);
    mediaControls.insertBefore(progressContainer, mediaControls.querySelector('.control-btns'));
    mediaControls.insertBefore(time, progressContainer);
    
    mediaControls.querySelector('.control-btns').querySelector('.next-btn')
      .addEventListener('click', () => {
        if(playList.length > 1 && playList.indexOf(media) < playList.length - 2){
            media.replaceWith(playList[playList.indexOf(media)++]);
        } else {
            media.currentTime = 0;
        }
    })

    mediaControls.querySelector('.control-btns').querySelector('.prev-btn')
      .addEventListener('click', () => {
        if(playList.length > 1 && playList.indexOf(media)){
            media.replaceWith(playList[playList.indexOf(media)--]);
        }
    });

    mediaControls.querySelector('.volume-mute').addEventListener('click', () => {
        media.muted = media.muted?false:true; 
        mediaControls.querySelector('.volume-mute').textContent = media.muted?'volume_off':'volume_up';
    });

    mediaControls.querySelector('.volume-mute').addEventListener('kbd', (event) => {
        // if()
    })
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
    
    // create and configure audio element
    if(media.type === 'audio'){
        var audio = document.createElement('audio');
        audio.src = `./audios/${media.lang}/${media.title}.mp3`;
    }else if(media.type === 'video'){
        var video = document.createElement('video');
        video.setAttribute('is','video-player');
        video.src = `./videos/${media.lang}/${media.title}.mp4`;
    }

    //creating and configuring play button
    playBtn = document.createElement("span");
    playBtn.classList= "play-btn material-symbols-outlined";
    playBtn.textContent = "play_circle";
    playBtn.addEventListener('click', async (event)=>{
        if(media.type == 'audio'){
            if(event.target.textContent == "play_circle"){
                //changing play btn to pause btn
                event.target.textContent = "pause_circle";
                
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
                    
                    // configuring media controls to control the audio
                    let audioControls = createMediaControls(audio, mediaCard);

                    // creating lyrics containing DOM element
                    let lyrics = document.createElement('div');
                    lyrics.innerHTML = (media.lyrics == undefined || media.lyrics == '' 
                        || media.lyrics == null)?"No lyrics": `<pre>${media.lyrics}</pre>`; 

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
                    audio.preload = true;
                    // audio.controls = true;
                    audio.play();
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
                    lyrics.innerHTML = (media.lyrics == undefined || media.lyrics == null 
                        || media.lyrics == '')? "No lyrics": `<pre>${media.lyrics}</pre>`;

                    // creating controlling btns for the audio
                    let audioControls = createMediaControls(audio, mediaCard);
                    
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
                    
                    audio.preload = true;
                    // audio.controls = true;
                    audio.play();
                }
            }else{
                // changing pause btn to play btn
                event.target.textContent = "play_circle";
                audio.pause();
            }
        }else if(media.type === 'video'){
            if(event.target.textContent == "play_circle"){
                // change play btn to pause btn
                event.target.textContent = "pause_circle";
                
                if(document.getElementById("video-tab").classList.contains('active')){
                    let videoPlayingSection = document.querySelector('.video-playing-section');
                    let videoPlayer = document.createElement('div');
                    videoPlayer.classList = 'video-player';
                    
                    videoControls = createMediaControls(video, mediaCard);
                    
                    videoPlayer.append(video, videoControls);

                    let videoInfo = document.createElement('div');
                    videoInfo.className = 'video-info';
                    videoInfo.innerHTML = `<p> ${media.title} - ${media.performer}</p>`;

                    videoPlayer.insertBefore(videoInfo, videoControls);

                    videoPlayingSection.hasChildNodes()?
                      videoPlayingSection.replaceChild(videoPlayer, 
                        videoPlayingSection.querySelector('.video-player')):
                      videoPlayingSection.append(videoPlayer);
                } else {
                    highlightActiveTab(document.getElementById('video-tab'));

                    let videoTab = await createVideoTab();
                    let videoPlayingSection = videoTab.querySelector('.video-playing-section');

                    document.querySelector('main').replaceWith(videoTab);

                    let videoPlayer = document.createElement('div');
                    videoPlayer.classList = 'video-player';
                    
                    videoControls = createMediaControls(video, mediaCard);
                    
                    videoPlayer.append(video, videoControls);

                    let videoInfo = document.createElement('div');
                    videoInfo.innerHTML = `<p> ${media.title} - ${media.performer}</p>`;

                    videoPlayer.insertBefore(videoInfo, videoControls);

                    videoPlayingSection.hasChildNodes(videoPlayer)?
                      videoPlayingSection.replaceChild(videoPlayer, 
                        videoPlayingSection.querySelector('.video-player')):
                      videoPlayingSection.append(videoPlayer);
                }

            }else {
                event.target.textContent = 'play_circle';
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

    if(theme == 'dark'){
        let elements = mediaCard.querySelectorAll('*');
        for(element of elements){
            element.classList.add('dark');
        }
    }
    return mediaCard;
}
async function getMediaInfo() {
    const request = new Request("Grace-Hymns-Website/JSON/Media.json");
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
            const audio = new Music(medium.title, medium.performer, medium.author, medium.type, medium.lang);
            musics.push(audio);
        }else if(medium.type === "video"){
            const video = new Video(medium.title, medium.performer, medium.author, medium.type, medium.lang);
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
    if(theme == 'dark') {
        audioListSection.classList.add('dark');
        audioLyricsSection.classList.add('dark');
        audioPlayingSection.classList.add('dark');
    }
    for await(medium of media){
        if (medium.type === 'audio'){
            let mediaCard = createMediaCard(medium);
            audioListSection.appendChild(mediaCard);
        }
    }
    
    mainAudioTab.append(audioListSection,audioPlayingSection, audioLyricsSection);
    
    return mainAudioTab;
}
async function createVideoTab() {
    // declaring tab and sections inside it
    let mainVideoTab = document.createElement('main');
    let videoListSection = document.createElement('section');
    let videoPlayingSection = document.createElement('section');

    // requesting infos about the media in storage
    let media = await getMediaInfo();

    // assign class for Elements
    videoListSection.classList = 'flex-container video-list-section';
    videoPlayingSection.classList = 'video-playing-section';
    if(theme == 'dark'){
        videoListSection.classList.add('dark');
        videoPlayingSection.classList.add('dark');
    }
    
    // populating the tab with media-cards of videos
    for await(medium of media){
        if(medium.type === 'video'){
            const mediaCard = createMediaCard(medium);
            videoListSection.appendChild(mediaCard);
        }
    }

    mainVideoTab.append(videoPlayingSection, videoListSection);
    return mainVideoTab;
}

async function populateTab(tab){
    let main = document.querySelector('main');// lookup the DOM element <main> and assign
    let newMain;
    if(tab == 'audio') {
        newMain = await createAudioTab();// create new <main> element for Audio tab
    } else if (tab == 'video'){
        newMain = await createVideoTab();// create new <main> element for video tab
    }
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

function darkMode() {
    theme = theme=='dark'? 'light': 'dark';
    const elements = document.querySelectorAll('*');
    for(element of elements){
        element.classList.toggle('dark');
    }
}

populateSamples();

var audioTab = document.getElementById("audio-tab");
audioTab.addEventListener('click',(evt) => {
    highlightActiveTab(evt.target);
    populateTab('audio');
});

var videoTab = document.getElementById('video-tab');
videoTab.addEventListener('click', (evt) => {
    highlightActiveTab(evt.target);
    populateTab('video');    
});
document.getElementById("theme-toggler").addEventListener('click', darkMode);