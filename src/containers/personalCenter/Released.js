import { Card, Col, Row } from "antd";

const Released = () => {

    const data=[
        {
            company:'广和通',
            id:1,
            signUp_deadline:1111,
            race_deadline:4567,
            reward:'5毛钱',
            yaoqiu:'开心就好'
        },
        {
            company:'hahaha',
            id:2,
            signUp_deadline:'sads',
            race_deadline:'asdsdasdasd',
            reward:'5毛钱',
            yaoqiu:'不开心就好'
        },
        {
            company:'呜呜呜呜',
            id:3,
            signUp_deadline:'sa光电股份ds',
            race_deadline:'as多少分dsdasdasd',
            reward:'5毛防守打法钱',
            yaoqiu:'你觉得好就好'
        },
    ]
    let elements=[];
    for(const item of data){
        elements.push(
            <Col span={8}>
                <Card title={item.company} style={{width:300}} >
                    <p>主办方：{item.company}</p>
                    <p>比赛要求：{item.yaoqiu}</p>
                    <p>奖励：{item.reward}</p>
                    <p>报名截止时间：{item.signUp_deadline}</p>
                    <p>比赛截止时间：{item.race_deadline}</p>
                </Card>
            </Col>
        )
    }
    return (
        <div style={{margin:"2%"}}>
            <Row gutter={[16,16]}>
                {elements}
            </Row>
            
        </div>
    )
}

export default Released;