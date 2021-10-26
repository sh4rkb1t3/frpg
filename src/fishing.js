import { toInteger } from './helpers';

let pageInit = false;
const goFishingId = 'go-fishing';
const target = () => document.getElementById('baitarea');
const goFishing = () => document.getElementById(goFishingId);

const getRemainingBait = () => toInteger(document.querySelector('.col-40 strong').textContent);

const reloadBait = () => $('#baitarea').load('worker.php?go=baitarea&id='+ zone_id, () => {});

const chargebait = () => $.ajax({
    url: 'worker.php?go=chargebait',
    method: 'POST'
}).done(function() {
    attcatch = 0;
    reloadBait();
});

const caughtFish = () => {
    const { id } = document.querySelector('.fishcaught').dataset;

    // pause spot fish
    attcatch = 1;

    $.ajax({
        url: 'worker.php?go=fishcaught&id='+ id,
        method: 'POST'
    })
    .done(function(data) {
        let title = 'You caught something!';
        const $consoleTxt = $('#consoletxt');

        if (data == '') {
            data = '<br/>Out of bait...';
            title = 'Sorry!';
        }

        // display results
        $consoleTxt.fadeOut(10, function() {
            // display data
            $consoleTxt.hide();
            $consoleTxt.html("<br/><span style='font-size:11px'>"+ title +'</span><br/>'+ data);
            $consoleTxt.fadeIn(250);
        });

        // need to reload buttons
        // reloadBait
        reloadBait();
        // fishcount
        $('#fishcount').load('worker.php?go=fishcount', () => {});
        // getProgress
        $('#pbzone').load('worker.php?go=fishingprogressxp', function() {
            const progress = $('.progressbar').data('progress');
            myApp.setProgressbar('.progressbar', progress);
        });
        // getStats
        // $('#statszone').load('worker.php?go=getstats', () => {});
    });
}

const createFishingElement = () => {
    const parentEl = document.querySelector(".page[data-page='fishing'] .content-block");
    const currentEl = goFishing();

    if(getRemainingBait() < 1 || !parentEl || currentEl) return;

    const el = document.createElement('div');

    el.id = goFishingId;
    el.classList.add('card');
    el.innerHTML = `
        <div class='card-content'>
            <div class="card-content">
                <div class="list-block">
                    <ul>
                        <li>
                            <a href="#" class="item-link">
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title">Go Fishing!</div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;
    el.addEventListener('click', goFishingListener);

    parentEl.insertBefore(el, parentEl.childNodes[7]);
}

const goFishingListener = (e) => {
    e.preventDefault();

    if(pageInit) {
        pageInit = false;
    }

    document.querySelector('.fishcaught').click();
};

const config = {
    childList: true,
};

const callback = () => {
    const bait = getRemainingBait();
    const streak = toInteger(document.querySelector('.col-60 strong').textContent);

    if(pageInit) return;

    if(bait < 1) return mainView.router.refreshPage();

    if(streak >= 3000) return chargebait();

    caughtFish();
};

const observer = new MutationObserver(callback);

const init = () => {
    pageInit = true;
    createFishingElement();
    observer.observe(target(), config);
}

const destroy = () => {
    const el = goFishing();

    if(el) {
        goFishing().removeEventListener('click', goFishingListener);
    }

    observer.disconnect();
}

export default { init, destroy };
