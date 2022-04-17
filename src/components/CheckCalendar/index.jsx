import React, { Component, Fragment } from "react";
import { cloneDeep, chunk } from "lodash";
import PropTypes from 'prop-types';
// import "animate.css";
import "./index.scss"

class CheckCalendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateTable: [],
            isCheck: [],
        }
        this.calendar = React.createRef();
        this.mask = React.createRef();
    }

    componentWillMount() {
        this.initDateTable()
    }

    initDateTable() {
        let temp = []
        for (let i = 0; i < 2; i++) {  // 取近三个月内的日期
            let obj = this.getDateTable(i);
            temp.push(obj);
        }
        this.setState({
            dateTable: temp
        });
    }

    getDateTable(plus) {
        let curDate = new Date()  //现在时间
        let curYear = curDate.getFullYear();
        let curMonth = curDate.getMonth() + 1;
        let curDay = curDate.getDate();
        if (curMonth + plus > 12) {
            curYear++
            curMonth = curMonth + plus - 12
        } else {
            curMonth = curMonth + plus
        }
        let date = new Date(curYear, curMonth, 0);
        let year = date.getFullYear(); // 当前年
        let month = date.getMonth() + 1; // 当前月
        // console.log(`${year}年${month}月.`);

        let date2 = new Date(year, month, 0);
        let days = date2.getDate(); // 当月有多少天
        // console.log(`当月有${days}天.`);

        date2.setDate(1);
        let day = date2.getDay(); // 当月第一天是星期几
        // console.log(`当月第一天是星期${day}.`);

        let list = [];

        for (let i = 0; i < days + day; i++) {
            if (i < day) {  // 头部补零
                list.push({
                    isActive: false,
                    number: 0
                });
            } else {
                if (plus === 0) {
                    if ((i - day + 1) < curDay) {
                        list.push({
                            disable: true,
                            isActive: false,
                            number: i - day + 1
                        });
                    } else {
                        list.push({
                            isActive: false,
                            number: i - day + 1
                        });
                    }
                } else {
                    list.push({
                        isActive: false,
                        number: i - day + 1
                    });
                }
            }
        }
        let hlist = chunk(list, 7); // 转换为二维数组
        let len = hlist.length;
        let to = 7 - hlist[len - 1].length;

        // 循环尾部补0
        for (let i = 0; i < to; i++) {
            hlist[len - 1].push({
                isActive: false,
                number: 0
            });
        }
        if (month < 10) {
            month = "0" + month
        }
        const str = `${year}-${month}`
        return {
            "list": hlist,
            "desc": str
        }
    }

    handleItemClick(desc, number, index, index1, index2) {
        let temp = cloneDeep(this.state.dateTable)
        const flag = !temp[index].list[index1][index2].isActive
        temp[index].list[index1][index2].isActive = flag
        this.setState({
            dateTable: temp,
        })
        const arr = desc.split("-");
        if (number < 10) {
            number = "0" + number
        }
        if (flag) {
            let temp = cloneDeep(this.state.isCheck);
            temp.push(arr[0] + "-" + arr[1] + "-" + number)
            this.setState({
                isCheck: temp
            })
        } else {
            let temp = cloneDeep(this.state.isCheck);
            let filted = temp.filter((item) => {
                return item !== arr[0] + "-" + arr[1] + "-" + number
            })
            this.setState({
                isCheck: filted
            })
        }
    }

    onExit = () => {
        const { onCancel } = this.props;

        onCancel && onCancel();
    }

    onConfirm = () => {
        const { onConfirm } = this.props;

        onConfirm && onConfirm(this.state.isCheck);
    }

    render() {
        return this.props.visible ? (
            <div className="calendar-mask">
                <div className="calendar-wrap animated fadeInUp">
                    <RenderCalendarHeader
                        onExit={this.onExit}
                    />
                    <RenderChineseWeek />
                    <RenderDateTemp
                        dateTable={this.state.dateTable}
                        handleItemClick={this.handleItemClick}
                        self={this}
                    />
                    <div className="fake-area"></div>
                </div>
                <RenderConfirm
                    onConfirm={this.onConfirm}
                />
            </div>
        ) : (<span></span>)
    }
}

/**
 * 渲染表格每个item
 * 
 */
const RenderDateItem = (props) => {
    const { number, active } = props;

    return number === 0 ?
        (
            <div className="date-wrap">
                <span className="left"></span><div className="item"></div><span className="right"></span>
            </div>
        ) : props.disable ?
            (
                <div className="date-wrap">
                    <span className="left"></span>
                    <div className="item disable">{number}</div>
                    <span className="right"></span>
                </div>
            ) :
            (
                <div className="date-wrap">
                    <span className="left"></span>
                    <div className={`item ${active ? 'active' : ''}`} onClick={props.itemClick} >
                        <span>{number}</span>
                    </div>
                    <span className="right"></span>
                </div>
            )
}

/**
 * 日历顶部
 * @param props.onExit 退出事件 
 */
const RenderCalendarHeader = (props) => {
    const { onExit } = props;
    return (
        <div className="header">
            <span>日期多选</span>
            <div className="exit" onClick={onExit}></div>
        </div>
    )
}

/**
 * 渲染中文日期
 */
const RenderChineseWeek = () => {
    const weeks = ["日", "一", "二", "三", "四", "五", "六"];
    return (
        <div className="week-wrap">
            {
                weeks.map((item, index) => (
                    <div className="week-item" key={index}>{item}</div>
                ))
            }
        </div>
    )
}

/**
 * 
 * @param props.dateTable 模板数组
 * @param prop.handleItemClick item点击事件
 * @param prop.self 父组件作用域
 */
const RenderDateTemp = (props) => {
    const { dateTable, handleItemClick, self } = props;
    return (
        <Fragment>
            {
                dateTable.map((item, index) => {
                    const arr = item.desc.split("-");
                    return (
                        <div className="date-table" key={index}>
                            <span className="desc">
                                {arr[0] + "年" + arr[1] + "月"}
                            </span>
                            {
                                item.list.map((item2, index2) => {
                                    return (
                                        <div className="row" key={index2}>
                                            {
                                                item2.map((item3, index3) => {
                                                    return (
                                                        <RenderDateItem
                                                            itemClick={handleItemClick.bind(self, item.desc, item3.number, index, index2, index3)}
                                                            active={item3.isActive}
                                                            disable={item3.disable ? item3.disable : false}
                                                            number={item3.number}
                                                            key={index3}
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    );
                })
            }
        </Fragment>
    )
}

const RenderConfirm = (props) => {
    return (
        <div className="confirm-wrap">
            <div className="confirm" onClick={props.onConfirm}>
                确定
            </div>
        </div>
    )
}

/**
 * @param onCancel 关闭事件回调
 * @param onConfirm 确认事件回调
 * @param visible 组件显示状态
 */
CheckCalendar.propTypes = {
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    visible: PropTypes.bool
}

export default CheckCalendar;
