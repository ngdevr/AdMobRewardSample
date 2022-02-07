let emitter = new Phaser.Events.EventEmitter();

let launchGame = function () {
    let config = {
        type: Phaser.AUTO,
        scale: {
            parent: 'mygame3',
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio
        },
        autoResize: true,
        backgroundColor: 0xff5733,
        scene: [GameScene]
    }

    let game = new Phaser.Game(config);
};

class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }

    init(config) {
    }

    preload() {
    }

    create() {
        this.cameras.main.setBackgroundColor('#ff5733');

		this.rewardButton = this.add.text(100, 100, 'Click to view Reward Ad', { fontFamily: "Arial", color: "#fff", fontSize: 40, align: 'center' });
		this.rewardButton.setInteractive().on('pointerdown', () => this.confirmRewardPopup() );
		
		emitter.on('sendAward', this.onReward, this);
        emitter.on('sendAwardError', this.onRewardError, this);
        emitter.on('sendAwardClose', this.onRewardClose, this);

    }

    confirmRewardPopup(button) {
        let _self = this;
        _self.scene.pause();

        Swal.fire({
            animation: true,
            background: 'linear-gradient(#437186, rgb(26 63 80)) rgb(255, 255, 255)',
            html: "<br/><span style='font-size:1.2em; font-weight:400; color: #fbfaf7; text-shadow: 1px 1px 2px #3a3832;'>\nWatch the video and get your reward.</span><span style='font-size:0.75em; font-weight:400; color: #fbfaf7; text-shadow: 1px 1px 2px #3a3832;'><br/>Reward will be shown after the video.</span>",
            showCloseButton: false,
            showCancelButton: true,
            cancelButtonColor: 'rgb(253, 80, 80)',
            onClose: function () {
                _self.scene.resume("GameScene");
            },
            showConfirmButton: true,
            confirmButtonText: 'Yes, Show video',
            confirmButtonColor: '#18b3a4',
        }).then((result) => {
            if (result.value) {
                showReward();
            }
        });
    }
	
    onReward() {
        this.isReward = true;
        this.showRewardMessage();
    }

    onRewardClose() {
    }

    onRewardError() {

        let _self = this;
        _self.scene.pause();

        Swal.fire({
            animation: false,
            background: 'linear-gradient(#437186, rgb(26 63 80)) rgb(255, 255, 255)',
            html: "<br/><span style='font-size:1.2em; font-weight:400; color: #fbfaf7; text-shadow: 1px 1px 2px #3a3832;'>\nError while loading video. Check network connection.</span>",
            showCloseButton: true,
            showCancelButton: false,
            onClose: function () {
                _self.scene.resume("GameScene");
            }
        });
    }

    showRewardMessage() {
        let _self = this;

        _self.scene.pause();

        Swal.fire({
            animation: false,
            background: 'linear-gradient(#437186, rgb(26 63 80)) rgb(255, 255, 255)',
            html: "<br/><span style='font-size:1.2em; font-weight:400; color: #fbfaf7; text-shadow: 1px 1px 2px #3a3832;'>\nYou have got a reward.</span>",
            showCloseButton: true,
            showCancelButton: false,
            onClose: function () {
                _self.scene.resume("GameScene");
            }
        });
    }
	
}
