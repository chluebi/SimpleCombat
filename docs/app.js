Vue.component('filepicker-image', {
    props: ['info', 'selectedimage'],
    template: `
    <div v-if="info.image ? true : false" class="filepicker-image clickable hoverable"
    v-bind:class="info.id == selectedimage ? 'selected-image' : '' ">
        <img class="thumbnail" v-bind:src="info.image"/>
        <div class="image-name">{{ info.name }}</div>
    </div>`
})

Vue.component('token', {
    props: ['info', 'selectedtoken'],
    template: `<div v-if="info.assetId != -1 ? true : false" class="token" v-bind:tokenId="info.id"
    v-bind:class="info.id == selectedtoken ? 'selected-token' : '' "
    v-bind:style="{transform: 'translate(' + info.x + 'px,' + info.y + 'px) ' + 'rotate(' + info.orientation + ')',
        webkitTransform: 'translate(' + info.x + 'px,' + info.y + ' px) ' + 'rotate(' + info.orientation + ')',
        width: info.width,
        height: info.height,
        'z-index': info.z,
        opacity: info.opacity}"
    v-bind:data-x="info.x"
    v-bind:data-y="info.y">

        <img class="token-image" v-bind:src="info.image"/>
    </div>

    <div v-else-if="info.assetId == -1 ? true : false" class="token text-token" v-bind:tokenId="info.id"
    v-bind:class="info.id == selectedtoken ? 'selected-token' : '' "
    v-bind:style="{transform: 'translate(' + info.x + 'px,' + info.y + 'px) ' + 'rotate(' + info.orientation + ')',
        webkitTransform: 'translate(' + info.x + 'px,' + info.y + ' px) ' + 'rotate(' + info.orientation + ')',
        width: info.width,
        height: info.height,
        'z-index': info.z,
        opacity: info.opacity,
        color: info.color,
        'font-size': info.fontsize,
        border: '3px solid ' + info.bordercolor}"
    v-bind:data-x="info.x"
    v-bind:data-y="info.y">
        {{ info.text }}
    </div>`
  })

Vue.component('player', {
    props: ['info'],
    template: '<div class="player"> {{ info.name }} </div>'
})
  
