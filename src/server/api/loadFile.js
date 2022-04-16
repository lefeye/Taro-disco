import url from "./url";
import new_axios from "./axios";

const loadFile = link => {
    new_axios({
        method:'GET',
        url:url+`/api/v1/contest/download?url=${link}`,
        responseType:'blob'
    }).then( res => {
        var b = new Blob([res.data]);
        // 根据传入的参数b创建一个指向该参数对象的URL
        var url = URL.createObjectURL(b);
        var l = document.createElement('a');
        // 设置导出的文件名
        l.download = `${link}`;
        l.href = url;
        // 点击获取文件
        l.click();
    } )
}

export default loadFile;