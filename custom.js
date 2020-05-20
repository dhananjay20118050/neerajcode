
$(document).ready(function(){
    $("#username").val('');
    $("#password").val('');
    $("#cnpassword").val('');
})

toastr.options = {
    "closeButton": true, // true/false
    "debug": false, // true/false
    "newestOnTop": false, // true/false
    "progressBar": false, // true/false
    "positionClass": "toast-bottom-right", // toast-top-right / toast-top-left / toast-bottom-right / toast-bottom-left
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "5000", // in milliseconds
    "hideDuration": "1000", // in milliseconds
    "timeOut": "5000", // in milliseconds
    "extendedTimeOut": "1000", // in milliseconds
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

$(".dt-tabs").click(function(){
    var tab = $(this).attr("href");
    selTab(tab);
});

function selTab(tab){

    if(tab == "#t2"){
        setDT2();
    }else if(tab == "#t3"){
        setDT3();
    }else if(tab=="#t1"){
        setDT1();
    }else if(tab=="#t6"){
        setDT6();
    }else{
        setDT5();
    }
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
       $($.fn.dataTable.tables(true)).DataTable()
          .columns.adjust();
    });
}

function setDT1(){
    $("#dt-1").DataTable( { 
        processing: true,
        serverSide: true,
        destroy: true,
        paging: false,
        order : [[ 2, "desc" ]],
        search: { "caseInsensitive": false },
        ajax: { "url" : "include/datatable/dt-1.php" },
        columns: [  
                    { data: "TRNREFNO" },
                    { data: "APPLNO" },
                    { data: "upload_datetime" },
                    { data: "fullName" },
                    { data: "ipaddress" },
                    {   
                        mRender: function ( file_name, type, data ) {
                            return '<a href="#" onclick="startAction('+data['userid']+','+data['TRNREFNO']+')"><span class="glyphicon glyphicon-play" data-toggle="tooltip" title="Start"/></a><a href="#" class="info" data-value="No Info." onclick="showInfo('+data['TRNREFNO']+')"><span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Info"/></a>';
                        }
                    }
                ],
        dom: '<"toolbar"lB<"#filters">f>rt<"bottom"ip><"clear">',
        buttons: ['csv'],
        lengthMenu: [[5, 10, 15, 20, 25, 50, 100, -1], [5, 10, 15, 20, 25, 50, 100, "All"]],
        pageLength: 10,
        "scrollX": true,
        "scrollY": "500px",
        "scrollCollapse": true,
        initComplete: function () {
            $('.buttons-csv').html('<span class="glyphicon glyphicon-download-alt" data-toggle="tooltip" title="Download"/>');

            $("#filters").html('<a href="#" id="start-q"><span class="glyphicon glyphicon-play" data-toggle="tooltip" title="Start Queue"/></a><img src="css/img/loading.gif" class="none" id="loading-img">');

            afterDT1();
        },
        drawCallback: function( settings ) {
        },
        "language": {
            "lengthMenu": "Show _MENU_"
        },
        "columnDefs": [{ "searchable": false, "targets": [5] },{ "searchable": true, "targets": [0,1,2,3,4] }]

    } );

    function afterDT1(){

        function startAutomation(){

            $("#wait").show();
            $("#wait-loading-img").removeClass("none");

            var table = $('#dt-1').DataTable();
            var apps = table.column(1).data().toArray();
            var len = apps.length;
            var count = 0;

            function singlestart(){

                $("#row_"+apps[count]).addClass("running disabled");

                $.ajax({
                    type: 'GET',
                    url: SELENIUM_API+'start/'+userData.userId+'/'+apps[count],
                    async: true,
                    success: function(response) {
                        if(response.status == 'success'){
                            toastr["success"](response.message);
                        }else{
                            toastr["error"](response.message);
                        }
                        $("#row_"+apps[count]).removeClass("running disabled");
                        if(count < len - 1){
                            count++;
                            singlestart();
                        }
                        $("#wait").hide();
                        $("#wait-loading-img").addClass("none");
                    },error: function(request,status,errorThrown) {
                        toastr["error"]("Something went wrong!");
                        $("#row_"+apps[count]).removeClass("running disabled");
                        console.log(errorThrown);
                        console.log(JSON.parse(request.responseText));
                        $("#wait").hide();
                        $("#wait-loading-img").addClass("none");
                    }
                });
            }

            singlestart();
            
        }

        $("#start-q").click(function(){
            startAutomation();
        });
    }

 }


