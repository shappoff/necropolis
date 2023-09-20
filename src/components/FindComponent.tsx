import {CSSProperties, default as React} from 'react';

import useDebounce from "./useDebounce";
import List from "./List";

const {
    applicationID, searchOnlyAPIKey, index_name
} = env;

const algoliasearch = require("algoliasearch");

const client = algoliasearch(applicationID, searchOnlyAPIKey);

const FindComponent = () => {
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [isTypoTolerance, setIsTypoTolerance] = React.useState<boolean>(true);
    const [hits, setHits] = React.useState<Array<any>>([]);
    const [facets, setFacets] = React.useState<any>({});

    const [currentAlgoliaIndex, setCurrentAlgoliaIndex] = React.useState(client.initIndex(index_name));

    const debouncedSearchTerm = useDebounce(searchTerm, 1000);

    const searchHandler = ({target}: any) => {
        setSearchTerm(target.value);
    }

    const keysHandler = (e: any) => {
        if (e.which == 27) {
            setSearchTerm('');
            setHits([]);
        }
    };

    React.useEffect(() => {
        currentAlgoliaIndex.search('', {
            hitsPerPage: 0,
            facets: ["*"]
        })
            .then(({facets, nbHits}: any) => {
                setFacets(facets);
            });
    }, []);

    React.useEffect(() => {
        currentAlgoliaIndex.search(debouncedSearchTerm, {
            facets: ["*"],
            typoTolerance: isTypoTolerance,
            facetFilters: [

            ]
        })
            .then(({hits, facets}: any) => {
                if (debouncedSearchTerm.length > 1) {
                    setHits(hits);
                    const locationsArrFiltered: Array<any> = [];
                }
            });
    }, [debouncedSearchTerm, isTypoTolerance]);

    return (
        <>
            <div className="filter-panel">
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
                           onChange={(e: any) => setIsTypoTolerance(!e.target.checked)} />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Точный поиск</label>
                </div>
            </div>
            <input autoFocus onInput={searchHandler} onChange={keysHandler} type="text" value={searchTerm} id="input" placeholder="Фамилия, Имя, Отчество"/>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a className={'nav-link active'}
                       onClick={() => {
                           // route && route.add(HASH_MAP.isMap, '');
                           // setIsMap(false);
                       }}
                       aria-current="page"
                       href="#">Таблица результатов</a>
                </li>
                <li className="nav-item">
                    <a className={'nav-link'}
                       onClick={() => {
                           // setIsMap(true);
                           // route && route.add(HASH_MAP.isMap, '1');
                       }}
                       aria-current="page"
                       href="#">Карта результатов</a>
                </li>
            </ul>
            {(() => {

                return <List hits={hits} />
            })()}
        </>
    );
};

export default FindComponent;