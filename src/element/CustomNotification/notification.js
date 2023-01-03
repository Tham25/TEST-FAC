import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const TypeAlert = ({ chooseType, msg }) => {
    let returnType;
    switch (chooseType) {
        case "success":
            returnType = <Alert severity="success">{msg}</Alert>;
            break;
        case "error":
            returnType = <Alert severity="error">{msg}</Alert>;
            break;
        case "info":
            returnType = <Alert severity="info">{msg}</Alert>;
            break;
        case "warning":
            returnType = <Alert severity="warning">{msg}</Alert>;
            break;
        default:
            returnType = <Alert severity="info">{msg}</Alert>;
            break;
    }
    return returnType;
}

const CustomNotification = ({ type, message, visible, setVisible, duration }) => {
    const [vertical, horizontal] = ['top', 'right'];

    function handleClose() {
        setVisible(false)
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={visible}
                autoHideDuration={duration}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <TypeAlert chooseType={type} msg={message} />
            </Snackbar>
        </>

    );
}

export default CustomNotification;