function setDT2(){

 var date = $("#date-filter").val();
    if(date == undefined){
        /* set date for complete tab */
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy+'-'+mm+'-'+dd;
    }

        $("#dt-2").DataTable( {
        processing: true,
        serverSide: true,
        destroy: true,
        paging: false,
        order : [[ 8, "desc" ]],
        search: { "caseInsensitive": false },
        ajax:{
                "url" : "include/datatable/dt-2.php",
                "data" : { 'date' : date }
            },
        columns: [
                    { data: "appno" },
                    { data: "TRNREFNO" },
                    {   
                        mRender: function ( file_name, type, data ) {
                            if(data['is_existing_cust_1'] == 1){
                                return 'YES';
                            }else{
                                return 'NO';
                            }
                        }
                    },
                    { data: "cifid_1" },
                    {   
                        mRender: function ( file_name, type, data ) {
                            if(data['is_existing_cust_2'] == 1){
                                return 'YES';
                            }else{
                                return 'NO';
                            }
                        }
                    },
                    { data: "cifid_2" },
                    {   
                        mRender: function ( file_name, type, data ) {
                            if(data['is_existing_cust_3'] == 1){
                                return 'YES';
                            }else{
                                return 'NO';
                            }
                        }
                    },
                    { data: "cifid_3" },
                    { data: "accountno" },
                    { data: "processed" },
                    { data: "start_time" },
                    { data: "end_time" },
                    { data: "finnacleuser" },
                    { data: "upload_fullName" },
                    { data: "upload_datetime" }
                  //  {
                        //mRender: function ( file_name, type, data ) {
                          //  return '<a href="#" class="view"><span class="glyphicon glyphicon-info" data-toggle="tooltip" title="View Remarks"/></a>';
                       // }
                    //}
                ],

        dom: '<"toolbar"lB<"#filters2">f>rt<"bottom"ip><"clear">',
        buttons: ['csv'],
        lengthMenu: [[5, 10, 15, 20, 25, 50, 100, -1], [5, 10, 15, 20, 25, 50, 100, "All"]],
        pageLength: 10,
        "scrollX": true,
        "scrollY": "400px",
        "scrollCollapse": true,
        initComplete: function () {
            $('.buttons-csv').html('<span class="glyphicon glyphicon-download-alt" data-toggle="tooltip" title="Download"/>');
            $("#filters2").html('<div class="form-group"><input type="date" id="date-filter" class="form-control"></div>');
            afterDT2();
            if(date != ""){
                $("#date-filter").val(date);
            }
        },
        drawCallback: function( settings ) {
            afterDT2();
        },
        "language": {
            "lengthMenu": "Show _MENU_"
        },
        "columnDefs": [{ "searchable": false, "targets": [2,4,6] },{ "searchable": true, "targets": [0,1,3,5,7,8,9,10,11,12,13,14] }]

    } );

}

function afterDT2(){
    $("#date-filter").change(function(){
        setDT2();
    });
}

function setDT3(){

     var date = $("#date-filter").val();
    if(date == undefined){
        /* set date for complete tab */
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy+'-'+mm+'-'+dd;
    }

    $("#dt-3").DataTable( {
        processing: true,
        serverSide: true,
        destroy: true,
        paging: false,
        order : [[ 1, "desc" ]],
        search: { "caseInsensitive": false },
        ajax: { "url" : "include/datatable/dt-3.php" },
        columns: [
                    { data: "TRNREFNO" },                    
                    { data: "datetime" },
                    { data: "fullName" },
                    { data: "error_section" },
                    { data: "exception_dtl" }
                ],
        dom: '<"toolbar"lB<"#filters3">f>rt<"bottom"ip><"clear">',
        buttons: ['csv'],
        lengthMenu: [[5, 10, 15, 20, 25, 50, 100, -1], [5, 10, 15, 20, 25, 50, 100, "All"]],
        pageLength: 10,
        scrollX: true,
        scrollY: "400px",
        scrollCollapse: true,
        initComplete: function () {
            $('.buttons-csv').html('<span class="glyphicon glyphicon-download-alt" data-toggle="tooltip" title="Download"/>');
        },
        drawCallback: function( settings ) {
            //afterDT3();
        },
        language: { "lengthMenu": "Show _MENU_" },
        columnDefs: [
            { "searchable": false, "targets": [] }, { "searchable": true, "targets": [0,1,2,3,4] }
        ]

    } );

}

function setDT6(){

     var date = $("#date-filter").val();
    if(date == undefined){
        /* set date for complete tab */
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy+'-'+mm+'-'+dd;
    }

    $("#dt-6").DataTable( {
        processing: true,
        serverSide: true,
        destroy: true,
        paging: false,
        order : [[ 1, "desc" ]],
        search: { "caseInsensitive": false },
        ajax: { "url" : "include/datatable/dt-6.php" },
        columns: [
                    { data: "trnrefno" },                    
                    { data: "city" },
                    { data: "state" },
                    { data: "filename" },
                    { data: "upload_date" },
                    { data: "cityreason" },
                    { data: "statereason" }
                ],
        dom: '<"toolbar"lB<"#filters3">f>rt<"bottom"ip><"clear">',
        buttons: ['csv'],
        lengthMenu: [[5, 10, 15, 20, 25, 50, 100, -1], [5, 10, 15, 20, 25, 50, 100, "All"]],
        pageLength: 10,
        scrollX: true,
        scrollY: "400px",
        scrollCollapse: true,
        initComplete: function () {
            $('.buttons-csv').html('<span class="glyphicon glyphicon-download-alt" data-toggle="tooltip" title="Download"/>');
        },
        drawCallback: function( settings ) {
            //afterDT3();
        },
        language: { "lengthMenu": "Show _MENU_" },
        columnDefs: [
            { "searchable": false, "targets": [] }, { "searchable": true, "targets": [0,1,2,3,4,5,6] }
        ]

    } );

}

