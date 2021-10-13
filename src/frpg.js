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
                const el = mutation.target;

                if(el.style.opacity === '1' && mutation.oldValue === 'display: inline;') {
                    const streak = toInteger(document.querySelector('.col-60 strong').textContent);

                    if(streak < 500) {
                        return document.querySelector('.fishcaught').click();
                    }

                    el.click();
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

            if(modalIn && viewMain.currentPage() === 'fishing') {
                setTimeout(() => modalIn.querySelector('.modal-button').click(), 500);
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