var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        images: [
        ],
        selectedImage: -1,
        grid: {
            'width': 0,
            'height': 0,
            'offsetx': 0,
            'offsety': 0
        },
        background: {
            'empty': true,
            'image': '',
            'x':0,
            'y':0,
            'width':'500px',
            'height':'400px',
            'originalWidth':'500px',
            'originalHeight':'400px'
        },
        filepickerCurrentStatus: 'asset',
        filepickerText: 'help',
        filepickerStatus: {
            'background': {'text': 'Choose a Background Asset'},
            'asset': {'text': 'Choose an Asset to import as a Token'}
        },
        tokens: [
        ],
        selectedToken: -1,
        selectedTokenData: {},
        inviteLink: "https://google.com",
        players: [
            {'id': 0, 'name': 'player1'},
            {'id': 1, 'name': 'player2'}
        ]
    },
    methods: {
        getIndexbyId: function (list, id) {
            for (i in list) {
                if (list[i].id == id) {
                    return i;
                }
            }
            return -1;
        },
        closeFilePicker: function (event) {
            document.querySelector('#filepicker-overlay').style.display = 'none';
        },
        openFilePicker: function (event) {
            document.querySelector('#filepicker-overlay').style.display = 'grid';
            this.updateFilePickerText();
        },
        importBackground: function (event) {
            this.filepickerCurrentStatus = 'background';
            this.openFilePicker();
        },
        importAsset: function (event) {
            this.filepickerCurrentStatus = 'asset';
            this.openFilePicker();
        },
        loadImage: function (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            if (this.images.length == 0) {
                nextid = 0;
            }
            else {
                nextid = this.images[this.images.length-1].id + 1;
            }

            let nextImage = {
            'id': nextid,
            'name': file.name,
            'path':file.webkitRelativePath,
            'image': ''
            };
            this.images.push(nextImage);
            let images = this.images;
            let p = this;
            
            reader.addEventListener('load', function () {
                // convert image file to base64 string
                let img = new Image();
                img.src = reader.result;
                
                img.addEventListener('load', function () {
                    nextImage.image = reader.result;
                }, false)
            }, false); 
        },
        loadImageWrapper: function (event) {
            let file = event.target.file;
            this.loadImage(file)
        },
        loadImages: function (event) {
            let files = event.target.files;
            for (let i=0; i<files.length; i++) {
                file = files[i];
                this.loadImage(file);   
            };
        },
        unselectImage: function () {
            this.selectedImage = -1;
        },
        selectImage: function (id) {
            this.selectedImage = id;
        },
        updateFilePickerText: function () {
            this.filepickerText = this.filepickerStatus[this.filepickerCurrentStatus].text;
        },
        deleteTokensbyAssetId: function (id) {
            for (let i in this.tokens) {
                if (this.tokens[i].assetId == id) {
                    this.tokens.splice(i, 1);
                }
            }
        },
        deleteAsset: function () {
            if (this.selectedImage == -1) {
                return;
            }
            index = this.getIndexbyId(this.images, this.selectedImage);
            if (index > -1) {
                this.images.splice(index, 1);
            }
            this.deleteTokensbyAssetId(this.selectedImage);
            this.selectedImage == -1;
        },
        confirmFilePicker: function () {
            if (this.selectedImage == -1) {
                return;
            }

            if (this.filepickerCurrentStatus == 'background') {
                this.changeBackground(this.selectedImage);
            } else if (this.filepickerCurrentStatus == 'asset') {
                this.createAssetToken(this.selectedImage);
            }
            this.closeFilePicker()
        },
        updateGrid: function (event) {
            this.grid[event.target.name] = parseFloat(event.target.value);
            loadInteract();
        },
        changeBackground: function () {
            this.background.empty = false;
            index = this.getIndexbyId(this.images, this.selectedImage)
            this.background.image = this.images[index].image;
            let img = new Image();
            img.src = this.images[index].image;
            this.background.width = img.width;
            this.background.height = img.height;
            this.background.originalWidth = img.width;
            this.background.originalHeight = img.height;
        },
        createAssetToken: function () {
            index = this.getIndexbyId(this.images, this.selectedImage)
            this.tokens.push({
                'id': this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].id + 1 : 0,
                'assetId': this.selectedImage,
                'text': this.images[index].name,
                'image': this.images[index].image,
                'x': 0,
                'y': 0,
                'width': 100,
                'height': 100,
                'z':0,
                'orientation': '0deg',
                'opacity':1,
            })
        },
        createTextToken: function () {
            this.tokens.push({
                'id': this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].id + 1 : 0,
                'assetId': -1,
                'text': 'Token',
                'image': '',
                'x': 0,
                'y': 0,
                'width': 100,
                'height': 100,
                'z':0,
                'orientation': '0deg',
                'opacity':1,
                'fontsize':'12',
                'color': '#f5f054',
                'bordercolor': '#f5f054'
            })
            console.log(this.tokens)
        },
        updateSelectedToken: function () {
            index = this.getIndexbyId(this.tokens, this.selectedToken);
            this.selectedTokenData = this.tokens[index];
        },
        updateTokenValues: function (event) {
            index = this.getIndexbyId(this.tokens, this.selectedToken);
            if (event.target.name == 'orientation') {
                this.selectedTokenData[event.target.name] = event.target.value + 'deg';
            } else if (event.target.name == 'z') {
                this.selectedTokenData[event.target.name] = Math.max(0, Math.min(100, event.target.value));
            }
            else {
                this.selectedTokenData[event.target.name] = event.target.value;
            }
            this.tokens[index] = this.selectedTokenData;
            console.log('updated token values')
        },
        selectToken: function (id) {
            this.selectedToken = id;
            this.updateSelectedToken();
        },
        deleteToken: function (event) {
            index = this.getIndexbyId(this.tokens, this.selectedToken);
            this.tokens.splice(index, 1);
            this.selectedToken = -1;
        }
    }
})