function setDT5(){ 
       
        $("#username").val('');
        $("#password").val('');
        $("#cnpassword").val('');
}

$('#upload_csv').on("submit", function(e){
    e.preventDefault(); //form will not submitted
    $("#input-file").addClass("disabled");
    $("#upload").addClass("disabled");
    $.ajax({
       url:"include/upload/upload.php",
        method:"POST",  
        data:new FormData(this),
        dataType: 'json',
        contentType:false,          // The content type used when sending data to the server.  
        cache:false,                // To unable request pages to be cached  
        processData:false,          // To send DOMDocument or non processed data file it is set to false  
        success: function(data){
            toastr[data.status](data.msg);
            $("#input-file").removeClass("disabled");
            $("#upload").removeClass("disabled");
            $("#input-file").val("");
        }
    })
});


$('#usersubmit').on("submit", function(e){
    e.preventDefault(); //form will not submitted

    var username = $("#username").val();
    var password = $("#password").val();
    //var cnpassword = $("#cnpassword").val();


    if(username ==''){
        alert('Please Write Username');
    }
    else if(password ==''){
        alert('Please Write Password');
    }
    // else if(cnpassword !=password){
    //     alert('Password do not Match');
    // }
    else{
            $.ajax({
               url:"include/adduser.php",
                //url: SELENIUM_API+'saveencryptpass/',
                method:"POST",  
                data:new FormData(this),
                dataType: 'json',
                contentType:false,          // The content type used when sending data to the server.  
                cache:false,                // To unable request pages to be cached  
                processData:false,          // To send DOMDocument or non processed data file it is set to false  
                success: function(data){
                    toastr[data.status](data.msg);  
                    var username = $("#username").val('');
                    var password = $("#password").val('');
                    var cnpassword = $("#cnpassword").val('');
  
                }
            })
    }
});

function accountcreate(userid,trnrefno){

    $("#row_"+trnrefno).addClass("running disabled");
    $("#wait").show();
    $("#wait-loading-img").removeClass("none");
    $.ajax({
        url: SELENIUM_API+'finalfun/'+userid+'/'+trnrefno,
        type:"GET",
        dataType: 'json',
        cache:false,
        success: function(data){
            toastr["success"]("Automation Completed.");
            $("#row_"+trnrefno).removeClass("running disabled");
            $("#wait").hide();
            $("#wait-loading-img").addClass("none");
            console.log(JSON.parse(data));
        },
        error: function(request,status,errorThrown) {
            toastr["error"]("Something went wrong!");
            $("#row_"+trnrefno).removeClass("running disabled");
            $("#wait").hide();
            $("#wait-loading-img").addClass("none");
            console.log(errorThrown);
            console.log(JSON.parse(request.responseText));
        }
    })

}

function startAction(userid,trnrefno){

    $("#row_"+trnrefno).addClass("running disabled");
    $("#wait").show();
    $("#wait-loading-img").removeClass("none");
    $.ajax({
        url: SELENIUM_API+'start/'+userid+'/'+trnrefno,
        type:"GET",
        dataType: 'json',
        cache:false,
        contentType:false,          // The content type used when sending data to the server.             // To unable request pages to be cached  
        processData:false,
        success: function(data){
            console.log(data)
            //toastr["success"]("Automation Completed.");
            if(data.status == 'success'){
                toastr["success"](data.message);
            }else{
                toastr["error"](data.message);
            }
            $("#row_"+trnrefno).removeClass("running disabled");
            $("#wait").hide();
            $("#wait-loading-img").addClass("none");
            //console.log(JSON.parse(data));
        },
        error: function(request,status,errorThrown) {
            //console.log(request)
            //console.log(status)
            toastr["error"]("Something went wrong!");
            $("#row_"+trnrefno).removeClass("running disabled");
            $("#wait").hide();
            $("#wait-loading-img").addClass("none");
            console.log(errorThrown);
            console.log(JSON.parse(request.responseText));
        }
    })

}

function showInfo(trnrefno){
    toastr["info"]("TRN REFERENCE NO: "+trnrefno+" is ready for automation.");
}