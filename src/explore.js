import { toInteger } from './helpers';

const target = () => document.getElementById('stamina');

const config = {
    childList: true,
};

const callback = () => {
    const stamina = toInteger(target().textContent);
    const exploreBtn = document.querySelector('.explorebtn');

    if (stamina > 0) {
        exploreBtn.click();
    }
};

const observer = new MutationObserver(callback);

const observe = () => {
    observer.observe(target(), config);
};
const disconnect = () => observer.disconnect();

export default { observe, disconnect };
