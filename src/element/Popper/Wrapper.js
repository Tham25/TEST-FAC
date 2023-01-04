import classNames from 'classnames/bind';
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

function Wrapper({ menuSquare, menuList, children }) {

    let Comp = 'h4';

    const classes = cx('wrapper', {
        menuSquare,
        menuList
    });

    return (
    <Comp className={classes} >
        <span>{children}</span>
    </Comp>
    );
}




export default Wrapper;