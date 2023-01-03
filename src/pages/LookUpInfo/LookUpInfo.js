import { Search } from '@material-ui/icons';
import classNames from 'classnames/bind';
import style from './LookUpInfo.module.scss';
import Paper from '@material-ui/core/Paper';
import { Container } from 'reactstrap';

import {
    PagingState,
    IntegratedFiltering,
    IntegratedPaging,
} from '@devexpress/dx-react-grid';

import {
    Grid,
    VirtualTable,
    TableHeaderRow,
    PagingPanel,
    Toolbar
} from '@devexpress/dx-react-grid-material-ui';
//Authen
import { instanceOf } from 'prop-types';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Cookies, withCookies } from 'react-cookie';

import { Logout} from "../../utils/redux/actions/ActionLogin";
import { DisableSearchSN } from "../../utils/redux/actions/ActionSearchSN";

// var web_url = require('../url')
const pageSize = 50;

const columns = [
    { name: 'time', title: 'Time' },
    { name: 'tool', title: 'Tool' },
    { name: 'steps', title: 'Steps' },
    { name: 'result', title: 'Result' },
    { name: 'ipcountry', title: 'IP Country ' },
];

const columnExtensions = [

    { columnName: 'time', align: 'center', width: '250px' },
    { columnName: 'tool', align: 'center', width: '150px' },
    { columnName: 'steps', align: 'center', width: '450px' },
    { columnName: 'result', align: 'center', width: '250px' },
    { columnName: 'ipcountry', align: 'center', width: '250px' },
];
const cx = classNames.bind(style);


function ColorResult(data) {
    let check;
    let check1;
    if (data === "PASS") {
        check = true
        check1 = false
    } else if (data === "FAIL") {
        check = false
        check1 = false
    } else {
        check1 = true
    }
    return (
        <div>
            {check1 ? <span style={{ color: "#73879C", fontWeight: "700" }}>{data}</span> : (check ? <span style={{ color: "green", fontWeight: "700" }}>{data}</span> : <span style={{ color: "red", fontWeight: "700" }}>{data}</span>)}
        </div>
    )
}


function exportData(respData) {
    let exportData = [];

    respData.forEach((element) => {
        // console.log("nhatnt", element)
        exportData.push({
            'time': element.content.time.slice(0, 19),
            'tool': "Tool " + element.content.tool,
            'steps': element.content.step,
            'result': ColorResult(element.content.status),
            'ipcountry': element.ip,
        });
    });
    return exportData;
}


function getInfomationBySN(serialNumber, token) {
    var axios = require('axios');
    let url = 'http://10.1.110.30:81/device/step-test-info?serial_number=' + serialNumber


    return new Promise((resolve, reject) => {
        axios.get(url,
            {
                headers: { 'Authorization': 'Token 1bdd52efa42ec2a9f1d4ff15b183606de9018399' },
            })
            .then(resp => resolve(resp))
            .catch(error => reject(error))
    })
}

function LookUpInfo(props) {
    const [rows, setRows] = useState([]);
    const [show, setShow] = useState(false);
    const [serialNumber, setSerialNumber] = useState("");
    const [info, setInfo] = useState("");

    //Authen
    const [token, setToken] = useState('');
    const { loginState, timestamp } = useSelector(state => state.login)
    const { data, dataState } = useSelector(state => state.search)
    const timeRef = useRef(timestamp);
    const dispatch = useDispatch();


    const handleClickSearch = () => {
        if (serialNumber !== "") {
            getInfomationBySN(serialNumber, token)
                .then(resp => {
                    const data = resp.data.history
                    if (resp.status === 200) {
                        setRows(exportData(data))
                        setInfo(resp.data.serial_number)
                    } else {
                        console.log("error")
                    }

                })
                .catch(error => {
                    console.log(error)
                })
            setShow(true)
        }
    }

    const handleSerialNumber = event => {
        setSerialNumber(event.target.value)
    }

    useEffect(() => {
        if (new Date().getTime() - timeRef.current > 3600 * 1000) {
            dispatch(Logout())
            return
        }

        const { cookies } = props;

        let user = cookies.get("Authentication");
        if (user === "null") {
            user = JSON.parse(user);
        }
        if (user === undefined || user === null) {
            return;
        }
        setToken(user.accessToken)

        if (dataState) {
            setSerialNumber(data)
            getInfomationBySN(data, token)
                .then(resp => {
                    const data = resp.data.history
                    if (resp.status === 200) {
                        setRows(exportData(data))
                        setInfo(resp.data.serial_number)
                    } else {
                        console.log("error")
                    }

                })
                .catch(error => {
                    console.log(error)
                })
            setShow(true)
        }
        dispatch(DisableSearchSN())
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    function checkRole() {
        if (!loginState) {
            return <Redirect to='/login' />
        }
    }

    return (
        <div style={{ width: "100%" }}>
            {checkRole()}
            <div>
                <div className={cx('header')}>
                    <span > LOOK UP INFORMATION </span>
                </div>
                <div className={cx('container')} >
                    <div className={cx('input')}>
                        <Search style={{ margin: "10px 0px 10px 10px" }}></Search>
                        <input
                            className={cx('input-text')}
                            type='text'
                            placeholder='Serial Number'
                            value={serialNumber}
                            onChange={handleSerialNumber}
                        >
                        </input>
                    </div>
                    <button
                        className={cx('button-search')}
                        onClick={() => {
                            handleClickSearch();
                        }}
                    >
                        Search
                    </button>
                </div>

                {show && <div className={cx('info')}>
                    <div className={cx("text-box")}>
                        <span>SN:</span>
                        <span>{info}</span>
                    </div>
                    <div className={cx("text-box")}>
                        <span>ID Main Body:</span>
                        <span>0</span>
                    </div>
                    <div className={cx("text-box")}>
                        <span>ID JIG LCD:</span>
                        <span>0</span>
                    </div>
                    <div className={cx("text-box")}>
                        <span>ID JIG Main KeyBroad:</span>
                        <span>0</span>
                    </div>
                    <div className={cx("text-box")}>
                        <span>ID Transist:</span>
                        <span>0</span>
                    </div>
                </div>}

                {show && <div className={cx("table")}>
                    <Container>
                        <Paper elevation={3} style={{ padding: "0px 20px" }}>
                            <Grid
                                rows={rows}
                                columns={columns}
                            >
                                <IntegratedFiltering />
                                <PagingState
                                    defaultCurrentPage={0}
                                    pageSize={pageSize}
                                />
                                <IntegratedPaging />

                                <VirtualTable
                                    columnExtensions={columnExtensions}
                                    height="450px"
                                />

                                <TableHeaderRow />
                                <PagingPanel />
                                <Toolbar />
                            </Grid>
                        </Paper>
                    </Container>
                </div>}
            </div>
        </div>
    );
}

LookUpInfo.propTypes = {
    cookies: instanceOf(Cookies).isRequired
}

export default withCookies(LookUpInfo);