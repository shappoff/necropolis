import {default as React} from 'react';
import IconInfo from '../icons/info-tooltip.svg';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const List: React.FC<any> = ({hits}: any) => {

    return (
        <>
            {
                hits.length ? <table className="table table-striped">
                        <thead className="desktop-version">
                        <tr>
                            <th>род.</th>
                            <th>ум.</th>
                            <th>ФИО</th>
                            <th>Кладбище</th>
                            <th>Заметки</th>
                            <th>Родство</th>
                        </tr>
                        </thead>
                        <tbody id="list-of-res">
                        {
                            hits.sort((a: any, b: any) => a.fio.localeCompare(b.fio)).map((hits: any, index: number) => {
                                const {nmb, np, raion, oblast, bornsurname, surname, name, patronymic, born, died, note, relationship, fio, _highlightResult} = hits;
                                const placeTooltipDescription = `${raion} район, ${oblast} область`;

const infoMobile = `
${note};
`;

                                return (
                                    <tr key={index} className="born-item">
                                        <td className="born-name-tr">
                                            <i className="mobile-version">род.: </i>
                                            <span>{born}</span>
                                        </td>
                                        <td className="born-name-tr">
                                            <i className="mobile-version">ум.: </i>
                                            <span>{died}</span>
                                        </td>
                                        <td className="born-name-tr">
                                            <i className="mobile-version">ФИО: </i>
                                            <span dangerouslySetInnerHTML={{__html: _highlightResult?.fio?.value}} />
                                        </td>
                                        <td className="td-place-location">

                                            <OverlayTrigger
                                                placement={'right'}
                                                overlay={<Tooltip id={`tooltip-rigth`}>{placeTooltipDescription}</Tooltip>}
                                            >
                                                <span>
                                                    <span>{np}</span>
                                                    <svg id="Layer_1"
                                                         data-name="Layer 1"
                                                         style={{width: '2px', marginLeft: '5px'}}
                                                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 122.88">
                                                        <path className="cls-1"
                                                              d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Zm0,92.93a15,15,0,1,1-15,15,15,15,0,0,1,15-15Zm0-46.47a15,15,0,1,1-15,15,15,15,0,0,1,15-15Z"/>
                                                    </svg>
                                                </span>
                                            </OverlayTrigger>

                                        </td>
                                        <td className="mobile-version">
                                            <OverlayTrigger
                                                placement={'auto'}
                                                overlay={<Tooltip id={`tooltip-left`}>{infoMobile}</Tooltip>}
                                            >
                                                <img title={infoMobile} alt={infoMobile} src={IconInfo}/>
                                            </OverlayTrigger>
                                        </td>
                                        <td className="note-info">{
                                            note ?
                                                <OverlayTrigger
                                                    placement={'left'}
                                                    overlay={<Tooltip id={`tooltip-left`}>{note}</Tooltip>}
                                                >
                                                    <img src={IconInfo}/>
                                                </OverlayTrigger>
                                                : null
                                        }</td>
                                        <td className="note-info">{
                                            relationship ?
                                                <OverlayTrigger
                                                    placement={'left'}
                                                    overlay={<Tooltip id={`tooltip-left`}>{relationship}</Tooltip>}
                                                >
                                                    <img src={IconInfo}/>
                                                </OverlayTrigger>
                                                : null
                                        }</td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>
                    : null
            }

        </>
    );

};

export default List;