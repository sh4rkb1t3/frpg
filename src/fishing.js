import { toInteger } from './helpers';

const handleFishCaught = () => new Promise((resolve) => {
    const { id } = document.querySelector('.fishcaught').dataset;
    const randomnumber = Math.floor(Math.random() * 500000);

    $.ajax({
        url: 'worker.php?go=fishcaught&id='+ id +'&r='+ randomnumber,
        method: 'POST'
    }).done(() => resolve());
});

const handleCargeBait = () => new Promise((resolve) => $.ajax({
    url: 'worker.php?go=chargebait',
    method: 'POST'
}).done(() => resolve()));

const listener = async (e) => {
    e.preventDefault();

    const col60El = document.querySelector('.col-60');
    const streakEl = col60El.querySelector('strong');
    const remainingBaitEl = document.querySelector('.col-40 strong');

    if(e.target == col60El) {
        let streak = toInteger(streakEl.textContent);
        let remainingBait = toInteger(remainingBaitEl.textContent);

        myApp.showIndicator();

        while (remainingBait > 0) {
            if(streak > 1000) {
                await handleCargeBait();
                streak = 0;
            } else {
                await handleFishCaught();
                streak++;
            }

            remainingBait--;
            remainingBaitEl.textContent = remainingBait;
            streakEl.textContent = streak;
        }

        // save current scroll before page refresh
        currentScroll = $$(mainView.activePage.container).find('.page-content').scrollTop();

        // refreshes both this page and prev page
        mainView.router.refreshPage();
    }
};

const init = () => document.body.addEventListener('click', listener);
const destroy = () => document.body.removeEventListener('click', listener);

export default { init, destroy };
