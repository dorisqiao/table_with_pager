/**
 * Created by doris on 2017/06/05.
 * Version 1.0
 * 1. Click table head of each column to sort.
 * 2. Column name configurable.
 * 3. Data configurable to show in the table by ajax.
 * 4. Pager button number configurable, odd integer, range from 1 to 10.
 * 5. Function configurable when click prev, next, and pager buttons.
 */

var Table = (function(){
    // Private attributes
    var pagerBtnNum = 9;//The number of pager buttons, odd number, no more than 10
    var pageSize = 10;
    var totalPages = null;
    var columnName = null;
    var activeBtnNum = 1;
    var clickPrevFn = null;//user's function when click the prev button
    var clickNextFn = null;//user's function when click the next button
    var clickPagerFn  = null;//user's function when click the pager button
    var _data = null;//data to show in the table
    var _sortFlag = 'asc';

    // Callbacks
    var _prevHandler = function(e){
        if(activeBtnNum > 1){
            activeBtnNum --;
            _updateTable();
            _updatePagerBtn();
        }
        if(typeof clickPrevFn === "function")
            clickPrevFn();
    };

    var _nextHandler = function (e) {
        if(activeBtnNum < totalPages){
            activeBtnNum ++;
            $("#data").html('');
            $('#dorisPager').find('[data-pager]').remove();
            _updateTable();
            _updatePagerBtn();
        }
        if(typeof clickNextFn === "function")
            clickNextFn();
    };

    var _pagerBtnHandler = function (e) {
        e = e.target || e.srcElement;
        activeBtnNum = e.innerHTML - 0;
        _updateTable();
        _updatePagerBtn();
        if(typeof clickPagerFn === "function")
            clickPagerFn();
    };

    var _pageSizeChangeHandler = function(e){
        pageSize = this.value - 0;
        totalPages = Math.ceil(_data.length / pageSize);
        activeBtnNum = 1;
        _updateTable();
        _updatePagerBtn();
    };

    var _pageToHandler = function (e) {
        var pageToNum = $('#pageTo').val() - 0;
        if(pageToNum > totalPages){
            pageToNum = totalPages;
        }
        if(pageToNum < 1) {
            pageToNum = 1;
        }
        activeBtnNum = pageToNum;
        _updateTable();
        _updatePagerBtn();
    };

    // private methods
    var _buildSkeleton = function(container){
        var dorisWrapper = $("<div id='dorisWrapper' class='doris-wrapper'></div>");
        $('#'+ container).append(dorisWrapper);
        var tableContainer = $('<div data-table class="doris-wrapper"></div>');
        var pagerAndSizer = $('<div data-pager-sizer class="doris-wrapper"></div>');
        dorisWrapper.append(tableContainer);
        dorisWrapper.append(pagerAndSizer);
    };

    var _appendTable = function(){
        var tableContainer = $('[data-table]');
        var table = $('<table class="doris-table"></table>');
        var tableHead = $('<thead></thead>');
        var tableBody = $('<tbody id="data"></tbody>');
        var trs = $('<tr><th>NO.</th></tr>');
        for(var i=0; i < columnName.length; i++){
            var _th = $('<th data-col=' + (i+1) + '>' + columnName[i] + '<span class="doris-arrow"></span></th>');
            trs.append(_th);
        }
        tableHead.append(trs);
        table.append(tableHead);
        table.append(tableBody);
        tableContainer.append(table);
    };

    var _appendPager = function(){
        var pagerAndSizer = $('[data-pager-sizer]');
        var pager = $('<ol id="dorisPager" class="doris-pull-left doris-pager"></ol>');
        var prevBtn = $('<li id="dorisPrev"><button class="doris-btn doris-btn-danger">prev</button></li>');
        var nextBtn = $('<li id="dorisNext"><button class="doris-btn doris-btn-info">next</button></li>');
        pager.append(prevBtn);
        pager.append(nextBtn);
        pagerAndSizer.append(pager);
    };

    var _appendPageSizer = function(){
        var pagerAndSizer = $('[data-pager-sizer]');
        var sizer = $('<div class="doris-pull-right doris-page-sizer"></div>');
        var selection = $('<select id="pageSizer" name="pageSizer"></select>');
        var opts = $('<option value="10">10</option>'+
            '<option value="20">20</option>'+
            '<option value="50">50</option>'+
            '<option value="100">100</option>');
        selection.append(opts);
        sizer.append(selection);
        sizer.append('<span> rows per page, to page </span>');
        sizer.append('<input id="pageTo" name="pageTo" type="text" value="1"/>');
        sizer.append('<span> <button id="pageToBtn" class="doris-btn doris-btn-default">go</button></span>');
        pagerAndSizer.append(sizer);
    };

    var _updateTable = function() {
        var curPageNum = activeBtnNum;
        $("#data").html('');
        var start = (curPageNum - 1) * pageSize;
        var end = start + pageSize;
        var data = _data.slice(start,end);
        var frag = document.createDocumentFragment();
        for(var i=0; i<data.length; i++){
            var trEle = document.createElement("tr");
            var numEle = document.createElement("td");
            numEle.innerHTML = start + i + 1;
            numEle.className = "col-last";
            trEle.appendChild(numEle);
            for(var k in data[i]){
                var tdEle = document.createElement("td");
                tdEle.className = k;
                tdEle.innerHTML = data[i][k];
                trEle.appendChild(tdEle);
            }
            frag.appendChild(trEle);
        }
        document.getElementById("data").appendChild(frag);
    };

    var _updatePagerBtn = function() {

        var first, last;
        var half = Math.floor(pagerBtnNum / 2);

        //Calculates the start and end positions of the page number
        if((activeBtnNum + half) > totalPages){
            last = totalPages;
            first = last - pagerBtnNum + 1;
            if(first < 1){
                first = 1;
            }
        }else if((activeBtnNum - half) < 1){
            first = 1;
            last = first + pagerBtnNum -1;
            if(last > totalPages) last = totalPages;
        } else{
            last = activeBtnNum + half;
            first = activeBtnNum - half;
        }

        //Generate buttons before active button
        $('#dorisPager').find('[data-pager]').remove();
        for(var i = first; i < activeBtnNum; i++){
            var liElem = $('<li data-pager><button class="doris-btn doris-btn-default">' + i + '</button></li>');
            $('#dorisNext').before(liElem);
        }
        //Generate the active button
        liElem = $('<li data-pager><button class="doris-btn doris-btn-default active">' + i + '</button></li>');
        $('#dorisNext').before(liElem);

        //Generate buttons after active button
        for(i = activeBtnNum + 1; i <= last; i++){
            liElem = $('<li data-pager><button class="doris-btn doris-btn-default">' + i + '</button></li>');
            $('#dorisNext').before(liElem);
        }
        //add click listener
        $('[data-pager]').find('button').on('click', _pagerBtnHandler);
    };

    var _sort = function(e){
        e = e.target || e.srcElement;
        var _col = $(e).attr('data-col') - 0;
        if(_sortFlag === 'asc'){
            _data.sort(function(a, b){
                return a['col'+_col] - b['col'+_col];
            });
            _sortFlag = 'des';
            $(e).find('span').attr('class','doris-arrow asc');
        }else{
            _data.sort(function(a, b){
                return b['col'+_col] - a['col'+_col];
            });
            _sortFlag = 'asc';
            $(e).find('span').attr('class','doris-arrow des');
        }
        activeBtnNum = 1;
        _updateTable();
        _updatePagerBtn();
    };

    var _init = function (config) {
        config = config || {};
        config.container = config.container || "container";//container id
        columnName = config.columnName  || ['column1', 'column2', 'column3', 'column4', 'column5'];//name of each column
        _data = (config.data === undefined) ? [] : JSON.parse(config.data);//data to show in the table
        pagerBtnNum = config.pagerBtnNum || pagerBtnNum;//how many buttons in the pager
        activeBtnNum = 1;//default active pager button
        totalPages = Math.ceil(_data.length/pageSize);
        clickPrevFn = config.clickPrevFn || '';
        clickNextFn = config.clickNextFn || '';
        clickPagerFn = config.clickPagerFn || '';

        //Initialize the page
        var that = this;
        _buildSkeleton(config.container);
        _appendTable();
        _appendPager();
        _appendPageSizer();
        _updateTable();
        _updatePagerBtn();

        $('#dorisPrev').find('button').on('click', _prevHandler);
        $('#dorisNext').find('button').on('click', _nextHandler);
        $('#pageSizer').on('change', _pageSizeChangeHandler);
        $('#pageToBtn').on('click', _pageToHandler);
        $('[data-col]').on('click', _sort);
    };

    //return constructor
    return function(config) {
        _init(config);
    }
})();