const frpg = (function() {
    const toInteger = (value) => parseInt(value.replace(/,/g, ''));

    const viewMain = {
        observer: new MutationObserver(() => {
            initActivity(viewMain.currentPage());
        }),
        nodeTarget: () => document.querySelector('.view.view-main'),
        currentPage: () => viewMain.nodeTarget().getAttribute('data-page'),
        observe: () => viewMain.observer.observe(
            viewMain.nodeTarget(), {
                attibutes: true,
                attributeFilter: ['data-page'],
            }),
    };

    const fishInWater = {
        observer: new MutationObserver((mutationsList) => {
            for(const mutation of mutationsList) {
                const target = mutation.target;

                if(target.style.opacity === '1' && mutation.oldValue === 'display: inline;') {
                    const streak = toInteger(document.querySelector('.col-60 strong').textContent);
                    const catchLength = fishInWater.nodeTarget() ? fishInWater.nodeTarget().querySelectorAll('.catch').length : 0;
                    let catchLoop = 2;

                    if(streak > 500) {
                        return target.click();
                    }

                    if(catchLength > 1) {
                        catchLoop = 0;
                    }

                    for(let f = 0; f <= catchLoop; f++) {
                        const speed = f * 1000;

                        setTimeout(() => document.querySelector('.fishcaught').click(), speed);
                    }
                }
            }
        }),
        nodeTarget: () => document.getElementById('fishinwater'),
        observe: () => {
            if(fishInWater.nodeTarget()) {
                fishInWater.observer.observe(
                    fishInWater.nodeTarget(), {
                        childList: true,
                        subtree: true,
                        attibutes: true,
                        attributeFilter: ['style'],
                        attributeOldValue: true,
                    }
                    )
            }
        }
    }

    const docBody = {
        observer: new MutationObserver(async () => {
            const modalIn = document.querySelector('.modal.modal-in');

            if(
                modalIn
                && modalIn.querySelector('.modal-title').textContent === 'You caught something!'
                && viewMain.currentPage() === 'fishing'
            ) {
                modalIn.querySelector('.modal-button').click();
            }
        }),
        observe: () => docBody.observer.observe(
            document.body, {
                childList: true,
            }),
    };


    const exploreStamina = {
        observer: new MutationObserver(() => {
            const stamina = toInteger(exploreStamina.nodeTarget().textContent);

            if (stamina > 0) {
                document.querySelector('.explorebtn').click();
            }
        }),
        nodeTarget: () => document.getElementById('stamina'),
        observe: () => exploreStamina.observer.observe(
            exploreStamina.nodeTarget(), {
                childList: true,
            }),
    }

    const initActivity = (page) => {
        if(page === 'fishing') {
            return fishInWater.observe();
        }

        if(page === 'area') {
            return exploreStamina.observe();
        }

        fishInWater.observer.disconnect();
        exploreStamina.observer.disconnect();
    }

    const init = () => {
        docBody.observe();
        viewMain.observe();

        initActivity(viewMain.currentPage());
    };

    return {
        init,
    };

})();

frpg.init();
