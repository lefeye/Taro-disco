import React, { useEffect, useState } from 'react';
import url from '../../../server/api/url';
import new_axios from '../../../server/api/axios';
import { useHistory } from 'react-router-dom';

const ContestList = () => {
    const [list,setList] = useState([]);
    const history = useHistory();
    useEffect( () => {
        new_axios({
            method:'GET',
            url:url+'/api/v1/judge/contest/get-list'
        }).then( res => {
            console.log(res);
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
            <ul style={{ fontSize:'24px' }} >
                {lis}
            </ul>
       </div>
    )    
}

export default ContestList;