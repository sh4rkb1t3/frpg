import fishing from './fishing';
import explore from './explore';

const target = () => document.querySelector('.view.view-main');

const config = {
    attibutes: true,
    attributeFilter: ['data-page'],
};

const callback = () => {
    const { page } = target().dataset;

    if(page === 'fishing') {
        return fishing.init();
    }

    if(page === 'area') {
        return explore.observe();
    }

    fishing.destroy();
    explore.disconnect();
};

const observer = new MutationObserver(callback);

const observe = () => observer.observe(target(), config);
// const disconnect = () => observer.disconnect();

const init = () => {
    observe();
    callback();
};

export default { init };
