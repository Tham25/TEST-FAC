import moment from 'moment';
import classNames from 'classnames/bind';
import style from './Statistics.module.scss';
import Paper from '@material-ui/core/Paper';
import { Container } from 'reactstrap';
import CircularProgress from '@mui/material/CircularProgress';
import CustomNotification from "../../element/CustomNotification/notification";
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
import React, { useEffect, useState } from 'react';
import { Dialog, TextField } from '@material-ui/core';
import { ArrowRightAlt, Close } from '@material-ui/icons';
import Slide from '@mui/material/Slide';

//Authen
import { instanceOf } from 'prop-types';
import { Logout } from "../../utils/redux/actions/ActionLogin";
import { SearchSN } from "../../utils/redux/actions/ActionSearchSN";
import { Redirect } from 'react-router-dom';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Cookies, withCookies } from 'react-cookie';
import { Autocomplete } from '@material-ui/lab';
var web_url = require('../../url')

const columns = [
    { name: 'stt', title: 'STT' },
    { name: 'tooltype', title: 'Catalog' },
    { name: 'total', title: 'Total' },
    { name: 'pass', title: 'Pass' },
    { name: 'failed', title: 'Failed ' },
    { name: 'start', title: 'Unknown' },
];

const columnExtensions = [

    { columnName: 'stt', align: 'center', width: '80px' },
    { columnName: 'tooltype', align: 'center', width: '290px' },
    { columnName: 'total', align: 'center', width: '200px' },
    { columnName: 'pass', align: 'center', width: '300px' },
    { columnName: 'failed', align: 'center', width: '250px' },
    { columnName: 'start', align: 'center', width: '250px' },

];

const optionsTime = ['Today', 'Yesterday', 'Last 1 Weeks', 'Last 1 Months', 'Last 1 Quarter', 'Last 1 Year', "Time Custom"];

const optionsLoto = ['All'];

const cx = classNames.bind(style);


function Data(data, handleShow) {
    return (
        <button
            className={cx("button-show-data")}
            onClick={() => handleShow(data)}
        >
            <span>{data}</span>
        </button>
    )
}

function GetTime(timeOption, number) {
    let time = new Date();
    let fullDate;
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let date = time.getDate()
    let hour = time.getHours()
    let minute = time.getMinutes()


    if (timeOption === "Today") {
        date = date - number;
        hour = 0;
        minute = 0;
    }
    else if (timeOption === "Yesterday") {
        date = date - number;
        hour = 0;
        minute = 0;
    }
    else if (timeOption === "Last 1 Weeks") {
        let endOfMonth = moment().clone().subtract(7, 'days').endOf('month').format('YYYY-MM-DD');
        let dateTemp = date - number;
        if (date === 7) {
            date = 1
        }
        if (date < 7 && dateTemp < 0) {
            date = endOfMonth.slice(8, 10) - (number - date)
            if (month === 1) {
                month = 12
                year = year - 1
            } else {
                month = month - 1
            }

        }
        hour = 0;
        minute = 0;
    }
    else if (timeOption === "Last 1 Months") {
        month = month - number;
        if (month === 0) {
            month = 12;
            year = year - 1;
        }
        hour = 0;
        minute = 0;
    } else if (timeOption === "Last 1 Quarter") {
        let monthTemp = month - number;
        console.log("nhatnt12", month)
        if (month === 3 && monthTemp === 0) {
            month = 1;
        }
        if (month < 3 && monthTemp < 0) {
            month = 12 - (number - month);
            year = year - 1;
        }
        hour = 0;
        minute = 0;
    } else if (timeOption === "Last 1 Year") {
        year = year - number;
        hour = 0;
        minute = 0;
    }

    if (date < 10) {
        date = "0" + date
    }
    if (month < 10) {
        month = "0" + month
    }

    if (hour < 10) {
        hour = "0" + hour
    }

    if (minute < 10) {
        minute = "0" + minute
    }

    fullDate = year + "-" + month + "-" + date + "T" + hour + ":" + minute
    return fullDate
}

function GetLoto(token) {
    var axios = require('axios');
    let url = "http://10.1.110.30:81/device/lot?getall=true"
    return new Promise((resolve, reject) => {
        axios.get(url,
            {
                headers: { 'Authorization': 'Token ' + token },
                // headers: { 'Authorization': 'Token 1bdd52efa42ec2a9f1d4ff15b183606de9018399' },

            })
            .then(resp => resolve(resp))
            .catch(error => reject(error))
    })
}

