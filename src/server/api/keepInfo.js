import moment from "moment";
const keepInfo = value => {
    sessionStorage.setItem('title',value.title);
    sessionStorage.setItem('content',value.content);
    sessionStorage.setItem('create',moment(value.created_at).format('l'));
}
export default keepInfo;