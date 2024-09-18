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