function ParseLot(lot) {

    let ProductCode = lot.substr(0, 2)

    let HWCode = lot.substr(2, 2)

    let SMTManufactureCode = lot.substr(4, 2)

    let YearOfManufacture = lot.substr(10, 1)

    let MonthOfManufacture = lot.substr(11, 1)

    var ListProductCode = [
        { char: "P2", name: "ODIN" }
    ]

    var ListHWCode = [
        { char: "31", name: "EVT 3.1" },
        { char: "40", name: "EVT 4.0" },
        { char: "51", name: "EVT 5.1" },
        { char: "52", name: "EVT 5.2" },
    ]

    var ListSMTManufactureCode = [
        { char: "SN", name: "ISCN" },
        { char: "MK", name: "Meiko" },
        { char: "PK", name: "Penika" },
    ]

    var ListYearOfManufacture = [
        { char: "A", name: "2021" },
        { char: "B", name: "2022" },
        { char: "C", name: "2023" },
    ]

    var ListMonthOfManufacture = [
        { char: "A", name: "Jan" },
        { char: "B", name: "Feb" },
        { char: "C", name: "Mar" },
        { char: "D", name: "Apr" },
        { char: "E", name: "May" },
        { char: "F", name: "Jun" },
        { char: "G", name: "July" },
        { char: "H", name: "Aug" },
        { char: "I", name: "Sep" },
        { char: "J", name: "Oct" },
        { char: "K", name: "Nov" },
        { char: "L", name: "Dec" },
    ]
    let result = [];

    const product = ListProductCode.filter((e) => {
        let temp;
        if (e.char === ProductCode) {
            temp = e.char
        }
        return temp
    })

    const hw = ListHWCode.filter((e) => {
        let temp;
        if (e.char === HWCode) {
            temp = e.char
        }
        return temp
    })

    const smtManufacture = ListSMTManufactureCode.filter((e) => {
        let temp;
        if (e.char === SMTManufactureCode) {
            temp = e.char
        }
        return temp
    })


    const year = ListYearOfManufacture.filter((e) => {
        let temp;
        if (e.char === YearOfManufacture) {
            temp = e.char
        }
        return temp
    })

    const month = ListMonthOfManufacture.filter((e) => {
        let temp;
        if (e.char === MonthOfManufacture) {
            temp = e.char
        }
        return temp
    })

    result.push(product, hw, smtManufacture, year, month)

    let temp = []
    result.forEach((e) => {
        if (e.length !== 0) {
            temp.push(e[0].name)
        }
    })

    let messageProduct = "Product Code: " + ProductCode + " - " + temp[0] + "; "
    let messageHW = "HW Code: " + HWCode + " - " + temp[1] + "; "
    let messageSMT = "SMT Manufacture Code: " + SMTManufactureCode + " - " + temp[2] + "; "
    let messageSN = "Serial Number: xxxx (0000 - 9999); "
    let messageYear = "Year Of Manufacture: " + YearOfManufacture + " - " + temp[3] + "; "
    let messageMonth = "Month  Of Manufacture: " + MonthOfManufacture + " - " + temp[4]
    return messageProduct + messageHW + messageSMT + messageSN + messageYear + messageMonth
}

function exportToolData(respData, nameTool, handleShow) {
    let exportToolData = [];

    respData.forEach((element) => {
        if (element.tool === nameTool) {
            element.dataDetail.forEach((data, index) => {
                let timeData;
                if (data.time === null) {
                    timeData = "Don't have time"
                } else {
                    timeData = data.time.slice(0, 10) + " " + data.time.slice(11, 19)
                }

                exportToolData.push({
                    'stt': index + 1,
                    'name_tool': DataSearch(data.serial_number, handleShow),
                    'time': timeData,
                    'status': ColorResult(data.status),
                });
            })
        }


    });
    return exportToolData;
}

function DataSearch(data, handleShow) {

    return (
        <button
            className={cx("button-show-data")}
            onClick={() => handleShow(data)}
        >
            <span>{data}</span>
        </button>
    )
}

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


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

