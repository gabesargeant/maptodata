function _getColumnNames(num, rslt, btnNum) {
    $.getJSON($SCRIPT_ROOT + '/_get_columns', {
        col_no: num
    }, function (data) {
        //$("#result").text(data.result);
        var array = data['result'];
        var $hide_button = "<input type=\"button\" id=\"hide_" + rslt + "\" onclick=\"_hideShowResultDiv(\'" + rslt + "\')\" value=\"Hide / Show Fields relating to:\">";

        $("#" + rslt + "ctr").prepend($hide_button);
        $("#" + btnNum).hide();

        for (i = 0; i < array.length; i++) {
            var fld =  array[i][1];
            fld = fld.replace(/_/g, ' ');
            var $result_div = "<label class=\"cklbl\"><input type=\"checkbox\" id\"columns\" name=\"columns\" value=" + array[i][0] + ">" + fld + "</label>";
            $("#" + rslt).append($result_div);

        }

    });
    return false;
};

function _hideShowResultDiv(div) {
    $("#" + div).toggle();
}