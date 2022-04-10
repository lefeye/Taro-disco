import React, { useEffect, useState } from 'react';
import url from '../../../server/api/url';
import new_axios from '../../../server/api/axios';
import { useHistory } from 'react-router-dom';
import { Empty } from 'antd';

const ContestList = () => {
    const [list,setList] = useState([]);
    const history = useHistory();
    useEffect( () => {
        new_axios({
            method:'GET',
            url:url+'/api/v1/judge/contest/get-list'
        }).then( res => {
            if( res.data.code === '200' ){
                setList(res.data.data)
            }
        } )
    },[] )

    const lis = (
        list.map( item => 
            <li onClick={ () => {
                sessionStorage.setItem('competition_id', `${item.id}`);
                history.push('/home/searchsignupinfo');
            } }><a>{item.title}</a></li>
        )
    )

    return (
        <div>
            {
                lis.length ?
                <ul style={{ fontSize:'24px' }} >
                    {lis}
                </ul> :
                <Empty description='暂时没有比赛'/>
            }
            
       </div>
    )    
}

export default ContestList;