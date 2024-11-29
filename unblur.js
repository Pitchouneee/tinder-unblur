class TinderUnblur {
    constructor() {
        this.apiBaseUrl = 'https://api.gotinder.com/v2/fast-match/teasers';
        this.previewBaseUrl = 'https://preview.gotinder.com/';
    }

    /**
    * Retrieve profile teasers from the Tinder API
    * @returns {Promise<Array>} List of teasers
    */
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
            console.error('Error retrieving teasers:', error);
            return [];
        }
    }

    /**
    * Builds the URL of the teaser image
    * @param {Object} user - Teaser user object
    * @returns {string} Image URL
    */
    getImageUrl(user) {
        if (!user || !user.photos || user.photos.length === 0) {
            return null;
        }
        return `${this.previewBaseUrl}${user._id}/original_${user.photos[0].id}.jpeg`;
    }

    /**
    * Unblur images
    */
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
            console.error('Error during unblur:', error);
        }
    }
}

const tinderUnblur = new TinderUnblur();
tinderUnblur.unblur();