function DialogShowData({ open, handleToClose, nameTool, fromDate, toDate, data, handleRedictPage }) {

    const dispatch = useDispatch();

    let name
    if (nameTool === "Jig LCD" || nameTool === "Jig Main Keybroad" || nameTool === "Transist") {
        name = "ID" + nameTool
    } else {
        name = "SN"
    }

    const columnsTableDetail = [
        { name: 'stt', title: 'STT' },
        { name: 'name_tool', title: name },
        { name: 'time', title: 'Time' },
        { name: 'status', title: 'Status ' },
    ];

    const columnExtensionsTableDetail = [

        { columnName: 'stt', align: 'center', width: '100px' },
        { columnName: 'name_tool', align: 'center', width: '500px' },
        { columnName: 'time', align: 'center', width: '400px' },
        { columnName: 'status', align: 'center', width: '400px' },
    ];

    const [rows, setRows] = useState([]);


    const handleShow = ((data) => {
        handleRedictPage()
        dispatch(SearchSN(data))
    })


    useEffect(() => {
        setRows(exportToolData(data, nameTool, handleShow))
    }, [open])// eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                fullWidth
                maxWidth="xl"
                style={{ height: "100%" }}
            >
                <div className={cx('header-dialog-box')} style={{ border: "none", justifyContent: "space-between" }} >
                    <h2 style={{ fontWeight: 600 }}>{nameTool} Details </h2>
                    <button className={cx('button-close-dialog')}
                        onClick={() => {
                            handleToClose();
                        }}
                    >
                        <Close />
                    </button>
                </div>
                <div className={cx('note-time')}>
                    <span >From: {fromDate.slice(0, 9)} </span>
                    <ArrowRightAlt></ArrowRightAlt>
                    <span >To: {toDate.slice(0, 9)} </span>
                </div>
                <div className={cx("table-detail")}>
                    <Container>
                        <Paper elevation={3} style={{ padding: "0px 20px" }}>
                            <Grid
                                rows={rows}
                                columns={columnsTableDetail}
                            >
                                <IntegratedFiltering />
                                <PagingState
                                    defaultCurrentPage={0}
                                    pageSize={40}
                                />
                                <IntegratedPaging />

                                <VirtualTable
                                    columnExtensions={columnExtensionsTableDetail}
                                />

                                <TableHeaderRow />
                                <PagingPanel />
                                <Toolbar />
                            </Grid>
                        </Paper>
                    </Container>
                </div>
            </Dialog>
        </div>
    )
}


function exportData(respData, handleShow) {
    let exportData = [];

    respData.forEach((element, index) => {
        // console.log("nhatnt", element)

        exportData.push({
            'stt': index + 1,
            'tooltype': Data("Tool " + element.tool, handleShow),
            'total': element.total,
            'start': element.unknow_status,
            'pass': element.pass_count,
            'failed': element.fail_count,
            "dataDetail": element.serial_number_arr,
            "tool": "Tool " + element.tool,
        });
    });
    return exportData;
}

function Processing() {
    return (
        <div className={cx("processing")}>
            <CircularProgress />
            <span style={{ marginTop: "50px" }}>Processing ...</span>
        </div>
    )
}

const waitData = [
    { "stt": '', "tooltype": "", "total": "", "start": "", "pass": <Processing />, "failed": "" },
]



function getDataByDate(toDate, fromDate, token, valueLoto) {
    var axios = require('axios');
    var snStart, snEnd;

    if (valueLoto === "All") {
        snStart = "";
        snEnd = "";
    } else {
        snStart = valueLoto.split("xxxx")[0];
        snEnd = valueLoto.split("xxxx")[1];
    }
    let url = web_url.get_statistics_url + '/steps?startdate=' + fromDate + '&enddate=' + toDate + "&sn_start=" + snStart + "&sn_end=" + snEnd;
    console.log("getData", url)
    // console.log("token", token)
    return new Promise((resolve, reject) => {
        axios.get(url,
            {
                headers: { 'Authorization': 'Token ' + token },
            })
            .then(resp => resolve(resp))
            .catch(error => reject(error))
    })
}




