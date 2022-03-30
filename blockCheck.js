//출처 : https://kutar37.tistory.com/entry/%EA%B5%AC%EA%B8%80-%EC%8A%A4%ED%94%84%EB%A0%88%EB%93%9C%EC%8B%9C%ED%8A%B8-API-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0-SELECT

var datas = [];
var jsonp = function (url) {
    var script = window.document.createElement('script');
    script.async = true;
    script.src = url;
    script.onerror = function () {
        alert('Can not access JSONP file.')
    };
    var done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState ===
                'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            if (script.parentNode) {
                return script.parentNode.removeChild(script);
            }
        }
    };
    window.document.getElementsByTagName('head')[0].appendChild(script);
};

var parse = function (data) {
    var column_length = data.table.cols.length;
    if (!column_length || !data.table.rows.length) {
        return false;
    }
    var columns = [],
        result = [],
        row_length,
        value;
    for (var column_idx in data.table.cols) {
        columns.push(data.table.cols[column_idx].label);
    }
    for (var rows_idx in data.table.rows) {
        row_length = data.table.rows[rows_idx]['c'].length;
        if (column_length != row_length) {
            return false;
        }
        for (var row_idx in data.table.rows[rows_idx]['c']) {
            if (!result[rows_idx]) {
                result[rows_idx] = {};
            }

            value = !!data.table.rows[rows_idx]['c'][row_idx].v ? data.table.rows[rows_idx]['c'][row_idx]
                .v : null;
            if (data.table.rows[rows_idx]['c'][row_idx].f !== undefined && data.table.rows[rows_idx]['c'][
                    row_idx
                ].v !== undefined) {
                value = data.table.rows[rows_idx]['c'][row_idx].f;
            }
            result[rows_idx][columns[row_idx]] = value;
        }
    }
    console.log(result);
    return result;
};


var query = function (sql, sheetName, callback) {
    //myKey : 구글 시트 링크의 키값 가져오기.
    var myKey = '1s9w9LX3_dK2_oVe_s9VsYt4gCQK3gK2eZCW18Vgj5do';
    var url = 'https://docs.google.com/spreadsheets/d/'+myKey+'/gviz/tq?',
        params = {
            tq: encodeURIComponent(sql),
            sheet: encodeURIComponent(sheetName),
            tqx: 'responseHandler:' + callback
        },
        qs = [];
    for (var key in params) {
        qs.push(key + '=' + params[key]);
    }
    url += qs.join('&');
    return jsonp(url); // Call JSONP helper function
}

var my_callback = function (data) {

    data = parse(data); // Call data parser helper function
  
    // //AND THEN WHATEVER YOU WANT 
    // for(var i = 0 ; i < datas.length; i++){
    //     if(JSON.stringify(datas[i]) == JSON.stringify(data)) {
    //         return false;
    //     }
    // }
    
    datas.push(data);

    // EXTRACT VALUE FOR HTML HEADER. 
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            console.log(col.indexOf(key))
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    //블럭 개수 가져옴.
    blockNum = data[0][col[0]];
    showBlock(parseInt(blockNum));
    
}

function getID(){
    var id = document.form1.id.value;
    return id;
}


function search(){
    var id = getID();
    datas = [];

    // query(sql문, 시트 이름, 콜백 함수)
    query('SELECT B WHERE A = ' + id, '신선해', 'my_callback');
    
}

function showBlock(blockNum){
    


    var showNum = blockNum%10; //showNum은 보여줘야하는 블럭 숫자. 쿠폰 단위로 나눈 값.
    var couponNum = (blockNum - showNum)/10;
    document.getElementById("couponNum").textContent = couponNum;
    var i;

    for(i = 0; i < 10; i++){
        var idString = 'bean' + i;

        if(i>=showNum){
            document.getElementById(idString).style.visibility = 'hidden';
        }
        else{
            document.getElementById(idString).style.visibility = 'visible';
        }
    }
}

function setUp(){
    for(i = 0; i < 10; i++){
        var idString = 'bean' + i;
        document.getElementById(idString).style.visibility = 'hidden';
    }
}