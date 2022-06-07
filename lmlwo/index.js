import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Label, Popup } from 'semantic-ui-react';
import browserHistory from '../../../utils/history';
import { Link } from 'react-router-dom';
import { centerH } from '../templates/helper';
import './style.css';
import MainPage from '../templates/MainPageTemplate';
import { momentToString, stringToMoment } from '../../../utils/helpers';
import { fetchList, clearList } from './actions';
require('moment/locale/ru');

// Списание материалов
const Lmlwo = props => {
    const {
        intl: { messages },
        list = [],
    } = props;

    React.useEffect(() => {
        props.fetchList();
    }, []);

    const columns = [
        {
            Header: () => centerH('#'),
            accessor: 'number',
            sortable: false,
            width: 50,
            Cell: num => <div style={{ paddingLeft: 28-Math.floor((num.index+1)/10)*7 }}>{num.index+1}</div>
        },
        {
            Header: '№',
            accessor: 'regNumber',
            maxWidth: 100,
            sortable: false,
            Cell: row => centerH(
                <Link to={`/marketing/mainoperation/mmcv?contractNumber=${row.value}`}>
                    <span
                        style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                    >
                        {row.value}
                    </span>
                </Link>)
        },
        {
            Header: 'Склад отправитель',
            accessor: 'fromWerksName',
            style: { whiteSpace: 'unset' },
            sortable: false,
            Cell: row => row.value
        },
        {
            Header: 'Автор',
            accessor: 'lastname',
            sortable: false,
            style: { whiteSpace: 'unset' },
            Cell: row => row.value
        },
        {
            Header: 'Дата создания',
            accessor: 'createdAt',
            sortable: false,
            width: 150,
            Cell: row => centerH(momentToString(row.value, 'DD.MM.YYYY HH:mm'))
        },
        {
            Header: 'Статус',
            accessor: 'statusName',
            sortable: false,
            width: 150,
            // getProps: (state, rowInfo) =>({
            //         style: {
            //             // background: rowInfo?.original?.statusId === 1? 'green' : 'red',
            //             fontWeight: 'bold',
            //             color: rowInfo?.original?.statusId === 1? 'green' : 'red'}}
            // ),
            Cell: ({ original }) => (
                <div className="cellFlexCenter">
                    <Label
                        as="span"
                        color={original.statusId === 1 ? 'green' : 'red'}
                        tag
                    >
                        {original.statusName}
                    </Label>
                </div>
            ),
        },
        {
            Header: 'Примечание',
            accessor: 'note',
            sortable: false,
            style: { whiteSpace: 'unset' },
            Cell: row => row.value
        },
        {
            Header: messages['Table.Actions'],
            accessor: 'id',
            maxWidth: 150,
            sortable: false,
            Cell: row => centerH(
                <div className="cellFlexCenter">
                    <Popup
                        content="Просмотр"
                        trigger={
                            <Button
                                icon
                                color="blue"
                                size="mini"
                                onClick={() => {
                                    browserHistory.push(
                                        `/logistics/mainoperation/lmlwo/document?action=view&ID=${row.value}`,
                                    );
                                }}
                            >
                                Просмотр
                            </Button>
                        }
                    />
                </div>)
        }
    ];
    return (
        <MainPage
            list={props.list.map((item=>({...item, createdAt: stringToMoment(item.createdAt, 'DD.MM.YYYY HH:mm')})))}
            transaction={{name: 'lmlwo', title: 'LMLWO: Списание по потере'}}
            columns={columns}
            filterBy={[
                {title: '№'                , accessor: 'regNumber'    , type: 'input'      },
                {title: 'Склад отправитель', accessor: 'fromWerksName', type: 'multiOption'},
                {title: 'Автор'            , accessor: 'lastname'     , type: 'input'      },
                {title: 'Дата создания от' , accessor: 'createdAt'    , type: 'dateFrom'   },
                {title: 'Дата создания до' , accessor: 'createdAt'    , type: 'dateTo'     },
                {title: 'Примечание'       , accessor: 'note'         , type: 'input'      },
            ]}
        />
    );
};

function mapStateToProps(state) {
    return {
        list: state.lmlwoReducer.list,
    };
}

export default connect(mapStateToProps, {
    fetchList,
    clearList,
})(injectIntl(Lmlwo));