function Statistics(props) {

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [toDate, setToDate] = useState(GetTime("", 0))
    const [fromDate, setFromDate] = useState(GetTime(optionsTime[2], 7));
    const [nameTool, setNameTool] = useState('');
    const [valueTime, setValueTime] = useState(optionsTime[2]);
    const [valueLoto, setValueLoto] = useState(optionsLoto[0]);
    const [detailData, setDetailData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [redirectPage, setRedirectPage] = useState(false);
    //Authen
    const [token, setToken] = useState('');
    const { loginState, timestamp } = useSelector(state => state.login);
    const timeRef = useRef(timestamp);
    const dispatch = useDispatch();


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
            GetLoto(token)
                .then(resp => {
                    const data = resp.data
                    if (resp.status === 200) {
                        data.forEach((element) => {
                            optionsLoto.push(element.fields.sn_start + "xxxx" + element.fields.sn_end)
                        });
                    } else {
                        console.log("error")
                    }

                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [token])


    const handleClick = () => {
        if (toDate !== "" && fromDate !== "") {
            setRows(waitData)
            getDataByDate(toDate, fromDate, token, valueLoto)
                .then(resp => {
                    const data = resp.data
                    if (resp.status === 200) {
                        setDetailData(exportData(data, handleShow))
                        setRows(exportData(data, handleShow))
                    } else {
                        console.log("error")
                    }

                })
                .catch(error => {
                    console.log(error)
                })
        }

    }

    const handleToClose = () => {
        setOpen(false);
    }

    const handleRedictPage = () => {
        checkRedirect();
        setRedirectPage(true);
        setOpen(false);
    }

    const handleShow = (nameTool) => {
        setOpen(true);
        setNameTool(nameTool);
    }

    const onDropChangeTime = (event, value) => {
        if (value === "Today") {
            setFromDate(GetTime(value, 0))
        }
        else if (value === "Yesterday") {
            setFromDate(GetTime(value, 1))
        }
        else if (value === "Last 1 Weeks") {
            setFromDate(GetTime(value, 7))
        }
        else if (value === "Last 1 Months") {
            setFromDate(GetTime(value, 1))
        } else if (value === "Last 1 Quarter") {
            setFromDate(GetTime(value, 3))
        } else if (value === "Last 1 Year") {
            setFromDate(GetTime(value, 1))
        }
        setToDate(GetTime("", 0))
        setValueTime(value)
    }

    const handleSelectToDate = event => {
        setToDate(event.target.value)
        setValueTime(optionsTime[6])
    };

    const handleSelectFromDate = event => {
        setFromDate(event.target.value)
        setValueTime(optionsTime[6])
        // console.log(event.target.value)
    };


    const onDropChangeLoto = (event, value) => {

        if (value !== "All") {
            setVisible(true)
            setMessage(ParseLot(value))
        }
        setValueLoto(value)
    }

    function checkRedirect() {
        if (redirectPage) {
            return <Redirect to='/LookUpInfo' />
        }
    }


    function checkRole() {
        if (!loginState) {
            return <Redirect to='/login' />
        }
    }

    // console.log(fromDate)
    return (
        <div>
            <div style={{ display: "flex" }}>
                {checkRedirect()}
                {checkRole()}
                <div style={{ flex:"1" }}>
                    <SideMenu />
                </div>
                <div style={{ flex:"5", minHeight:"100vh" }}>
                    <CustomNotification type="info" message={message} visible={visible} setVisible={setVisible} duration={6000}></CustomNotification>
                    <div>
                        <div className={cx('header')}>
                            <span > STATISTICS </span>
                        </div>
                        <div className={cx('container')} >
                            <div>
                                <label style={{ fontSize: "18px" }}>Time Options:</label>
                                <Autocomplete
                                    disableClearable={true}
                                    options={optionsTime}
                                    onChange={onDropChangeTime}
                                    value={valueTime}
                                    style={{ width: 200, color: "#000" }}
                                    renderInput={(params) =>
                                        <TextField {...params} style={{ width: 200 }} label="" />}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontSize: "18px" }}>From:</label>
                                <input
                                    className={cx('input-date')}
                                    type='datetime-local'
                                    value={fromDate}
                                    onChange={handleSelectFromDate}
                                >

                                </input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }} >
                                <label style={{ fontSize: "18px" }}>To:</label>
                                <input
                                    className={cx('input-date')}
                                    type='datetime-local'
                                    value={toDate}
                                    onChange={handleSelectToDate}
                                >
                                </input>
                            </div>

                            <div>
                                <label style={{ fontSize: "18px" }}>Loto Options:</label>
                                <Autocomplete
                                    disableClearable={true}
                                    options={optionsLoto}
                                    onChange={onDropChangeLoto}
                                    value={valueLoto}
                                    style={{ width: 200 }}
                                    renderInput={(params) =>
                                        <TextField {...params} style={{ width: 200 }} label="" />}
                                />
                            </div>
                            <button
                                className={cx('button-search')}
                                onClick={() => {
                                    handleClick();
                                }}
                            >
                                Search
                            </button>
                        </div>
                        <div className={cx("table")}>
                            <Container>
                                <Paper elevation={3} style={{ padding: "0px 20px" }}>
                                    <Grid
                                        rows={rows}
                                        columns={columns}
                                    >
                                        <IntegratedFiltering />
                                        <PagingState
                                            defaultCurrentPage={0}
                                            pageSize={12}
                                        />
                                        <IntegratedPaging />

                                        <VirtualTable
                                            columnExtensions={columnExtensions}
                                            height="520px"
                                        />

                                        <TableHeaderRow />
                                        <PagingPanel />
                                        <Toolbar />
                                    </Grid>
                                    {/* {visible && <div className={cx("process")} >
                                    <CircularProgress />
                                    <span style={{ marginTop: "50px" }}>Processing ...</span>
                                </div>} */}
                                </Paper >
                                <DialogShowData open={open}
                                    handleToClose={handleToClose}
                                    handleRedictPage={handleRedictPage}
                                    nameTool={nameTool}
                                    fromDate={fromDate}
                                    toDate={toDate}
                                    data={detailData}
                                >

                                </DialogShowData>
                            </Container >
                        </div >
                    </div >
                </div >
            </div>

        </div >
    );
}
Statistics.propTypes = {
    cookies: instanceOf(Cookies).isRequired
}

export default withCookies(Statistics);