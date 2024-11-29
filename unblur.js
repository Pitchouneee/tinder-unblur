class TinderUnblur {
    constructor() {
        this.apiBaseUrl = 'https://api.gotinder.com/v2/fast-match/teasers';
        this.previewBaseUrl = 'https://preview.gotinder.com/';
    }

    async fetchTeasers() {
        try {
            const response = await fetch(this.apiBaseUrl, {
                headers: {
                    'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                    'platform': 'android'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data.data.results || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des teasers:', error);
            return [];
        }
    }

    getImageUrl(user) {
        if (!user || !user.photos || user.photos.length === 0) {
            return null;
        }
        return `${this.previewBaseUrl}${user._id}/original_${user.photos[0].id}.jpeg`;
    }


    async unblur() {
        try {
            const teasers = await this.fetchTeasers();
            const teaserEls = document.querySelectorAll('.Expand.enterAnimationContainer > div:nth-child(1)');

            teasers.forEach((teaser, index) => {
                if (index >= teaserEls.length) return;

                const teaserEl = teaserEls[index];
                const imageUrl = this.getImageUrl(teaser.user);

                if (imageUrl) {
                    teaserEl.style.backgroundImage = `url(${imageUrl})`;
                }
            });
        } catch (error) {
            console.error('Erreur lors du défloutage:', error);
        }
    }
}

const tinderUnblur = new TinderUnblur();
tinderUnblur.unblur();