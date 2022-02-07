// reward
let rewardVideoLoaded = false;
let rewardVideoRequestCount = 0;
let sendReward = false;
let showRewardCalled = false;

let rewardAdId = 'ca-app-pub-3940256099942544/5224354917';
// reward video
let rewarded;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    initAd();
    launchGame();
}

//initialize the goodies
function initAd() {
    try {
        if (admob) {
            prepareReward();
        }
    } catch (err) {
    }
}

function prepareReward(canShow) {
    try {
        if (admob) {
            if(!rewarded){
                rewarded = new admob.RewardedAd({ adUnitId: rewardAdId });

                rewarded.on('load', (evt) => {    
                    rewardVideoLoaded = true;
                    showRewardCalled = false;
                });

                rewarded.on('loadfail', (evt) => {    
                    // if load has failed once try one more time
                    if (rewardVideoRequestCount === 1) {
                        prepareReward();
                    }
                    // called from game and failed, take some action
                    if (showRewardCalled) {
                        showRewardCalled = false;
                        if(emitter)
                            emitter.emit('sendAwardError');
                    }
                });

                rewarded.on('reward', (evt) => {    
                    sendReward = true;
                });

                rewarded.on('dismiss', (evt) => {    
                    rewardVideoLoaded = false;
                    rewardVideoRequestCount = 0;
                    if (sendReward) {
                        sendReward = false;
                        if(emitter)
                            emitter.emit('sendAward');
                    } else {
                        if(emitter)
                            emitter.emit('sendAwardClose');
                    }
                });
            }

            rewardVideoRequestCount++;

            if(canShow){
                rewarded.load().then(function (result) {
                    rewardVideoRequestCount = 0;
                    rewarded.show();
                });
            } else{
                rewarded.load();
            }
        }
    } catch (err) { }
}

function showReward() {
    try {
        if (admob) {
            showRewardCalled = true;
            if (rewardVideoLoaded) {
                rewardVideoRequestCount = 0;
                rewarded.show();
            } else {
                rewardVideoRequestCount = 0;
                prepareAndShowReward();
            }
        }
    } catch (err) { }
}

function prepareAndShowReward() {
    try {
        if (admob) {
            prepareReward(true);
        }
    } catch (err) { }
}
