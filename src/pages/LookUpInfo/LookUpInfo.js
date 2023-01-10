import { Search } from '@material-ui/icons';
import classNames from 'classnames/bind';
import style from './LookUpInfo.module.scss';
import Paper from '@material-ui/core/Paper';
import { Container } from 'reactstrap';
import SideMenu from "../../app/Sidemenu"


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

import { Logout } from "../../utils/redux/actions/ActionLogin";
import { DisableSearchSN } from "../../utils/redux/actions/ActionSearchSN";

var web_url = require('../../url')
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


function DataSteps(data) {
    var arrData = [];
    arrData.push(data.split("\r\n"))

    const newArrData = arrData[0].filter(item => item !== "")
    console.log("arrData", newArrData)

    return (
        newArrData.map((arrData, index) => {
            let data = arrData.split(" ")
            let score = data[2].split(":")
            console.log(data)
            return (
                <div style={{ display: "flex", justifyContent: "flex-start", marginLeft: "100px" }}>
                    <table style={{ border: "1", fontSize: "15px", alignItems: "flex-start" }}>

                        <tr style={{ marginTop: "10px", fontWeight: "700" }}>
                            <td style={{ width: "80px" }} >FILE {index + 1}:</td>
                            <td ></td>
                            <td ></td>
                        </tr>

                        <tr>
                            <td ></td>
                            <td style={{ fontWeight: "700", width: "80px" }}>Name:</td>
                            <td style={{ width: "300px" }} >{data[0]}</td>
                        </tr>

                        <tr style={{ marginTop: "10px" }}>
                            <td></td>
                            <td style={{ marginLeft: "5px", fontWeight: "700", width: "80px" }} >Result:</td>
                            <td style={{ width: "300px" }} >{ColorResult(data[1])}</td>
                        </tr>
                        <tr style={{ marginTop: "10px" }}>
                            <td></td>
                            <td style={{ marginLeft: "5px", fontWeight: "700", width: "80px" }} >Score:</td>
                            <td style={{ width: "300px" }}>{score[1]}</td>
                        </tr>
                    </table>
                </div>
            )
        })

    )
}


function exportData(respData) {
    let exportData = [];

    respData.forEach((element) => {
        // console.log("nhatnt", element)


        if (element.content.tool === "audio_jig") {
            exportData.push({
                'time': element.content.time.slice(0, 19),
                'tool': "Tool " + element.content.tool,
                'steps': DataSteps(element.content.step),
                'result': ColorResult(element.content.status),
                'ipcountry': element.ip,
            });
        } else {
            exportData.push({
                'time': element.content.time.slice(0, 19),
                'tool': "Tool " + element.content.tool,
                'steps': element.content.step,
                'result': ColorResult(element.content.status),
                'ipcountry': element.ip,
            });
        }

    });
    return exportData;
}


function getInfomationBySN(serialNumber, token) {
    var axios = require('axios');
    let url = web_url.get_infomation_by_SN + serialNumber

    return new Promise((resolve, reject) => {
        axios.get(url,
            {
                headers: { 'Authorization': 'Token ' + token },
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

    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (token !== "") {
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
        }
    }, [token])// eslint-disable-line react-hooks/exhaustive-deps


    function checkRole() {
        if (!loginState) {
            return <Redirect to='/login' />
        }
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                {checkRole()}
                <div style={{ flex: "1" }}>
                    <SideMenu />
                </div>

                <div style={{ flex: "5", height: "100vh" }}>
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
                                            height="calc(100vh - 520px)"
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
            </div>
        </div>
    );
}

LookUpInfo.propTypes = {
    cookies: instanceOf(Cookies).isRequired
}

export default withCookies(LookUpInfo);