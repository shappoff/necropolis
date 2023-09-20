import React from 'react';
declare const env: any;
declare const google: any;

const {
    applicationID, searchOnlyAPIKey, index_name
} = env;


const algoliasearch = require("algoliasearch");

const client = algoliasearch(applicationID, searchOnlyAPIKey);

export const GoogeInfoMap: React.FC<any> = () => {
    const [hits, setHits] = React.useState<Array<any>>([]);
    const [markers, setMarkers] = React.useState<Array<any>>([]);

    React.useEffect(() => {

        const uluru = { lat: -25.344, lng: 131.031 };
        // The map, centered at Uluru
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 4,
            center: uluru,
        });
        // The marker, positioned at Uluru
        const marker = new google.maps.Marker({
            position: uluru,
            map: map,
        });

        const locationsIndex = client.initIndex('locations');
        locationsIndex.search('', {})
            .then(({hits}: any) => {
                setHits(hits);
            });
    }, []);

    React.useEffect(() => {
        if (!hits || (hits && !hits.length)) {
            return
        }

        let lanArr = [];
        let latArr = [];


        const ch: any = hits.map((hit: any) => {
            const {title, coords, stats} = hit;
            const statsArr = [];
            let count = 0;
            for (const statsKey in stats) {
                count += stats[statsKey];
                statsArr.push({
                    year: statsKey,
                    count: stats[statsKey]
                });
            }
            if (coords) {
                const [lat, lang] = coords;
                lanArr.push(lang);
                latArr.push(lat);
                return {
                    title,
                    coords,
                    stats: statsArr,
                    count
                }
            } else {
                return hit
            }
        }).filter((d) => d && d.coords.length);
        setMarkers(ch);
    }, [hits]);

    const defaultProps = {
        center: {
            lat: 54.339248,
            lng: 29.399810
        },
        zoom: 11
    };

    return null
};